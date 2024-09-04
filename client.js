import PusherJS from "pusher-js";

function log(...args) {
  console.log("[client]", ...args);
}

let client = new PusherJS("app-key", {
  cluster: "",
  httpHost: "127.0.0.1",
  httpPort: 6001,
  wsHost: "127.0.0.1",
  wsPort: 6001,
  wssPort: 6001,
  forceTLS: false,
  enabledTransports: ["ws", "wss"],
  userAuthentication: {
    endpoint: "http://localhost:4321/pusher/user-auth",
  },
});

client.signin();
client.user.bind("to-me", (data) => log(data));
log("signed in");
client.subscribe("chat-room").bind("message", (message) => {
  if ("sender" in message && "content" in message)
    log(`${message.sender} says: ${message.content}`);
  else log("message", message);
});
