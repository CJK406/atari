/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {withTheme} from 'react-native-material-ui';
import Modal from 'react-native-modal';
import styles from './style';
import {SideTrade} from '../index';
import {CryptoStyle} from '../../Constant';
import {Images} from '../../Assets';

import Receive from './Receive';
import Send from './Send';
import {
  BwModelicaMedium,
  BwModelicaRegular,
  TRANSPARENT_COLOR,
} from '../../Utils/AppContants';
const TopContent = (props) => {
  const [cryptoBalance, setCryptoBalance] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  // const [currPrice, setCurrPrice] = useState(0)
  const [changes, setChanges] = useState('0.00');
  const [comingshowmodal, setShowComingModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState(0);
  const {tabData} = props;
  const txtColor = props.darkmode ? 'white' : 'black';

  const currency = tabData?.text ? tabData?.text : '';
  const curr_key = currency?.toLowerCase();
  const currPrice =
    props !== undefined && props?.price ? props?.price[curr_key] : '0.00';
  const cryptoColor = CryptoStyle[curr_key]['color'];
  const {chart_data, balance, price, currentTab} = props;
  const {decimal} = CryptoStyle[curr_key];
  const unsetData = () => {
    setCryptoBalance(0);
    setUsdBalance(0);
    setChanges('0.00');
  };
  const setData = () => {
    setCryptoBalance(balance[curr_key].toFixed(decimal));
    const usdkey = curr_key + '_usd';
    setUsdBalance(balance[usdkey].toFixed(2));
    // setCurrPrice(parseFloat(price[curr_key]))
  };
  const calculateChanges = () => {
    let changes = '0.00';
    if (chart_data.y.length > 0) {
      const openPrice = chart_data.y[0];
      const closePrice = chart_data.y[chart_data.y.length - 1];
      changes = (((closePrice - openPrice) / openPrice) * 100).toFixed(2);
    }
    setChanges(changes);
  };
  useEffect(() => {
    setChanges('0.00');
    unsetData();
    return setData();
  }, [props.tabData]);

  useEffect(() => {
    calculateChanges();
  }, [props.chart_data]);

  useEffect(() => {
    unsetData();
    return setData();
  }, []);

  const showModalComponent = (mode) => {
    if (currentTab === 3 || currentTab === 4 || currentTab === 5) {
      setShowComingModal(true);
    } else {
      setModalMode(mode);
      setShowModal(true);
    }
  };
  const ListsContent = [
    {
      component: Receive,
      params: {
        address: props.get_address[curr_key],
        darkmode: props.darkmode,
        icon: tabData.qr_image,
        crypto_name: tabData.full_text,
        color: tabData.color,
      },
    },
    {
      component: Send,
      params: {
        darkmode: props.darkmode,
        tabData: tabData,
        cryptoBalance: balance[curr_key].toFixed(decimal),
        usdBalance: usdBalance,
        price: currPrice,
        closeModal: () => {
          setShowModal(false);
        },
      },
    },
  ];
  const renderModal = () => {
    const _render = ListsContent[modalMode];
    const ContentModal = _render.component;
    return <ContentModal {..._render.params} />;
  };
  function commafy(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <View>
      <Text style={{color: txtColor, ...styles.balanceLabel}}>
        Current Balance
      </Text>
      <View style={{flexDirection: 'row'}}>
        {currency !== 'BCH' && (
          <SideTrade
            label={'Receive'}
            icon={'trending-down-outline'}
            position={'left'}
            image={Images.revieveArrow}
            onPress={() => showModalComponent(0)}
          />
        )}
        <View style={{flex: 1}}>
          <Text style={{color: txtColor, ...styles.coinBalance}}>
            {balance[curr_key].toFixed(decimal)} {currency}
          </Text>
          <Text style={{color: txtColor, ...styles.usdBalance}}>
            ${commafy((balance[curr_key] * parseFloat(currPrice)).toFixed(2))}
          </Text>
        </View>
        {currency !== 'BCH' && (
          <SideTrade
            label={'Send'}
            icon={'trending-up-outline'}
            image={Images.sendArrow}
            position={'right'}
            onPress={() => showModalComponent(1)}
          />
        )}
      </View>
      <View style={styles.cryptoPriceContainer}>
        {/* <Text style={{color:cryptoColor,fontSize:19}}>{currency} ${chart_data.y[chart_data.y.length-1]}</Text> */}
        <Text
          style={{
            color: cryptoColor,
            fontSize: 12,
            fontFamily: BwModelicaRegular,
          }}>
          {currency} ${parseFloat(currPrice).toFixed(4)}
        </Text>

        <View style={{backgroundColor: cryptoColor, ...styles.badgeRadius}}>
          <Text style={{fontFamily: BwModelicaMedium}}>
            {chart_data?.percent?.toFixed(2)}%
          </Text>
        </View>
      </View>
      <Modal
        isVisible={showModal}
        style={{margin: 0}}
        onBackdropPress={() => setShowModal(false)}>
        {renderModal()}
      </Modal>
      <Modal isVisible={comingshowmodal}>
        <View style={{backgroundColor: 'white', borderRadius: 10}}>
          <Image
            source={Images.Logo}
            style={{
              justifyContent: 'center',
              width: 100,
              height: 30,
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: 24,
            }}
          />
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              marginTop: 10,
              marginBottom: 10,
            }}>
            Coming Soon
          </Text>
          {/* <Text style={{textAlign:'center',padding:20,fontSize:20}}>This feature will be available soon.</Text> */}
          <TouchableOpacity
            onPress={() => {
              setShowComingModal(false);
            }}
            style={{
              backgroundColor: 'rgb(227,30,45)',
              width: '60%',
              marginBottom: 20,
              textAlign: 'center',
              justifyContent: 'center',
              marginLeft: '18%',
              padding: 10,
              borderRadius: 10,
              textAlign: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: 'white',
                textAlign: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}>
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

function mapStateToProps(state) {
  return {
    darkmode: state?.Auth?.darkmode,
    get_address: state?.Auth?.get_address,
    price: state?.Auth?.price,
  };
}

export default connect(mapStateToProps, {})(withTheme(TopContent));
