import { readdirSync, statSync } from "fs";
import { join } from "path";
import { addEndSlash, getAbsolutePathForURL } from "../utils/fileUtils";
import { getFileIcon, ICONS } from "../utils/Icons";

interface ListElement {
	icon: string
	href: string
	name: string
	size: string
	lastModified: string
}

const units = ["B", "KB", "MB", "GB"];

function formatFileSize(size: number): string {
	let u = 0;
	while (size >= 1024 && u < units.length - 1) {
		size /= 1024;
		++u;
	}
	return size.toFixed(2) + " " + units[u];
}

function formatDate(date: Date): string {
	const iso = date.toISOString();
	return iso.substr(0, 10) + " " + iso.substr(11, 8);
}

function listElemtToHTML(e: ListElement) {
	return `<li><a href="${e.href}">
	<span>${e.icon}</span>
	<span>${e.name}</span>
	<span>${e.lastModified}</span>
	<span>${e.size}</span></a></li>`;
}

export function handleDefaultRequest(url: URL): string {
	const absolutePath = getAbsolutePathForURL(url);
	const dirname = absolutePath.replace("/public", "");
	const aria2URL = new URL(url.toString()); aria2URL.search = "?aria2";
	const rawURL = new URL(url.toString()); rawURL.search = "?raw";

	const directories: ListElement[] = [];
	const files: ListElement[] = [];

	const entries = readdirSync(absolutePath)
		.map(name => {
			const stat = statSync(join(absolutePath, name));
			return {
				name,
				isDirectory: stat.isDirectory(),
				isFile: stat.isFile(),
			};
		});

	for (const { name, isFile, isDirectory } of entries) {
		const href = join("/", url.pathname, name);
		const info = statSync(join(absolutePath, name));

		if (isFile) {
			files.push({ icon: getFileIcon(name), href, name, size: formatFileSize(info.size), lastModified: formatDate(info.mtime) });
		}
		else if (isDirectory) {
			directories.push({ icon: ICONS.Folder, href: addEndSlash(href), name, size: "", lastModified: formatDate(info.mtime) });
		}
	}

	// add parent directory
	if (absolutePath !== "/public" && absolutePath !== "/public/") {
		directories.unshift({ icon: ICONS.Folder, href: addEndSlash(join("/", url.pathname, "..")), name: "..", size: "", lastModified: "" });
	}

	return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0"> 
			<title>${ICONS.Folder} ${dirname}</title>
			<style>
			
			body {
				margin: 0;
				font-family: sans-serif;
				font-size: 1.1rem;
			}
			a, a:visited {
				color: #1896E1;
			}

			ul {
				list-style: none;
				padding: 0;
				margin: 0;
			}

			h1 { 
				margin: 1rem 1.5rem;
				font-size: 2rem;
			}
			h2 {
				margin: 0 0 1rem 0;
				font-size: 1.5rem;
			}

			li a, li a:visited {
				display: inline-block;
				color: inherit;
				text-decoration: inherit;
				padding: 6px 16px;
			}

			li span:first-child {
				display: inline-block;
				width: 1.8rem;
			}

			li span:nth-child(2) {
				flex-grow:1;
			}	
			li span:nth-child(3) {
				width:20%;
				font-size: 0.85rem
			}	
			li span:nth-child(4) {
				width:20%;
				font-size: 0.85rem
			}	
			li a {
				display:flex;
				align-items: center;
			}	

			li:nth-child(even) {
				background-color: #00002010;
			}		

			code {
				display: inline-block;
				padding: .25rem 1rem;
				border-radius: .25rem;
				background-color: #1E1E1E;
				color: white;
			}

			p, code {
				margin: .5rem 0;
			}

			.info {
				margin: .5rem;
				padding: 2rem 1rem;
				background-color: #00002020;
				border-radius: .25rem;
			}
				
			</style>
		</head>
		<body>
		<ul>
			<h1>${dirname}</h1>
			${directories.map(listElemtToHTML).join("")}
			${files.map(listElemtToHTML).join("")}
			<br><br><br><br><br>
		</ul>

		<div class="info">
		<h2>Usage</h2>
		<p>You can find a text list of all the files within <i>${dirname}</i> and nested folders here: <a href="${rawURL}">${rawURL}</a>
		
		<br><br><br>

		<p>To download <i>${dirname}</i> and all nested folders with <a href="http://aria2.github.io/">aria2c</a> you can do this: </p>
		<code>&gt; curl ${aria2URL} | aria2c -c -i -</code>
		</div>
		<br><br><br><br><br>
		</body>
		</html>`;
}

