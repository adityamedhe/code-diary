//DOM Handler
//abstracts all DOM Modifications and gives a standard API to modify DOM and insert/delete posts
function DOMHandler(set_pc) {
	this.postContainer = set_pc
	this.postsInDOM = []
}

DOMHandler.prototype.injectPost = function(post) {
	card = $("<div></div>")
	card.addClass('card white blue-text')

	cardContent = $("<div></div>")
	cardContent.addClass('card-content')

	cardTitle = $("<div></div>")
	cardTitle.addClass('card-title')

	cardText = $("<div></div>")
	cardText.addClass('grey-text')

	cardAction = $("<div></div>")
	cardAction.addClass('card-action')

	tags = $("<div>TAGGED </div>")
	tags.css('marginTop', '15px')
	tags.addClass('blue-text')

	viewButton = $("<button>view post</button>")
	viewButton.addClass('btn blue white-text waves-effect waves-dark')

	card.data('post_id', post.post_id)
	card.append(cardContent)
	cardContent.append(cardTitle)
	cardContent.append(cardText)
	cardContent.append(tags)
	card.append(cardAction)
	cardAction.append(viewButton)

	cardTitle.html(post.post_title)
	cardText.html(post.post_text)
	for(t of post.tags){
		tag = $('<div><i class="material-icons small">close</i></div>')
		tag.addClass('chip')
		tag.append(t.tag_name)
		tags.append(tag)
	}
	this.postContainer.append(card)
}

DOMHandler.prototype.clearPosts = function() {
	this.postsInDOM = []
	this.postContainer.html('')
}