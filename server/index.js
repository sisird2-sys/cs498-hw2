const express = require("express");
const { Datastore } = require("@google-cloud/datastore");

const app = express();
const db = new Datastore();

app.use(express.json());

app.get("/greeting", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", async (req, res) => {
  const name = req.body.username;
  await db.save({
    key: db.key(["User", name]),
    data: { username: name, createdAt: new Date() },
  });
  res.json({ message: "User registered" });
});

app.get("/list", async (req, res) => {
  const [users] = await db.runQuery(db.createQuery("User"));
  res.json({ users: users.map(u => u.username) });
});

app.post("/clear", async (req, res) => {
  const [users] = await db.runQuery(db.createQuery("User"));
  const keys = users.map(u => u[db.KEY]);
  for (let i = 0; i < keys.length; i += 500) {
    await db.delete(keys.slice(i, i + 500));
  }
  res.json({ message: "Cleared" });
});

app.listen(8080, "0.0.0.0", () => {
  console.log("Server running on port 8080");
});