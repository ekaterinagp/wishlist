const { Model } = require("objection");

class Wish extends Model {
  static get tableName() {
    return "wishes";
  }

  static get relationMappings() {
    const Comment = require("./Comment");
    const User = require("./User");
    return {
      comments: {
        relation: Model.HasManyRelation,
        modelClass: Comment,
        join: {
          from: "wishes.id",
          to: "comments.wish_id",
        },
      },
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "wishes.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = Wish;
