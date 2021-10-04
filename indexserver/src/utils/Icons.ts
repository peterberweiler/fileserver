import { extname } from "path";

export const ICONS = {
	Folder: "&#x1F4C1;",
	Audio: "&#x1F3B5;",
	Film: "&#x1F39E;&#xFE0F;",
	Text: "&#x1F4C4;",
	Image: "&#x1F5BC;&#xFE0F;",
	Chart: "&#x1F4CA;",
};

export const FILE_ICONS: Record<string, string> = {
	"doc": ICONS.Text,
	"docx": ICONS.Text,
	"log": ICONS.Text,
	"msg": ICONS.Text,
	"odt": ICONS.Text,
	"pages": ICONS.Text,
	"rtf": ICONS.Text,
	"tex": ICONS.Text,
	"txt": ICONS.Text,
	"wpd": ICONS.Text,
	"wps": ICONS.Text,

	"aif": ICONS.Audio,
	"iff": ICONS.Audio,
	"m3u": ICONS.Audio,
	"m4a": ICONS.Audio,
	"mid": ICONS.Audio,
	"mp3": ICONS.Audio,
	"mpa": ICONS.Audio,
	"wav": ICONS.Audio,
	"wma": ICONS.Audio,

	"3g2": ICONS.Film,
	"3gp": ICONS.Film,
	"asf": ICONS.Film,
	"avi": ICONS.Film,
	"flv": ICONS.Film,
	"m4v": ICONS.Film,
	"mov": ICONS.Film,
	"mp4": ICONS.Film,
	"mpg": ICONS.Film,
	"rm": ICONS.Film,
	"swf": ICONS.Film,
	"vob": ICONS.Film,
	"wmv": ICONS.Film,
	"mkv": ICONS.Film,

	"bmp": ICONS.Image,
	"dds": ICONS.Image,
	"gif": ICONS.Image,
	"heic": ICONS.Image,
	"jpg": ICONS.Image,
	"png": ICONS.Image,
	"psd": ICONS.Image,
	"tga": ICONS.Image,
	"thm": ICONS.Image,
	"tif": ICONS.Image,
	"tiff": ICONS.Image,
	"yuv": ICONS.Image,
	"ai": ICONS.Image,
	"eps": ICONS.Image,
	"svg": ICONS.Image,

	"csv": ICONS.Chart,
	"dat": ICONS.Chart,
	"ged": ICONS.Chart,
	"key": ICONS.Chart,
	"xlr": ICONS.Chart,
	"xls": ICONS.Chart,
	"xlsx": ICONS.Chart,
};

export function getFileIcon(name: string): string {
	return FILE_ICONS[extname(name).toLowerCase().substr(1)] || "";
}
