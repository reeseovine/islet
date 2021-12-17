const fs = require('fs');

let postDateFormat = /\d{4}\-\d{2}\-\d{2}\-/;

// Convert the post filename to readable post name. E.g. changes "2020-10-10-My-First-Post.html" to "My First Post"
let getPostTitle = (filename) => {
	let fileExtPos = filename.lastIndexOf('.');
	if (postDateFormat.test(filename.slice(0, 11))){
		return filename.slice(11, fileExtPos).replace(/-/g, ' ');
	} else {
		return filename.slice(0, fileExtPos).replace(/-/g, ' ');
	}
}

// Generate the "nice to read" version of date
let getPostDate = (filename) => {
	if (postDateFormat.test(filename.slice(0, 11))){
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
	let files = fs.readdirSync('./posts');
	let posts = [];
	for (var filename of files){
		posts.push({
			filename,
			title: getPostTitle(filename),
			date: filename.slice(0, 10)
		})
	}
	return posts;
}

module.exports = {
	getPostTitle,
	getPostDate,
	getPostList
}
