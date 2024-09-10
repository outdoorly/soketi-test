# Node SDK Soketi Test

A minimal javascript program to test sending/receiving messages with soketi.

## Running Chestnut Script

- assumes soketi is running in chestnut

By default, this command will create a pusher client, sign into the soketi server, listen for messages, then fire a mutation so chestnut sends a message through soketi. If you only want _part of that functionality_ there are `listen` and `send` commands. For more information about each, run:

```bash
node chesnut-client.js -h
```

## Running Test Server

```bash
> pnpm i

> npm start
```

After cloning and installing dependencies, `npm start` will run the entire service:

- from pulling the docker conatiner (if needed)
- to starting the client/server
- and tearing it all down at the end (to avoid orphan processes)

### Prerequisites

- docker
- node
- pnpm
