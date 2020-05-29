exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("wishes")
    .del()
    .then(() => {
      return knex("users").del();
    })
    .then(() => {
      return knex("comments").del();
    })
    .then(function () {
      return knex("users").insert([
        {
          email: "admin@admin.dk",
          first_name: "Admin",
          last_name: "Admins",
          password:
            "$2b$10$G/v/MRwgMgOAtCUCQRKJTO8GRD/rKxyu61J5wfYimsHd0/FSxuVAq",
        },
        {
          email: "katya@power.dk",
          first_name: "Katya",
          last_name: "PowerUser",
          password:
            "$2b$10$G/v/MRwgMgOAtCUCQRKJTO8GRD/rKxyu61J5wfYimsHd0/FSxuVAq",
        },
        {
          email: "a@aa.dk",
          first_name: "A",
          last_name: "AA",
          password:
            "$2b$10$G/v/MRwgMgOAtCUCQRKJTO8GRD/rKxyu61J5wfYimsHd0/FSxuVAq",
        },
      ]);
    })
    .then(() => {
      return knex("wishes").insert([
        {
          user_id: 1,
          wish: "New door",
          desc: "I would like it to be old and beautiful",
        },
        {
          user_id: 2,
          wish: "Red flowers",
          desc: "I'd like it to be in a pot",
        },
        {
          user_id: 3,
          wish: "Tattoo",
          desc: "A big one, it costs 2500kr",
        },
      ]);
    })
    .then(() => {
      return knex("comments").insert([
        {
          text: "I thought you hate red color",
          user_id: 1,
          to_user_id: 2,
        },
        {
          text: "Like the one in Harry Potter?",
          user_id: 3,
          to_user_id: 1,
        },
        {
          text: "My friend does it! I can make it cheaper!",
          user_id: 2,
          to_user_id: 3,
        },
      ]);
    });
};
