const credentials = require("./config/dbcredentials");

const knexSnakeCaseMappers = require("objection").knexSnakeCaseMappers;

module.exports = {
  development: {
    client: "mysql",
    connection: {
      database: credentials.database,
      user: credentials.user,
      password: credentials.password,
      timezone: "UTC",
      dateStrings: true,
    },
  },

  ...knexSnakeCaseMappers(),
};
