const fs = require('fs');
const path = require('path');
const marked = require('marked');

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

module.exports = {
	getPostDate,
	getPostTitle,
	getPostContents,
	cachePostContents,
	getPostList,
}
