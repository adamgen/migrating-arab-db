import { knex } from "./knex.mjs";

export const printExistingTables = async () => {
  const tables = await knex.raw(`
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = 'arab-db'
`);
  console.log(chalk.blue(`Existing db tables list:`));
  const existingTables = tables[0].map(({ TABLE_NAME }) => TABLE_NAME);
  console.log(existingTables);
};

const executeManySchemaChanges = async (sqlQuery) => {
  const dropQueries = sqlQuery.trim().split(";");
  for (let i = 0; i < dropQueries.length; i++) {
    const dropQuery = dropQueries[i].trim();
    if (!dropQuery) {
      continue;
    }
    // console.log(chalk.blue(`Query: "${dropQuery}"`));
    await knex.schema.raw(dropQuery);
  }
};

export const dropTables = async () => {
  await executeManySchemaChanges(
    fs.readFileSync(path.join("sql-files", "drop.sql")).toString()
  );
  console.log(chalk.blue(`Dropped all tables`));
};

export const createTables = async () => {
  await executeManySchemaChanges(
    fs.readFileSync(path.join("sql-files", "create.sql")).toString()
  );
  console.log(chalk.blue(`Created all tables`));
};

export const sqlPlay = () => {
  const insertSql = fs.readFileSync("./sql-files/insert.sql").toString();

  const inserts = insertSql.split("-- Inserting ");

  const insertNames = inserts.map((str) => str.match(/.*rows into.*/)[0]);
  insertNames.forEach((insertName, i) => {
    const fileName = insertName.replaceAll(" ", "-") + ".sql";

    fs.writeFileSync(
      path.join(OUT_DIR, fileName),
      inserts[i].replace(insertName, "")
    );
  });

  console.log(chalk.blue(`Printed files`));
};
