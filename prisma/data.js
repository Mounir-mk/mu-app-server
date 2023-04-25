const users = [
  {
    email: "johndoe@mail.com",
    hashed_password:
      "$argon2id$v=19$m=16,t=2,p=1$ZTNYU1U2cjRyNUJuTkJzVA$lgBqAYdbLX+j1Bc6DP+WAw",
    role: "admin",
  },
  {
    email: "jessy.hazart@outlook.fr",
    hashed_password:
      "$argon2id$v=19$m=16,t=2,p=1$ZTNYU1U2cjRyNUJuTkJzVA$lgBqAYdbLX+j1Bc6DP+WAw",
    role: "employee",
  },
  {
    email: "chef@mail.com",
    hashed_password:
      "$argon2id$v=19$m=16,t=2,p=1$ZTNYU1U2cjRyNUJuTkJzVA$lgBqAYdbLX+j1Bc6DP+WAw",
    role: "chief",
  },
];

module.exports = {
  users,
};
