import { createServer, Server } from "http";
import { handleAria2Request } from "./handlers/aria2Handler";
import { handleDefaultRequest } from "./handlers/defaultHandler";
import { handleRawRequest } from "./handlers/rawHandler";
import { CONFIG } from "./utils/config";
import { directoryForURLExists } from "./utils/fileUtils";

export function createIndexserver(): Server {
	return createServer(async (req, res) => {
		const url = new URL("http://" + req.headers.host + (req.url || "/"));
		console.log(`INDEXSERVER: Got request for "${url.toString()}"`);

		if (!url.pathname.startsWith(CONFIG.BASEPATH)) {
			url.pathname = CONFIG.BASEPATH;
			res
				.writeHead(200)
				.end(`Your files are at ${url.toString()}. If this is not the desired location, you need to change the basepath.`);
			return;
		}

		if (!directoryForURLExists(url)) {
			res
				.writeHead(404)
				.end("Not Found");
			return;
		}

		try {
			const isRawRequest = url.searchParams.has("raw") || url.searchParams.has("txt");
			const isAriaRequest = url.searchParams.has("aria") || url.searchParams.has("aria2");

			if (isRawRequest) {
				res
					.writeHead(200, undefined, { "Content-Type": "text/html; charset=utf-8" })
					.end(await handleRawRequest(url));
			}
			else if (isAriaRequest) {
				res
					.writeHead(200)
					.end(await handleAria2Request(url));
			}
			else {
				res
					.writeHead(200)
					.end(handleDefaultRequest(url));
			}
			return;
		}
		catch (err) {
			let text = (err as Error)?.toString();
			if (typeof text !== "string") { text = "Error"; }

			console.error("INDEXSERVER ERROR: ", text);
			res
				.writeHead(500)
				.end(text);
			return;
		}
	});
}
