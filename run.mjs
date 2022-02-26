import "zx/globals";
import { validateAndMakeDir, protectFolders } from "./lib/utils.mjs";
import { createTables, dropTables } from "./lib/sql.mjs";
import { csv } from "./lib/csv.mjs";

const SQL_FILES_DIR = "sql-files";
const SQL_FILES_EXAMPLE_DIR = `${SQL_FILES_DIR}-example`;

const OUT_DIR = `out`;

await validateAndMakeDir(OUT_DIR);
await protectFolders(SQL_FILES_DIR, SQL_FILES_EXAMPLE_DIR);

await dropTables();
await createTables();
await csv();

console.log(chalk.green("Done!"));
