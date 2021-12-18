const fs = require('fs');
const path = require('path');

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
	res.render('index', {config, posts: helpers.getPostList(), content: {include: 'archive'}});
});
app.get(['/about', '/about.html'], (req, res) => {
	res.render('index', {config, posts: helpers.getPostList(), content: {include: 'about'}});
});

// A blog post
app.get('/posts/:filename', (req, res) => {
	// steps:
	// find the file that is being referred to. html takes precedence over md.
	// load this file into a variable. parse markdown if needed.
	// parse the title and date.

	// req.params.filename
	res.render('index', {config, posts: helpers.getPostList(), content: {include: 'post', data: {}}});
});

// 404 not found!
app.get('*', (req, res) => {
	res.render('index', {config, posts: helpers.getPostList(), content: {include: 'not_found'}});
});


app.listen(config.serverPort, () => {
	console.log(`Backend server started on port ${config.serverPort}.`);
});
