const fsx = require('fs-extra')
const path = require('path')
const fetch = require('node-fetch')

const helpers = require('./helpers.js')

// render page to html file
let render = async (app, route, outName) => {
	await fetch(`http://127.0.0.1:${app.server.address().port}${route}`)
		.then((res) => res.text())
		.then((data) => {
			let fileName = path.join('dist', outName)
			// add '.html' to file names that don't have an extension
			if (outName.lastIndexOf('.') < 0){
				fileName += '.html'
			}
			fsx.writeFile(fileName, data, (err, res) => {
				if (err){
					console.error(`Error saving file ${fileName}:\n${err}`)
				} else {
					console.log(`rendered:  ${route}  ->  ${fileName}`)
				}
			})
		})
}

let main = async () => {
	const app = await require('./index')

	console.log('Rendering Islet to static site...')

	// ensure dist/ exists and is empty
	await fsx.emptyDir('dist')

	// render routes to html files
	for (var layer of app.app._router.stack) {
		let route = layer.route

		// ensure it's a valid route
		if (route === undefined || !route.path) {
			continue
		}

		let routePath = route.path

		// if there are multiple paths, select the first one
		if (Array.isArray(routePath)) {
			routePath = routePath[0]
		}

		// omit wildcard paths and paths that don't start with /
		if (routePath.indexOf('*') >= 0 || routePath.indexOf('/') != 0) {
			continue
		}

		// file name to save rendered page as
		let outName

		// render each blog post
		if (routePath === '/posts/:slug') {
			await fsx.mkdirp('dist/posts')
			let postList = helpers.getPostList()
			for (var post of postList) {
				routePath = `/posts/${post.slug}`
				outName = routePath.slice(1)
				await render(app, routePath, outName)
			}
		}
		// render the remaining pages
		else {
			if (routePath === '/') {
				outName = 'index'
			} else {
				outName = routePath.slice(1)
			}
			await render(app, routePath, outName)
		}
	}

	// copy everything inside static/ to dist/
	await fsx.copy('static/', 'dist/')
	console.log(`copied:  static/*  ->  dist/`)

	console.log('Done!')

	app.server.close()
	process.exit(0)
}

main()
