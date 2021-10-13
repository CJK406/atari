import React from 'react';
import {View, TouchableHighlight, Text, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Images} from '../../Assets';
import styles from './style';
const SideTrade = ({label, icon, onPress, position, image}) => {
  const radiusStyle =
    position === 'left' ? styles.rightRadius : styles.leftRadius;
  return (
    <View style={{width: 70}}>
      <TouchableHighlight
        onPress={onPress}
        style={{...styles.container, ...radiusStyle}}>
        <View>
          <Image
            resizeMode="contain"
            style={{height: 20, width: 20}}
            source={image}
          />
          {/* <Ionicons name={icon} size={20} color="white" /> */}
          {/* <Text style={styles.labelStyle}>{label}</Text> */}
        </View>
      </TouchableHighlight>
    </View>
  );
};
export default SideTrade;
