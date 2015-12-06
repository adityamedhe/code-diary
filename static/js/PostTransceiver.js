// class PostTransceiver
// responsible for sending and receiving Posts

function PostTransceiver(set_URL){
	while(set_URL.indexOf('/') != -1)
		set_URL = set_URL.replace('/', '')

	this.serverURL = set_URL.trim()

	this.endpoints = []
	this.endpoints['insert_post'] = this.serverURL + '/insert_post'
	this.endpoints['edit_post'] = this.serverURL + '/edit_post'
	this.endpoints['get_posts'] = this.serverURL + '/get_posts'
	this.endpoints['get_posts_by_tags'] = this.serverURL + '/get_posts_by_tags'
	this.endpoints['get_post_by_id'] = this.serverURL + '/get_post_by_id'
	this.endpoints['get_tag_suggs'] = this.serverURL + '/get_tag_suggs'
	this.endpoints['delete_post'] = this.serverURL + '/delete_post'
}

//function definitions
PostTransceiver.prototype.insertPost = function(post_title, post_text, post_tags) {
		
}
	