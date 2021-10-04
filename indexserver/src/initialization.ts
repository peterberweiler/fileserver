import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { htpasswdSSHA, isEnvValueTrue } from "./utils/util";

const NGINX_CONF_PATH = "/etc/nginx/conf.d/default.conf";

const BASIC_AUTH_ENABLED = isEnvValueTrue(process.env.BASIC_AUTH_ENABLED);
const BASIC_AUTH_REALM = process.env.BASIC_AUTH_REALM || "admin";
const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER || "admin";
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD || "fileserver";

/**
 * replaced rows in nginx conf
 */
function templateReplacer(name: string): string {
	if (BASIC_AUTH_ENABLED) {
		switch (name) {
			case "auth_basic": return `auth_basic "${BASIC_AUTH_REALM}";`;
			case "auth_basic_user_file": return "auth_basic_user_file /config/.htpasswd;";
		}
	}
	return "";
}

/**
 * this is only run if the application is started with the --init flag
 * it adds extra settings to the nginx configuration (e.g. basic auth)
 */
export function initialization(): void {
	try {
		// create htpasswd file for basic auth
		if (BASIC_AUTH_ENABLED) {
			const htpasswd = htpasswdSSHA(
				BASIC_AUTH_USER,
				BASIC_AUTH_PASSWORD,
				new Date().toISOString() + Math.random()
			);

			mkdirSync("/config", { recursive: true });
			writeFileSync("/config/.htpasswd", htpasswd, "utf-8");
		}

		// replace all lines in the nginx conf that contain "# {{ ... }}" with the correct values

		const conf = readFileSync(NGINX_CONF_PATH, "utf-8");
		const newConf = conf.replace(/.*#\s*{{(.*)}}.*/g, (_, $1) => {
			const templateComment = " # {{" + $1 + "}}";
			return templateReplacer($1.trim()) + templateComment;
		});
		writeFileSync(NGINX_CONF_PATH, newConf, "utf-8");

		process.exit(0);
	}
	catch (err) {
		console.error(err);
		process.exit(1);
	}
}

