import json
from db import db
import validation
from data.user import User
import data.songbook

def run(arguments):
	db.authenticate()
	if "username" and "password" in arguments: #Bejelentkezteti a felhasználót és visszaadja a sessionid-t, ha helyesek az adatok

		user_class = User(db.graph)
		return(user_class.start_login(arguments["username"],arguments["password"]))

	elif "logout" in arguments: #Kijelentkezteti a usert
		user_class = User(db.graph)
		res = user_class.delete_session(arguments["sessionid"])
		return str(res)

	elif "sessionid" and "username" in arguments: #DEBUG beállítja sessionid-t és frissíti a dátumot

		user_class = User(db.graph)
		user_class.debug_login(arguments["sessionid"],arguments["username"])
		sb_c = data.songbook.Songbook(db.graph)
		print(sb_c.get_download_id(10))
		return "True"

	elif "sessionid"in arguments: #Ellenőrzi, hogy az adott id megtalálható-e még

		user_class = User(db.graph)
		res = user_class.is_sessionid_exists(arguments["sessionid"])
		return str(res).lower()
