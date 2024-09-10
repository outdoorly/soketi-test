import PusherJS from "pusher-js";
import chalk from "chalk";

function log(...args) {
  console.log(chalk.blue("[client]"), ...args);
}
function logDir(args) {
  console.log(chalk.blue("[client] ---"));
  console.dir(args, { depth: 5 });
  console.log(chalk.blue("---"));
}

const lead = process.env.LEAD || "fc2f683a-4856-49c8-abf2-48dab6dc80b3";
const conversationId =
  process.env.CONVERSATION_ID || "250232f0-f056-4e99-8b73-3f6f2727154a";

/** create pusher client to listen to chestnut on conversation id */
function listen() {
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
      endpoint: "http://localhost:4000/soketi/user-auth",
      // The lead needs sent as part of the body
      params: {
        lead,
      },
    },
  });

  client.signin();
  client.user.bind("to-me", (data) => log(data));
  log("signed in");
  client
    .subscribe(`conversation-${conversationId}`)
    .bind("new-message", (message) => {
      log("message", message);
    });
}

/** send a message to this conversation */
function sendMessage() {
  log("sending message via api");
  const vendorId =
    process.env.VENDOR_ID || "9a93c317-1fde-479b-b495-fad22def801e";
  const messageBody = process.env.MESSAGE_BODY || "hi there!";

  log("sending body:", messageBody);

  const query = `
  mutation SendMessage ($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      body
      identity { 
        id 
      }
}}
`;
  fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query,
      operationName: "SendMessage",
      variables: {
        input: { lead, vendorId, createChatEvent: { body: messageBody } },
      },
    }),
  })
    .then((resp) => resp.json())
    .then((resp) => logDir(resp))
    .catch(() => {
      console.error("Is chestnut running?");
      process.exit(1);
    });
}

function all() {
  listen();
  sendMessage();
}

function printHelp() {
  console.log(`
A script to run/test Chestnut's Soketi server

COMMANDS
  listen    start soketi listener
  send      send test message to chestnut that soketi will pick up
  all       (default) equivalent of running listen and run.

ENV VARS
  LEAD             lead of vendor
  VENDOR_ID        id of vendor lead is in conversation on 
  CONVERSATION_ID  id of conversation to listen for messages on
  MESSAGE_BODY     string to send as the message body
`);
}

// --- process command line ---
const args = process.argv;
args.shift(); // node
args.shift(); // script file
if (args.some((x) => /--?h(elp)?/.test(x))) printHelp();
else if (args.length === 0 || args.includes("all")) all();
else {
  if (args.includes("listen")) listen();
  if (args.includes("send")) sendMessage();
}
