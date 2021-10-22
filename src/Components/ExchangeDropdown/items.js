import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {COLOR_GREY, FontFamilyRegular} from '../../Utils/AppContants';
import styles from './style';

const DropdownItem = ({onPress, item, isOpen}) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress} activeOpacity={1}>
        <View style={{...styles.selectedBox, borderTopWidth: 0}}>
          <View style={{width: '14.5%'}}>
            <Image
              source={item['image']}
              style={{...styles.activeIcon, marginRight: 10}}
            />
          </View>
          <View
            style={{
              height: '100%',
              width: 0.5,
              backgroundColor: COLOR_GREY,
              marginRight: 20,
            }}></View>
          <View style={styles.dropdownLabelContainer}>
            <Text style={[styles.activeTitle]}>
              {item.f_text} {item.text}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: '#C0C0C0',
                fontFamily: FontFamilyRegular,
                marginTop: 3,
              }}>
              {item.value} {item.f_text} | ${item.u_v}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default DropdownItem;
