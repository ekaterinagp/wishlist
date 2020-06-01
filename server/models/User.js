const { Model } = require("objection");
const Wish = require("./Wish");
const Comment = require("./Comment");
const Follower = require("./Follower");

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get relationMappings() {
    return {
      wishes: {
        relation: Model.HasManyRelation,
        modelClass: Wish,
        join: {
          from: "users.id",
          to: "wishes.user_id",
        },
      },
      comments: {
        relation: Model.HasManyRelation,
        modelClass: Comment,
        join: {
          from: "users.id",
          to: "comments.user_id",
        },
      },
      followers: {
        relation: Model.HasManyRelation,
        modelClass: Follower,
        join: {
          from: "users.id",
          to: "followers.user_id",
        },
      },
      followers: {
        relation: Model.HasManyRelation,
        modelClass: Follower,
        join: {
          from: "users.id",
          to: "followers.follower_id",
        },
      },
    };
  }
}

module.exports = User;
