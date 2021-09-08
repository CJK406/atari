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
    // this.sendOTPCode();
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
      } else if (input_pincode !== user_pincode) {
        this.awesomeAlert.showAlert(
          'error',
          'Failed!',
          'Pincode is not correct',
        );
      } else {
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
        console.log('atari send', data);
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
                height: 70,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                backgroundColor: darkmode ? 'black' : 'white',
                width: '100%',
              }}>
              <TouchableOpacity
                style={{position: 'absolute', left: 10}}
                onPress={this.goBack}>
                <Ionicons
                  name="arrow-back-outline"
                  size={20}
                  color={darkmode ? 'white' : 'black'}
                />
              </TouchableOpacity>
              <Image source={Images.Logo} style={{width: 160, height: 50}} />
            </View>
            <View style={{padding: 20}}>
              <Text style={{fontSize: 25, color: darkmode ? 'white' : 'black'}}>
                Confirm Payment
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: darkmode ? 'white' : 'black',
                  marginTop: 20,
                }}>
                SUMMARY
              </Text>
              {console.log('pin code', this.state.pincode)}
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  borderBottomWidth: 2,
                  borderBottomColor: darkmode ? '#333333' : 'gray',
                  paddingBottom: 20,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    width: '50%',
                    fontSize: 20,
                    letterSpacing: 1,
                    color: darkmode ? 'white' : 'black',
                  }}>
                  Sending to
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    borderRadius: 10,
                    padding: 2,
                    paddingLeft: 10,
                    backgroundColor: '#3a3a3a',
                  }}>
                  <Image
                    source={Headers[info.currentTab]['Image']}
                    style={{
                      width: 14,
                      height: 14,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      alignItems: 'center',
                      maxWidth: '50%',
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingLeft: 10,
                      paddingRight: 20,
                    }}>
                    <Text style={{color: 'white', width: 60}} numberOfLines={1}>
                      {leftText}
                    </Text>
                    <Text style={{color: 'white'}} numberOfLines={1}>
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
                  marginTop: 20,
                  borderBottomWidth: 2,
                  borderBottomColor: darkmode ? '#333333' : 'gray',
                  paddingBottom: 20,
                }}>
                <Text
                  style={{
                    marginBottom: 20,
                    fontSize: 20,
                    letterSpacing: 1,
                    color: darkmode ? 'white' : 'black',
                  }}>
                  Enter your pincode*
                </Text>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
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
                      color: darkmode ? 'black' : 'white',
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                  borderBottomWidth: 2,
                  borderBottomColor: darkmode ? '#333333' : 'gray',
                  paddingBottom: 5,
                }}>
                <Text
                  style={{
                    marginBottom: 20,
                    fontSize: 20,
                    letterSpacing: 1,
                    color: darkmode ? 'white' : 'black',
                  }}>
                  Enter OTP*
                </Text>
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
                    width: '40%',
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
                      fontSize: 18,
                      color: this.state.timer === 1 ? 'white' : '#696969',
                      textAlign: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                    }}>
                    {this.state.isShowOtpProgress ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      'Resend OTP'
                    )}
                  </Text>
                </TouchableOpacity>

                {this.state.timer === 1 ? null : (
                  <Text style={styles.resendText}>
                    Resend code in {this.secondsToHms(this.state.timer)}
                  </Text>
                )}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  marginBottom: 30,
                  borderBottomWidth: 2,
                  borderBottomColor: darkmode ? '#333333' : 'gray',
                  paddingBottom: 20,
                }}>
                <Text
                  style={{
                    width: '50%',
                    fontSize: 20,
                    letterSpacing: 1,
                    color: darkmode ? 'white' : 'black',
                  }}>
                  TOTAL AMOUNT
                </Text>
                <View
                  style={{
                    width: '50%',
                    textAlign: 'right',
                    justifyContent: 'flex-end',
                    alignSelf: 'flex-end',
                    alignItems: 'flex-end',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '700',
                      marginBottom: 5,
                      color: darkmode ? 'white' : 'black',
                    }}>
                    {info.send_amount} {Headers[info.currentTab]['text']}
                  </Text>
                  <Text
                    style={{fontSize: 17, color: darkmode ? 'white' : 'black'}}>
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
                  padding: 20,
                  alignSelf: 'center',
                  borderRadius: 10,
                  textAlign: 'center',
                  justifyContent: 'center',
                }}>
                {this.state.isLoading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text
                    style={{
                      fontSize: 18,
                      color: 'white',
                      textAlign: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
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
  },
});

function mapStateToProps(state) {
  console.log('state.Auth.pincode', state.Auth.pincode);
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
