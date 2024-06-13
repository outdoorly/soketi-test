import Pusher from 'pusher';

function log(...args) {
  console.log('[server]', ...args);
}

const pusher = new Pusher({
  appId: 'app-id',
  key: 'app-key',
  secret: 'app-secret',
  cluster: '',
  host: '127.0.0.1',
  port: 6001,
  useTLS: false
});

await pusher.trigger('chat-room', 'message', {message: 'hello world!'});
await pusher.trigger('chat-room', 'message', {sender: 'Ben', content: 'hi there!'});
log('triggered message');

