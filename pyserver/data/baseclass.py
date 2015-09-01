class BaseClass:
	database_schema = {}
	graph = ''
	def __init__(self,graph):
		self.graph = graph
	def test(self):
		print(self.database_schema)
	def get(self, node, database_schema_key):
		return node[self.database_schema[database_schema_key]]