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

	def is_song_permission_valid(permission_level, operation):
		if permission_level == SongPermissionLevel.User:
			if operation in [SongOperation.Create,SongOperation.EditRequest,SongOperation.DeleteRequest,SongOperation.Fork]:
				return True
		elif permission_level == SongPermissionLevel.Creator:
			if operation in [SongOperation.Create,SongOperation.Edit,SongOperation.Delete,SongOperation.Fork,SongOperation.AcceptRequest]:
				return True
		elif permission_level == SongPermissionLevel.Admin:
			if operation in [SongOperation.Create,SongOperation.Edit,SongOperation.Delete,SongOperation.Fork,SongOperation.AcceptRequest]:
				return True
		return False

	def is_songbook_permission_valid(permission_level, operation, is_public):
		if permission_level == SongbookPermissionLevel.User:
			if is_public:
				if operation in [SongbookOperation.Create,SongbookOperation.Browse,SongbookOperation.Download]:
					return True
			else:
				if operation in [SongbookOperation.Create]:
					return True
		elif permission_level == SongbookPermissionLevel.Owner:
			if operation in [SongbookOperation.Create,
							 SongbookOperation.Rename,
							 SongbookOperation.Delete,
							 SongbookOperation.Add,
							 SongbookOperation.Browse,
							 SongbookOperation.DeleteElement,
							 SongbookOperation.Share,
							 SongbookOperation.Download,
							 SongbookOperation.Visibility]:
				return True
		elif permission_level == SongbookPermissionLevel.Shared:
			if operation in [SongbookOperation.Create,
							 SongbookOperation.Add,
							 SongbookOperation.Browse,
							 SongbookOperation.DeleteElement,
							 SongbookOperation.Download]:
				return True
		elif permission_level == SongbookPermissionLevel.Admin:
			if operation in [SongbookOperation.Create,
							 SongbookOperation.Rename,
							 SongbookOperation.Delete,
							 SongbookOperation.Add,
							 SongbookOperation.Browse,
							 SongbookOperation.DeleteElement,
							 SongbookOperation.Share,
							 SongbookOperation.Download,
							 SongbookOperation.Visibility]:
				return True
		return False

	def get_permission_level_for_songbook(songbookid,admin,is_owner,is_shared):
		if songbookid == 0:
			if admin == 1:
				return SongbookPermissionLevel.Admin
			return SongbookPermissionLevel.User
		else:
			if admin == 1:
				return SongbookPermissionLevel.Admin
			elif is_owner:
				return SongbookPermissionLevel.Owner
			elif is_shared:
				return SongbookPermissionLevel.Shared
			else:
				return SongbookPermissionLevel.User

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

	def get_song_operations(permission_level):
		if permission_level == SongPermissionLevel.User:
			return [SongOperation.Create,SongOperation.EditRequest,SongOperation.DeleteRequest,SongOperation.Fork]
		elif permission_level == SongPermissionLevel.Creator:
			return [SongOperation.Create,SongOperation.Edit,SongOperation.Delete,SongOperation.Fork,SongOperation.AcceptRequest]
		elif permission_level == SongPermissionLevel.Admin:
			return [SongOperation.Create,SongOperation.Edit,SongOperation.Delete,SongOperation.Fork,SongOperation.AcceptRequest]

	def get_permission_level_for_song(admin,userid,songid,songcreatorid):
		if songid == 0:
			if admin == 1:
				return SongPermissionLevel.Admin
			return SongPermissionLevel.User
		else:
			if admin == 1:
				return SongPermissionLevel.Admin
			else:
				if songcreatorid == userid:
					return SongPermissionLevel.Creator
			return SongPermissionLevel.User

	def get_permission_level_for_song_by_sessionid(graph,sessionid,songid):
		#admin 		userid  	songcreatorid
		result = graph.cypher.execute("""match (u:User), (creator:User)-[:CREATED]->(s:Song)
										 where u.session = '%s' and ID(s) = %s
										 return ID(u) as userid, 
										 ID(creator) as songcreatorid, u""" % (sessionid,songid))
		return Permission.get_permission_level_for_song(result.one.u["admin"],result.one.userid,
														songid,result.one.songcreatorid)

	def get_permission_level_for_songbook_by_sessionid(graph,sessionid,songbookid):
		#songbookid,is_admin,is_owner,is_shared
		from data.songbook import Songbook
		songbook_class = Songbook(graph)
		result = graph.cypher.execute("""match (u:User), (creator:User)-[:CREATED]->(sb:Songbook)
										 where u.session = '%s' and ID(sb) = %s
										 return ID(u) as userid, 
										 ID(creator) as songbookcreatorid, u""" % (sessionid,songbookid))
		return Permission.get_permission_level_for_songbook(songbookid,result.one.u["admin"],
															result.one.userid == result.one.songbookcreatorid,
															songbook_class.is_shared_with_user(int(songbookid),int(result.one.userid)))

	def is_songbook_public(graph,songbookid):
		result = graph.cypher.execute("""match (sb:Songbook)
										 where ID(sb) = %s
										 return sb.public""" % (songbookid))
		return result.one == 1

	# A usernek el lehet-e végeznie az adott műveletet az adott éneken
	def is_song_operation_valid_for_user(admin,userid,songid,songcreatorid,operation):
		permission_level = Permission.get_permission_level_for_song(admin,userid,songid,songcreatorid)
		return Permission.is_song_permission_valid(permission_level,operation)

	#Megadja, hogy a usernek van-e joga az adott művelethez
	def is_songbook_operation_valid_for_user(graph,operation,songbookid,sessionid):
		perm_level = Permission.get_permission_level_for_songbook_by_sessionid(graph,sessionid,songbookid)
		print(songbookid,perm_level,operation,Permission.is_songbook_public(graph,songbookid))
		print(Permission.is_songbook_permission_valid(perm_level,operation,
												Permission.is_songbook_public(graph,songbookid)))
		return Permission.is_songbook_permission_valid(perm_level,operation,
												Permission.is_songbook_public(graph,songbookid))