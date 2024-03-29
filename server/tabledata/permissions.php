<?php
$ROOT = dirname(__FILE__)."\\";
require_once($ROOT."..\\db.php");
require_once("tableobjects.php");
require_once("song.php");
require_once("songbook.php");

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
//Ezek az id-k a kliensen is megvannak, úgyhogy a sorrendet nem szabad felcserélni
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
		if($songid == 0) {
			if($usertable->admin == 1) {
				return SongPermissionLevel::Admin;
			}
			return SongPermissionLevel::User;
		}
		else {
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
		
	}
	public function getPermissionOfSongbook($usertable,$songbookid) {
		if($songbookid == 0) {
			if($usertable->admin == 1) {
				return SongbookPermissionLevel::Admin;
			}
			return SongbookPermissionLevel::User;
		}
		else {
			if($usertable->admin == 1) {
				return SongbookPermissionLevel::Admin;
			}
			$songbook = new Songbook($this->db);
			$songbookTable = $songbook->getById($songbookid);
			if($songbookTable->userid == $usertable->id) {
				return SongbookPermissionLevel::Owner;
			}
			if($songbook->isSharedWithUser($songbookid,$usertable->id)) {
				return SongbookPermissionLevel::Shared;
			}
			return SongbookPermissionLevel::User;
		}
	}
	public function getSongOperations($permissionLevel) {
		if($permissionLevel == SongPermissionLevel::User) {
			return array(SongOperation::Create,SongOperation::EditRequest,SongOperation::DeleteRequest,SongOperation::Fork);
		}
		else if($permissionLevel == SongPermissionLevel::Creator) {
			return array(SongOperation::Create,SongOperation::Edit,SongOperation::Delete,SongOperation::Fork,SongOperation::AcceptRequest);
		}
		else if($permissionLevel == SongPermissionLevel::Admin) {
			return array(SongOperation::Create,SongOperation::Edit,SongOperation::Delete,SongOperation::Fork,SongOperation::AcceptRequest);
		}
	}
	public function getSongbookOperations($permissionLevel,$ispublic) {
		if($permissionLevel == SongbookPermissionLevel::User) {
			if($ispublic) {
				return array(SongbookOperation::Create,SongbookOperation::Browse,SongbookOperation::Download);
			}
			else {
				return array(SongbookOperation::Create);
			}
		}
		else if($permissionLevel == SongbookPermissionLevel::Owner) {
			return array(SongbookOperation::Create,SongbookOperation::Rename,SongbookOperation::Delete,SongbookOperation::Add,SongbookOperation::Browse
						 ,SongbookOperation::DeleteElement,SongbookOperation::Share,SongbookOperation::Download,SongbookOperation::Visibility);
		}
		else if($permissionLevel == SongbookPermissionLevel::Admin) {
			return array(SongbookOperation::Create,SongbookOperation::Rename,SongbookOperation::Delete,SongbookOperation::Add,SongbookOperation::Browse
						 ,SongbookOperation::DeleteElement,SongbookOperation::Share,SongbookOperation::Download,SongbookOperation::Visibility);
		}
		else if($permissionLevel == SongbookPermissionLevel::Shared) {
			return array(SongbookOperation::Create,SongbookOperation::Add,SongbookOperation::Browse,SongbookOperation::DeleteElement,SongbookOperation::Download);
		}
	}
	/**
	** A usernek el lehet-e végeznie az adott műveletet az adott éneken
	**/
	public function isOperationValidForUserSong($usertable,$songid,$operation) {
		$permissionLevel = $this->getPermissionOfSong($usertable,$songid);
		return $this->isSongPermissionValid($permissionLevel,$operation);
	}


	public function addPermissionToSongTable($songtable,$usertable) {
		$permissionLevel = $this->getPermissionOfSong($usertable,$songtable->id);
    	$operations = $this->getSongOperations($permissionLevel);
    	$songtable->permissions = $operations;
		return $songtable;
	}
	public function addPermissionToSongbookTable($songbooktable,$usertable) {
		$permissionLevel = $this->getPermissionOfSongbook($usertable,$songbooktable->id);
    	$operations = $this->getSongbookOperations($permissionLevel,$songbooktable->public);
    	$songbooktable->permissions = $operations;
		return $songbooktable;
	}
}