/* ui functions */

function progressStop() {
	$("#progress-bar").css('visibility', 'hidden')
}
function progressStart() {
	$("#progress-bar").css('visibility', 'visible')
}

$(document).ready(function() {
	progressStop()
	UIBundle = {
		"card-status" : $("#card-status"),
		"post-container" : $("#post-container")
	}
	pt = new Transceiver("/")
	dh = new DOMHandler(UIBundle)
	loader = new PostLoader(pt, dh, UIBundle)


	loader.setSearchNoFilter()
	loader.loadMorePosts()


	//assign event handlers

	$("#button-load").on('click', function(){
		loader.loadMorePosts()
	})

	$("#tabAll").on('click', function() {
		loader.setSearchNoFilter()
		loader.loadMorePosts()
	})

	$("#but-search-title").on('click', function() {
		loader.setSearchTitleFilter($("#input-title").val())
		loader.loadMorePosts()
	})

	$("#but-search-tags").on('click', function() {
		loader.setSearchTagsFilter(selTags)
		loader.loadMorePosts()
	})

	$("#button-create").on('click', function() {
		location.href = '/create'
	})
	// tag searching logic
	selTags = []
	textField = $("#input-tags")
	labelSugg = $("#label-sugg")
	labelSelected = $("#label-selected")
	suggCont = $("#tag-sugg-container")
	selCont = $("#tag-selected-container")

	textField.on('keyup', function (key) {
		searchPattern = textField.val()

		pt.getTagSuggs(searchPattern, function (response){
			if(response.status == "OK") {
				labelSugg.fadeIn('slow')
				suggCont.fadeIn('slow')
				suggCont.html('')

				for(t of response.tags){
					tag = $("<div></div>")
					tag.addClass('chip')
					tag.html(t.tag_name)

					tag.on('click', function(){
						selCont.fadeIn('slow')
						labelSelected.fadeIn('slow')
						$(this).remove()
						selCont.append($(this))
						selTags.push($(this).text())
						$(this).on('click', function(){
							selTags.splice(selTags.indexOf($(this).text()), 1)							
							$(this).remove()
							if(selCont.find('div').length == 0){
								selCont.fadeOut('slow', function() {
									selCont.hide()
								})
								labelSelected.fadeOut('slow', function(){
									selCont.hide()
								})
							}
						})
					})
					suggCont.append(tag)
				}
			}
			else if (response.status == "NO_RESULT") {
				suggCont.fadeIn('slow')
				suggCont.html('Could not find any suggestions')
			}
		})
	})
})