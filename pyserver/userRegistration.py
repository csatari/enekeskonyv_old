import json
from db import db
import validation
from data.user import User

def run(arguments):
	db.authenticate()
	if "firstname" in arguments: #Hozzáadja a felhasználókhoz a usert aka regisztrálja
	
		user_class = User(db.graph)
		return str(user_class.add(arguments["firstname"],arguments["lastname"],arguments["username"],arguments["email"],arguments["password"]))

	elif "username" in arguments: #Lekérdezi, hogy az adott username használatban van-e

		user_class = User(db.graph)
		return str(user_class.is_username_exists(arguments["username"]))

	