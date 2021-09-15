/* eslint-disable */

import React from 'react';
import atariLogs from './AtariLogs';
var CryptoJS = require('crypto-js');

export default class EncryptionUtils {
  static instance = null;

  static getInstance() {
    if (EncryptionUtils.instance == null) {
      EncryptionUtils.instance = new EncryptionUtils();
    }
    return this.instance;
  }

  decrypt = (encryptedValue) => {
    let msg = encryptedValue
      .replace(/xMl3Jk/g, '+')
      .replace(/Por21Ld/g, '/')
      .replace(/Ml32/g, '=');
    const cipher = CryptoJS.AES.decrypt(
      msg,
      CryptoJS.enc.Hex.parse('5be97276402d8fc7c8fce00dce906f68'),
      {
        iv: CryptoJS.enc.Hex.parse('1ac6369b1b75ff777cdc5d3f46c7f189'),
        mode: CryptoJS.mode.CBC,
      },
    );
    let result = CryptoJS.enc.Utf8.stringify(cipher).toString();
    result = JSON.parse(result);
    return result;
  };
}
