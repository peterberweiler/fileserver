import { createHash } from "crypto";

export function isEnvValueTrue(value: string | undefined): boolean {
	return value ? ((value = value.toLowerCase().trim()) === "true" || value === "1") : false;
}

/**
 * returns contents for a htpasswd file
 */
export function htpasswdSSHA(username: string, password: string, salt: string): string {
	const saltBytes = Buffer.from(salt);
	const passwdBytes = Buffer.from(password);

	const digest = createHash("sha1")
		.update(passwdBytes)
		.update(saltBytes)
		.digest();

	const ssha = "{SSHA}" + Buffer.concat([digest, saltBytes]).toString("base64");

	return `${username}:${ssha}\n`;
}
