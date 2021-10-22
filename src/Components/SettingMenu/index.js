/* eslint-disable */

import React from 'react';
import {TouchableOpacity, View, Switch, Image, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLOR_GREY, SILVER_GREY} from '../../Utils/AppContants';
import styles from './style';
const SettingMenu = (props) => {
  const onPress = props.onPress ? {onPress: props.onPress} : {};
  const color = props.themeToggle ? 'rgb(66,66,66)' : '#ce2424';
  return (
    <TouchableOpacity
      style={{
        // backgroundColor: color,
        ...styles.container,
      }}
      {...onPress}
      activeOpacity={0.8}>
      <View style={styles.childBox}>
        <View style={{width: '10%', marginRight: 10}}>
          <Image
            resizeMode="contain"
            source={props.icon}
            style={{height: 26, width: 26}}
          />
          {/* <Ionicons name={props.icon} size={26} color="white" /> */}
        </View>
        <View style={{width: '75%'}}>
          <Text
            style={[
              styles.title,
              {color: props.themeToggle ? COLOR_GREY : 'black'},
            ]}>
            {props.title}
          </Text>
          {props.subTitle && (
            <Text style={[styles.subTitle, {color: SILVER_GREY}]}>
              {props.subTitle}
            </Text>
          )}
        </View>
        <View style={{width: '15%'}}>
          {props.withAction && (
            <Switch
              trackColor={{
                false: props.themeToggle ? 'white' : COLOR_GREY,
                true: props.themeToggle ? SILVER_GREY : 'red',
              }}
              thumbColor="black"
              ios_backgroundColor="#3e3e3e"
              onValueChange={props.onAction}
              value={props.actionValue}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default SettingMenu;
