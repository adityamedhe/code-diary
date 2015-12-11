// PostLoader
// implements search filters and pagination logic

function PostLoader (transceiver, domHandler, uibundle) {
	this.transceiver = transceiver
	this.domHandler = domHandler
	this.UIBundle = uibundle

	this.searchFilterType = "NONE"
	this.lastID = 0
	this.filterTitle = ""
	this.filterTags = []

}

PostLoader.prototype.loadMorePosts = function() {
	progressStart()
	if(this.searchFilterType == "TITLE") {
		this.transceiver.getPostsByTitle(this.filterTitle, this.lastID, 5, function(response) {
			if(response.status == "OK"){
				for (post of response.posts){
					this.domHandler.injectPost(post)
					progressStop()
				}
				this.lastID = response.posts[response.posts.length - 1].post_id
				this.UIBundle['card-status'].html('Showing all posts with title \'' + this.filterTitle + '\'')
			}

			else if(response.status == "NO_RESULT") {
				if(this.UIBundle['post-container'].children('div').length == 0) {
					this.UIBundle['card-status'].html("No posts to show")
				}
				Materialize.toast("No more posts!", 1000)
				progressStop()
			}
		}.bind(this))
	}

	else if(this.searchFilterType == "NONE") {
		this.transceiver.getPosts(this.lastID, 5, function(response) {
			if(response.status == "OK") {
				for(post of response.posts) {
					this.domHandler.injectPost(post)
				}
				this.lastID = response.posts[response.posts.length - 1].post_id
				this.UIBundle['card-status'].html('Showing all posts')
				progressStop()
			}			
			else if (response.status == "NO_RESULT") {
				if(this.UIBundle['post-container'].children('div').length == 0) {
					this.UIBundle['card-status'].html("No posts to show")
				}
				Materialize.toast("No more posts!", 1000)
				progressStop()
			}
		}.bind(this))
	}

	else if(this.searchFilterType == "TAGS") {
		this.transceiver.getPostsByTags(this.filterTags, this.lastID, 5, function(response){
			if(response.status == "OK") {
				for (post of response.posts) {
					this.domHandler.injectPost(post)
				}
				this.lastID = response.posts[response.posts.length - 1].post_id				
				$("#card-status").html('Showing all posts with tags: ')
				for (t of this.filterTags){
					tag = $('<div></div>')
					tag.addClass('chip')
					tag.html(t)
					this.UIBundle['card-status'].append(tag)
				}
				progressStop()
			}
			else if(response.status == "NO_RESULT") {
				if(this.UIBundle['post-container'].children('div').length == 0){
					this.UIBundle['card-status'].html("No posts to show")
				}
				Materialize.toast("No more posts!", 1000)
				progressStop()
			}
		}.bind(this))
	}
}

PostLoader.prototype.setSearchTitleFilter = function(title) {
	this.domHandler.clearPosts()
	this.lastID = 0
	this.searchFilterType = "TITLE"
	this.filterTitle = title
}

PostLoader.prototype.setSearchTagsFilter = function(tag_list) {
	this.domHandler.clearPosts()
	this.lastID = 0
	this.searchFilterType = "TAGS"
	this.filterTags = tag_list
}

PostLoader.prototype.setSearchNoFilter = function() {
	this.domHandler.clearPosts()
	this.lastID = 0
	this.searchFilterType = "NONE"
}