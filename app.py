# CodeDiary API Handler
# The "Controller" class of MVC

# imports
from flask import Flask, g, request, render_template
import json
import calendar
from database import Database

# init the app
app = Flask(__name__)
app.config.from_object('config')

# configuration methods

@app.before_request
def before_request():
	g.dbo = Database(app.config['DATABASE'])

@app.teardown_request
def teardown_request(e):
	g.dbo.destroy()

# static routes
@app.route('/')
def root():
	return render_template("index.html")
@app.route('/view/<int:id>')
def view(id):
	return render_template("view.html",post=g.dbo.get_post_by_id(id)['post'])
@app.route('/create')
def create():
	return render_template("create.html")
@app.route('/edit/<int:id>')
def edit(id):
	return render_template('edit.html', post=g.dbo.get_post_by_id(id)['post'])
@app.route('/about')
def about():
	return render_template('about.html')
# API routes
@app.route('/api/get_post_by_id', methods=['GET', 'POST'])
def api_get_post_by_id():
	recd_data = request.get_json(force=True)
	return pretty_json(g.dbo.get_post_by_id(recd_data.get('post_id', None)))

@app.route('/api/get_posts', methods=['GET', 'POST'])
def api_get_posts():
	recd_data = request.get_json(force=True)
	return pretty_json(g.dbo.get_posts(recd_data.get('timestamp', 0), recd_data.get('n', 5)))

@app.route('/api/get_posts_by_tags', methods=['GET', 'POST'])
def api_get_posts_by_tags():
	recd_data = request.get_json(force=True)
	return pretty_json(g.dbo.get_posts_by_tags(recd_data.get('tags', None), recd_data.get('timestamp', 0), recd_data.get('n', 5)))

@app.route('/api/get_posts_by_title', methods=['POST'])
def api_get_posts_by_title():
	recd_data = request.get_json(force=True)
	return pretty_json(g.dbo.get_posts_by_title(recd_data.get('key', None), recd_data.get('timestamp', 0), recd_data.get('n', 5)))


@app.route('/api/insert_post', methods=['POST'])
def api_insert_post():
	recd_data = request.get_json(force=True)
	return pretty_json(g.dbo.insert_post(recd_data.get('post_title', None),  recd_data.get('post_text', None), recd_data.get('post_tags', None)))

@app.route('/api/edit_post', methods=['POST'])
def api_edit_post():
	recd_data = request.get_json(force=True)
	return pretty_json(g.dbo.edit_post(recd_data.get('post_id', None), recd_data.get('new_title', None), recd_data.get('new_text', None), recd_data.get('new_tags', None)))

@app.route('/api/delete_post', methods=['GET'])
def api_delete_post():
	recd_data = request.args.get('post_id', None)
	return pretty_json(g.dbo.delete_post(recd_data))

@app.route('/api/get_tag_suggs', methods=['POST'])
def api_get_tag_suggs():
	recd_data = request.get_json(force=True)
	return pretty_json(g.dbo.get_tag_suggs(recd_data.get('key', None)))

# util functions
def pretty_json(jstr):
	return json.dumps(jstr)
# run the app
if __name__ == '__main__':
	app.run(debug=True, host="0.0.0.0", port=8080)