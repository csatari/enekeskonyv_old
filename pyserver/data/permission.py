import data.songbook

class SongPermissionLevel:
	User = 1
	Creator = 2
	Admin = 3
class SongbookPermissionLevel:
	User = 1
	Owner = 2
	Shared = 3
	Admin = 4
class SongOperation:
	Create = 1
	Edit = 2
	EditRequest = 3
	Delete = 4
	DeleteRequest = 5
	Fork = 6
	AcceptRequest = 7
class SongbookOperation:
	Create = 1
	Rename = 2
	Delete = 3
	Add = 4
	Browse = 5
	DeleteElement = 6
	Share = 7
	Download = 8
	Visibility = 9 #public or private

class Permission:
	# public function getPermissionOfSongbook($usertable,$songbookid) {
	# 	if($songbookid == 0) {
	# 		if($usertable->admin == 1) {
	# 			return SongbookPermissionLevel::Admin;
	# 		}
	# 		return SongbookPermissionLevel::User;
	# 	}
	# 	else {
	# 		if($usertable->admin == 1) {
	# 			return SongbookPermissionLevel::Admin;
	# 		}
	# 		$songbook = new Songbook($this->db);
	# 		$songbookTable = $songbook->getById($songbookid);
	# 		if($songbookTable->userid == $usertable->id) {
	# 			return SongbookPermissionLevel::Owner;
	# 		}
	# 		if($songbook->isSharedWithUser($songbookid,$usertable->id)) {
	# 			return SongbookPermissionLevel::Shared;
	# 		}
	# 		return SongbookPermissionLevel::User;
	# 	}
	# }
	def get_permission_level_of_songbook(songbookid,is_admin,is_owner,is_shared):
		if songbookid == 0:
			if is_admin:
				return SongbookPermissionLevel.Admin
			return SongbookPermissionLevel.User
		else:
			if is_admin:
				return SongbookPermissionLevel.Admin
			elif is_owner:
				return SongbookPermissionLevel.Owner
			elif is_shared:
				return SongbookPermissionLevel.Shared
			else:
				return SongbookPermissionLevel.User
	# public function getSongbookOperations($permissionLevel,$ispublic) {
	# 	if($permissionLevel == SongbookPermissionLevel::User) {
	# 		if($ispublic) {
	# 			return array(SongbookOperation::Create,SongbookOperation::Browse,SongbookOperation::Download);
	# 		}
	# 		else {
	# 			return array(SongbookOperation::Create);
	# 		}
	# 	}
	# 	else if($permissionLevel == SongbookPermissionLevel::Owner) {
	# 		return array(SongbookOperation::Create,SongbookOperation::Rename,SongbookOperation::Delete,SongbookOperation::Add,SongbookOperation::Browse
	# 					 ,SongbookOperation::DeleteElement,SongbookOperation::Share,SongbookOperation::Download,SongbookOperation::Visibility);
	# 	}
	# 	else if($permissionLevel == SongbookPermissionLevel::Admin) {
	# 		return array(SongbookOperation::Create,SongbookOperation::Rename,SongbookOperation::Delete,SongbookOperation::Add,SongbookOperation::Browse
	# 					 ,SongbookOperation::DeleteElement,SongbookOperation::Share,SongbookOperation::Download,SongbookOperation::Visibility);
	# 	}
	# 	else if($permissionLevel == SongbookPermissionLevel::Shared) {
	# 		return array(SongbookOperation::Create,SongbookOperation::Add,SongbookOperation::Browse,SongbookOperation::DeleteElement,SongbookOperation::Download);
	# 	}
	# }

	def get_songbook_operations(permission_level,is_public):
		if permission_level == SongbookPermissionLevel.User:
			if is_public:
				return [SongbookOperation.Create,SongbookOperation.Browse,SongbookOperation.Download]
			else:
				return [SongbookOperation.Create]
		elif permission_level == SongbookPermissionLevel.Owner:
			return [SongbookOperation.Create,SongbookOperation.Rename,SongbookOperation.Delete,SongbookOperation.Add,SongbookOperation.Browse,
					SongbookOperation.DeleteElement,SongbookOperation.Share,SongbookOperation.Download,SongbookOperation.Visibility]
		elif permission_level == SongbookPermissionLevel.Admin:
			return [SongbookOperation.Create,SongbookOperation.Rename,SongbookOperation.Delete,SongbookOperation.Add,SongbookOperation.Browse,
					SongbookOperation.DeleteElement,SongbookOperation.Share,SongbookOperation.Download,SongbookOperation.Visibility]
		elif permission_level == SongbookPermissionLevel.Shared:
			return [SongbookOperation.Create,SongbookOperation.Add,SongbookOperation.Browse,SongbookOperation.DeleteElement,SongbookOperation.Download]
	def get_permission_to_songbook(is_admin,is_owner,is_shared):
		#permission_level = self.get_permission_level_of_songbook(is_admin,is_owner,is_shared)
		#print(permission_level)
		return 