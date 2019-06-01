import { queueListener } from './queue-listener';
import { socketListener } from './socket-listener';

export const initRoutes = (config, rabbitManager) => {
  return [
    socketListener(config, rabbitManager),
  ];
};
