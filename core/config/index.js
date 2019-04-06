import * as fs from 'fs';
import * as path from 'path';

export const getDispatcherConfig = (processConfig) => {
  const { env } = processConfig;
  const config = {
    env: env.NODE_ENV,
    socketRequestEvent: env.SOCKET_REQUEST_EVENT,
    socketResponseEvent: env.SOCKET_RESPONSE_EVENT,
    logDir: env.LOG_DIR,
    socketPort: env.PORT,
    rabbitConfig: {
      host: env.RABBITMQ_HOST,
      port: env.RABBITMQ_PORT,
      user: env.RABBITMQ_USER,
      password: env.RABBITMQ_PASSWORD,
      vhost: env.RABBITMQ_VHOST,
    },
    datasources: {
      mongo: {
        host: env.DB_HOST,
        port: env.DB_PORT,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        dbName: env.DB_NAME,
      },
    },
  };

  const configFolderPath = path.join(__dirname, '../../config');
  const configFolder = `${configFolderPath}/${config.env}`;
  const PMConfigFolder = `${configFolder}/PM`;

  // get PM mappings
  const mappingFolders = fs.readdirSync(PMConfigFolder, 'utf8');

  const mappingFiles = [];

  mappingFolders.forEach((fileName) => {
    mappingFiles.push(JSON.parse(fs.readFileSync(`${PMConfigFolder}/${fileName}`, 'utf8')));
  });

  return { ...config, mappingFiles };
};
