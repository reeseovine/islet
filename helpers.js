const fs = require('fs');
const path = require('path');
const marked = require('marked');
const decode = require('html-entities').decode;

let postDateFormat = /^\d{4}\-\d{2}\-\d{2}\-?/;

// Generate the "nice to read" version of date
let getPostDate = (slug) => {
	if (postDateFormat.test(slug.slice(0, 10))){
		let monthSlice = slug.slice(5, 7);
		let month = "";
		switch (monthSlice){
			case "01": month = "Jan"; break;
			case "02": month = "Feb"; break;
			case "03": month = "Mar"; break;
			case "04": month = "Apr"; break;
			case "05": month = "May"; break;
			case "06": month = "Jun"; break;
			case "07": month = "Jul"; break;
			case "08": month = "Aug"; break;
			case "09": month = "Sep"; break;
			case "10": month = "Oct"; break;
			case "11": month = "Nov"; break;
			case "12": month = "Dec"; break;
			default: console.warn(`"${monthSlice}" in "${slug}" is not a valid month! Please double-check so that it will display properly.`);
		}

		return slug.slice(8, 10) + " " + month + ", " + slug.slice(0,4);
	} else {
		return "";
	}
}

// Get the readable post name. E.g. changes "2020-10-10-My-First-Post.html" to "My First Post", or grabs a custom title from the first line if it exists.
let getPostTitle = (slug, file) => {
	let firstLine = fs.readFileSync(file).toString().split('\n')[0];
	if (/^<title>.*<\/title>$/.test(firstLine)){
		return firstLine.replace(/^<title>(.*)<\/title>$/, '$1');
	} else {
		if (postDateFormat.test(slug.slice(0, 10))){
			return slug.slice(11).replace(/-/g, ' ');
		} else {
			return slug.replace(/-/g, ' ');
		}
	}
}

let getPostContents = (file) => {
	let contents = fs.readFileSync(file).toString();

	// Parse markdown if it has the proper file extension
	if (file.slice(-3) === '.md'){
		contents = marked.parse(contents);
	}

	// Remove custom title if it exists
	let firstLine = contents.split('\n')[0];
	if (/^<title>.*<\/title>$/.test(firstLine)){
		contents = contents.split('\n').slice(1).join('\n');
	}

	return contents;
}

// Fetch post contents from cache, or generate and store it if missing.
let cachePostContents = (file, cache) => {
	let body = cache.get(file);
	if (!body){
		body = getPostContents(file);
		cache.set(file, body);
	}
	return body;
}

let getPostSummary = (contents, truncateAt) => {
	// Take post contents -> Remove HTML tags -> Remove blank lines -> Remove spaces from start and end of each line -> Decode HTML encoded symbols -> Join lines with 2 spaces in between
	let text = contents.replace(/<[^>]+>/g, '').split('\n').filter(line => line.length > 0).map(line => decode(line.replace(/(^\s+|\s+$)/g, ''))).join('  ');

	// Cut length if needed and add ellipsis (280 characters total or whatever you specify in the config)
	truncateAt = truncateAt || 280
	if (text.length > truncateAt-3){
		return text.slice(0, truncateAt-3) + '...';
	}
	return text;
}

let getPostList = () => {
	let files = fs.readdirSync('posts').reverse();
	let posts = [];
	for (var file of files){
		let fileExtPos = file.lastIndexOf('.');
		let slug = file.slice(0, fileExtPos); // shortened path used for the URL
		file = path.join('posts', file); // the complete file path including extension

		posts.push({
			slug, file,
			title: getPostTitle(slug, file),
			date: slug.slice(0, 10),
			niceDate: getPostDate(slug)
		});
	}
	return posts;
}

let getIndex = (slug, posts) => {
	let index = -1;
	for (var i=0; i < posts.length; i++){
		if (posts[i].slug === slug){
			index = i;
			break;
		}
	}
	return index;
}

module.exports = {
	getPostDate,
	getPostTitle,
	getPostContents,
	cachePostContents,
	getPostSummary,
	getPostList,
	getIndex,
}
