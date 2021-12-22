const config = require('./config.js'); // User-defined config variables. You should edit this file first!
const helpers = require('./helpers.js');

const SimpleCache = require('./cache.js');
const cache = new SimpleCache();

const chokidar = require('chokidar');
// Update posts list and remove post contents from cache as changes are reported.
let postWatcher = chokidar.watch('posts/*', {ignoreInitial: true}).on('all', (event, path) => {
	cache.remove(path);
	cache.set('posts', helpers.getPostList());
});
// Cache post list on startup
postWatcher.on('ready', () => {
	cache.set('posts', helpers.getPostList());
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
app.get('/posts/:slug', (req, res) => {
	// Check if that post exists and determine its position within the list of posts.
	let posts = cache.get('posts');
	let index = -1;
	for (var i=0; i < posts.length; i++){
		if (posts[i].slug === req.params.slug){
			index = i;
			break;
		}
	}
	if (index < 0){
		res.status(404).render('index', {config, posts, pageTitle: 'Not found', content: {include: 'not_found'}});
		return;
	}

	// Fetch the post body from cache.
	let body = helpers.cachePostContents(posts[index].file, cache);
	// Make an object that includes the post's metadata, index, and body, then render the page with it.
	let postData = Object.assign(posts[index], {index, body});
	res.render('index', {config, posts, pageTitle: postData.title, content: {include: 'post', data: postData}});
});

// RSS feed
app.get('/feed.rss', (req, res) => {
	// Do a similar thing as we do above, but for all of them this time.
	let posts = cache.get('posts');
	let postsExtended = [];
	for (var post of posts){
		postsExtended.push(Object.assign(post, {body: helpers.cachePostContents(post.file, cache)}));
	}

	res.set('Content-Type', 'application/xml');
	res.render('feed', {config, posts: postsExtended});
});

// 404 not found!
app.get('*', (req, res) => {
	res.status(404).render('index', {config, posts: cache.get('posts'), pageTitle: 'Not found', content: {include: 'not_found'}});
});


app.listen(config.serverPort, () => {
	console.log(`Backend server started on port ${config.serverPort}.`);
});
