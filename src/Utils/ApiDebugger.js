/* eslint-disable */

import atariLogs from './AtariLogs';

let requestArray = [];
export default class ApiDebugger {
  static instance = null;

  static getInstance() {
    if (ApiDebugger.instance == null) {
      ApiDebugger.instance = new ApiDebugger();
    }
    return this.instance;
  }

  addApiRecord = (req) => {
    if (__DEV__) return;
    requestArray.push(req);
    console.log('addApiRecord', requestArray);
  };

  updateApiRecord = (result, actualResult) => {
    // if (!__DEV__) return;
    // console.log('result', actualResult);
    requestArray
      .filter((item) => item.tempId == actualResult.config.headers.tempId)
      .map((value) => {
        value.response = result;
        value.statusCode = actualResult.data.code;
      });
    let ress = requestArray;
    ress.push(requestArray);
    atariLogs.debugLog(
      'updatedList',
      ress.map((itemss) => console.log('res', itemss)),
    );
  };

  getRandomNumber() {
    let randomNumber = Math.floor(Math.random() * 100) + 1;
    return randomNumber;
  }
}
