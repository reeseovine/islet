const fs = require('fs');
const marked = require('marked');

let postDateFormat = /^\d{4}\-\d{2}\-\d{2}\-?/;

// Convert the post filename to readable post name. E.g. changes "2020-10-10-My-First-Post.html" to "My First Post"
let getPostTitle = (filename) => {
	if (postDateFormat.test(filename.slice(0, 10))){
		return filename.slice(11).replace(/-/g, ' ');
	} else {
		return filename.replace(/-/g, ' ');
	}
}

// Generate the "nice to read" version of date
let getPostDate = (filename) => {
	if (postDateFormat.test(filename.slice(0, 10))){
		let monthSlice = filename.slice(5, 7);
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
		}
		return filename.slice(8, 10) + " " + month + ", " + filename.slice(0,4);
	} else {
		return "";
	}
}

let getPostList = () => {
	let files = fs.readdirSync('./posts').reverse();
	let posts = [];
	for (var filename of files){
		let fileExtPos = filename.lastIndexOf('.');
		filename = filename.slice(0, fileExtPos);

		posts.push({
			filename,
			title: getPostTitle(filename),
			date: filename.slice(0, 10),
			date_fmt: getPostDate(filename)
		});
	}
	return posts;
}

// Grab the file contents and parse markdown if needed.
let getPostContents = (file) => {
	let contents = fs.readFileSync('./posts/' + file).toString();
	if (file.slice(-3) === '.md'){
		contents = marked.parse(contents);
	}

	return contents;
}

let getPostListExtended = () => {
	let files = fs.readdirSync('./posts').reverse();
	let posts = [];
	for (var file of files){
		let fileExtPos = file.lastIndexOf('.');
		filename = file.slice(0, fileExtPos);

		posts.push({
			filename,
			title: getPostTitle(filename),
			date: filename.slice(0, 10),
			date_fmt: getPostDate(filename),
			body: getPostContents(file)
		});
	}
	return posts;
}

module.exports = {
	getPostTitle,
	getPostDate,
	getPostList,
	getPostContents,
	getPostListExtended,
}
