import { MongoClient } from 'mongodb';

export default (config, logger) => {
  const { mongo } = config.datasources;
  const mongoUrl = `mongodb://${mongo.user}:${mongo.password}@${mongo.host}:${mongo.port}/${mongo.dbName}`;

  return new Promise((resolve, reject) => {
    MongoClient.connect(mongoUrl, { useNewUrlParser: true })
    .then((database) => {
      if (!mongo) throw new Error('MONGO URL is required!');

      const db = database.db(mongo.dbName);

      logger.info('db connected');
      resolve(db);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

