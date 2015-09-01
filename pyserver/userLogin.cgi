#!C:\Python34\python.exe

import cgi
import json
from db import db
import validation
from data.user import User
from data.songbook import Songbook
from data.theme import Theme
import error

graph = ''

def htmlTop():
	# print("""Content-type:text/html\n\n
	# 		<!DOCTYPE html>
	# 		<html>
	# 			<head>
	# 			</head>
	# 			<body>""")
	print("""Content-type:text/html\n\n""")
def htmlTail():
	# print("""</body></html>""")
	print ("")
def htmlBody():
	arguments = cgi.FieldStorage()
	db.authenticate()
	if "username" and "password" in arguments: #Visszaadja a teljes nevet sessionid alapján

		user_class = User(db.graph)
		print(user_class.start_login(arguments["username"].value,arguments["password"].value))

#main program
if __name__ == "__main__":
	try:
		htmlTop()
		htmlBody()
		htmlTail()
	except:
		error.get_error('error')
		cgi.print_exception()
		