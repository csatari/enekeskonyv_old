import json
from db import db
import validation
from data.language import Language
import error

def run(arguments):
	db.authenticate()
	if not validation.validate(arguments,db.graph):
		return error.get_error("session_expired")
	else:
		if "allLanguages" in arguments:
			lang_class = Language(db.graph)
			langs = lang_class.get_all()
			return lang_class.to_json(langs)