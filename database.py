# The "model" class of MVC
# CodeDiary sqlite3 database adapter
import json
import sqlite3
import time

######################################################################

class Database(object):
	"""Abstracts the database operations and querying, single point doorway to physical databse"""
	def __init__(self, db_path):
		super(Database, self).__init__()
		self.db = sqlite3.connect(db_path)	

######################################################################

	def insert_post(self, title, text, tags):
		"""Function to insert a post with it's tags in the database"""
		if(text.strip() == ""):
			return {"status" : "TEXT_EMPTY"}

		elif(title.strip() == ""):
			return {"status" : "TITLE_EMPTY"}

		elif(len(tags) == 0):
			return {"status": "TAGS_EMPTY"}
		else:
			try:
				new_post_id = int(time.time() * 10000)
				self.db.execute("insert into posts values(?, ?, ?)", [new_post_id, title, text])

				for t in tags:
					cur_count = self.db.execute("SELECT count(tag_id) from 	tags where tag_name = ?", [t])
					row = cur_count.fetchone()

					if(row[0] == 0):
						# create new tag
						new_tag_id = int(time.time() * 10000)
						self.db.execute("insert into tags values(?, ?)", [new_tag_id, t])

					else:
						#tag already available
						cur_tags = self.db.execute("SELECT tag_id from tags where tag_name = ?", [t])
						new_tag_id = cur_tags.fetchone()[0]

					self.db.execute('insert into mapping values(?, ?)', [new_post_id, new_tag_id])
			except Exception, e:
				return {"status" : "DB_FAIL", "message" : e.message}
			else:
				self.db.commit()
				return {"status" : "OK"}
			finally:
				pass

######################################################################

	def delete_post(self, post_id):
		"""Deletes a post against an input ID, if it exists"""
		if(post_id == None):
			return {"status" : "EMPTY_KEY"}
			
		cur = self.db.execute('SELECT count(post_id) from posts where post_id = ?', [post_id])
		if(cur.fetchone()[0] == 0):
			return {"status" : "NOT_EXIST"}
		else:
			try:
				self.db.execute('delete from posts where post_id = ?', [post_id])
				self.db.execute('delete from mapping where post_id = ?', [post_id])
			except Exception, e:
				return {"status" : "DB_FAIL", "message" : e.message}
			else:
				self.db.commit()
				return {"status" : "OK"}

######################################################################

	def get_post_by_id(self, post_id):
		"""Retrieves a post, given it's post_id"""
		
		if(post_id == None):
			return {"status" : "EMPTY_KEY"}
		##########
		try:
			cur_post = self.db.execute("SELECT * from posts where post_id = ?", [post_id])
		except Exception, e:
			return {"status" : "DB_FAIL", "message" : e.message}
		else:
			post = cur_post.fetchone()
			if(post == None):	
				return {"status" : "NO_RESULT", "posts" : None}
			cur_tags = self.db.execute("SELECT tags.tag_id, tags.tag_name \
				                        from mapping INNER JOIN tags \
				                        ON mapping.tag_id = tags.tag_id \
				                        where mapping.post_id = ?", [post_id])
			tags = [dict(tag_id=t[0], tag_name=t[1]) for t in cur_tags.fetchall()]

			return {
				"status" : "OK",
				"post" : {
				"post_id" : post[0],
				"post_title" : post[1],
				"post_text" : post[2],
				"tags": tags
				}
			}

######################################################################

	def get_posts(self, timestamp, n):
		"""Retrieves all posts having a timestamp greater than parameter. For pagination"""

		try:
			cur_posts = self.db.execute('SELECT * from posts where post_id > ? LIMIT ?', [timestamp, n])
		except Exception, e:
			return {"status" : "DB_FAIL", "message" : e.message}
		else:
			posts_to_return = [dict(post_id=post[0], post_title=post[1], post_text=post[2]) \
							  for post in cur_posts.fetchall()]
			
			if(len(posts_to_return) == 0):
				return {"status" : "NO_RESULT", "posts" : None}
			else:
				for p in posts_to_return:
					cur_tags = self.db.execute("SELECT tags.tag_id, tags.tag_name from \
												mapping INNER JOIN tags \
												ON mapping.tag_id = tags.tag_id \
												where mapping.post_id = ?", [p["post_id"]])
					
					tags = [dict(tag_id=t[0], tag_name=t[1]) for t in cur_tags.fetchall()]
					p["tags"] = tags

			return {"status" : "OK", "posts" : posts_to_return}



