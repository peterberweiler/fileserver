import { fdir as FDir } from "fdir";
import { existsSync, statSync } from "fs";
import { join, relative } from "path";
import { CONFIG } from "./config";

interface FileInfo {
	relativePath: string;
	absolutePath: string;
	url: string;
}

export function addEndSlash(path: string): string {
	return path.endsWith("/") ? path : path + "/";
}

/**
 *  takes the requested url (e.g "www.example.com/basepath/dir/file.txt") and turns it into a relative path in /public (e.g "dir/file")
 */
export function getAbsolutePathForURL(url: URL): string {
	// join("/", ...) ensures that only /public is accessable
	return join(
		"/public",
		join("/", relative(CONFIG.BASEPATH, decodeURIComponent(url.pathname))),
	);
}

export function directoryForURLExists(url: URL): boolean {
	const path = getAbsolutePathForURL(url);
	return existsSync(path) && statSync(path).isDirectory();
}

// function readDirTree(absolutePath: string, maxDepth: number, depth = 0,): string[] {
// 	const files: string[] = [];
// 	for (const entry of readdirSync(absolutePath, { withFileTypes: true })) {
// 		if (entry.isFile()) {
// 			files.push(entry.name);
// 		}
// 		else if (entry.isDirectory() && (maxDepth === -1 || depth < maxDepth)) {
// 			const entryAbsolutePath = join(absolutePath, entry.name);
// 			const nestedFiles = readDirTree(entryAbsolutePath, maxDepth, depth + 1);
// 			files.push(...nestedFiles.map((f) => join(entry.name, f)));
// 		}
// 	}
// 	return files;
// }

export async function getFileInfoTree(url: URL): Promise<FileInfo[]> {
	const absolutePath = getAbsolutePathForURL(url);
	const maxDepth = parseInt(url.searchParams.get("depth") || "-1");

	const files = (await new FDir()
		.crawlWithOptions(absolutePath, {
			includeBasePath: true,
			maxDepth: maxDepth >= 0 ? maxDepth : undefined,
		})
		.withPromise()) as string[];

	const fileURL = new URL(url.toString());
	fileURL.search = "";

	return files.sort().map((path) => {
		const relativePath = relative(absolutePath, path);
		fileURL.pathname = join(url.pathname, relativePath);

		return {
			relativePath,
			absolutePath: path,
			url: fileURL.toString(),
		};
	});
}
