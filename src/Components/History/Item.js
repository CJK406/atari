import React from 'react';
import {View, Text, ActivityIndicator, Image} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomStyles, CryptoStyle} from '../../Constant';
import moment from 'moment';
import {
  COLOR_GREY,
  FontFamilyMedium,
  FontFamilyRegular,
  SILVER_GREY,
  SILVER_GREY_RGBA,
} from '../../Utils/AppContants';
import {Images} from '../../Assets';
class HistoryItem extends React.Component {
  constructor(props) {
    super(props);
  }

  convert(date) {
    let current_datetime = new Date(date);
    let year = current_datetime?.getFullYear();
    let month =
      current_datetime?.getMonth() + 1 < 10
        ? '0' + (current_datetime.getMonth() + 1)
        : current_datetime.getMonth() + 1;
    let day =
      current_datetime.getDate() < 10
        ? '0' + current_datetime.getDate()
        : current_datetime.getDate();
    let hour =
      current_datetime.getHours() < 10
        ? '0' + current_datetime.getHours()
        : current_datetime.getHours();
    let min =
      current_datetime.getMinutes() < 10
        ? '0' + current_datetime.getMinutes()
        : current_datetime.getMinutes();
    let second =
      current_datetime.getSeconds() < 10
        ? '0' + current_datetime.getSeconds()
        : current_datetime.getSeconds();
    let formatted_date =
      year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + second;
    return formatted_date;
  }
  render() {
    const {darkmode, item} = this.props;

    let date = this.convert(item?.createdAt);
    let value = parseFloat(item?.value).toFixed(
      CryptoStyle[
        item?.asset?.toLowerCase() ? item?.asset?.toLowerCase() : 'atari'
      ]['decimal'],
    );
    let e_value = parseFloat(item?.e_value).toFixed(
      CryptoStyle[
        item?.asset.toLowerCase() ? item?.asset.toLowerCase() : 'atari'
      ]['decimal'],
    );

    if (item.value < 1 && item?.asset?.toLowerCase() === 'atari') value = 1;
    if (item?.e_value < 1 && item?.asset?.toLowerCase() === 'atari')
      e_value = 1;

    if (
      item?.transactionType === 'exchange' &&
      item?.asset?.toLowerCase() === 'atari'
    )
      value = e_value;
    let icon = 'arrow-up-circle-outline';
    let type = 'Sent';
    let color = 'rgb(244,67,54)';
    let transIcon = Images.recievedIcon;
    if (item.transactionType === 'receive') {
      icon = 'arrow-down-circle-outline';
      type = 'Received';
      color = 'rgb(70,155,74)';
      transIcon = Images.recievedIcon;
    } else if (item.transactionType === 'exchange') {
      type = 'Exchange';
      icon = 'shuffle';
      color = 'rgb(12,145,255)';
      transIcon = Images.sendTransIcon;
    }
    if (item?.status === 'Pending') {
      type = 'Pending';
      icon = 'shuffle';
    }
    return (
      <View>
        <View
          style={{
            marginBottom: 15,
            flexDirection: 'row',
            borderBottomColor: SILVER_GREY_RGBA,
            borderBottomWidth: 0.5,
            paddingBottom: 10,
            alignItems: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              paddingRight: 7,
            }}>
            {type === 'Pending' ? (
              <ActivityIndicator size="small" color={color} />
            ) : (
              <View>
                <Ionicons
                  name={icon}
                  size={25}
                  color={darkmode ? 'white' : 'black'}
                />
                {/* <Image style={{height: 25, width: 25}} source={coinIcon} /> */}
              </View>
            )}
          </View>
          <View
            style={{
              height: '85%',
              width: 0.5,
              backgroundColor: SILVER_GREY_RGBA,
              marginRight: 9,
            }}></View>
          <View
            style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
            <View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    darkmode ? CustomStyles.d_text : CustomStyles.w_text,
                    {
                      fontSize: 14,
                      fontFamily: FontFamilyMedium,
                      color: darkmode ? COLOR_GREY : 'black',
                    },
                  ]}>
                  {type}
                </Text>
                <Image
                  resizeMode="contain"
                  style={{marginLeft: 5, height: 7, width: 7, marginTop: 5}}
                  source={transIcon}
                />
              </View>
              <Text
                style={[
                  darkmode ? CustomStyles.d_text : CustomStyles.w_text,
                  {
                    fontSize: 10,
                    marginTop: 2,
                    color: SILVER_GREY,
                    fontFamily: FontFamilyRegular,
                  },
                ]}>
                {moment(date).format('DD-MM-YYYY h:m:s')}
              </Text>
            </View>
          </View>
          <View style={{width: '35%'}}>
            <Text
              style={{
                color: color,
                fontSize: 13,
                textAlign: 'right',
                fontFamily: FontFamilyRegular,
              }}>
              {value} {item.asset.toUpperCase()}
            </Text>

            {type === 'Exchange' && (
              <Text style={{color: color, fontSize: 15, textAlign: 'right'}}>
                {item.fromAddress.toUpperCase()} to ATRI
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}

HistoryItem.propTypes = {
  item: PropTypes.object,
  darkmode: PropTypes.bool,
};
HistoryItem.defaultProps = {
  item: {},
  darkmode: true,
};

export default HistoryItem;
