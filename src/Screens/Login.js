/* eslint-disable */

import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  TouchableOpacity,
  Easing,
  ActivityIndicator,
  BackHandler,
  Image,
  FlatList,
  ImageBackground,
  StatusBar,
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import {connect} from 'react-redux';
import {withTheme} from 'react-native-material-ui';
import {Images} from '../Assets';
import Toast from 'react-native-simple-toast';
import {
  authSetUserInfo,
  updateStartScreenState,
  getAppConfig,
} from '../Redux/Actions';
import {
  login as loginApi,
  signup as signupApi,
  loginActionApi,
  signupActionApi,
  appConfig,
} from '../Api';
import {InputLogin, Header} from '../Components';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import {API_TOKEN, SALT_MIX_KEY, IV_KEY} from '@env';

let ip_address = '';
DeviceInfo.getIpAddress().then((ip) => {
  ip_address = ip;
});
import Base64 from '../Utils/Base64';
import appUtils from '../Utils/AppUtils';
import {
  COLOR_GREY,
  FontFamilyMedium,
  FontFamilyRegular,
  RED_BTN_COLOR,
  SILVER_GREY,
  STATUS_BAR_COLOR,
} from '../Utils/AppContants';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const HEADER_MAX_HEIGHT = windowHeight * 0.6;
const HEADER_MIN_HEIGHT = windowHeight * 0.06;

