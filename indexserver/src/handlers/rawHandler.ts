import { getFileInfoTree } from "../utils/fileUtils";

export async function handleRawRequest(url: URL): Promise<string> {
	return (await getFileInfoTree(url))
		.map(f => f.url)
		.join("\n");
}
