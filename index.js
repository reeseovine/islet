const fs = require('fs');
const path = require('path');

const config = require('./config'); // User-defined config variables. You should edit this file first!
const helpers = require('./helpers');

const express = require('express');
const app = express();

app.set('views', './templates');
app.set('view engine', 'ejs');

app.use('/', express.static('static'));

app.get('/', (req, res) => {
	res.render('index', {config, posts: helpers.getPostList(), pageTitle: 'Home', content: 'pee pee poo poo'});
});


app.listen(config.serverPort, () => {
	console.log(`Backend server started on port ${config.serverPort}.`);
});
