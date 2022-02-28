import "zx/globals";
import { validateAndMakeDir } from "./lib/utils.mjs";
import { createTables, dropTables } from "./lib/sql.mjs";
import { csv } from "./lib/csv.mjs";

const OUT_DIR = `out`;

await validateAndMakeDir(OUT_DIR);

await dropTables();
await createTables();
await csv();

console.log(chalk.green("Done!"));
