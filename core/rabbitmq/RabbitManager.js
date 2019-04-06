const amqp = require('amqplib/callback_api');

class RabbitManager {
  connection = null;
  channel = null;
  config = null;

  constructor(config) {
    this.config = config;
  }

  async init() {
    try {
      this.connection = await this.getRabbitConnection();
      this.channel = await this.createChannel(this.connection);
    } catch (ex) {
      throw new Error(ex);
    }
  }

  async getRabbitConnection() {
    const opts = { };
    const { host, port, user, password, vhost } = this.config;

    return new Promise((resolve, reject) => {
      amqp.connect({
        protocol: 'amqp',
        hostname: host,
        port: port,
        username: user,
        password: password,
        locale: 'en_US',
        frameMax: 0,
        heartbeat: 0,
        vhost: vhost,
      }, opts, (err, conn) => {
        if (err) {
          return reject(err);
        }
        console.log('Successfully connected to RabbitMQ Server !');
        return resolve(conn);
      });
    });
  }

  async createChannel(conn) {
    return new Promise((resolve, reject) => {
      conn.createChannel((err, ch) => {
        if (err) {
          return reject(err);
        }
        return resolve(ch);
      });
    });
  }

  async close() {
    this.connection.close();
  }

  async send(queueName, message) {
    await new Promise(async (resolve, fail) => {
      this.channel.assertQueue(queueName, { durable: false });
      console.log(`Message sent on queue ${queueName}`);
      await this.channel.sendToQueue(queueName, new Buffer(message));
      resolve();
    });
  }

  listen(queueName, callback, listenerId) {
    this.channel.assertQueue(queueName, { durable: false });
    // this.channel.prefetch(1);

    this.channel.consume(queueName, (message) => {
      callback(message, this.channel, listenerId);
    }, { noAck: true });
  }
}

export default RabbitManager;
