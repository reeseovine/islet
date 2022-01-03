module.exports = {
	/* === Basic info === */
	blogName: "My Blog Name",
	authorName: "My Name Here",
	authorLink: "", // Enter your website, social media, etc. Some way for people to tell you they like your blog! (Leaving it empty is okay too)

	/* === Theme customization === */
	themeURL: "/style/neptune.css", // Link to a theme file. Can be relative (on this server) or absolute (somewhere on the web)
	backgroundImage: "", // Optional, uses theme default if left blank.

	/* === Navigation === */
	headerLinks: [
		{path: "/", name: "Home"},
		{path: "/archive", name: "Archive"},
		{path: "/about", name: "About"},
	],
	recentPostsCutoff: 3,

	/* === Behind the scenes stuff === */
	serverPort: 5000, // The port that you want the islet server to use. You'll likely want to use port 80 in production.
	metaDescription: "Islet is a tiny blogging server designed to encourage creative fun on the internet!", // This description is not directly visible on the page, but it can show up in certain places like search engines.
	truncateSummaryAt: 280, // Maximum length of the post summary that's used in the meta description tag
	language: "en-US", // The language you primarily write in. Not required but recommended
	blogURL: "", // The address of this blog, used for links in the RSS feed.
}
