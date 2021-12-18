module.exports = {
	/* === Basic info === */
	blogName: "My Blog Name",
	authorName: "My Name Here",
	authorLink: "", // Enter your website, social media, etc. Some way for people to tell you they like your blog! (Leaving it empty is okay too)

	/* === Theme customization === */
	themeURL: "/style/style.css", // Link to a theme file. Can be relative (on this server) or absolute (somewhere on the web)
	backgroundImage: "", // Optional, uses theme default if left blank.

	/* === Navigation === */
	headerLinks: [
		{path: "/", name: "Home"},
		{path: "/archive", name: "Archive"},
		{path: "/about", name: "About"},
	],
	recentPostsCutoff: 3,

	/* === Behind the scenes stuff === */
	serverPort: 5000, // The port that you want the zonelet server to use. You'll likely want to use port 80 in production.
	metaDescription: "Zonelets is a scrappy blogging workflow designed to encourage creative fun on the internet!", // The description is not directly visible on the page, but it can show up in certain places like search engines.
	blogURL: "", // The address of this blog, used for links in the RSS feed.
	language: "en-US", // The language you primarily write in
}
