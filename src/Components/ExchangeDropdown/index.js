/* eslint-disable */

import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Images} from '../../Assets';
import {
  COLOR_GREY,
  FontFamilyMedium,
  FontFamilyRegular,
} from '../../Utils/AppContants';
import DropdownItem from './items';
import styles from './style';

const ExchangeDropdown = (props) => {
  const [activeKey, setActiveKey] = useState(0);
  const {items, darkmode, label, isOpen} = props;
  useEffect(() => {
    if (props.defaultKey >= 0) {
      setActiveKey(props.defaultKey);
    }
  }, []);
  const txColor = darkmode ? 'white' : 'black';
  const carretIcon = () => {
    const icon = isOpen ? 'angle-up' : 'angle-down';
    const iconColor = isOpen ? 'white' : 'black';
    return (
      // <Icon name={icon} style={styles.carretIcon} size={20} color={txColor} />
      <View>
        <Image
          tintColor={darkmode ? 'white' : 'black'}
          resizeMode="contain"
          source={Images.tramsDrop}
          style={{height: 13, width: 13}}
        />
      </View>
    );
  };
  const onSelect = (selectedIdx) => {
    props.drop_open(false);
    setActiveKey(selectedIdx);

    if (typeof onSelect === 'function') props.onSelect(selectedIdx);
  };
  return (
    <View style={styles.container}>
      <Text style={{...styles.label, color: txColor}}>{label}:</Text>
      <TouchableOpacity
        onPress={() =>
          isOpen ? props.drop_open(false) : props.drop_open(true)
        }
        activeOpacity={1}>
        <View style={[isOpen ? styles.selectedBox : styles.selectBox]}>
          <View
            style={{
              width: '14.5%',
              //   justifyContent: 'center',
              //   alignItems: 'center',
            }}>
            <Image
              source={items[activeKey]['image']}
              style={styles.activeIcon}
            />
          </View>
          <View
            style={{
              height: '100%',
              width: 0.5,
              backgroundColor: COLOR_GREY,
              marginRight: 20,
            }}></View>
          <View style={styles.activeLabel}>
            <Text
              style={
                darkmode
                  ? [isOpen ? styles.activeTitleOpen : styles.activeTitle]
                  : [
                      isOpen
                        ? styles.activeTitleOpenWhite
                        : styles.activeTitleWhite,
                    ]
              }>
              {items[activeKey]['f_text']} {items[activeKey]['text']}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: '#C0C0C0',
                fontFamily: FontFamilyRegular,
                marginTop: 3,
              }}>
              {items[activeKey]['value']} {items[activeKey]['f_text']} | $
              {items[activeKey]['u_v']}
            </Text>
          </View>
          <View
            style={{
              width: '15%',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            {carretIcon()}
          </View>
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownContainer}>
          {items.map((item, index) => (
            <DropdownItem
              key={item?.image}
              onPress={() => onSelect(index)}
              item={item}
              isOpen={isOpen}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default ExchangeDropdown;
