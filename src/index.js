import dotenv from 'dotenv';
import socket from 'socket.io';
import app from './app';

dotenv.config();

/**
 * Normalize a port into a number, string, or false.
 * @param {int} val The port number.
 * @returns {int} The port number.
 */
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) return val;
  if (port >= 0) return port;

  return false;
};

const port = normalizePort(process.env.PORT || '5000');

const server = app.listen(port, () => {
  process.stdout.write(`Server is running on port: ${port}\n`);
});

const io = socket(server, {
  log: false,
  origins: '*:*',
});

app.io = io;
app.connection = [];

app.io.on('connection', sock => {
  app.connection.push(sock);
});
