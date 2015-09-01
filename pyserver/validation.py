import time
import datetime
import error
from data.user import User

def validate(arg,graph):
	if "sessionid" not in arg:
		error.get_error('no_sessionid')
		return False
	else:
		return check_if_valid_session(arg["sessionid"].value,graph)

def check_if_valid_session(sessionid,graph):
	user = User(graph)
	#print(user.getBySession(sessionid))
	if not user.is_sessionid_exists(sessionid):
		return False
	last_login = user.getLatestDate(sessionid)
	#"2015-08-10 10:00:00"
	last_login_timestamp = time.mktime(datetime.datetime.strptime(last_login, "%Y-%m-%d %H:%M:%S").timetuple())
	now_timestamp = time.mktime(datetime.datetime.now().timetuple())
	if (now_timestamp - last_login_timestamp) > 24*60*60:
		return False
	else:
		return True
	# $user = new Users($db);
 #    $lastLogin = new DateTime($user->getLatestDate($sessionid));
 #    $date = new DateTime();
 #    $timestamp = $date->getTimestamp();
 #    $lastLoginTimestamp = $lastLogin->getTimestamp();
 #    //ha 24 óránál régebb óta lépett be, akkor nem fogadjuk el a sessiont
 #    if($timestamp - $lastLoginTimestamp > 24*60*60) {
 #        return false;
 #    }
 #    return $user->isSessionidExists($sessionid);