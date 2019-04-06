import * as socketIO from 'socket.io';
import { randomStr } from '../utils/helpers';

import { queueListener } from '../../routes/queue-listener';
import { socketListener } from '../../routes/socket-listener';

export const webSocketFactory = (server, config, rabbitManager, db, logger) => {
  const io = socketIO.listen(server, { pingTimeout: 700000 });

  const state = {};

  io.sockets.on('connection', async (socket, connMessage) => {
    socket.heartbeatTimeout = 1000000;
    const socketSessionId = randomStr(24);
    console.log('socketSessionId', socketSessionId);

    if (config.init) {
      await config.init(socket, state, socketSessionId);
    }

    if (config.disconnect) {
      socket.on('disconnect', () => {
        config.disconnect(state, socketSessionId);
      });
    }

    queueListener(config, rabbitManager, db, logger);

    const route = await socketListener(config, rabbitManager, logger);

    await socket.on(route.name, async (message) => {
      if (route.validation) {
        const validation = route.validation.validate(message);
        if (validation.isValid === false) {
          route.validation.responseIfInvalid(socket, validation.error);
          return;
        }
      }

      route.callback(socket, state, message, socketSessionId);
    });
  });
};
