import json
from db import db
import validation
from data.song import Song
import error

def run(arguments):
	db.authenticate()
	if not validation.validate(arguments,db.graph):
		return error.get_error("session_expired")

	if "addSong" in arguments: #Hozzáad egy éneket
		song_class = Song(db.graph)
		result = song_class.add(arguments["title"],arguments["text"],arguments["notes"],arguments["lang"],arguments["otherlang"],arguments["labels"],
					   arguments["comment"],arguments["songid"],arguments["verseOrder"],arguments["sessionid"])
		return str(result)
	if "getSong" in arguments: #Lekér egy éneket id alapján
		song_class = Song(db.graph)
		return song_class.to_json_one(song_class.get_by_id(arguments["getSong"]),arguments["sessionid"],arguments["songbookid"])
	if "searchSong" in arguments: #Megkeres egy éneket tag vagy cím alapján
		song_class = Song(db.graph)
		result = song_class.search_in_songs(arguments["title"],arguments["sessionid"],arguments["songbook"])
		return result
	# if "getNewestVersionOfSong" in arguments: #Lekéri a megadott ének legfrisebb verzióját
	# 	song_class = Song(db.graph)
	# 	result = song_class.get_newest_version(arguments["songid"])
	# 	return result

