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
} from 'react-native';
import {connect} from 'react-redux';
import {withTheme} from 'react-native-material-ui';
import {Images} from '../Assets';
import {CustomStyles} from '../Constant';
import Toast from 'react-native-simple-toast';
import {forgetPassword} from '../Api';
import {update_verifyToken} from '../Redux/Actions';
import {Header} from '../Components';
import {
  COLOR_GREY,
  FontFamilyMedium,
  SILVER_GREY_RGBA,
  RED_BTN_COLOR,
  TRANSPARENT_COLOR,
} from '../Utils/AppContants';

class VerifyCodeScreen extends React.Component {
  state = {
    insert_verify_code: '',
    verify_code: '',
    verify_token: '',
    button_loading: false,
  };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.insert_verify_code != nextState.insert_verify_code ||
      this.state.button_loading != nextState.button_loading
    );
  }
  static getDerivedStateFromProps(props, state) {
    return {
      verify_code: props.verify_code,
      verify_token: props.verify_token,
    };
  }
  render() {
    const {thirdcolor} = this.props.theme.palette;
    const {insert_verify_code, verify_code, button_loading} = this.state;

    return (
      <SafeAreaView
        style={{...CustomStyles.container, backgroundColor: TRANSPARENT_COLOR}}>
        <ImageBackground
          style={{flex: 1}}
          source={
            this.props.darkmode
              ? Images.dashBoardBackImage
              : Images.forgotPBackGround
          }>
          <Header darkmode={this.props.darkmode} />
          <View
            style={{
              justifyContent: 'center',
              backgroundColor: this.props.darkmode
                ? TRANSPARENT_COLOR
                : 'white',
              margin: 15,
              paddingTop: 30,
              height: '78%',
              marginTop: 20,
              borderRadius: 7,
            }}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                style={{height: 100, width: 100}}
                resizeMode="contain"
                source={
                  this.props.darkmode ? Images.white_lock : Images.blacklock
                }
              />
            </View>
            <Text
              style={{
                fontSize: 22,
                lineHeight: 55,
                textAlign: 'center',
                color: this.props.darkmode ? 'white' : 'black',
                marginBottom: 25,
                fontFamily: FontFamilyMedium,
                textTransform: 'uppercase',
              }}>
              Verify Code
            </Text>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  ...styles.customWriting,
                  color: this.props.darkmode ? 'white' : 'black',
                }}>
                Please enter the verification code sent to your email.
              </Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TextInput
                value={insert_verify_code}
                style={{
                  ...styles.textInput,
                  marginBottom: 20,
                  color: this.props.darkmode ? 'white' : 'black',
                }}
                onChangeText={(text) =>
                  this.setState({insert_verify_code: text})
                }
                placeholder="Verify Code"
                placeholderTextColor={
                  this.props.darkmode ? SILVER_GREY_RGBA : COLOR_GREY
                }
              />
              <TouchableOpacity
                onPress={this.goNext}
                style={{
                  backgroundColor: RED_BTN_COLOR,
                  justifyContent: 'center',
                  marginTop: 40,
                  shadowOffset: {
                    width: 0,
                    height: 8,
                  },
                  shadowOpacity: 0.46,
                  shadowRadius: 11.14,
                  width: '60%',
                  height: 35,
                  borderRadius: 100,
                }}>
                {this.state.button_loading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text
                    style={{
                      fontSize: 18,
                      color: 'white',
                      textAlign: 'center',
                      fontFamily: FontFamilyMedium,
                    }}>
                    NEXT
                  </Text>
                )}

                {/* <Text style={{fontSize: 18,color:'white',textAlign:'center',justifyContent:'center',fontWeight:'bold'}}>SEND EMAIL</Text> */}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.goBack}
                style={{
                  marginTop: 20,
                  borderRadius: 10,
                  ...CustomStyles.buttonStyle,
                  ...CustomStyles.smallBtn,
                  ...CustomStyles.longBtn,
                  backgroundColor: thirdcolor,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    marginTop: 20,
                    textDecorationLine: 'underline',
                    color: SILVER_GREY_RGBA,
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
    const {verify_code, insert_verify_code, verify_token} = this.state;
    if (insert_verify_code.length === 0) {
      Toast.show('Please fill in fields.');
      return;
    }
    if (verify_code !== insert_verify_code) {
      Toast.show('The verify code is not correct. Please check again');
      return;
    }
    try {
      this.props.navigation.navigate('ResetPassword');
    } catch (err) {}
  };
  goBack = () => {
    this.props.navigation.navigate('Login');
  };
}
const styles = StyleSheet.create({
  customWriting: {
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    width: '70%',
    fontFamily: FontFamilyMedium,
  },
  textInput: {
    borderWidth: 1,
    // borderColor: '#7070701f',
    borderColor: COLOR_GREY,
    width: '80%',
    borderRadius: 500,
    padding: 10,
    // backgroundColor: '',
    paddingLeft: 30,
    color: '#7882A2',
    fontSize: 12,
    fontFamily: FontFamilyMedium,
  },
});
function mapStateToProps(state) {
  return {
    verify_code: state.Auth.verify_code,
    verify_token: state.Auth.verify_token,
    darkmode: state?.Auth?.darkmode,
  };
}
export default connect(mapStateToProps, {update_verifyToken})(
  withTheme(VerifyCodeScreen),
);
