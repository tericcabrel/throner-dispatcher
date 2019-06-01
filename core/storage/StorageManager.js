class StorageManager {
  static sockets = { };

  constructor() {
    StorageManager.sockets = { };
  }

  static get() {
    return StorageManager.sockets;
  }

  static set(sockets) {
    StorageManager.sockets = sockets;
  }

  static saveNewTask(socket, socketSessionId, processCode, messageID, timeout) {
    const dateReception = new Date();
    const nowReception = dateReception.toISOString();

    if (!StorageManager.sockets[socketSessionId]) {
      StorageManager.sockets = {
        ...StorageManager.sockets, [socketSessionId]: { tasks: {}, socket },
      };
    }

    StorageManager.sockets[socketSessionId].tasks[messageID] = {
      processCode,
      initTime: nowReception,
      timeout,
      /* timeoutTimer: setTimeout(((socketSessionId, messageID) => {
        console.log('evaluating f now:', socketSessionId, messageID);
        return () => {
          console.log('deleting:', socketSessionId, messageID);
          delete sockets[socketSessionId].tasks[messageID];
          console.log('deleted');
        };
      })(socketSessionId, messageID), mappingFile[processCode].timeout), */
      messageID,
    };
  }
}

export default StorageManager;
