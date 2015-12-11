//DOM Handler
//abstracts all DOM Modifications and gives a standard API to modify DOM and insert/delete posts
function DOMHandler(set_ui) {
	this.UIBundle = set_ui
	this.postsInDOM = new Array()
}

DOMHandler.prototype.unInjectPost = function (post_id) {
	this.postsInDOM[post_id].fadeOut('slow').remove()
}
DOMHandler.prototype.clearPosts = function() {
	this.postsInDOM = new Array()
	this.UIBundle['post-container'].html('')
}
DOMHandler.prototype.injectPost = function(post) {
	card = $("<div></div>")
	card.addClass('card white blue-text')

	cardContent = $("<div></div>")
	cardContent.addClass('card-content')

	cardTitle = $("<div></div>")
	cardTitle.addClass('card-title')

	cardText = $("<div></div>")
	cardText.addClass('card-text black-text')
	cardText.css({
		'maxHeight' : '175px',
		'textOverflow' : 'ellipsis'
	})

	tagIcon = $("<img src='static/images/tag.png' width='25'>")
	cardTags = $("<div></div>")
	cardTags.css({
		'marginTop' : '15px',
		'lineHeight' : '-10px'
	})
	cardTags.addClass('card-tags')

	cardAction = $("<div></div>")
	cardAction.addClass('card-action')

	viewButton = $("<button>view</button>")
	viewButton.addClass('btn blue white-text waves-effect waves-light')
	viewButton.on('click', function() {
		location.href = '/view/' + post.post_id
	})


	editButton = $("<button><i class='material-icons'>edit</i></button>")
	editButton.addClass('btn-flat white blue-text waves-dark waves-effect')
	editButton.on('click', function(){
		location.href = '/edit/' + post.post_id
	})
	
	deleteButton = $("<button><i class='material-icons'>delete</i></button>")
	deleteButton.addClass('btn-flat white red-text waves-dark waves-effect')
	deleteButton.on('click', function() {
		pt.deletePost(post.post_id, function(response) {
			if(response.status == "OK") {
				this.unInjectPost(post.post_id)
				Materialize.toast("Deleted that post", 1000)
			}
			else {
				Materialize.toast("There was a problem deleting that post", 1000)
			}
		}.bind(this))
	}.bind(this))

	card.data('post_id', post.post_id)
	card.append(cardContent)
	card.append(cardAction)

	cardContent.append(cardTitle)
	cardContent.append(cardText)
	cardContent.append(cardTags)

	cardAction.append(viewButton)
	cardAction.append(editButton)
	cardAction.append(deleteButton)

	cardTags.append(tagIcon)

	cardTitle.html(post.post_title)
	cardText.html(post.post_text)

	for(t of post.tags){
		tag = $('<div></div>')
		tag.addClass('chip')
		tag.css({
			'margin' : '5px'
		})
		tag.append(t.tag_name)
		cardTags.append(tag)
	}

	this.postsInDOM[post.post_id] = card
	this.UIBundle['post-container'].append(card)
}
