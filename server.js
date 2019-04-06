require('dotenv').config();

import * as http from 'http';

import { getDispatcherConfig } from './core/config';
import { initializeDispatcher } from './core/bootstrap';

const dispatcherConfig = getDispatcherConfig(process);

const port = dispatcherConfig.socketPort;

const server = http.createServer((req, res) => {
  return;
});

initializeDispatcher(server, dispatcherConfig);

server.listen(port, () => {
  console.log(`Server started - ${port}`);
});
