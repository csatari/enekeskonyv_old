import json

errors = {
'no_sessionid': 'Hiányzó sessionid!',
'no_error_code': 'Hiányzó error code',
'session_expired': 'Lejárt sessionid',
'database_connection': 'Nem sikerült a csatlakozás: ',
'error': 'Valami hiba történt',
'songbook_exists': 'Már van ilyen énekeskönyv',
'theme_exists': 'Már van ilyen téma',
'authentication_error': 'Hiba a bejelentkezésben'
}

def get_error(key, description=''):
	if key in errors:
		print (json.dumps({'error': errors[key]+description}))
	else:
		print (json.dumps({'error': errors['no_error_code']}))