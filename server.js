import Pusher from "pusher";
import express from "express";
import chalk from "chalk";

const app = express();

function log(...args) {
  console.log(chalk.magenta("[server]"), ...args);
}

const pusher = new Pusher({
  appId: "app-id",
  key: "app-key",
  secret: "app-secret",
  cluster: "",
  host: "127.0.0.1",
  port: 6001,
  useTLS: false,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const USER_ID = "2d017c5a-af67-4cdc-b6c9-76420a44f268";
app.post("/pusher/user-auth", (req, res) => {
  const socketId = req.body.socket_id;
  const userData = { id: USER_ID };
  const authResp = pusher.authenticateUser(socketId, userData);
  log("socket id", socketId, "auth resp", authResp);
  res.send(authResp);
});

app.get("/user", (req, res) => {
  log("sending to user", USER_ID);
  pusher.sendToUser(USER_ID, "to-me", { test: "me" });
  res.status(200);
  res.end();
});

app.get("/message", async (req, res) => {
  await pusher.trigger("chat-room", "message", { message: "hello world!" });
  await pusher.trigger("chat-room", "message", {
    sender: "Ben",
    content: "hi there!",
  });
  log("triggered message");
  res.status(200);
  res.end();
});

app.listen(4321, () => log("listening"));
