/* eslint-disable */

import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {withTheme} from 'react-native-material-ui';
import {CustomStyles, Headers} from '../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Images} from '../Assets';
import Modal from 'react-native-modal';
import RadioForm from 'react-native-simple-radio-button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {sendEther, sendAttari, sendOTP, sendUsdt, sendActionApi} from '../Api';
import {updateBallance, setAllHistory} from '../Redux/Actions';
import {InputPin, AwesomeAlert} from '../Components';
let RESEND_TIME = 90;

const fontFamily = 'BwModelicaSS01-Medium';
const fontWhiteColor = '#D0D0D0';

class SendConfirmScreen extends React.Component {
  constructor(props) {
    super(props);
    this.awesomeAlert = null;
  }
  state = {
    show_miner_fee_modal: false,
    miner_fee: 1,
    info: {},
    isLoading: false,
    darkmode: true,
    codePin: '',
    otp_code: '',
    user_id: '',
    pincode: null,
    back_flag: false,
    isShowOtpProgress: true,
    timer: RESEND_TIME,
    isResendEnabled: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.isLoading != nextState.isLoading ||
      this.state.darkmode != nextState.darkmode ||
      this.state.codePin != nextState.codePin ||
      this.state.back_flag != nextState.back_flag ||
      this.state.otp_code != nextState.otp_code ||
      this.state.isShowOtpProgress != nextProps.isShowOtpProgress ||
      this.state.timer != nextProps.timer ||
      this.state.isResendEnabled != nextProps.isResendEnabled
    );
  }

  componentDidMount() {
    if (__DEV__) {
      console.log('salman');
    } else {
      this.sendOTPCode();
    }
  }

  componentDidUpdate() {
    if (this.state.timer === 1) {
      clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    // this.props.onTimerElapsed()
  }
  static getDerivedStateFromProps(props, state) {
    return {
      info: props.route.params.info,
      darkmode: props.darkmode,
      user_id: props.user_id,
      pincode: props.pincode,
      id: props.id,
      email: props.email,
      name: props.name,
    };
  }

  secondsToHms = (value) => {
    const sec = parseInt(value, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - hours * 3600) / 60);
    let seconds = sec - hours * 3600 - minutes * 60;
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    if (hours == 0) {
      return +minutes + ':' + seconds; // Return in MM:SS format
    } else {
      return hours + ':' + minutes + ':' + seconds; // Return in HH:MM:SS format
    }
  };

  startTimer = () => {
    this.interval = setInterval(
      () => this.setState((prevState) => ({timer: prevState.timer - 1})),
      1000,
    );
  };
  goBack = () => {
    const {back_flag} = this.state;
    if (!back_flag) {
      this.props.navigation.goBack();
    }
  };

  toggleModal = () => {
    this.setState({
      show_miner_fee_modal: !this.state.show_miner_fee_modal,
    });
  };
  SendConfirm = () => {
    const {codePin, otp_code, pincode, miner_fee, info, user_id} = this.state;

    if (codePin !== '') {
      // this.setState({isLoading:true});
      let input_pincode = parseInt(codePin);
      let user_pincode = parseInt(pincode);
      let user_otpcode = parseInt(otp_code);

      if (input_pincode === '') {
        this.awesomeAlert.showAlert('error', 'Failed!', 'Please enter pincode');
        return;
      } else if (otp_code === '') {
        this.awesomeAlert.showAlert(
          'error',
          'Failed!',
          'Please enter otp code',
        );
        return;
      }
      // else if (input_pincode !== user_pincode) {
      //   this.awesomeAlert.showAlert(
      //     'error',
      //     'Failed!',
      //     'Pincode is not correct',
      //   );
      // }
      else {
        this.setState({
          isLoading: true,
        });
        let currency = Headers[info.currentTab]['text'];
        if (currency === 'ATRI') currency = 'ATARI';
        let data = {
          token: currency,
          amount: parseFloat(info.send_amount),
          to: info.address,
          code: input_pincode,
          otpCode: user_otpcode,
        };
        let result = sendAttari(data);
        result.then((resp) => {
          this.setState({
            isLoading: false,
          });
          if (resp.code == 200) {
            this.goBack();
          } else {
            if (resp.message !== undefined) {
              this.awesomeAlert.showAlert('error', 'Failed!', resp.message);
            } else {
              this.setState({
                isLoading: false,
              });
              this.awesomeAlert.showAlert(
                'error',
                'Failed!',
                'Something went wrong',
              );
            }
          }
        });

        //sendAttari(data);
      }
    } else {
      this.awesomeAlert.showAlert('error', 'Failed!', 'Pincode is not correct');
    }
  };

  sendOTPCode = () => {
    this.setState({
      isShowOtpProgress: true,
    });

    let result = sendOTP();

    result.then((resp) => {
      this.setState({
        isShowOtpProgress: false,
      });
      if (resp.code === 200) {
        this.setState({
          timer: RESEND_TIME,
        });
        this.interval = setInterval(
          () => this.setState((prevState) => ({timer: prevState.timer - 1})),
          1000,
        );
      } else {
        if (resp.message !== undefined) {
          this.awesomeAlert.showAlert('error', 'Failed!', resp.message);
        } else {
          this.awesomeAlert.showAlert(
            'error',
            'Failed!',
            'Something went wrong',
          );
        }
      }
    });
  };

  elipsisText(value) {
    var splitIndex = Math.round(value.length * 0.8);
    this.fullText = value;
    return {
      leftText: value.slice(0, splitIndex),
      rightText: value.slice(splitIndex),
    };
  }

  render() {
    const radio_props = [
      {label: 'Economic', value: 1},
      {label: 'Standard', value: 2},
      {label: 'High Priority', value: 3},
    ];
    const {info, darkmode} = this.state;
    const {leftText, rightText} = this.elipsisText(info.address);

    return (
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: darkmode ? 'rgb(33,33,33)' : 'white'}}>
        <SafeAreaView
          style={{
            ...CustomStyles.container,
            backgroundColor: darkmode ? 'rgb(33,33,33)' : 'white',
            height: '100%',
          }}>
          <AwesomeAlert ref={(ref) => (this.awesomeAlert = ref)} />
          <View style={[CustomStyles.container, styles.innerContainer]}>
            <View
              style={{
                height: 100,
                // alignItems: 'spa',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
                position: 'relative',
                backgroundColor: darkmode ? 'black' : 'white',
                width: '100%',
              }}>
              <TouchableOpacity
                // style={{position: 'absolute', left: 10}}
                onPress={this.goBack}>
                <Ionicons
                  name="arrow-back-outline"
                  size={24}
                  color={darkmode ? 'white' : 'black'}
                />
              </TouchableOpacity>
              <Image source={Images.Logo} style={{width: 160, height: 50}} />
              <View>
                <View style={styles.redKeyImage}></View>
                <Image
                  resizeMode="contain"
                  resizeMethod="auto"
                  style={styles.keyImage}
                  source={Images.white_key}
                />
              </View>
            </View>

            <View style={{backgroundColor: '#191919'}}>
              <View style={{backgroundColor: '#1D1D1D', padding: 20}}>
                <Text
                  style={{
                    fontSize: 18,
                    lineHeight: 22,
                    color: darkmode ? fontWhiteColor : 'black',
                    textAlign: 'center',
                    fontFamily: 'BwModelicaSS01-Bold',
                  }}>
                  Confirm Payment
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: darkmode ? fontWhiteColor : 'black',
                    textAlign: 'center',
                    fontFamily: 'BwModelicaSS01-Regular',
                  }}>
                  Summary
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: -5,
                  // borderBottomWidth: 2,
                  backgroundColor: darkmode ? '#232323' : 'gray',
                  // borderBottomColor: darkmode ? '#333333' : 'gray',
                  // paddingBottom: 20,
                  justifyContent: 'space-between',
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  padding: 20,
                  paddingTop: 30,
                  paddingBottom: 30,
                }}>
                <Text
                  style={{
                    width: '50%',
                    fontSize: 12,
                    letterSpacing: 1,
                    color: darkmode ? fontWhiteColor : 'black',
                    fontFamily: 'BwModelica-Medium',
                  }}>
                  Sending to
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    // borderRadius: 10,
                    padding: 2,
                    paddingLeft: 5,
                    // backgroundColor: '#3a3a3a',
                  }}>
                  <Image
                    source={Headers[info.currentTab]['Image']}
                    style={{
                      width: 14,
                      height: 14,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      alignItems: 'center',
                      maxWidth: '60%',
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingLeft: 5,
                      paddingRight: 10,
                    }}>
                    <Text
                      style={{color: fontWhiteColor, width: 100}}
                      numberOfLines={1}>
                      {leftText}
                    </Text>
                    <Text style={{color: fontWhiteColor}} numberOfLines={1}>
                      {rightText}
                    </Text>
                  </View>
                </View>
              </View>

              {/* <View style={{flexDirection:'row',marginTop:20,borderBottomWidth:2,borderBottomColor:darkmode?'#333333':'gray',paddingBottom:20}}>
                    <Text style={{width:'50%',fontSize:20,letterSpacing:1,color:darkmode?'white':'black'}}>Miner fee</Text>
                    <TouchableOpacity style={{textAlign:'right',alignItems:'flex-end',alignSelf:'flex-end',justifyContent:'flex-end', width:'50%'}} onPress={() => this.toggleModal(true)}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{color:darkmode?'#b5b5b5':'black'}}>{radio_props[this.state.miner_fee-1]['label']}</Text>
                            <Ionicons name="chevron-down-outline" size={20} style={{marginLeft:20}} color={darkmode?"white":'black'} />
                        </View>
                    </TouchableOpacity>
                </View> */}

              <View
                style={{
                  marginTop: -15,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  // borderBottomWidth: 2,
                  paddingTop: 10,
                  backgroundColor: darkmode ? '#121212' : 'gray',
                  // borderBottomColor: darkmode ? '#121212' : 'gray',
                }}>
                <View style={styles.enterContainer}>
                  <Text
                    style={{
                      marginBottom: 10,
                      fontSize: 12,
                      letterSpacing: 2,
                      color: darkmode ? fontWhiteColor : 'black',
                      fontFamily: 'BwModelicaSS01-Medium',
                    }}>
                    Enter your pincode*
                  </Text>
                  <View style={styles.enterPinCodeLine}></View>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    // justifyContent: 'center',
                    marginBottom: 10,
                  }}>
                  <InputPin
                    value={this.state.codePin}
                    codeLength={6}
                    cellStyle={{
                      backgroundColor: darkmode ? 'white' : '#3a3a3a',
                    }}
                    onTextChange={(code) => this.setState({codePin: code})}
                    textStyle={{
                      fontSize: 24,
                      color: darkmode ? 'black' : fontWhiteColor,
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  // marginTop: 20,
                  // marginBottom: 20,
                  // borderBottomWidth: 2,
                  backgroundColor: darkmode ? '#121212' : 'gray',
                  // borderBottomColor: darkmode ? '#333333' : 'gray',
                  paddingBottom: 40,
                }}>
                <View style={styles.enterContainer}>
                  <Text
                    style={{
                      marginBottom: 10,
                      fontSize: 12,
                      letterSpacing: 1,
                      color: darkmode ? fontWhiteColor : 'black',
                      fontFamily: 'BwModelicaSS01-Medium',
                    }}>
                    Enter OTP*
                  </Text>
                  <View style={styles.enterLine}></View>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}>
                  <InputPin
                    value={this.state.otp_code}
                    codeLength={6}
                    cellStyle={{
                      backgroundColor: darkmode ? 'white' : '#3a3a3a',
                    }}
                    onTextChange={(code) => this.setState({otp_code: code})}
                    textStyle={{
                      fontSize: 24,
                      color: darkmode ? 'black' : 'white',
                    }}
                  />
                </View>
                <TouchableOpacity
                  disabled={this.state.timer !== 1}
                  onPress={this.sendOTPCode}
                  style={{
                    width: '35%',
                    alignSelf: 'center',
                    marginBottom: 10,
                    marignTop: 20,
                    textAlign: 'center',
                    borderWidth: 1,
                    borderColor: this.state.timer === 1 ? 'white' : '#696969',
                    justifyContent: 'center',
                    padding: 7,
                    borderRadius: 6,
                    textAlign: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: this.state.timer === 1 ? 'white' : '#696969',
                      textAlign: 'center',
                      justifyContent: 'center',
                      fontFamily: fontFamily,
                    }}>
                    {this.state.isShowOtpProgress ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      'Resend OTP'
                    )}
                  </Text>
                </TouchableOpacity>

                {this.state.timer === 1 ? null : (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'gray',
                        fontSize: 14,
                        marginRight: 5,
                        fontFamily: fontFamily,
                      }}>
                      Dont receive?
                    </Text>
                    <Text style={styles.resendText}>
                      Resend code in {this.secondsToHms(this.state.timer)}
                    </Text>
                  </View>
                )}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: -10,
                  marginBottom: 30,
                  paddingLeft: 40,
                  paddingRight: 40,
                  paddingBottom: 20,
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  paddingTop: 30,
                  backgroundColor: darkmode ? '#191919' : 'gray',
                }}>
                <Text
                  style={{
                    width: '50%',
                    fontSize: 12,
                    letterSpacing: 1,
                    color: darkmode ? fontWhiteColor : 'black',
                    fontFamily: 'BwModelicaSS01-Medium',
                  }}>
                  Total amount
                </Text>
                <View
                  style={{
                    width: '50%',
                    textAlign: 'right',
                    justifyContent: 'flex-end',
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: darkmode ? '#191919' : 'gray',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      // marginBottom: 5,
                      color: darkmode ? fontWhiteColor : 'black',
                      fontFamily: fontFamily,
                    }}>
                    {info.send_amount} {Headers[info.currentTab]['text']}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: darkmode ? fontWhiteColor : 'black',
                      marginLeft: 5,
                      fontFamily: fontFamily,
                    }}>
                    {info.send_usd_amount} USD
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={this.SendConfirm}
                style={{
                  backgroundColor: 'rgb(227,30,45)',
                  width: '60%',
                  marginBottom: 20,
                  marignTop: 20,
                  textAlign: 'center',
                  justifyContent: 'center',
                  padding: 10,
                  alignSelf: 'center',
                  borderRadius: 60,
                  textAlign: 'center',
                  justifyContent: 'center',
                }}>
                {this.state.isLoading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      color: fontWhiteColor,
                      textAlign: 'center',
                      justifyContent: 'center',
                      fontFamily: fontFamily,
                      letterSpacing: 1,
                    }}>
                    SEND
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            {/* <Modal isVisible={this.state.show_miner_fee_modal}
                onBackdropPress={() => this.toggleModal(false)}
                style={{margin:0}}
            >
                <View style={{ backgroundColor:'rgb(33,33,33)',borderRadius:10,top:'34%',width:'100%',margin:0,borderTopRightRadius:50,borderTopLeftRadius:50}}>
                    <View style={{backgroundColor:'rgb(22,22,22)',paddingTop:20,paddingBottom:10,borderTopRightRadius:50,borderTopLeftRadius:50}}>
                        <Text style={{fontSize:18, textAlign:'center',color:'white'}}>Miner fee</Text>
                    </View>
                    <View style={{padding:20}}>
                     <RadioForm
                        radio_props={radio_props}
                        initial={this.state.miner_fee-1}
                        onPress={(value) => {this.setState({miner_fee:value,show_miner_fee_modal:false})}}
                        buttonSize={20}
                        labelStyle={{fontSize: 16, color: 'white'}}
                        buttonWrapStyle={{marginTop: 40}}
                        />
                    </View>
                </View>
            </Modal> */}
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  innerContainer: {
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  itemStyle: {
    borderBottomColor: '#707070',
    flexDirection: 'row',
    paddingBottom: 15,
    paddingTop: 15,
    borderBottomWidth: 1,
  },
  resendText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fontFamily,
  },
  keyImage: {
    height: 30,
    width: 30,
    marginTop: -10,
  },
  redKeyImage: {
    position: 'absolute',
    top: '-42%',
    right: '44.5%',
    height: 30,
    width: 3,
    backgroundColor: 'red',
    zIndex: 2,
  },
  enterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '10%',
    paddingRight: 100,
    width: '100%',
    paddingTop: 20,
  },
  enterLine: {
    height: 1.2,
    backgroundColor: fontWhiteColor,
    width: '90%',
    marginTop: -5,
    marginLeft: 10,
  },
  enterPinCodeLine: {
    height: 1.2,
    backgroundColor: fontWhiteColor,
    width: '60.5%',
    marginTop: -5,
    marginLeft: 10,
    flexShrink: 0,
  },
});

function mapStateToProps(state) {
  return {
    darkmode: state.Auth.darkmode,
    user_id: state.Auth.user_id,
    pincode: state.Auth.pincode,
    name: state.Auth.user_name,
    email: state.Auth.email,
    id: state.Auth.user_id,
  };
}

export default connect(mapStateToProps, {updateBallance, setAllHistory})(
  withTheme(SendConfirmScreen),
);
