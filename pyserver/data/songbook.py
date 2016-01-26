import json
from data.user import User
import data.permission
from data.song import Song
from data.baseclass import BaseClass
import error
import time
import datetime
import hashlib
import binascii

class Songbook(BaseClass):
	def __init__(self,graph):
		super(Songbook,self).__init__(graph)
		self.database_schema = {
			"title": "title",
			"public": "public"
		}
	def add(self, title, sessionid):
		self.graph.cypher.execute(
			"""match (u:User) where u.session = '%s' 
			CREATE (sb:Songbook { title : '%s', public: 0})
			CREATE (u)-[r:CREATED]->(sb)
			CREATE (sb)-[r2:CREATED_BY]->(u)
			return sb""" % (sessionid,title))
		return True
	def get_all_by_sessionid(self,sessionid): #return RecordList
		record = self.graph.cypher.execute("""match (u:User)-[:CREATED]->(sb:Songbook) 
											  where u.session = '%s' 
											  optional match (sb:Songbook)-[:CONTAINS]-(s:Song) 
											  where u.session = '%s' 
											  return sb,u, ID(sb) as id, ID(u) as userid, count(s) as songnumber""" % (sessionid,sessionid))
		return record

	def is_songbook_exists(self,songbook,sessionid):
		songbooks = self.graph.cypher.execute_one("match (u:User)-[:CREATED]->(sb:Songbook) where u.session = '%s' and sb.title = '%s' return sb" % (sessionid,songbook))
		return songbooks != None

	def get_all_visible_songbooks(self,sessionid): #return RecordList
		user_class = User(self.graph)
		user = self.graph.cypher.execute("match (u:User) where u.session = '%s' return u, ID(u) as userid" % sessionid).one
		if user_class.get(user.u,"admin") == 1:
			record = self.graph.cypher.execute("match (sb:Songbook)-[:CREATED_BY]->(u:User) optional match (sb:Songbook)-[:CONTAINS]-(s:Song) return sb,u, ID(sb) as id, ID(u) as userid, count(s) as songnumber")
			return record
		elif user_class.get(user.u,"admin") == 0:
			record = self.graph.cypher.execute("""match (sb:Songbook)-[:CREATED_BY]->(u:User)
												  where sb.public = 1 or ID(u) = %d
												  optional match (sb:Songbook)-[:CONTAINS]-(s:Song)
												  where sb.public = 1 or ID(u) = %d
												  return sb,u, ID(sb) as id, ID(u) as userid, count(s) as songnumber
												  union
												  match (owner:User)-[:CREATED]->(sb:Songbook)-[:SHARED_WITH]->(u:User)
												  where ID(u) = %d
												  optional match (sb:Songbook)-[:CONTAINS]-(s:Song)
												  where ID(u) = %d
												  return sb,owner as u, ID(sb) as id, ID(owner) as userid, count(s) as songnumber""" % (user.userid,
												  																						user.userid,
												  																						user.userid,
												  																						user.userid))
			return record

	def get_by_id(self,id):
		record = self.graph.cypher.execute("""match (sb:Songbook)-[:CREATED_BY]->(u:User)
											  where ID(sb) = %s
											  optional match (sb:Songbook)-[:CONTAINS]-(s:Song)
											  where ID(sb) = %s
											  return sb,u, ID(sb) as id, ID(u) as userid, count(s) as songnumber
											  union
											  match (owner:User)-[:CREATED]->(sb:Songbook)-[:SHARED_WITH]->(u:User)
											  where ID(sb) = %s
											  optional match (sb:Songbook)-[:CONTAINS]-(s:Song)
											  where ID(sb) = %s
											  return sb,owner as u, ID(sb) as id, ID(owner) as userid, count(s) as songnumber""" % (id,id,id,id))
		return record.one

	def is_shared_with_user(self,songbookid,userid):
		record = self.graph.cypher.execute("""match (u:User)-[:SEES]->(sb:Songbook)
											  where ID(u) = %d and ID(sb) = %d
											  return sb""" % (userid,songbookid))
		return len(record) > 0

	def count_songs_of_songbook(self,songbookid):
		record = self.graph.cypher.execute("""match (sb:Songbook)-[:CONTAINS]->(s:Song)
											  where ID(sb) = %s
											  return count(s) as songnumber""" % (songbookid))
		return record.one

	def get_all_songs_from_songbook(self,songbookid):
		record = self.graph.cypher.execute("""match (sb:Songbook)-[:CONTAINS]->(s:Song)
											  where ID(sb) = %s
											  return ID(s) as songid""" % (songbookid))
		song_class = Song(self.graph)
		all_songs = []
		for row in record:
			song = song_class.get_by_id(row.songid)
			song.oldest_version = song_class.get_oldest_version_of_song(row.songid)
			all_songs.append(song)
		return all_songs

	def add_song_to_songbook(self,song,songbook,sessionid):
		if not data.permission.Permission.is_songbook_operation_valid_for_user(self.graph,data.permission.SongbookOperation.Add,
																		   songbook,sessionid):
			return False
		record = self.graph.cypher.execute("""MATCH (s:Song),(sb:Songbook) 
											  WHERE ID(s) = %s and ID(sb) = %s
											  OPTIONAL MATCH (s)-[contain:CONTAINED_IN]->(sb)
											  FOREACH (a IN CASE WHEN contain IS NULL THEN [1] ELSE [] END | 
															CREATE (s)-[r:CONTAINED_IN]->(sb)
															CREATE (sb)-[r2:CONTAINS]->(s)
														)""" % (song,songbook))
		return True

	def remove_song_from_songbook(self,song,songbook,sessionid):
		if not data.permission.Permission.is_songbook_operation_valid_for_user(self.graph,data.permission.SongbookOperation.Add,
																		   songbook,sessionid):
			return False
		record = self.graph.cypher.execute("""MATCH (s:Song),(sb:Songbook) 
											  WHERE ID(s) = %s and ID(sb) = %s
											  OPTIONAL MATCH (s)-[c1:CONTAINED_IN]->(sb)-[c2:CONTAINS]->(s)
											  delete c1,c2""" % (song,songbook))
		return True

	def get_download_id(self,songbookid):
		downloadid = self.__get_download_id__(songbookid)
		print(downloadid)
		if downloadid == None:
			now_timestamp = time.mktime(datetime.datetime.now().timetuple())
			new_downloadid_byte = hashlib.pbkdf2_hmac('sha512', (str(songbookid)+str(now_timestamp)).encode('ascii'), 
												 b'NoS9SWYCuZ9mhQU0ahKug21RDjeFoKHfZh7lSAAEWR+QFWASF2VIsq9maiyORgqzvfJUWm',10000)
			downloadid = binascii.hexlify(new_downloadid_byte).decode("utf-8")

			record = self.graph.cypher.execute("""MATCH (sb:Songbook) 
												  WHERE ID(sb) = %s
												  SET sb.downloadid = '%s' """ % (songbookid,downloadid))
			return downloadid
		else:
			return downloadid

	def __get_download_id__(self,songbookid):
		record = self.graph.cypher.execute("""MATCH (sb:Songbook) 
											  WHERE ID(sb) = %s
											  return sb.downloadid""" % (songbookid))
		return record.one

	def to_json(self,node,sessionid):
		temp_dic = []
		if node != None:
			for row in node:
				temp_dic.append(json.loads(self.to_json_one(row,sessionid)))
		return json.dumps(temp_dic)

	def to_json_one(self,node,sessionid):
		if node is not None:
			user_class = User(self.graph)
			requester_user = user_class.get_by_session(sessionid)
			perm_level = data.permission.Permission.get_permission_level_for_songbook(node.id,
																					 user_class.get(requester_user.u,"admin"),
																					 requester_user.userid == node.userid,
																					 self.is_shared_with_user(node.id,requester_user.userid))

			return json.dumps({"title": self.get(node.sb,"title"), "public": self.get(node.sb,"public"), "id": node.id,
							 "userid":  node.userid, "username": user_class.get(node.u,"firstn") + " " + user_class.get(node.u,"lastn"),
							 "songnumber": node.songnumber, "permissionlevel": perm_level, 
							 "permissions": data.permission.Permission.get_songbook_operations(perm_level,self.get(node.sb,"public") == 1)})
		else: return error.get_error('no_id')