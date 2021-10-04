import { basename, dirname } from "path";
import { getFileInfoTree } from "../utils/fileUtils";

export async function handleAria2Request(url: URL): Promise<string> {
	return (await getFileInfoTree(url))
		.map(f =>
			f.url +
			"\n  dir=" + dirname(f.relativePath) +
			"\n  out=" + basename(f.relativePath)
		)
		.join("\n");
}
