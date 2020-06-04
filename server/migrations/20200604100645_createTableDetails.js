exports.up = function (knex, Promise) {
  return knex.schema.createTable("details", (table) => {
    table.increments("id");
    table.integer("user_id").unsigned().notNullable();
    table
      .foreign("user_id")
      .references("users.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("size");
    table.string("color");
    table.string("shop");
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("details");
};
