import json

errors = {
'no_sessionid': 'Hiányzó sessionid!',
'no_error_code': 'Hiányzó error code',
'session_expired': 'Lejárt sessionid',
'database_connection': 'Nem sikerült a csatlakozás: ',
'error': 'Valami hiba történt',
'songbook_exists': 'Már van ilyen énekeskönyv',
'theme_exists': 'Már van ilyen téma',
'authentication_error': 'Hiba a bejelentkezésben',
'no_permission': 'Nincs jog a művelethez',
'bad_format': 'Rossz a formátum',
'no_id': 'Nem található elem',
'theme_not_editable': 'Nem szerkeszthető téma',
'not_downloadable': 'Nem letölthető a megadott adatokkal'
}

def get_error(key, description=''):
	if key in errors:
		return (json.dumps({'error': errors[key]+description}))
	else:
		return (json.dumps({'error': errors['no_error_code']}))