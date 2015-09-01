import json
from data.user import User
import data.permission
from data.baseclass import BaseClass

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
		print(record)
	def is_shared_with_user(self,songbookid,userid):
		record = self.graph.cypher.execute("""match (u:User)-[:SEES]->(sb:Songbook)
											  where ID(u) = %d and ID(sb) = %d
											  return sb""" % (userid,songbookid))
		return len(record) > 0
	def to_json(self,node,sessionid):
		temp_dic = []
		if node != None:
			user_class = User(self.graph)
			requester_user = user_class.get_by_session(sessionid)
			for row in node:
				perm_level = data.permission.Permission.get_permission_level_of_songbook(row.id,
																						 user_class.get(requester_user.u,"admin") == 1,
																						 requester_user.userid == row.userid,
																						 self.is_shared_with_user(row.id,requester_user.userid))

				temp_dic.append({"title": self.get(row.sb,"title"), "public": self.get(row.sb,"public"), "id": row.id,
								 "userid":  row.userid, "username": user_class.get(row.u,"firstn") + " " + user_class.get(row.u,"lastn"),
								 "songnumber": row.songnumber, "permissionlevel": perm_level, 
								 "permissions": data.permission.Permission.get_songbook_operations(perm_level,self.get(row.sb,"public") == 1)})
		return json.dumps(temp_dic)