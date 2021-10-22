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
import {resetPassword} from '../Api';
import {update_verifyToken} from '../Redux/Actions';
import {Header} from '../Components';
import {
  COLOR_GREY,
  FontFamilyMedium,
  RED_BTN_COLOR,
  SILVER_GREY_RGBA,
  TRANSPARENT_COLOR,
} from '../Utils/AppContants';

class ResetPasswordScreen extends React.Component {
  state = {
    password: '',
    c_password: '',
    button_loading: false,
    verify_token: '',
  };

  static getDerivedStateFromProps(props, state) {
    return {
      verify_token: props.verify_token,
    };
  }
  render() {
    const {thirdcolor} = this.props.theme.palette;
    const {password, c_password, button_loading} = this.state;
    return (
      <SafeAreaView
        style={{...CustomStyles.container, backgroundColor: 'rgb(33,33,33)'}}>
        <ImageBackground
          source={
            this.props.darkmode
              ? Images.dashBoardBackImage
              : Images.forgotPBackGround
          }
          style={{flex: 1}}>
          <Header darkmode={this.props.darkmode} />
          <View
            style={{
              justifyContent: 'center',
              backgroundColor: this.props.darkmode
                ? TRANSPARENT_COLOR
                : 'white',
              margin: 15,
              paddingTop: 20,
              height: '75%',
              marginTop: 20,
              borderRadius: 7,
            }}>
            <View style={[CustomStyles.container]}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  resizeMode="contain"
                  source={
                    this.props.darkmode ? Images.white_lock : Images.blacklock
                  }
                  style={{height: 100, width: 100}}
                />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 55,
                  textAlign: 'center',
                  color: this.props.darkmode ? 'white' : 'black',
                  marginBottom: 25,
                  fontFamily: FontFamilyMedium,
                  textTransform: 'uppercase',
                }}>
                Reset Password
              </Text>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{...styles.customWriting}}>
                  Please Input Password
                </Text>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TextInput
                  value={password}
                  style={{
                    ...styles.textInput,
                    marginBottom: 20,
                    color: this.props.darkmode ? 'white' : 'black',
                    borderColor: this.props.darkmode ? COLOR_GREY : 'black',
                  }}
                  onChangeText={(text) => this.setState({password: text})}
                  secureTextEntry={true}
                  placeholder="Type your password"
                  placeholderTextColor={
                    this.props.darkmode ? 'rgba(255,255,255,0.3)' : COLOR_GREY
                  }
                />

                <TextInput
                  value={c_password}
                  style={{
                    ...styles.textInput,
                    marginBottom: 20,
                    color: this.props.darkmode ? 'white' : 'black',
                    borderColor: this.props.darkmode ? COLOR_GREY : 'black',
                    // fontFamily: c_password === "" ? FontFamilyMedium
                  }}
                  onChangeText={(text) => this.setState({c_password: text})}
                  secureTextEntry={c_password === '' ? false : true}
                  placeholder="Retype your password"
                  placeholderTextColor={
                    this.props.darkmode ? 'rgba(255,255,255,0.3)' : COLOR_GREY
                  }
                />
                <TouchableOpacity
                  onPress={this.goNext}
                  style={{
                    backgroundColor: RED_BTN_COLOR,
                    width: '65%',
                    padding: 9,
                    borderRadius: 100,
                    textAlign: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 10},
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    marginTop: 20,
                  }}>
                  {this.state.button_loading ? (
                    <ActivityIndicator size="large" color="white" />
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        color: 'white',
                        textAlign: 'center',
                        fontFamily: FontFamilyMedium,
                        textTransform: 'uppercase',
                      }}>
                      Change Password
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
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
  goNext = async () => {
    const {c_password, password, verify_token} = this.state;
    if (
      c_password.length === 0 ||
      password.length === 0 ||
      c_password !== password
    ) {
      Toast.show('Confirm password is not match. Please check again');
      return;
    }

    try {
      let data = {newPass: password, token: verify_token};
      this.setState({button_loading: true});
      const response = await resetPassword(data);
      if (response.code === 200) {
        Toast.show('Your password has been changed.');
        this.props.navigation.navigate('Login');
      } else {
        Toast.show(response.message);
      }
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
    color: COLOR_GREY,
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
    fontSize: 14,
    fontFamily: FontFamilyMedium,
  },
});
function mapStateToProps(state) {
  return {
    verify_token: state.Auth.verify_token,
    darkmode: state?.Auth?.darkmode,
  };
}
export default connect(mapStateToProps, {update_verifyToken})(
  withTheme(ResetPasswordScreen),
);
