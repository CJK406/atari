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
import {COLOR_GREY, FontFamilyMedium} from '../Utils/AppContants';

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
      <SafeAreaView
        style={{...CustomStyles.container, backgroundColor: 'rgb(33,33,33)'}}>
        <ImageBackground
          source={Images.login_background_new}
          style={[CustomStyles.container, CustomStyles.innerContainer]}>
          <View style={{backgroundColor: 'rgba(30, 3, 4, 0.8)', padding: 20}}>
            <View style={styles.lock_container}>
              <Image style={styles.lock_image} source={Images.white_lock} />
            </View>
            <Text
              style={{
                fontSize: 20,
                lineHeight: 28,
                textAlign: 'center',
                color: 'white',
                marginBottom: 35,
                fontFamily: FontFamilyMedium,
              }}>
              FORGET PASSWORD
            </Text>
            <View style={styles.descContainer}>
              <Text style={{...styles.customWriting}}>
                We just need your registered email to send you password reset
                instructions
              </Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={{...CustomStyles.forgetPasswordInputContainer}}>
                <TextInput
                  value={email}
                  style={{
                    ...CustomStyles.textInput,
                    color: 'white',
                    borderRadius: 500,
                    width: '100%',
                  }}
                  onChangeText={(text) => this.setState({email: text})}
                  autoCompleteType="email"
                  keyboardType="email-address"
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                />
              </View>
              <TouchableOpacity
                onPress={this.goNext}
                style={{
                  backgroundColor: 'rgb(227,30,45)',
                  // width: '%',
                  padding: 10,
                  paddingLeft: 20,
                  paddingRight: 20,
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
                      fontWeight: 'bold',
                      fontSize: 18,
                      color: 'white',
                      textAlign: 'center',
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
                    color: COLOR_GREY,
                    lineHeight: 33,
                    letterSpacing: 1,
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
        .match(
          /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
        )
    ) {
      Toast.show('Invalid Email Format');
      return;
    }
    try {
      let data = {email: email};
      this.setState({button_loading: true});
      const response = await forgetPassword(data);
      if (response.code === 200) {
        const verify_code = response.body.verify_code;
        const verify_token = response.body.token;
        const data = {verify_code: verify_code, verify_token: verify_token};
        Toast.show(
          'Email has been sent at ' +
            email +
            ', kindly follow the instruction ',
        );

        this.props.update_verifyToken(data);
        this.props.navigation.navigate('VerifyCode');
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
  return {};
}
export default connect(mapStateToProps, {update_verifyToken})(
  withTheme(ForgotPasswordScreen),
);
