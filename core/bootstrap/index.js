import { webSocketFactory } from '../socket';
import RabbitManager from '../rabbitmq/RabbitManager';
import Logger from '../logger/app-logger';
import mongoConnection from '../db/db';

export const initializeDispatcher = async (server, config) => {
  const logger = new Logger(config.logDir);

  const rabbitManager = new RabbitManager(config.rabbitConfig);

  await rabbitManager.init();

  const db = await mongoConnection(config, logger);

  webSocketFactory(server, config, rabbitManager, db, logger);
};
