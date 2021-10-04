import { initialization } from "./initialization";
import { createIndexserver } from "./server";

if (process.argv.includes("--init")) {
	// update nginx conf
	initialization();
}
else {
	// start indexserver
	createIndexserver()
		.listen(3000);
}
