import React from 'react';
import {View} from 'react-native';

import NetInfo from '@react-native-community/netinfo';

let isConnected = true;

export const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected === true) {
        isConnected = true
    } else {
        isConnected = false
    }
});

export const isInternetConnected = () => {
    return isConnected;
}


