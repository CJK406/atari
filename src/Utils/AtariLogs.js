/* eslint-disable */

class AtariLogs {
  debugLog(key, value) {
    if (__DEV__) {
      console.log(key, value);
    }
  }

  debugLogValue(value) {
    if (__DEV__) {
    }
  }
}

const atariLogs = new AtariLogs();

export default atariLogs;
