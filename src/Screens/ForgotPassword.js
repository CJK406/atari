/* eslint-disable */

import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import {withTheme} from 'react-native-material-ui';
import {Images} from '../Assets';
import {CustomStyles} from '../Constant';
import Toast from 'react-native-simple-toast';
import {forgetPassword} from '../Api';
import {update_verifyToken} from '../Redux/Actions';
import {
  COLOR_GREY,
  FontFamilyMedium,
  FontFamilyRegular,
  SILVER_GREY,
  STATUS_BAR_COLOR,
  TRANSPARENT_COLOR,
} from '../Utils/AppContants';

import {Header} from '../Components';

class ForgotPasswordScreen extends React.Component {
  state = {
    email: '',
    button_loading: false,
  };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.email != nextState.email ||
      this.state.button_loading != nextState.button_loading
    );
  }
  render() {
    const {thirdcolor} = this.props.theme.palette;
    const {email} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header darkmode={this.props.darkmode} />
        <ImageBackground
          resizeMode="cover"
          source={
            this.props.darkmode
              ? Images.login_background_new
              : Images.forgotPBackGround
          }
          style={[CustomStyles.container, CustomStyles.innerContainer]}>
          <StatusBar
            backgroundColor={this.props.darkmode ? 'black' : STATUS_BAR_COLOR}
            barStyle={this.props.darkmode ? 'light-content' : 'dark-content'}
          />
          <View
            style={{
              backgroundColor: this.props.darkmode
                ? TRANSPARENT_COLOR
                : 'white',
              padding: 20,
              // marginTop: -30,
              borderRadius: 8,
            }}>
            <View style={styles.lock_container}>
              <Image
                style={styles.lock_image}
                source={
                  this.props.darkmode ? Images.white_lock : Images.redForgotLock
                }
              />
            </View>
            <Text
              style={{
                fontSize: 20,
                lineHeight: 28,
                textAlign: 'center',
                color: this.props.darkmode ? 'white' : 'black',
                marginBottom: 35,
                fontFamily: FontFamilyMedium,
              }}>
              FORGOT PASSWORD
            </Text>
            <View style={styles.descContainer}>
              <Text
                style={{
                  ...styles.customWriting,
                  color: this.props.darkmode ? COLOR_GREY : '#454545',
                }}>
                We just need your registered email to send you password reset
                instructions
              </Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View
                style={{
                  ...CustomStyles.forgetPasswordInputContainer,

                  borderColor: COLOR_GREY,
                }}>
                <TextInput
                  value={email}
                  style={{
                    ...CustomStyles.textInput,
                    color: this.props.darkmode ? 'white' : 'black',
                    borderRadius: 500,
                    width: '100%',
                    fontWeight: 'normal',
                    fontFamily: FontFamilyMedium,
                    fontSize: 14,
                  }}
                  autoCapitalize="none"
                  onChangeText={(text) => this.setState({email: text})}
                  autoCompleteType="email"
                  keyboardType="email-address"
                  placeholder="Email"
                  placeholderTextColor={
                    this.props.darkmode ? 'rgba(255,255,255,0.3)' : COLOR_GREY
                  }
                />
              </View>
              <TouchableOpacity
                onPress={this.goNext}
                style={{
                  backgroundColor: 'rgb(227,30,45)',
                  // width: '%',
                  padding: 10,
                  paddingLeft: 30,
                  paddingRight: 30,
                  borderRadius: 500,
                  textAlign: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 10},
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                }}>
                {this.state.button_loading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text
                    style={{
                      fontSize: 14,
                      color: this.props.darkmode ? 'white' : 'white',
                      textAlign: 'center',
                      fontFamily: FontFamilyMedium,
                    }}>
                    SEND EMAIL
                  </Text>
                )}

                {/* <Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>SEND EMAIL</Text> */}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.goBack}
                style={{
                  marginTop: 60,
                  borderRadius: 10,

                  ...CustomStyles.buttonStyle,
                  ...CustomStyles.smallBtn,
                  ...CustomStyles.longBtn,
                  backgroundColor: thirdcolor,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: this.props.darkmode ? SILVER_GREY : COLOR_GREY,
                    lineHeight: 33,
                    // letterSpacing: 1,
                    textDecorationLine: 'underline',
                    fontFamily: FontFamilyMedium,
                  }}>
                  BACK TO LOGIN
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
  goNext = async () => {
    const {email} = this.state;
    if (email.length === 0) {
      Toast.show('Please fill in all fields.');
      return;
    }
    if (
      !email
        .toLowerCase()
        .trim()
        .match(
          /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
        )
    ) {
      Toast.show('Invalid Email Format');
      return;
    }
    try {
      let data = {email: email.trim()};
      this.setState({button_loading: true});
      const response = await forgetPassword(data);
      console.log('response ', response);
      // if (response.code === 200) {
      //   const verify_code = response.body.verify_code;
      //   const verify_token = response.body.token;
      //   const verify_email = email.trim();
      //   const data = {
      //     verify_code: verify_code,
      //     verify_token: verify_token,
      //     verify_email: verify_email.trim(),
      //   };
      //   Toast.show(
      //     'Email has been sent at ' +
      //       email +
      //       ', kindly follow the instruction ',
      //   );

      //   this.props.update_verifyToken(data);
      //   this.props.navigation.navigate('VerifyCode');
      // } else {
      //   Toast.show(response.message);
      // }
      this.setState({button_loading: false});
    } catch (err) {}
  };
  goBack = () => {
    this.props.navigation.navigate('Login');
  };
}
const styles = StyleSheet.create({
  customWriting: {
    fontSize: 13,
    lineHeight: 22,
    letterSpacing: 2,
    color: SILVER_GREY,
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: FontFamilyRegular,
  },
  lock_container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  lock_image: {
    height: 60,
    width: 60,
    resizeMode: 'contain',
  },

  descContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
function mapStateToProps(state) {
  return {
    darkmode: state?.Auth?.darkmode,
  };
}
export default connect(mapStateToProps, {update_verifyToken})(
  withTheme(ForgotPasswordScreen),
);
