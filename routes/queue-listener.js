// Packages
import moment from 'moment';

// Utils
import StorageManager from '../core/storage/StorageManager';
import { PM_MAPPINGS } from '../core/utils/constants';
import { reqToResMapping } from '../core/utils/helpers';
import helpers from '../helpers';

const sendResponseToClient = (object) => {
  const {
    logger, socketResponseEvent, sockets, socketId, processID, messageID, data, deleteTask,
  } = object;

  if (sockets[socketId]) {
    // console.log('tasks', sockets[socketId].tasks);
    // console.log('sending back', processID);
    if (sockets[socketId].tasks[messageID]) {
      if (deleteTask) {
        delete sockets[socketId].tasks[messageID];
        // Update sockets value
        StorageManager.set(sockets);
      }
      delete data.clientID;
      delete data.processID;

      const response = `send back:::${reqToResMapping(processID)}:::${JSON.stringify(data)}`;
      // console.log('Response => ', response);
      sockets[socketId].socket.emit(socketResponseEvent, response);
    } else {
      logger.info('Process had timed out');
    }
  }
};

export const queueListener = async (config, rabbitManager, db, logger) => {
  config.mappingFiles.forEach((mappingFile) => {
    rabbitManager.listen(mappingFile.response_queue, async (message, channel, listenerId) => {
      console.log(`Res[${mappingFile.response_queue}]`, message.content.toString());
      const messageStr = message.content.toString().replace('\n', '');

      const sockets = StorageManager.get();
      let parsedJSON = {};
      let socketId = '';
      let messageID = '';
      let processID = '';

      try {
        parsedJSON = JSON.parse(messageStr);

        if (parsedJSON.clientID) {
          const ids = parsedJSON.clientID.split('***');
          socketId = ids[0];
          messageID = ids[1];

          processID = parsedJSON.processID;
          if (processID === undefined) {
            throw({ errorType: 'wrong format', error: "return PM doesn't have a processID" });
          }
          // TODO validate response with Joi library

          const { socketResponseEvent } = config;
          const responseParams = {
            logger, socketResponseEvent, sockets, socketId,
            processID, messageID, data: parsedJSON, deleteTask: true,
          };

          switch (processID) {
            case PM_MAPPINGS.TAKE_PICTURE:
              // Nothing
              break;
            default:
              await sendResponseToClient(responseParams);
              break;
          }
        }
      } catch (e) {
        logger.error(e.stack ? e.stack : e.toString());
      }
    });
  });
};

