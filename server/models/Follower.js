const { Model } = require("objection");

class Follower extends Model {
  static get tableName() {
    return "followers";
  }

  static get relationMappings() {
    const User = require("./User");
    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: "users.id",
          to: "followers.user_id",
        },
      },
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: "users.id",
          to: "followers.follower_id",
        },
      },
    };
  }
}

module.exports = Follower;
