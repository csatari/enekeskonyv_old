import json
from db import db
import validation
from data.song import Song
from data.songbook import Songbook

def run(arguments):
	db.authenticate()
	if not validation.validate(arguments,db.graph):
		return error.get_error("session_expired")

		
	if "get-songbook-data" in arguments: #Hozzáad egy éneket
		songbook_class = Songbook(db.graph)
		result = songbook_class.to_json_one(songbook_class.get_by_id(arguments["songbook"]),arguments["sessionid"])
		return result
	elif "get-songbook-count" in arguments: #Lekéri az énekek számát
		songbook_class = Songbook(db.graph)
		result = songbook_class.count_songs_of_songbook(arguments["songbook"])
		return str(result)
	elif "get-all-songs-from-songbook" in arguments: #Lekéri az összes éneket az énekeskönyvben
		songbook_class = Songbook(db.graph)
		song_class = Song(db.graph)
		result = song_class.to_json(songbook_class.get_all_songs_from_songbook(arguments["songbook"]),
			arguments["sessionid"],arguments["songbook"])
		return result
	elif "add-song-to-songbook" in arguments: #Hozzáadja az éneket az énekeskönyvhöz
		songbook_class = Songbook(db.graph)
		result = songbook_class.add_song_to_songbook(arguments["song"],arguments["songbook"],arguments["sessionid"])
		return str(result).lower()
	elif "remove-song-from-songbook" in arguments:
		songbook_class = Songbook(db.graph)
		result = songbook_class.remove_song_from_songbook(arguments["song"],arguments["songbook"],arguments["sessionid"])
		return str(result).lower()


