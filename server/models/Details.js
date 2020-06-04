const { Model } = require("objection");
const User = require("./User");

class Details extends Model {
  static get tableName() {
    return "details";
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "details.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = Details;
