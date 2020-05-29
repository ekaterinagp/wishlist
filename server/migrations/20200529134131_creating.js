exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id");
      table.string("email").notNullable();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.string("password").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("wishes", (table) => {
      table.increments("id");
      table.string("wish").notNullable();
      table.string("desc");
      table.string("imgURL");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.integer("user_id").unsigned().notNullable();
      table
        .foreign("user_id")
        .references("users.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("comments", (table) => {
      table.increments("id");
      table.string("text").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.integer("user_id").unsigned().notNullable();
      table
        .foreign("user_id")
        .references("users.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.integer("wish_id").unsigned().notNullable();
      table
        .foreign("wish_id")
        .references("wishes.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("wishes")
    .dropTableIfExists("users")
    .dropTableIfExists("comments");
};
