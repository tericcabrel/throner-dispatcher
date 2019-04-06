import uuidv4 from 'uuid/v4';
import joi from 'joi';

import { schemasBeforeDispatching } from '../validator';
import { checkSameProcessIsRunning, getMappingFileConfig, handleErrorOnSend } from '../core/utils/helpers';
import StorageManager from '../core/storage/StorageManager';

export const socketListener = async (config, rabbitManager, logger) => {
  const sockets = StorageManager.get();

  return {
    name: config.socketRequestEvent,
    validation: {
      validate: (message) => {
        const messagePieces = message.split(':::');
        if (messagePieces.length !== 2) {
          return {
            isValid: false,
            error: 'message must have two parts, separated by \':::\'',
          };
        }

        const filter = config.mappingFiles.filter(
          mappingFile => mappingFile.pid === messagePieces[0]
        );

        if (filter.length === 0) {
          const validPMs = [];
          config.mappingFiles.filter((mappingFile) => { validPMs.push(mappingFile.pid); });
          return {
            isValid: false,
            error: `message code must be one of the following: ${validPMs.join(',')}`,
          };
        }

        let parsedJSON = {};
        try {
          messagePieces[1] = messagePieces[1].trim();
          parsedJSON = JSON.parse(messagePieces[1]);
        } catch (e) {
          logger.error(e);
          return { isValid: false, error: 'JSON data can\'t be parsed' };
        }

        try {
          const joiValidation = joi.validate(parsedJSON, joi.object());
          if (joiValidation.error) {
            return { isValid: false, error: joiValidation.error };
          }
        } catch (e) {
          return { isValid: false, error: 'JSON is valid but there was an error at JSON validation' };
        }

        return { isValid: true };
      },
      responseIfInvalid: (socket, error) => {
        socket.emit(config.socketResponseEvent,
          JSON.stringify({
            error: {
              errorType: 'wrong format',
              errorData: error,
            },
          })
        );
      },
    },
    callback: async (socket, state, socketMessage, socketSessionId) => {
      try {
        // console.log('socketMessage', socketMessage);
        const messagePieces = socketMessage.split(':::');
        const processCode = messagePieces[0];
        const samePMBeingProcessed = checkSameProcessIsRunning(
          config, socket, sockets, socketSessionId, processCode
        );

        if (samePMBeingProcessed) {
          return;
        }

        const messageID = uuidv4();
        const mappingFile = getMappingFileConfig(config.mappingFiles, processCode);

        StorageManager.saveNewTask(
          socket,
          socketSessionId,
          processCode,
          messageID,
          mappingFile.timeout
        );

        let parsedJSON = {};
        try {
          messagePieces[1] = messagePieces[1].trim();
          parsedJSON = JSON.parse(messagePieces[1]);
        } catch (e) {
          logger.error(e);
        }

        const joiValidation = joi.validate(parsedJSON, schemasBeforeDispatching[processCode]);
        if (joiValidation.error) {
          throw { errorType: 'wrong format', error: joiValidation.error };
        }

        parsedJSON.clientID = `${socketSessionId}***${messageID}`;
        parsedJSON.processID = processCode;

        const requestQueueName = mappingFile.request_queue;
        const message = JSON.stringify(parsedJSON);

        await rabbitManager.send(requestQueueName, message);
        /* socket.emit(
          config.socketResponseEvent,
          JSON.stringify({
            error: null,
            isRequestReceipt: true,
            requestQueueName,
            sent: message,
          })
        );*/
      } catch (e) {
        handleErrorOnSend(logger, e, socket, config);
      }
    },
  };
};

