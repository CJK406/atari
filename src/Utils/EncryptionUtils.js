/* eslint-disable */

import React from 'react';
import atariLogs from './AtariLogs';
var CryptoJS = require('crypto-js');
import {SALT_MIX_KEY, IV_KEY} from '@env';

export default class EncryptionUtils {
  static instance = null;

  static getInstance() {
    if (EncryptionUtils.instance == null) {
      EncryptionUtils.instance = new EncryptionUtils();
    }
    return this.instance;
  }

  decrypt = (encryptedValue) => {
    if (typeof encryptedValue !== 'string') {
      return encryptedValue;
    }

    let msg = encryptedValue
      .replace(/xMl3Jk/g, '+')
      .replace(/Por21Ld/g, '/')
      .replace(/Ml32/g, '=');
    const cipher = CryptoJS.AES.decrypt(
      msg,
      CryptoJS.enc.Hex.parse(SALT_MIX_KEY),
      {
        iv: CryptoJS.enc.Hex.parse(IV_KEY),
        mode: CryptoJS.mode.CBC,
      },
    );
    let result = CryptoJS.enc.Utf8.stringify(cipher).toString();

    result = JSON.parse(result);
    atariLogs.debugLog('result', result);
    return result;
  };
}
