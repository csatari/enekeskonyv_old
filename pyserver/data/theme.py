from data.baseclass import BaseClass
import json

class Theme(BaseClass):
	def __init__(self,graph):
		self.graph = graph
		super(Theme,self).__init__(graph)
		self.database_schema = {
			"title": "title",
			"public": "public",
			"theme": "theme"
		}

	def get_all_for_user(self,sessionid):
		record = self.graph.cypher.execute("""match (t:Theme)-[:CREATED_BY]->(u:User)
											  where u.session = '%s'
											  return t, ID(t) as id, ID(u) as creator
											  union 
											  match (t:Theme)-[:CREATED_BY]->(u:User)
											  where t.public = 1
											  return t, ID(t) as id, ID(u) as creator""" % (sessionid))
		return record
	def save_theme(self,themeid,sessionid,name,public,theme):
		if themeid == "0":
			#Új téma
			if self.is_theme_exists(name):
				return 0
			record = self.graph.cypher.execute("""match (u:User)
												  where u.session = '%s'
												  CREATE (t:Theme { title: '%s', public: %s, theme:'%s' })
												  CREATE (t)-[r:CREATED_BY]->(u)
												  return ID(t) as id""" % (sessionid,name,public,theme))
			return record.one
		else:
			#Módosítás
			record = self.graph.cypher.execute("""match (t:Theme),(u:User), (t:Theme)-[r:CREATED_BY]->(creator:User)
												  where ID(t) = %s and u.session = '%s'
												  set t.title = '%s', t.public = %s, t.theme = '%s'
												  delete r
												  CREATE (t)-[r2:CREATED_BY]->(u)
												  return ID(t) as id""" % (themeid,sessionid,name,public,theme))
			return record.one
	def is_theme_exists(self,themename):
		record = self.graph.cypher.execute("""match (t:Theme)
											  where t.title = '%s'
											  return t""" % (themename))
		return len(record) > 0
	def set_theme(self,sessionid,themeid):
		record = self.graph.cypher.execute("""match (t:Theme),(u:User)-[r:CHOSE]->(t2:Theme)
											  where ID(t) = %s and u.session = '%s'
											  delete r
											  CREATE (u)-[:CHOSE]->(t)""" % (themeid,sessionid))
		return
	def get_theme(self,sessionid):
		record = self.graph.cypher.execute("""match (u:User)-[r:CHOSE]->(t:Theme)
											  where u.session = '%s'
											  return ID(t) as id""" % (sessionid))
		return record.one
	def to_json(self,node):
		temp_dic = []
		if node != None:
			for row in node:

				temp_dic.append({"id": row.id,"creator": row.creator, "title": self.get(row.t,"title"), "public": self.get(row.t,"public"), 
								 "theme": self.get(row.t,"theme")})
		return json.dumps(temp_dic)