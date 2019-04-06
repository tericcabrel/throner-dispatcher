import _ from 'lodash';
import * as fs from 'fs';
import { REQUEST_MAPPING } from './constants';

export const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const randomStr = (n = 24) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let nChar = 24;

  if (n !== undefined) {
    nChar = n;
  }

  for (let i = 0; i < nChar; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export const reqToResMapping = (processID) => {
  return REQUEST_MAPPING[processID];
};

export const stringify = (toStringify) => {
  let stringified = '';

  if (_.isBoolean(toStringify)) {
    stringified = toStringify === true ? 'True' : 'False';
  } else {
    stringified = toStringify.toString();
  }

  return stringified;
};

export const readFile = async (filePath) => {
  return new Promise((resolve, fail) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        fail(err);

        return;
      }

      resolve(data.toString());
    });
  });
};

export const getMappingFileConfig = (mappingFiles, processId) => {
  const mappingFileIndex = mappingFiles.findIndex(file => file.pid === processId);
  if (mappingFileIndex < 0) {
    return null;
  }
  return mappingFiles[mappingFileIndex];
};

export const checkSameProcessIsRunning = (
  config, socket, socketSessions, socketSessionId, processCode
) => {
  let samePMBeingProcessed = false;

  if (!socketSessions[socketSessionId]) {
    return samePMBeingProcessed;
  }

  for (const key in socketSessions[socketSessionId].tasks) {
    if (socketSessions[socketSessionId].tasks[key].processCode === processCode) {
      samePMBeingProcessed = true;
    }
  }

  if (samePMBeingProcessed) {
    socket.emit(
      config.socketResponseEvent,
      JSON.stringify({
        error: 'A PM with he same process code is already being processed. Please try again later',
        isRequestReceipt: true,
        sent: null,
      })
    );
  }

  return samePMBeingProcessed;
};

export const handleErrorOnSend = (logger, e, socket, config) => {
  let ex = e;
  if (e.errorType === undefined) {
    ex = { errorType: 'Internal Server Error', errorData: e };
  }
  logger.error(e);
  socket.emit(
    config.socketResponseEvent,
    JSON.stringify({
      error: ex,
      isRequestReceipt: true,
      sent: null,
    })
  );
};

