import json
from db import db
import validation
from data.user import User
from data.songbook import Songbook
from data.theme import Theme
import error


def run(arguments):
	db.authenticate()
	#print("userData: ",str(arguments).replace("\\u","u"))
	if not validation.validate(arguments,db.graph):
		return error.get_error("session_expired")
		
	else:
		if "name" in arguments: #Visszaadja a teljes nevet sessionid alapján

			user_class = User(db.graph)
			user = user_class.get_by_session(arguments["sessionid"])
			return (json.dumps({"firstname": user_class.get(user.u,"firstn"), "lastname": user_class.get(user.u,"lastn")}))

		if "get-songbooks" in arguments: #Lekéri az összes énekeskönyvét a usernek sessionid alapján

			songbook_class = Songbook(db.graph)
			songbook = songbook_class.to_json(songbook_class.get_all_by_sessionid(arguments["sessionid"]),arguments["sessionid"])
			#songbook = songbook_class.get_all_by_sessionid(arguments["sessionid"])
			return songbook

		if "add-songbook" in arguments: #Hozzáad egy énekeskönyvet

			songbook_class = Songbook(db.graph)
			if not songbook_class.is_songbook_exists(arguments["add-songbook"],arguments["sessionid"]):
				songbook_class.add(arguments["add-songbook"],arguments["sessionid"])
				return "true"
			else:
				return error.get_error('songbook_exists')

		if "get-all-visible-songbooks" in arguments: #Lekéri az összes olyan énekeskönyvet, amit láthat a user

			songbook_class = Songbook(db.graph)
			return (songbook_class.to_json(songbook_class.get_all_visible_songbooks(arguments["sessionid"]),arguments["sessionid"]))

		if "get-themes" in arguments: #Lekéri az összes témáját a usernek

			th = Theme(db.graph)
			return (th.to_json(th.get_all_for_user(arguments["sessionid"])))

		if "add-theme" in arguments: #Hozzáad (ha 0 a themeid) vagy módosít egy témán

			print(arguments["theme-id"],arguments["sessionid"],arguments["theme-name"],
						  arguments["theme-public"])
			th = Theme(db.graph)
			id = th.save_theme(arguments["theme-id"],arguments["sessionid"],arguments["theme-name"],
						  arguments["theme-public"],arguments["theme"])
			print("id: ",id)
			if id == 0:
				return error.get_error('theme_exists')
			elif id == None:
				return error.get_error('theme_not_editable')
			return str(id)

		if "set-theme" in arguments: #Beállítja, hogy a user az adott témát használja

			th = Theme(db.graph)
			th.set_theme(arguments["sessionid"],arguments["set-theme"])
			return ("true")

		if "get-theme" in arguments: #Lekéri a user éppen beállított témájának az id-jét

			th = Theme(db.graph)
			return str((th.get_theme(arguments["sessionid"])))

		