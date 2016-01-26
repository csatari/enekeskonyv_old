import json
from data.user import User
from data.permission import Permission
from data.permission import SongOperation
import error
from data.baseclass import BaseClass
import operator

class Song(BaseClass):
	def __init__(self,graph):
		super(Song,self).__init__(graph)
		self.database_schema = {
			"title": "title",
			"song": "song",
			"sheet": "sheet_music",
			"comment": "comment",
			"verse_order": "verse_order"
		}
	def add(self,title,text,notes,lang,otherlang,labels,comments,songid,verseOrder,sessionid):
		user_class = User(self.graph)
		user = user_class.get_by_session(sessionid)
		songcreator = self.get_creator_of_song(songid)
		if not Permission.is_song_operation_valid_for_user(user_class.get(user.u,user_class.database_schema["admin"]),
																user.userid,
																songid,
																songcreator,
																SongOperation.Create):
			return error.get_error('no_permission')

		print(lang,user.userid,otherlang)
		newsongid = self.graph.cypher.execute_one("""MATCH (l:Language),(u:User)
												WHERE ID(l) = %s AND ID(u) = %s
												OPTIONAL MATCH (s_other:Song)
												WHERE ID(s_other) = %s
												OPTIONAL MATCH (s_old:Song)
												WHERE ID(s_old) = %s
												CREATE (s:Song { title: '%s', song: '%s', sheet_music: '%s', comment: '%s', verse_order: '%s'})
												CREATE (s)-[lr:LANGUAGE]->(l)
												CREATE (u)-[r_u:CREATED]->(s)
												CREATE (s)-[r2_u:CREATED_BY]->(u)
												FOREACH (a IN CASE WHEN s_old IS NULL THEN [] ELSE [s_old] END | 
													CREATE (a)-[r3:NEXT_VERSION]->(s)-[r4:PREVIOUS_VERSION]->(a)
												)
												FOREACH (a IN CASE WHEN s_other IS NULL THEN [] ELSE [s_other] END | 
													CREATE (s)-[r:OTHER_LANGUAGE]->(a)-[r2:OTHER_LANGUAGE]->(s)
												)
												RETURN ID(s) as songid""" % (lang,user.userid,otherlang,songid,title,text,notes,comments,verseOrder))
		self.add_labels_to_song(labels,newsongid)
		#Ha a régi ének benne volt egy énekeskönyvben, az újba is belerakom
		if int(songid) > 0:
			print("adding to songbooks: ",songid,newsongid)
			self.graph.cypher.execute_one("""MATCH (sb:Songbook)-[:CONTAINS]->(old:Song),(new:Song)
											 WHERE ID(old) = %s AND ID(new) = %s
											 OPTIONAL MATCH (new)-[contain:CONTAINED_IN]->(sb)
											 FOREACH (a IN CASE WHEN contain IS NULL THEN [1] ELSE [] END | 
															CREATE (new)-[r:CONTAINED_IN]->(sb)
															CREATE (sb)-[r2:CONTAINS]->(new)
														)""" % (songid,newsongid))
		return newsongid

	def get_by_id(self,songid):
		record = self.graph.cypher.execute("""match (s:Song), (s)-[:CREATED_BY]->(u:User), (s)-[:LANGUAGE]->(l:Language)
											  where ID(s) = %s
											  optional match (s)-[:OTHER_LANGUAGE]->(so:Song)
											  where ID(s) = %s
											  optional match versions = (s)-[:PREVIOUS_VERSION*]->(pvs:Song)
											  where not(pvs)-[:PREVIOUS_VERSION]->() and ID(s) = %s
											  return s, ID(s) as songid, ID(u) as userid, ID(l) as langid, ID(so) as otherlangid, length(versions) as versionlen"""
											   % (songid,songid,songid))
		return record.one

	#Lekérdezi az összes labelét az éneknek
	def get_all_labels_as_string(self,songid):
		labels = self.graph.cypher.execute("""match (s:Song), (s)-[:LABELLED]->(l:Label)
											  where ID(s) = %s return l""" % songid)
		langs = self.graph.cypher.execute("""match (s:Song)-[:LANGUAGE]->(l:Language)
											  where ID(s) = %s return l""" % songid)
		all_labels = []
		for label in labels:
			all_labels.append(label.l["name"])
		for label in langs:
			all_labels.append(label.l["name"])
		
		return all_labels

	#Szétszedi a labeleket vesszőnként, majd elküldi az adatbázisnak beillesztésre:
	#Az adatbázis létrehozza, ha még nem volt beszúrva, a labelt, majd összeköti az énekkel. 
	#Ellenőrzi, hogy ne adja hozzá kétszer ugyanazt a labelt egy énekehez
	def add_labels_to_song(self,label_string,songid):
		if(label_string == ''):
			return
		labels = label_string.split(',')
		for label in labels:
			result = self.graph.cypher.execute_one("""MATCH (s:Song) WHERE ID(s) = %s
													OPTIONAL MATCH (l:Label)
													WHERE l.name = '%s'
													OPTIONAL MATCH (s)-[is_rel:LABELLED]->(l)
													FOREACH (a IN CASE WHEN l IS NULL THEN [1] ELSE [] END | 
														CREATE (new_l:Label { name : '%s'})
														CREATE (s)-[r:LABELLED]->(new_l)
														CREATE (new_l)-[r2:USED_BY]->(s)
													)
													FOREACH (b IN CASE WHEN l IS NULL THEN [] ELSE [l] END | 
														FOREACH (new_label IN CASE WHEN is_rel IS NULL THEN [1] ELSE [] END | 
															CREATE (s)-[r:LABELLED]->(b)
															CREATE (b)-[r2:USED_BY]->(s)
														)
													)
													""" % (songid,label,label))

	def get_creator_of_song(self,songid):
		userid = self.graph.cypher.execute_one("MATCH (s:Song)-[:CREATED_BY]->(u:User) where ID(s) = %d return ID(u) as userid" % int(songid))
		if userid == None:
			return 0
		else:
			return userid

	def search_in_songs(self,title,sessionid,songbookid):
		#szavak elválasztása és tagek, szórészek kiválogatása
		words = title.split(" ")
		search = {}
		for word in words:
			if word == "": continue
			songids = []
			if word[0] == "#":
				#Tag
				label = word[1:]
				#label alapján
				songids = self.get_by_label(label)
				#nyelv alapján
				othersongids = self.get_by_language(label)
				search = self.extend_search_idarray(search,othersongids)
			else:
				#szó
				songids = self.get_by_title_part(word)
				
			search = self.extend_search_idarray(search,songids)

		result = self.get_songs_from_tuple(sorted(search.items(), key=operator.itemgetter(1), reverse=True),sessionid,songbookid)

		return result

	def get_by_title_part(self,title):
		record = self.graph.cypher.execute("""match (s:Song) where s.title =~ '(?i).*%s.*' return ID(s) as songid""" % (title))
		idarray = []
		for row in record:
			idarray.append(row.songid)
		return idarray

	def get_by_label(self,label):
		record = self.graph.cypher.execute("""match (l:Label)-[:USED_BY]->(s:Song) where l.name =~ '(?i).*%s.*' return ID(s) as songid""" % (label))
		idarray = []
		for row in record:
			idarray.append(row.songid)
		return idarray
	def get_by_language(self,label):
		record = self.graph.cypher.execute("""match (l:Language)<-[:LANGUAGE]-(s:Song) where l.name =~ '(?i).*%s.*' return ID(s) as songid""" % (label))
		idarray = []
		for row in record:
			idarray.append(row.songid)
		return idarray

	#Visszaadja egy énekről a legrégebbi verziójának az id-ját. Ha ő a legrégebbi verzió, akkor önmagát adja vissza
	def get_oldest_version_of_song(self,songid):
		result = self.graph.cypher.execute_one("""match (new:Song)-[:PREVIOUS_VERSION*]->(old:Song)
												  where NOT (old)-[:PREVIOUS_VERSION]->() and id(new) = %d
												  return ID(old) as songid""" % (songid))
		if result == None:
			return songid
		else:
			return result


	# def get_newest_version(self,songid):
	# 	record = self.graph.cypher.execute_one("""match (old:Song)-[:NEXT_VERSION*]->(new:Song)
	# 											  where NOT (new)-[:NEXT_VERSION]->() and id(old) = %d 
	# 											  return ID(new) as songid""" % (songid))
	# 	return record.songid

	def extend_search_idarray(self,search_dictionary,songid_array):
		for songid in songid_array:
			if songid not in search_dictionary:
				search_dictionary[songid] = 1
			else:
				search_dictionary[songid] = search_dictionary[songid]+1
		return search_dictionary

	def get_songs_from_tuple(self,tuples,sessionid,songbookid):
		temp_dic = []
		for tup in tuples:
			song = self.get_by_id(tup[0])
			temp_dic.append(song)
		res = self.to_json(temp_dic,sessionid,songbookid)
		return res

	def is_song_in_songbook(self,songid,songbookid): #Lekérdezi, hogy az adott ének benne van-e az adott énekeskönyvben
		record = self.graph.cypher.execute_one("""match (s:Song)-[:CONTAINED_IN]->(sb:Songbook)
												  where id(s) = %s and id(sb) = %s
												  return id(s) """ % (songid,songbookid))
		if record == None:
			return 0
		else: return 1

	def to_json_one(self,node,sessionid,songbookid):
		if node is None:
			return error.get_error('no_id')
		other_lang_id = 0
		if node.otherlangid is not None:
			other_lang_id = node.otherlangid
		version_number = 1
		if node.versionlen is not None:
			version_number = 1 + node.versionlen

		permissions = Permission.get_song_operations(Permission.get_permission_level_for_song_by_sessionid(self.graph,sessionid,node.songid))

		in_songbook = self.is_song_in_songbook(node.songid,songbookid)

		return json.dumps({"id": node.songid, "version": version_number, "creator": node.userid, "title": self.get(node.s,"title"),
						   "song": self.get(node.s,"song"), "sheet_music": self.get(node.s,"sheet"), "language": node.langid, 
						   "other_languages": other_lang_id,"labels": self.get_all_labels_as_string(node.songid), 
						   "comment": self.get(node.s,"comment"), "permissions": permissions, "in_songbook": in_songbook,
						   "verse_order": self.get(node.s,"verse_order")})

	def to_json(self,node,sessionid,songbookid):
		temp_dic = []
		if node != None:
			for row in node:
				temp_dic.append(json.loads(self.to_json_one(row,sessionid,songbookid)))

		return json.dumps(temp_dic)

	# Fontos! Legyen benne a legrégebbi verzió id-ja is
	def to_json_one_pure(self,node):
		if node is None:
			return error.get_error('no_id')
		other_lang_id = 0
		if node.otherlangid is not None:
			other_lang_id = node.otherlangid
		version_number = 1
		if node.versionlen is not None:
			version_number = 1 + node.versionlen

		return json.dumps({"id": node.songid, "version": version_number, "creator": node.userid, "title": self.get(node.s,"title"),
						   "song": self.get(node.s,"song"), "sheet_music": self.get(node.s,"sheet"), "language": node.langid, 
						   "other_languages": other_lang_id,"labels": self.get_all_labels_as_string(node.songid), 
						   "comment": self.get(node.s,"comment"),"oldest_version": node.oldest_version,
						   "verse_order": self.get(node.s,"verse_order")})

	# Fontos! Legyen benne a legrégebbi verzió id-ja is
	def to_json_pure(self,node):
		temp_dic = []
		if node != None:
			for row in node:
				temp_dic.append(json.loads(self.to_json_one_pure(row)))

		return json.dumps(temp_dic)