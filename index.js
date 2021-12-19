const fs = require('fs');

const config = require('./config'); // User-defined config variables. You should edit this file first!
const helpers = require('./helpers');

const NodeCache = require('node-cache');
const cache = new NodeCache();
const chokidar = require('chokidar');
let postWatcher = chokidar.watch('./posts/*').on('all', (event, path) => {
	cache.set('posts', helpers.getPostList());
	cache.set('posts/'+path.slice(6, path.lastIndexOf('.')), helpers.getPostContents(path.slice(6)));
});

const express = require('express');
const app = express();

app.set('views', './templates');
app.set('view engine', 'ejs');

// Static assets (CSS, images)
app.use('/', express.static('static'));

// Main pages
app.get(['/', '/index.html'], (req, res) => {
	res.render('index', {config, posts: cache.get('posts'), pageTitle: 'Home', content: {include: 'home'}});
});
app.get(['/archive', '/archive.html'], (req, res) => {
	res.render('index', {config, posts: cache.get('posts'), pageTitle: 'Archive', content: {include: 'archive'}});
});
app.get(['/about', '/about.html'], (req, res) => {
	res.render('index', {config, posts: cache.get('posts'), pageTitle: 'About', content: {include: 'about'}});
});

// A blog post
app.get('/posts/:filename', (req, res) => {
	let posts = cache.get('posts');
	let contents = cache.get('posts/'+req.params.filename);
	if (!contents){
		// find the file that is being referred to. html takes precedence over md.
		let postFiles = fs.readdirSync('./posts');
		let filename;
		for (var file of postFiles){
			let fileExtPos = file.lastIndexOf('.');
			if (file.slice(0, fileExtPos) === req.params.filename){
				filename = file;
				break;
			}
		}
		if (!filename){
			// That blog post doesn't exist!
			res.status(404).render('index', {config, posts, pageTitle: 'Not found', content: {include: 'not_found'}});
			return;
		}
		contents = helpers.getPostContents(filename);
		cache.set('posts/'+req.params.filename, contents);
	}

	// grab the title, date, and index from the posts list
	let postData;
	for (var i=0, post; post=posts[i]; i++){
		if (post.filename === req.params.filename){
			postData = Object.assign(post, {index: i, title: (contents.title ? contents.title : post.title), body: contents.body});
			break;
		}
	}

	res.render('index', {config, posts, pageTitle: postData.title, content: {include: 'post', data: postData}});
});

// RSS feed
app.get('/feed.rss', (req, res) => {
	res.set('Content-Type', 'application/xml');
	res.render('feed', {config, posts: helpers.getPostListExtended()});
});

// 404 not found!
app.get('*', (req, res) => {
	res.status(404).render('index', {config, posts: cache.get('posts'), pageTitle: 'Not found', content: {include: 'not_found'}});
});


app.listen(config.serverPort, () => {
	console.log(`Backend server started on port ${config.serverPort}.`);
});
