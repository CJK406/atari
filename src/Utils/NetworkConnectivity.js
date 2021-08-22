import React from 'react';
import {View} from 'react-native';

import NetInfo from '@react-native-community/netinfo';

let isConnected = true;

export const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected === true) {
        isConnected = true
        console.log("isConnected" , isConnected);
    } else {
        isConnected = false
        console.log("isConnected" , isConnected);
    }
});

export const isInternetConnected = () => {
    return isConnected;
}


