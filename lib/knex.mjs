import Knex from "knex";

export const knex = Knex({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "root",
    database: "arab-db-2",
    charset: "utf8",
  },
});

