/* eslint-disable */
import * as React from 'react';
import {
  BackHandler,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  FlatList,
  InteractionManager,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {withTheme} from 'react-native-material-ui';
import NetInfo from '@react-native-community/netinfo';

import {CustomStyles} from '../Constant';
import {Header, BalanceList, History} from '../Components';
import {Images} from '../Assets';
import {PieChart} from 'react-native-svg-charts';
import LinearGradient from 'react-native-linear-gradient';
import {
  setAllHistory,
  getAllAddress,
  updateBallance,
  updateStartScreenState,
  updateMenuStatus,
  getAppConfig,
  authLogout,
} from '../Redux/Actions';
import PTRView from 'react-native-pull-to-refresh';
// import PTRView from '../Components/PullToRefreshCustom';
import {isInternetConnected} from '../Utils/NetworkConnectivity';
import Toast from 'react-native-simple-toast';
import VersionInfo from 'react-native-version-info';
import appUtils from '../Utils/AppUtils';
import UpdateVersionModal from '../Components/UpdateVersionModal';
import appNavigation from '../Utils/AppNavigation';
import atariLogs from '../Utils/AtariLogs';
import {SALT_MIX_KEY, IV_KEY} from '@env';
const {height} = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;
let backPressed = 0;
class DashboardScreen extends React.Component {
  state = {
    balance: null,
    history_finish: true,
    darkmode: true,
    pincode: null,
    history: {
      body: {
        obj: {ATARI: [], ETH: [], USDT: [], BTC: [], BNB: [], LTC: []},
        arr: [],
      },
    },
    get_address: {atri: '', btc: '', eth: '', ltc: '', bch: '', flag: false},
    interval: null,
    triggerRefresh: false,
    isLoading: true,
    modalVisible: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state?.balance != nextState.balance ||
      this.state?.history != nextState.history ||
      this.state?.darkmode != nextState.darkmode ||
      this.state?.history_finish != nextState.history_finish ||
      this.state.modalVisible != nextState.modalVisible
    );
  }

  setView() {
    this.state.isLoading = true;
    InteractionManager.runAfterInteractions(() => {
      this.props.updateMenuStatus(true);
      if (this.props.pincode === null) {
        this.props.navigation.navigate('SetPincode');
      } else {
        this.getHistory();
        this.props.updateBallance();
        this.props.updateStartScreenState(false);
        this.get_address();
        if (
          this.props.all_history === undefined ||
          this.props.all_history.length == 0
        ) {
          this.getHistory();
        } else {
          setTimeout(() => {
            if (this.state !== null) {
              this.state.isLoading = false;
              this.setState({
                isLoading: false,
              });
            }
          }, 2000);
          this.setState({history_finish: true});
        }
      }
    });
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }
  // unsubscribe = NetInfo.addEventListener(state => {

  //     if (state.isConnected === true) {
  //         this.state.netWorkConnection = true
  //     } else {
  //         this.state.netWorkConnection = false
  //     }
  // });

  check() {
    if (isInternetConnected() === true) {
      this.resetError();
      this.state.isLoading = false;
      this.setState({
        isLoading: true,
      });
      this.setView();
      this.forceUpdate();
    } else {
      this.forceUpdate();
    }
  }

  componentDidMount() {
    console.log('this.props', this.props);
    if (isInternetConnected() === true) {
      this.setView();
      if (this.props.pincode !== null) {
        this.getHistory();
        this.props.updateBallance();
        this.getAppConfigData();
        appUtils.checkAppUpdate(this.props);
      }
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }
  handleBackButton = () => {
    if (backPressed > 0) {
      BackHandler.exitApp();
      backPressed = 0;
    } else {
      backPressed++;
      Toast.show('Press again to exit.', Toast.SHORT);
      setTimeout(() => {
        backPressed = 0;
      }, 2000);
      return true;
    }

    return true;
  };
  static getDerivedStateFromProps(props, state) {
    return {
      balance: props?.balance,
      darkmode: props?.darkmode,
      pincode: props?.pincode,
      history: props?.all_history,
      get_address: props?.get_address,
      notification_Flag: props?.notification_Flag,
    };
  }

  isErrorMessage() {
    return (
      // (this.props.get_address.code !== undefined &&
      //   this.props.get_address.code === 900) ||
      // (this.props.all_history.code !== undefined &&
      //   this.props.all_history.code === 900) ||
      this.props.balance.code !== undefined && this.props.balance.code === 900
    );
  }

  resetError() {
    // if (this.props.get_address.code !== undefined) {
    //   this.props.get_address.code = 0;
    // }

    // if (this.props.all_history.code !== undefined) {
    //   this.props.all_history.code = 0;
    // }

    if (this.props.balance.code !== undefined) {
      this.props.balance.code = 0;
    }
  }

  getErrorMessage() {
    // if (
    //   this.props.get_address.code !== undefined &&
    //   this.props.get_address.code !== 200
    // ) {
    //   return this.props.get_address.message;
    // } else if (
    //   this.props.all_history.code !== undefined &&
    //   this.props.all_history.code !== 200
    // ) {
    //   return this.props.all_history.message;
    // } else
    if (
      this.props.balance.code !== undefined &&
      this.props.balance.code !== 200
    ) {
      return this.props.balance.message;
    }
  }

  get_address() {
    this.props.getAllAddress();
  }

  getHistory = async () => {
    this.props.setAllHistory();
  };

  getAppConfigData = async () => {
    await this.props.getAppConfig();
  };
  refresh() {
    if (isInternetConnected() === false) {
      this.forceUpdate();
      return;
    }

    this.setState(
      {
        history: {},
        history_finish: false,
        triggerRefresh: true,
        netWorkConnection: true,
      },
      () => {
        if (this.state.notification_Flag) {
          this.getHistory();
          this.props.updateBallance();
        }
        this.setState({
          triggerRefresh: false,
          history_finish: true,
        });
      },
    );
  }
  commafy(num) {
    return num?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  toggleModal(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    const {balance, darkmode, history_finish, history} = this.state;
    let data = [
      balance?.atri_usd,
      balance?.btc_usd,
      balance?.eth_usd,
      balance?.ltc_usd,
      balance?.usdt_usd,
    ];
    if (
      balance?.atri_usd === 0 &&
      balance?.btc_usd === 0 &&
      balance?.eth_usd === 0 &&
      balance.ltc_usd === 0 &&
      balance?.usdt_usd === 0
    )
      data = [1, 0, 0, 0, 0];
    const color_data = [
      '#ce2424',
      '#f7931a',
      'aqua',
      '#345c9c',
      'rgb(80,175,149)',
      'rgb(19,181,236))',
      'rgb(243,186,46)',
    ];
    const getColor = (key) => color_data[key];
    const pieData = data.map((value, index) => ({
      value,
      svg: {
        fill: getColor(index),
      },
      key: `pie-${index}`,
      innerRadius: '10%',
      outerRadius: '10%',
    }));

    const themeBG = darkmode ? 'black' : 'white';
    const txtColor = darkmode ? CustomStyles.d_text : CustomStyles.w_text;
    const renderItem = ({item}) => (
      <View style={[CustomStyles.container, styles.innerContainer]}>
        <Header darkmode={darkmode} />
        <View
          style={{...CustomStyles.innerContainer, ...styles.balanceContainer}}>
          <Text
            style={{
              fontSize: 17,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginBottom: 100,
              ...txtColor,
            }}>
            Total Balance{' '}
          </Text>
          <Text
            style={{
              fontSize: 16,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginBottom: -140,
              ...txtColor,
            }}>
            ${this.commafy(balance?.sum?.toFixed(2))}
          </Text>
          <View style={{marginTop: 10}}>
            <View style={{marginTop: 0}}>
              {this.state.balance != null ? (
                <PieChart
                  style={{height: 180, marginTop: 30}}
                  data={pieData}
                  innerRadius="95%"
                />
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: '40%',
                  }}>
                  <ActivityIndicator
                    size="large"
                    color={darkmode ? 'white' : 'black'}
                  />
                </View>
              )}
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View style={{flexDirection: 'column', marginRight: 16}}>
                <BalanceList
                  darkmode={darkmode}
                  balance={this?.state?.balance?.atri?.toFixed(0)}
                  label={'ATRI'}
                  icon={Images.Atri_icon}
                  iconColor={color_data[0]}
                />

                <BalanceList
                  darkmode={darkmode}
                  balance={this?.state?.balance?.eth?.toFixed(8)}
                  label={'ETH'}
                  icon={Images.Eth_icon}
                  iconColor={color_data[2]}
                />

                <BalanceList
                  darkmode={darkmode}
                  balance={this.state?.balance?.usdt?.toFixed(6)}
                  label={'USDT'}
                  icon={Images.bch_icon}
                  iconColor={color_data[4]}
                />
              </View>

              <View style={{flexDirection: 'column', marginLeft: 16}}>
                <BalanceList
                  darkmode={darkmode}
                  balance={this.state?.balance?.btc?.toFixed(8)}
                  label={'BTC'}
                  isIcon
                  icon="bitcoin"
                  iconColor={color_data[1]}
                />
                <BalanceList
                  darkmode={darkmode}
                  balance={'0.00000000'}
                  label={'BNB'}
                  icon={Images.bnb_icon}
                  iconColor={color_data[6]}
                />
                <BalanceList
                  darkmode={darkmode}
                  balance={this.state?.balance?.ltc?.toFixed(8)}
                  label={'LTC'}
                  icon={Images.Ltc_icon}
                  iconColor={color_data[3]}
                />
              </View>
            </View>
          </View>
        </View>
        <History
          label={'History'}
          data={history?.body?.arr}
          darkmode={darkmode}
          isLoad={!history_finish}
        />
      </View>
    );
    return (
      <View style={{flex: 1, backgroundColor: themeBG}}>
        {isInternetConnected() && !this.isErrorMessage() ? (
          <View style={{flex: 1}}>
            {this.state.isLoading ? (
              <View style={{flex: 1}}>
                {darkmode && (
                  <Image
                    resizeMode="contain"
                    style={{
                      resizeMode: 'cover',
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      flex: 1,
                      alignSelf: 'stretch',
                      width: '100%',
                      height: height,
                    }}
                    source={Images.dashboard_background}
                  />
                )}
                <Header darkmode={darkmode} />
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator color="white" size="large" />
                </View>
              </View>
            ) : (
              <View style={{flex: 1}}>
                {/* <ImageBackground style={{alignItems: 'center', flex: 1,}} source={darkmode ? Images.dashboard_background : null} > */}
                {darkmode && (
                  <Image
                    resizeMode="contain"
                    style={{
                      resizeMode: 'cover',
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      flex: 1,
                      alignSelf: 'stretch',
                      width: '100%',
                      height: height,
                    }}
                    source={Images.dashboard_background}
                  />
                )}

                <FlatList
                  data={[{id: 1}]}
                  renderItem={renderItem}
                  keyExtractor={(item) => item?.id}
                  refreshing={this.state.triggerRefresh}
                  // keyExtractor={item => item?.id}
                  onRefresh={() => this.refresh()}
                />
                {/* </ImageBackground> */}
              </View>
            )}
          </View>
        ) : (
          <View style={{flex: 1, backgroundColor: themeBG}}>
            {darkmode && (
              <Image
                resizeMode="contain"
                style={{
                  resizeMode: 'cover',
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  flex: 1,
                  alignSelf: 'stretch',
                  width: '100%',
                  height: height,
                }}
                source={Images?.dashboard_background}
              />
            )}
            <Header darkmode={darkmode} />
            <View style={styles.tryAgainContainer}>
              <Text style={styles.internetText}>
                {this.isErrorMessage()
                  ? this.getErrorMessage()
                  : 'Please check your internet connection'}{' '}
              </Text>
              <LinearGradient
                colors={['#fff', '#000']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                  ...styles.inputContainer2,
                  height: 43,
                  borderWidth: 0,
                  paddingLeft: 2,
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.inputContainer2,
                    {
                      backgroundColor: 'black',
                      justifyContent: 'center',
                      marginTop: 0,
                    },
                  ]}
                  onPress={() => this.check()}>
                  <Text
                    style={{fontWeight: '500', fontSize: 18, color: 'white'}}>
                    Try again
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  customWriting: {
    fontSize: 12,
    color: '#7882A2',
  },
  balanceContainer: {
    flex: 1,
    paddingBottom: 20,
    paddingLeft: 20,
  },
  tryAgainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tryAgainBtn: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer2: {
    marginTop: 30,
    width: windowWidth * 0.5,
    opacity: 1,
    borderRadius: 500,
    borderColor: 'black',
    borderWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  internetText: {
    color: 'white',
    fontSize: 16,
  },
});

function mapStateToProps(state) {
  return {
    balance: state?.Auth?.balance,
    darkmode: state?.Auth?.darkmode,
    pincode: state?.Auth?.pincode,
    all_history: state?.Auth?.all_history,
    get_address: state?.Auth?.get_address,
    notification_Flag: state?.Auth?.notification_Flag,
    app_config_data: state?.Auth?.app_config_data,
  };
}

export default connect(mapStateToProps, {
  setAllHistory,
  getAllAddress,
  updateBallance,
  updateStartScreenState,
  updateMenuStatus,
  getAppConfig,
  authLogout,
})(withTheme(DashboardScreen));
