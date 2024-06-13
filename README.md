# Node SDK Soketi Test

A minimal javascript program to test sending/receiving messages with soketi.

## Running

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
