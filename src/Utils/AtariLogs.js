/* eslint-disable */

class AtariLogs {
  debugLog(key, value) {
    if (__DEV__) {
      console.log(key, value);
    }
  }
}

const atariLogs = new AtariLogs();

export default atariLogs;
