// PostLoader
// implements search filters and pagination logic

function PostLoader (transceiver, domHandler) {
	this.transceiver = transceiver
	this.domHandler = domHandler
	this.searchFilterType = "NONE"
	this.lastID = 0
	this.filterTitle = ""
	this.filterTags = []

}

PostLoader.prototype.loadMorePosts = function() {
	if(this.searchFilterType == "TITLE") {
		this.transceiver.getPostsByTitle(this.filterTitle, this.lastID, 1, function(response) {
			if(response.status == "OK"){
				for (post of response.posts){
					this.domHandler.injectPost(post)
				}
				this.lastID = response.posts[response.posts.length - 1].post_id
			}

			else if(response.status == "NO_RESULT") {
				Materialize.toast("No more posts!")
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
			}			
			else if (response.status == "NO_RESULT") {
				alert("NO MORE")
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
			}
			else if(response.status == "NO_RESULT") {
				alert("NO MORE")
			}
		}.bind(this))
	}
}

PostLoader.prototype.setSearchTitleFilter = function(title) {
	this.lastID = 0
	this.searchFilterType = "TITLE"
	this.filterTitle = title
}

PostLoader.prototype.setSearchTagsFilter = function(tag_list) {
	this.lastID = 0
	this.searchFilterType = "TAGS"
	this.filterTags = tag_list

}

PostLoader.prototype.setSearchNoFilter = function() {
	this.lastID = 0
	this.searchFilterType = "NONE"
}