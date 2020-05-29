const { Model } = require("objection");

class Comment extends Model {
  static get tableName() {
    return "comments";
  }

  static get relationMappings() {
    const User = require("./User");
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "comments.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = Comment;
