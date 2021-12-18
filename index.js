const fs = require('fs');

const config = require('./config'); // User-defined config variables. You should edit this file first!
const helpers = require('./helpers');

const express = require('express');
const app = express();

app.set('views', './templates');
app.set('view engine', 'ejs');

// Static assets (CSS, images)
app.use('/', express.static('static'));

// Main pages
app.get(['/', '/index.html'], (req, res) => {
	res.render('index', {config, posts: helpers.getPostList(), pageTitle: 'Home', content: {include: 'home'}});
});
app.get(['/archive', '/archive.html'], (req, res) => {
	res.render('index', {config, posts: helpers.getPostList(), pageTitle: 'Archive', content: {include: 'archive'}});
});
app.get(['/about', '/about.html'], (req, res) => {
	res.render('index', {config, posts: helpers.getPostList(), pageTitle: 'About', content: {include: 'about'}});
});

// A blog post
app.get('/posts/:filename', (req, res) => {
	// find the file that is being referred to. html takes precedence over md.
	let postFiles = fs.readdirSync('./posts');
	let fileExtPos = req.params.filename.lastIndexOf('.');
	let filename;
	for (var file of postFiles){
		if (file.slice(0, fileExtPos) === req.params.filename){
			filename = file;
			break;
		}
	}
	if (!filename){
		res.status(404).render('index', {config, pageTitle: 'Not found', content: {include: 'not_found'}});
		return;
	}
	let contents = helpers.getPostContents(filename);

	// grab the title, date, and index from the posts list
	let posts = helpers.getPostList();
	let postData;
	for (var i=0, p; p=posts[i]; i++){
		if (p.filename === req.params.filename){
			postData = Object.assign(p, {index: i, body: contents});
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
	res.status(404).render('index', {config, pageTitle: 'Not found', content: {include: 'not_found'}});
});


app.listen(config.serverPort, () => {
	console.log(`Backend server started on port ${config.serverPort}.`);
});
