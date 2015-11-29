import json
from db import db
import validation
from data.songbook import Songbook
from data.song import Song

def run(arguments):
	db.authenticate()
	if "download-songbook" in arguments: #Hozzáad egy éneket
		songbook_class = Songbook(db.graph)
		song_class = Song(db.graph)
		downloadid = songbook_class.get_download_id(arguments["songbook"])

		if downloadid == arguments["downloadid"]:
			return song_class.to_json_pure(songbook_class.get_all_songs_from_songbook(arguments["songbook"]))
		else:
			return error.get_error('not_downloadable')