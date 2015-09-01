import py2neo
import error

class db:
	graph = ''
	def authenticate():
		py2neo.authenticate("localhost:7474","neo4j","asdfgh")
		db.graph = py2neo.Graph()