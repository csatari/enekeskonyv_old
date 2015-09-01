import hashlib
import binascii
import array
import error
import time
import datetime
import json

#TODO BaseClass
class User:
	database_schema = {
		"sessionid": "session",
		"lastn": "lastname",
		"firstn": "firstname",
		"username": "username",
		"email": "email",
		"pw": "pass",
		"date": "date",
		"admin": "admin"
	}
	graph = ''
	def __init__(self,graph):
		self.graph = graph
	def get(self, node, database_schema_key):
		return node[self.database_schema[database_schema_key]]
	def getByUsername(self,username):
		record = self.graph.cypher.execute_one("match (u:User) where u.username = '%s' return u" % username)
		return record

	def get_by_session(self,sessionid):
		record = self.graph.cypher.execute("match (u:User) where u.session = '%s' return u, ID(u) as userid" % sessionid)
		return record.one

	def getLatestDate(self,sessionid): #in string
		user = self.get_by_session(sessionid)
		return self.get(user.u,"date")
		#return user[self.database_schema["date"]]

	def is_sessionid_exists(self,sessionid):
		user = self.get_by_session(sessionid)
		return len(user) > 0

	def start_login(self,username,password):
		bin_password = password.encode('ascii')
		dk = hashlib.pbkdf2_hmac('sha512', bin_password, b'NoS9SWYCuZ9mhQU0ahKug21RDjeFoKHfZh7lLNY1PpQ2VIsq9maiyORgqzvfJUWm',10000)
		hash = binascii.hexlify(dk)
		if self.is_password_same(username,hash.decode("utf-8")):
			user = self.getByUsername(username)
			sessionid = self.login(self.get(user,"date"),self.get(user,"sessionid"),self.get(user,"email"),username)
			return json.dumps({"sessionid": sessionid})
		else:
			return error.get_error('authentication_error')
	def is_password_same(self,username,hash):
		record = self.graph.cypher.execute("""match (u:User)
											  where u.username = '%s' 
											  return u""" % (username))
		if record == None:
			return False
		else:
			return self.get(record.one,"pw") == hash
	def login(self,last_login_date,sessionid,email,username):
		last_login_timestamp = time.mktime(datetime.datetime.strptime(last_login_date, "%Y-%m-%d %H:%M:%S").timetuple())
		now_timestamp = time.mktime(datetime.datetime.now().timetuple())
		if sessionid != "" and (now_timestamp - last_login_timestamp) < 12*60*60:
			return sessionid

		new_sessionid_byte = hashlib.pbkdf2_hmac('sha512', (email+"session"+str(now_timestamp)).encode('ascii'), 
												 b'NoS9SWYCuZ9mhQU0ahKug21RDjeFoKHfZh7lSAAEWR+QFWASF2VIsq9maiyORgqzvfJUWm',10000)
		new_sessionid = binascii.hexlify(new_sessionid_byte).decode("utf-8")
		self.update_date_session(username,datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),new_sessionid)
		return new_sessionid
	def update_date_session(self,username,date,sessionid):
		record = self.graph.cypher.execute("""match (u:User)
											  where u.username = '%s' 
											  set u.date = '%s', u.session = '%s'
											  return u""" % (username,date,sessionid))
		return