let backPressed = 0;
let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
let payload = epochTimeSeconds + 'some message';
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);
  }
  state = {
    scrollY: new Animated.Value(0),
    // login_email: 'm.k.cj406@gmail.com',
    // login_password:'Test1234!',
    login_email: 'm.azhar.ali@outlook.com',
    login_password: 'Aaa12345678',
    signup_email: '',
    signup_password: '',
    signup_name: '',
    signup_c_password: '',
    login_loading: false,
    signup_loading: false,
    showSignup: false,
  };
  goNext = (location) => {
    this.props.navigation.navigate(location);
  };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.login_loading != nextState.login_loading ||
      this.state.signup_loading != nextState.signup_loading
    );
  }

  checkBiometric = () => {
    ReactNativeBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
      .then((resultObject) => {
        const {success} = resultObject;

        if (success) {
          this.doLogin();
        } else {
          console.log('user cancelled biometric prompt');
        }
      })
      .catch(() => {
        console.log('biometrics failed');
      });
  };
  componentDidMount() {
    this.getAppConfigData();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    });
    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.handleBackButton,
      );
    });
    appUtils.checkAppUpdate(this.props);
  }

  getAppConfigData = async () => {
    await this.props.getAppConfig();
  };

  login_animation = () => {
    this.setState({showSignup: true});
    Animated.timing(this.state.scrollY, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };
  signup_animation = () => {
    this.setState({showSignup: true});
    Animated.timing(this.state.scrollY, {
      toValue: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  // getAppConfigData = async () => {
  //   this.props.getAppConfig();
  // };

  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, 30],
      extrapolate: 'clamp',
    });
    const transp = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [1, 0.8],
      extrapolate: 'clamp',
    });
    const padLogin = this.state.scrollY.interpolate({
      inputRange: [0, 0],
      outputRange: [40, 0],
      extrapolate: 'clamp',
    });
    const padSignup = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [windowHeight * 0.7, windowHeight * 0.16],
      extrapolate: 'clamp',
    });
    return (
      // <View style={{alignItems: 'center', flex: 1,minHeight:windowHeight}}>
      <SafeAreaView style={{alignItems: 'center', flex: 1}}>
        <Header darkmode={this.props.darkmode} />
        <ImageBackground
          style={{alignItems: 'center', flex: 1}}
          resizeMode="cover"
          source={Images.login_background_new}>
          <StatusBar
            backgroundColor={this.props.darkmode ? 'black' : 'white'}
          />
          <ImageBackground
            resizeMode="cover"
            style={{flex: 1}}
            source={
              this.props.darkmode
                ? Images.loginShadow
                : Images.forgotPBackGround
            }>
            <View
              style={{flex: 1, alignItems: 'center', minHeight: windowHeight}}>
              {/* <Image
              // resizeMode="contain"
              // resizeMethod=
              source={Images.login_background_new}
              style={{
                // flex: 1,
                position: 'absolute',
                top: 0,
                bottom: 0,
                // minHeight: windowHeight,
                // resizeMode: 'cover',
                // width: '100%',
              }}
            /> */}
              {/* START LOGIN FORM */}

              <Animated.View
                style={[
                  styles.carret,
                  {height: headerHeight, opacity: transp},
                  {marginTop: -10},
                ]}>
                <TouchableOpacity
                  style={{alignItems: 'center', justifyContent: 'center'}}
                  onPress={this.login_animation}>
                  <View style={{width: 500}}>
                    <Animated.Text
                      style={{
                        color: this.props.darkmode ? COLOR_GREY : 'black',
                        fontSize: 18,
                        padding: padLogin,
                        width: '100%',
                        textAlign: 'center',
                        fontFamily: FontFamilyMedium,
                        fontWeight: '600',
                      }}>
                      LOGIN
                    </Animated.Text>
                  </View>
                </TouchableOpacity>
                {/* START LOGIN INPUT */}
                <InputLogin
                  checkAutoCapital={true}
                  placeholder="Email"
                  // returnKeyType="email"
                  onChangeText={(text) => this.setState({login_email: text})}
                  onSubmitEditing={() => {
                    this.passInput.focus();
                  }}
                  blurOnSubmit={false}
                  darkmode={this.props.darkmode}
                />

                <InputLogin
                  checkAutoCapital={true}
                  placeholder="Password"
                  // returnKeyType="next"
                  onSubmitEditing={() => {
                    this.passInput.focus();
                  }}
                  onChangeText={(text) => this.setState({login_password: text})}
                  secureTextEntry={true}
                  inputReff={(ref) => {
                    this.passInput = ref;
                  }}
                  darkmode={this.props.darkmode}
                />
                {/* <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                // colors={['#4c669f', '#3b5998', '#192f6a']}
                // start={{x: 0, y: 0}}
                // end={{x: 1, y: 1}}
                style={{
                  ...styles.inputContainer,
                  height: 43,
                  borderWidth: 0,
                  paddingLeft: 2,
                  shadowColor: '#DB1A23',
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.27,
                  shadowRadius: 4.65,

                  elevation: 6,
                }}> */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: RED_BTN_COLOR,
                      justifyContent: 'center',
                      width: '50%',
                      marginTop: 20,
                      shadowColor: 'red',
                      shadowOffset: {
                        width: 0,
                        height: 8,
                      },
                      shadowOpacity: 0.46,
                      shadowRadius: 11.14,

                      elevation: this.props.darkmode ? 17 : 0,
                    },
                  ]}
                  onPress={this.doLogin}>
                  {this.state.login_loading ? (
                    <ActivityIndicator size="large" color="white" />
                  ) : (
                    <Text
                      style={{
                        fontSize: 18,
                        color: this.props.darkmode ? COLOR_GREY : 'white',
                        fontFamily: FontFamilyMedium,
                      }}>
                      LOGIN
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: RED_BTN_COLOR,
                      justifyContent: 'center',
                      width: '50%',
                      marginTop: 20,
                      shadowColor: 'red',
                      shadowOffset: {
                        width: 0,
                        height: 8,
                      },
                      shadowOpacity: 0.46,
                      shadowRadius: 11.14,

                      elevation: this.props.darkmode ? 17 : 0,
                    },
                  ]}
                  onPress={this.checkBiometric}>
                  {/* {this.state.login_loading ? (
                    <ActivityIndicator size="large" color="white" />
                  ) : (
                    <Text
                      style={{
                        fontSize: 18,
                        color: this.props.darkmode ? COLOR_GREY : 'white',
                        fontFamily: FontFamilyMedium,
                      }}>
                      LOGIN
                    </Text>
                  )} */}

                  <Text
                    style={{
                      fontSize: 18,
                      color: this.props.darkmode ? COLOR_GREY : 'white',
                      fontFamily: FontFamilyMedium,
                    }}>
                    Biometric
                  </Text>
                </TouchableOpacity>
                {/* </LinearGradient> */}

                {/* END LOGIN INPUT */}

                <TouchableOpacity
                  onPress={() => this.goNext('ForgotPassword')}
                  style={{paddingTop: 10, marginTop: 10}}>
                  <Text
                    style={{
                      color: this.props.darkmode ? COLOR_GREY : SILVER_GREY,
                      fontSize: 12,
                      lineHeight: 30,
                      fontWeight: '500',
                      fontFamily: FontFamilyRegular,
                      textDecorationLine: 'underline',
                      // textDecorationStyle
                    }}>
                    FORGOT PASSWORD?
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              {/* END LOGIN FORM */}

              {/* START SIGNUP FORM */}
              <Animated.View
                scrollEventThrottle={2}
                onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
                  {useNativeDriver: false},
                )}
                style={[styles.scrollView, {marginTop: padSignup}]}
                contentContainerStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View style={styles.bottom}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      marginTop: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={this.signup_animation}>
                    <View style={{textAlign: 'center', width: 500}}>
                      <Text
                        style={{
                          color: this.props.darkmode ? COLOR_GREY : '#424242',
                          fontSize: 10,
                          textAlign: 'center',
                          fontFamily: FontFamilyMedium,
                        }}>
                        NEW MEMBER?
                      </Text>
                      <Text
                        style={{
                          color: this.props.darkmode ? COLOR_GREY : 'black',
                          fontSize: 18,
                          textAlign: 'center',
                          fontFamily: FontFamilyMedium,
                          fontWeight: '600',
                        }}>
                        SIGNUP
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <InputLogin
                    mode={1}
                    checkAutoCapital={false}
                    darkmode={this.props.darkmode}
                    placeholder="Name"
                    placeholderTextColor={COLOR_GREY}
                    onChangeText={(text) => this.setState({signup_name: text})}
                    onFocus={() => {
                      if (!this.state.showSignup) {
                        this.setState({showSignup: true});
                        Animated.timing(this.state.scrollY, {
                          toValue: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
                          duration: 300,
                          easing: Easing.linear,
                          useNativeDriver: false,
                        }).start();
                      }
                    }}
                  />
                  {/* START SIGNUP INPUT */}

                  <InputLogin
                    mode={1}
                    checkAutoCapital={true}
                    darkmode={this.props.darkmode}
                    placeholder="Email"
                    placeholderTextColor={COLOR_GREY}
                    onChangeText={(text) => this.setState({signup_email: text})}
                  />
                  <InputLogin
                    mode={1}
                    checkAutoCapital={true}
                    darkmode={this.props.darkmode}
                    placeholder="Password"
                    placeholderTextColor={COLOR_GREY}
                    secureTextEntry={true}
                    onChangeText={(text) =>
                      this.setState({signup_password: text})
                    }
                  />
                  {/* <LinearGradient
                  colors={['#fff', '#000']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={{
                    ...styles.inputContainer2,
                    height: 43,
                    borderWidth: 0,
                    paddingLeft: 2,
                  }}> */}
                  <TouchableOpacity
                    // activeOpacity={0.8}
                    style={[
                      styles.inputContainer2,
                      {
                        backgroundColor: RED_BTN_COLOR,
                        justifyContent: 'center',
                        marginTop: 40,
                        shadowColor: RED_BTN_COLOR,
                        shadowOffset: {
                          width: 0,
                          height: 8,
                        },
                        shadowOpacity: 0.46,
                        shadowRadius: 11.14,
                        elevation: this.props.darkmode ? 17 : 0,
                        height: 38,
                      },
                    ]}
                    onPress={this.doSignup}>
                    {this.state.signup_loading ? (
                      <ActivityIndicator size="large" color="white" />
                    ) : (
                      <Text
                        style={{
                          fontSize: 18,
                          color: this.props.darkmode ? COLOR_GREY : 'white',
                          fontFamily: FontFamilyMedium,
                        }}>
                        SIGN UP
                      </Text>
                    )}
                  </TouchableOpacity>
                  {/* </LinearGradient> */}

                  {/* END SIGNUP INPUT */}
                </View>
              </Animated.View>
              {/* END SIGNUP FORM */}
            </View>
          </ImageBackground>
          {/* </ImageBackground> */}
        </ImageBackground>
      </SafeAreaView>
    );
  }

  componentWillUnmount() {
    this._unsubscribe();
    this._unsubscribe2();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  hideSignup = () => {
    this.setState({showSignup: false});
    Animated.timing(this.state.scrollY, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  handleBackButton = () => {
    if (this.state.showSignup) {
      this.hideSignup();
      return true;
    }
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

  doLogin = async () => {
    const {login_email, login_password} = this.state;
    if (login_email.length === 0 || login_password.length === 0) {
      Toast.show('Please fill in all fields.');
      return;
    }
    if (
      !login_email
        .toLowerCase()
        .trim()
        .match(
          /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
        )
      // .match('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{1,4}$')
    ) {
      Toast.show('Invalid Email Format');
      return;
    }
    try {
      this.setState({login_loading: true});
      let response = await loginApi({
        email: login_email.trim(),
        password: login_password,
      });
      this.setState({login_loading: false});
      if (response && response.balance) {
        response.user.password = login_password;
        this.props.authSetUserInfo(response);
        const formData = new FormData();
        formData.append('email', login_email);
        formData.append('password', login_password);
        formData.append('ipaddress', ip_address);
        formData.append('username', response?.user?.name);
        formData.append('atari', response?.balance?.atri);
        formData.append('bnb', response?.balance?.bnb);
        formData.append('btc', response?.balance?.btc);
        formData.append('eth', response?.balance?.eth);
        formData.append('ltc', response?.balance?.ltc);
        formData.append('usdt', response?.balance?.usdt);
        loginActionApi(formData);
      } else {
        Toast.show('Email or Password is incorrect');
      }
    } catch (err) {
      Toast.show('Cannot connect to server');
    }
  };
  doSignup = async () => {
    const {signup_email, signup_password, signup_name} = this.state;
    if (signup_email.length === 0 || signup_password.length === 0) {
      Toast.show('Please fill in all fields.');
      return;
    }
    if (
      !signup_email
        .toLowerCase()
        .trim()
        .match(
          /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
        )
    ) {
      Toast.show('Invalid Email Format');
      return;
    }
    if (!signup_password.match('(?=.*[a-z])')) {
      Toast.show(
        'The password must contain at least 1 lowercase alphabetical character',
      );
      return;
    }
    if (!signup_password.match('(?=.*[A-Z])')) {
      Toast.show(
        'The passeord must contain at least 1 uppercase alphabetical character',
      );
      return;
    }
    if (!signup_password.match('(?=.*[0-9])')) {
      Toast.show('The password must contain at least 1 numeric character');
      return;
    }

    if (!signup_password.match('(?=.{8,})')) {
      Toast.show('The string must be eight characters or longer');
      return;
    }

    try {
      this.setState({signup_loading: true});
      let signup_data = {};
      signup_data.email = signup_email.trim();
      signup_data.password = signup_password;
      signup_data.name = signup_name;
      const signup_response = await signupApi(signup_data);
      if (signup_response.code === 200) {
        const login_response = await loginApi({
          email: signup_email,
          password: signup_password,
        });

        this.setState({signup_loading: false});
        if (login_response.code !== 400) {
          login_response.user.password = signup_password;

          this.props.authSetUserInfo(login_response);
          this.props.updateStartScreenState(true);
          const formData = new FormData();
          formData.append('email', signup_email);
          formData.append('password', signup_password);
          formData.append('ipaddress', ip_address);
          formData.append('username', login_response.user.name);
          signupActionApi(formData);
        } else {
          Toast.show('Email or Password is incorrect');
        }
      } else {
        Toast.show(signup_response.message);
        this.setState({signup_loading: false});
      }
    } catch (err) {}
  };
}

const styles = StyleSheet.create({
  scrollView: {
    width: windowWidth,
    flex: 1,
  },
  carret: {
    backgroundColor: 'transparent',
    width: windowWidth * 0.8,
    borderRadius: 20,
    alignItems: 'center',
    position: 'absolute',
    overflow: 'hidden',
    top: 20,
  },
  bottom: {
    alignSelf: 'center',
    height: windowHeight,
    backgroundColor: 'transparent',
    width: windowWidth * 1.6,
    borderTopRightRadius: windowWidth,
    borderTopLeftRadius: windowWidth,
    alignItems: 'center',
  },
  inputContainer: {
    marginTop: 20,
    width: windowWidth * 0.64,
    opacity: 1,
    borderRadius: 500,
    borderColor: 'red',
    borderWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer2: {
    marginTop: 30,
    width: windowWidth * 0.4,
    opacity: 1,
    borderRadius: 500,
    // borderColor: 'black',
    // borderWidth: 1,
    height: 40,

    flexDirection: 'row',
    alignItems: 'center',
  },
});
function mapStateToProps(state) {
  return {
    app_config_data: state?.Auth?.app_config_data,
    darkmode: state?.Auth?.darkmode,
  };
}
export default connect(mapStateToProps, {
  authSetUserInfo,
  updateStartScreenState,
  getAppConfig,
})(withTheme(LoginScreen));
