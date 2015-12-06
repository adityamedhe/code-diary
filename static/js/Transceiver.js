// class Transceiver
// responsible for sending and receiving Posts

function Transceiver(set_URL){
	while(set_URL.indexOf('/') != -1)
		set_URL = set_URL.replace('/', '')

	this.serverURL = set_URL.trim()

	this.endpoints = []
	this.endpoints['insert_post'] = 'http://' + this.serverURL + '/api/insert_post'
	this.endpoints['edit_post'] = 'http://' + this.serverURL + '/api/edit_post'
	this.endpoints['get_posts'] = 'http://' + this.serverURL + '/api/get_posts'
	this.endpoints['get_posts_by_tags'] = 'http://' + this.serverURL + '/api/get_posts_by_tags'
	this.endpoints['get_post_by_id'] = 'http://' + this.serverURL + '/api/get_post_by_id'
	this.endpoints['get_tag_suggs'] = 'http://' + this.serverURL + '/api/get_tag_suggs'
	this.endpoints['delete_post'] = 'http://' + this.serverURL + '/api/delete_post'
	this.endpoints['get_posts_by_title'] = 'http://' + this.serverURL + '/api/get_posts_by_title'
}

//function definitions
Transceiver.prototype.insertPost = function(post_title, post_text, post_tags) {
	payload = {
		"post_title" : post_title,
		"post_text" : post_text,
		"post_tags" : post_tags
	}		

	$.post(this.endpoints['insert_post'], JSON.stringify(payload), function(response) {
		console.log (response);
	})
}

Transceiver.prototype.getTagSuggs = function(key, callback) {
	key = typeof(key) == 'undefined' ? "" : key
	payload = {
		"key" : key
	}

	$.post(this.endpoints['get_tag_suggs'], JSON.stringify(payload),  function(response) {
		callback(response)
	}, "json")
}

Transceiver.prototype.getPosts = function(timestamp, n, callback) {
	timestamp = typeof(timestamp) == 'undefined' ? 0 : timestamp
	n = typeof(n) == 'undefined' ? 5 : n
	
	payload = {
		"timestamp" : timestamp,
		"n" : n
	}

	$.post(this.endpoints['get_posts'], JSON.stringify(payload), function (response) {
		callback(response)
	}, "json")
}
	

Transceiver.prototype.getPostByID = function(post_id, callback) {
	post_id = typeof(post_id) == 'undefined' ? 0 : post_id
	
	payload = {
		"post_id" : post_id
	}

	$.post(this.endpoints['get_post_by_id'], JSON.stringify(payload), function(response) {
		callback(response)
	}, "json")
}

Transceiver.prototype.getPostsByTitle = function(key, timestamp, n, callback) {
	key = typeof(key) == 'undefined' ? 0 : key
	timestamp = typeof(timestamp) == 'undefined' ? 0 : timestamp
	n = typeof(n) == 'undefined' ? 5 : n

	payload = {
		"key" : key,
		"timestamp" : timestamp,
		"n" : n
	}

	$.post(this.endpoints['get_posts_by_title'], JSON.stringify(payload), function (response) {
		callback(response)
	}, "json")
}

Transceiver.prototype.deletePost = function(post_id, callback) {
	post_id = typeof(post_id) == 'undefined' ? 0 : post_id

	$.get(this.endpoints['delete_post'] + "?post_id=" + post_id, null, function(response) {
		callback(response)
	}, "json")
}

Transceiver.prototype.editPost = function(post_id, new_title, new_text, new_tags, callback) {
	payload = {
		"post_id" : post_id,
		"new_title" : new_title,
		"new_text" : new_text,
		"new_tags" :new_tags
	}

	$.post(this.endpoints['edit_post'], JSON.stringify(payload), function(response) {
		callback(response)
	}, "json")
};

Transceiver.prototype.getPostsByTags = function(tags, timestamp, n, callback) {
	payload = {
		"tags" : tags,
		"timestamp": timestamp,
		"n" : n
	}

	$.post(this.endpoints['get_posts_by_tags'], JSON.stringify(payload), function(response) {
		callback(response)
	}, "json")
}