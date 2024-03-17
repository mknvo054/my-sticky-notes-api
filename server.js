const express = require("express");

const app = express();
app.use(express.json()); //For JSON requests
app.use(express.urlencoded({ extended: true }));

const bcrypt = require("bcrypt");
const saltRounds = 10;

const port = 8000;

const database = {
  users: [
    {
      userid: "00001",
      email: "johndoe@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      userid: "00002",
      email: "sally@gmail.com",
      password: "lovely",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.send(`Hello World! Coming from port ${port}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/signin", (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare(database.users[0].password, hash, function (err, result) {
    // result == true
    if (
      req.body.email === database.users[0].email &&
      req.body.password === result
    )
      res.json("success!");
    else res.status(400).json("error logging in");
  });
});

app.get("/profile/:id", (req, res) => {
  const { userid } = req.params;
  let found = false;

  database.users.forEach((user) => {
    if (user.userid === userid) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) res.status(404).json("user not found");
});

app.put("/notes", (req, res) => {
  const { userid } = req.body;
  let found = false;

  database.users.forEach((user) => {
    if (user.userid === userid) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) res.status(404).json("user not found");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    database.users.push({
      userid: "00003",
      email: email,
      hash: hash,
      entries: 0,
      joined: new Date(),
    });
  });

  res.json(database.users[database.users.length - 1]);
});
