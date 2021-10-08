/* eslint-disable */

import React from 'react';
import {View, Text, TextInput, Image} from 'react-native';
import styles from './style';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ExchangeInput = (props) => {
  const txColor = props.darkmode ? 'white' : 'black';
  return (
    <View style={styles.container}>
      <Text style={{...styles.label, color: txColor}}>{props.label}</Text>
      <View style={styles.row}>
        {props.Type ? (
          <TextInput
            onChangeText={(e) => {
              props.onChangeInput(e);
            }}
            value={props.inputValue}
            placeholder="Type amount"
            placeholderTextColor={txColor}
            style={props.darkmode ? styles.inputField : styles.inputFieldBlack}
            keyboardType={'numeric'}
          />
        ) : (
          <Text
            style={props?.darkmode ? styles.textField : styles.textFieldBlack}>
            {props.inputValue}
          </Text>
        )}
        <View
          style={
            props.darkmode ? styles.iconContainer : styles.iconContainerBlack
          }>
          <Image source={props.centerIcon} style={styles.centerIcon} />
        </View>
        <Text
          style={props?.darkmode ? styles.textField : styles.textFieldBlack}>
          {props.usdInputValue}
        </Text>
        {/* <Text onChangeText={(e) => {props.onChangeUsdInput(e)}} value={props.usdInputValue} style={styles.textField} >{props.usdInputValue}</Text> */}
        <View
          style={
            props.darkmode
              ? styles.iconContainerLast
              : styles.iconContainerLastBlack
          }>
          <Ionicons
            name="logo-usd"
            style={{marginTop: 7}}
            size={30}
            color={txColor}
          />
        </View>
      </View>
    </View>
  );
};

export default ExchangeInput;
