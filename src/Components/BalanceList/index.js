/* eslint-disable */

import React from 'react';
import {View, Text, Image} from 'react-native';
import {CustomStyles} from '../../Constant';
import FontawesomeIcon from 'react-native-vector-icons/FontAwesome';
import {
  COLOR_GREY,
  FontFamilyMedium,
  SILVER_GREY_RGBA,
} from '../../Utils/AppContants';
import {formatMoney} from '../../Utils/functions';

const BalanceList = (props) => {
  return (
    <View
      style={
        props.darkmode
          ? {
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              // marginLeft: 10,
              // width: '95%',
              borderWidth: 0.5,
              borderColor: SILVER_GREY_RGBA,
              borderRadius: 200,
              paddingRight: 5,
              // paddingLeft: 10,
              paddingTop: 5,
              paddingBottom: 5,
              // justifyContent: 'center',
            }
          : {
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              // marginLeft: 10,
              // width: '95%',
              borderWidth: 0.5,
              borderColor: SILVER_GREY_RGBA,
              borderRadius: 200,
              paddingRight: 10,
              paddingLeft: 10,
              paddingTop: 5,
              paddingBottom: 5,
              // justifyContent: 'center',
            }
      }>
      {props.isIcon ? (
        <FontawesomeIcon
          name={props.icon}
          style={{marginRight: 15}}
          size={20}
          color={props.iconColor}
        />
      ) : (
        <Image
          source={props.icon}
          style={{width: 15, height: 15, marginRight: 7, marginLeft: 7}}
        />
      )}
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={
            props.darkmode
              ? {
                  height: 15,
                  marginRight: 10,
                  width: 0.5,
                  backgroundColor: 'white',
                }
              : {
                  height: 15,
                  marginRight: 10,
                  width: 0.5,
                  backgroundColor: 'black',
                }
          }></View>
        <Text
          style={[
            props.darkmode
              ? [CustomStyles.d_text, {fontSize: 11}]
              : [CustomStyles.w_text, {fontSize: 11}],
            {
              justifyContent: 'center',
              marginRight: 5,
              fontFamily: FontFamilyMedium,
            },
          ]}>
          {formatMoney(props.balance)}
        </Text>
        <Text style={{color: props.iconColor, fontFamily: FontFamilyMedium}}>
          {props.label}
        </Text>
      </View>
    </View>
  );
};

export default BalanceList;
