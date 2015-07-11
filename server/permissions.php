<?php
$ROOT = dirname(__FILE__)."\\";
require_once($ROOT."..\\db.php");
require_once("tableobjects.php");
require_once("/tabledata/songs.php");

abstract class SongPermissionLevel {
	const User = 1;
    const Creator = 2;
    const Admin = 3;
}
abstract class SongbookPermissionLevel {
	const User = 1;
    const Owner = 2;
    const Shared = 3;
    const Admin = 4;
}
abstract class SongOperation {
	const Create = 1;
	const Edit = 2;
	const EditRequest = 3;
	const Delete = 4;
	const DeleteRequest = 5;
	const Fork = 6;
	const AcceptRequest = 7;
}
abstract class SongbookOperation {
	const Create = 1;
	const Rename = 2;
	const Delete = 3;
	const Add = 4;
	const Browse = 5;
	const DeleteElement = 6;
	const Share = 7;
	const Download = 8;
	const Visibility = 9; //public or private
}
class Permission {

	private $db;

    function __construct($db) {
        $this->db = $db;
    }

	public function isSongPermissionValid($permissionLevel, $operation) {
		if($permissionLevel == SongPermissionLevel::User) {
			if(in_array($operation, array(SongOperation::Create,SongOperation::EditRequest,SongOperation::DeleteRequest,SongOperation::Fork))) {
				return true;
			}
			else return false;
		}
		else if($permissionLevel == SongPermissionLevel::Creator) {
			if(in_array($operation, array(SongOperation::Create,SongOperation::Edit,SongOperation::Delete,SongOperation::Fork,SongOperation::AcceptRequest))) {
				return true;
			}
			else return false;
		}
		else if($permissionLevel == SongPermissionLevel::Admin) {
			if(in_array($operation, array(SongOperation::Create,SongOperation::Edit,SongOperation::Delete,SongOperation::Fork,SongOperation::AcceptRequest))) {
				return true;
			}
			else return false;
		}
	}
	public function isSongbookPermissionValid($permissionLevel, $operation, $public) {
		if($permissionLevel == SongbookPermissionLevel::User) {
			if(in_array($operation, array(SongbookOperation::Create))) {
				return true;
			}
			if($public) {
				if(in_array($operation, array(SongbookOperation::Browse,SongbookOperation::Download))) {
					return true;
				}
			}
			return false;
		}
		else if($permissionLevel == SongbookPermissionLevel::Owner) {
			if(in_array($operation, array(SongbookOperation::Create,
										  SongbookOperation::Rename,
										  SongbookOperation::Delete,
										  SongbookOperation::Add,
										  SongbookOperation::Browse,
										  SongbookOperation::DeleteElement,
										  SongbookOperation::Share,
										  SongbookOperation::Download,
										  SongbookOperation::Visibility))) {
				return true;
			}
			else return false;
		}
		else if($permissionLevel == SongbookPermissionLevel::Shared) {
			if(in_array($operation, array(SongbookOperation::Create,SongbookOperation::Add,SongbookOperation::Browse,SongbookOperation::DeleteElement,SongbookOperation::Download))) {
				return true;
			}
			else return false;
		}
		else if($permissionLevel == SongbookPermissionLevel::Admin) {
			if(in_array($operation, array(SongbookOperation::Create,
										  SongbookOperation::Rename,
										  SongbookOperation::Delete,
										  SongbookOperation::Add,
										  SongbookOperation::Browse,
										  SongbookOperation::DeleteElement,
										  SongbookOperation::Share,
										  SongbookOperation::Download,
										  SongbookOperation::Visibility))) {
				return true;
			}
			else return false;
		}
	}
	public function getPermissionOfSong($usertable,$songid) {
		if($usertable->admin == 1) {
			return SongPermissionLevel::Admin;
		}
		else {
			$songs = new Song($this->db);
			$song = $songs->getById($songid);
			if($song->creator == $usertable->id) {
				return SongPermissionLevel::Creator;
			}
		}
		return SongPermissionLevel::User;
	}
	public function getPermissionOfSongbook() {
		//TODO az ehhez tartozó dolgokat még meg kell csinálni -> felhasználó, tulajdonos, megosztott, hozzá adatbázis, stb
		return SongbookPermissionLevel::Admin;
	}
}