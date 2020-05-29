const { Model } = require("objection");

class Comment extends Model {
  static get tableName() {
    return "comments";
  }

  static get relationMappings() {
    const User = require("./User");
    const Wish = require("./Wish");
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "comments.user_id",
          to: "users.id",
        },
      },
      whishes: {
        relation: Model.HasManyRelation,
        modelClass: Wish,
        join: {
          from: "comments.user_id",
          to: "wishes.user_id",
        },
      },
    };
  }
}

module.exports = Comment;
