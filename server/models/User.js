const { Model } = require("objection");
const Wish = require("./Wish");
const Comment = require("./Comment");
const Follower = require("./Follower");
const Details = require("./Details");

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
      wishes: {
        relation: Model.BelongsToOneRelation,
        modelClass: Details,
        join: {
          from: "users.id",
          to: "details.user_id",
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
          to: "followers.follows_id",
        },
      },
    };
  }
}

module.exports = User;
