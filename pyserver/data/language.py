from data.baseclass import BaseClass
import json

class Language(BaseClass):
	def __init__(self,graph):
		self.graph = graph
		super(Language,self).__init__(graph)
		self.database_schema = {
			"name": "name"
		}
	def get_all(self):
		record = self.graph.cypher.execute("""match (l:Language) return l, ID(l) as id""")
		return record

	def to_json(self,node):
		temp_dic = []
		if node != None:
			for row in node:

				temp_dic.append({"id": row.id,"name": self.get(row.l,"name")})
		return json.dumps(temp_dic)