######################################################################

	def edit_post(self, post_id, new_title, new_text, new_tags):
		"""Edits an already existing post with id as post_id"""
		if(new_text == None or new_text.strip() == ""):
			return {"status" : "TEXT_EMPTY"}

		elif(new_title == None or new_title.strip() == ""):
			return {"status" : "TITLE_EMPTY"}

		elif(new_tags ==None or len(new_tags) == 0):
			return {"status": "TAGS_EMPTY"}

		try:
			cur_post = self.db.execute("SELECT count(post_id) from posts where post_id = ?", [post_id])
			if(cur_post.fetchone()[0] == 0):
				return {"status" : "POST_NOT_FOUND"}
			
		except Exception, e:
			return {"status" : "DB_FAIL", "message" : e.message}

		# the post exists, now we can proceed to edit it

		try:
			self.db.execute("update posts set post_title = ? where post_id = ?", [new_title, post_id])
			self.db.execute("update posts set post_text = ? where post_id = ?", [new_text, post_id])
			self.db.execute("delete from mapping where post_id = ?", [post_id])

		
			for t in new_tags:
				cur_count = self.db.execute("SELECT count(tag_id) from 	tags where tag_name = ?", [t])
				row = cur_count.fetchone()

				if(row[0] == 0):
					# create new tag
					new_tag_id = int(time.time() * 10000)
					self.db.execute("insert into tags values(?, ?)", [new_tag_id, t])

				else:
					# tag already available
					cur_tags = self.db.execute("SELECT tag_id from tags where tag_name = ?", [t])
					new_tag_id = cur_tags.fetchone()[0]

				self.db.execute('insert into mapping values(?, ?)', [post_id, new_tag_id])
		
		except Exception, e:
			return {"status" : "DB_FAIL", "message" : e.message}
		else:
			self.db.commit()
			return {"status" : "OK"}
	
######################################################################

	def get_posts_by_tags(self, taglist, timestamp, n):
		if(taglist== None or len(taglist) == 0):
			return({"status" : "TAGS_EMPTY"})

		candidate_lists = []

		# get a list of all posts with a tag and store it in a list in candidate_lists

		try:
			for t in taglist:
				cur_tags = self.db.execute("SELECT DISTINCT mapping.post_id \
											from mapping INNER JOIN tags\
											ON mapping.tag_id = tags.tag_id \
											where tags.tag_name = ? AND mapping.post_id > ?", [t, timestamp])
				candidate_lists.append([r[0] for r in cur_tags.fetchall()])
		except Exception, e:
			return {"status" : "DB_FAIL", "message" : e.message}

		# compute intersection of all lists in candidate
		final_list = candidate_lists[0]

		for clist in candidate_lists:
			final_list = [tag for tag in final_list if tag in clist]


		final_list = final_list[0:n]

		if(len(final_list) == 0):
			return {"status" : "NO_RESULT", "posts" : None}

		# final_list now contains the post_ids of ALL the posts that match search criteria
		# call get_post_by_id for each post in final_list and make a list of the results			
		post_list =  [self.get_post_by_id(int(post))["post"] for post in final_list]
		return {"status" : "OK", "posts" : post_list}
	
######################################################################

	def get_posts_by_title(self, key, timestamp, n):
		if(key == None or key.strip() == ""):
			return {"status" : "EMPTY_KEY"}


		try:
			cur_posts = self.db.execute('SELECT * from posts where post_title like ?||"%" AND post_id > ? LIMIT ?', [key, timestamp, n])
		except Exception, e:
			return {"status" : "DB_FAIL", "message" : e.message}
		else:
			posts_to_return = [dict(post_id=post[0], post_title=post[1], post_text=post[2]) \
							  for post in cur_posts.fetchall()]
			
			if(len(posts_to_return) == 0):
				return {"status" : "NO_RESULT", "posts" : None}
			else:
				for p in posts_to_return:
					cur_tags = self.db.execute("SELECT tags.tag_id, tags.tag_name from \
												mapping INNER JOIN tags \
												ON mapping.tag_id = tags.tag_id \
												where mapping.post_id = ?", [p["post_id"]])
					
					tags = [dict(tag_id=t[0], tag_name=t[1]) for t in cur_tags.fetchall()]
					p["tags"] = tags

			return {"status" : "OK", "posts" : posts_to_return}

######################################################################
	def get_tag_suggs(self, key):
		"""Returns a list of all tags which match with key"""

		if(key == None or key.strip() == ""):
			return {"status" : "EMPTY_KEY"}

		try:
			cur_tags = self.db.execute("SELECT tag_id, tag_name from tags where tag_name like ?||'%'", [key])
		except Exception, e:
			return {"status" : "DB_FAIL", "message" : e.message}

		suggestions = [dict(tag_id=tag[0], tag_name=tag[1]) for tag in cur_tags.fetchall()]

		if(len(suggestions) != 0):			
			return {"status" : "OK", "tags" : suggestions}
		else:
			return {"status" : "NO_RESULT", "tags" : None}

######################################################################

	def destroy(self):
		"""Function to destroy database object"""
		if(getattr(self, 'db', None) != None):
			self.db = None



		