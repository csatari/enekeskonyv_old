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
	print("""Content-type:text/html\n\n
			<!DOCTYPE html>
			<html>
				<head>
				</head>
				<body>""")
def htmlTail():
	print("""</body></html>""")

def demoGraph():
	for record in graph.cypher.execute("match (u:User) where u.username = 'csatari' return u"):
		#print(record.firstname + " " + record.lastname)
		print(record.u)

def htmlBody():
	arguments = cgi.FieldStorage()
	db.authenticate()
	if not validation.validate(arguments,db.graph):
		error.get_error("session_expired")
		return
	else:
		if "name" in arguments: #Visszaadja a teljes nevet sessionid alapján

			user_class = User(db.graph)
			user = user_class.get_by_session(arguments["sessionid"].value)
			print (json.dumps({"firstname": user_class.get(user,"firstn"), "lastname": user_class.get(user,"lastn")}))

		if "get-songbooks" in arguments: #Lekéri az összes énekeskönyvét a usernek sessionid alapján

			songbook_class = Songbook(db.graph)
			songbook = songbook_class.to_json(songbook_class.get_all_by_sessionid(arguments["sessionid"].value),arguments["sessionid"].value)
			#songbook = songbook_class.get_all_by_sessionid(arguments["sessionid"].value)
			print(songbook)

		if "add-songbook" in arguments: #Hozzáad egy énekeskönyvet

			songbook_class = Songbook(db.graph)
			if not songbook_class.is_songbook_exists(arguments["add-songbook"].value,arguments["sessionid"].value):
				songbook_class.add(arguments["add-songbook"].value,arguments["sessionid"].value)
			else:
				error.get_error('songbook_exists')
				return
		if "get-all-visible-songbooks" in arguments: #Lekéri az összes olyan énekeskönyvet, amit láthat a user

			songbook_class = Songbook(db.graph)
			print(songbook_class.to_json(songbook_class.get_all_visible_songbooks(arguments["sessionid"].value),arguments["sessionid"].value))
			return

		if "get-themes" in arguments: #Lekéri az összes témáját a usernek
			th = Theme(db.graph)
			print(th.to_json(th.get_all_for_user(arguments["sessionid"].value)))
			return
		if "add-theme" in arguments: #Hozzáad (ha 0 a themeid) vagy módosít egy témán
			th = Theme(db.graph)
			id = th.save_theme(arguments["theme-id"].value,arguments["sessionid"].value,arguments["theme-name"].value,
						  arguments["theme-public"].value,arguments["theme"].value)
			if id == 0:
				error.get_error('theme_exists')
				return
			print(id)
			return
		if "set-theme" in arguments: #Beállítja, hogy a user az adott témát használja
			th = Theme(db.graph)
			th.set_theme(arguments["sessionid"].value,arguments["set-theme"].value)
			print("true")
			return
		if "get-theme" in arguments: #Lekéri a user éppen beállított témájának az id-jét
			th = Theme(db.graph)
			print(th.get_theme(arguments["sessionid"].value))
			return

#main program
if __name__ == "__main__":
	try:
		htmlTop()
		htmlBody()
		htmlTail()
	except:
		error.get_error('error')
		cgi.print_exception()
		