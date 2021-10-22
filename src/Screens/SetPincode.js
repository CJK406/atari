import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  View,
  ImageBackground,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import {withTheme} from 'react-native-material-ui';
import {Images} from '../Assets';
import {CustomStyles} from '../Constant';
import Toast from 'react-native-simple-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {authSetPincode} from '../Redux/Actions';
import {InputPin, Header} from '../Components';
import {
  COLOR_GREY,
  FontFamilyMedium,
  TRANSPARENT_COLOR,
} from '../Utils/AppContants';

class SetPincodeScreen extends React.Component {
  state = {
    pincode: null,
    loading: false,
    codePin: '',
    user_id: '',
  };
  static getDerivedStateFromProps(props, state) {
    return {
      pincode: props.pincode,
      user_id: props.user_id,
    };
  }
  goNext(page) {
    this.props.navigation.navigate(page);
  }

  SetPin = () => {
    const {codePin, user_id} = this.state;
    let pincode = codePin;
    let data = {pinCode: pincode, id: user_id};
    if (codePin !== '' && codePin.length === 6) {
      this.setState({
        loading: true,
      });
      this.props.authSetPincode(data);
    } else {
      Toast.show('Please fill up all the cells properly.');
    }
  };
  render() {
    return (
      <SafeAreaView
        style={{...CustomStyles.container, backgroundColor: 'rgb(33,33,33)'}}>
        <StatusBar
          barStyle={this.props.darkmode ? 'light-content' : 'dark-content'}
          backgroundColor={this.props.darkmode ? 'black' : 'white'}
        />
        {/* <KeyboardAwareScrollView> */}
        <ImageBackground
          style={{flex: 1}}
          source={
            this.props.darkmode
              ? Images.login_background_new
              : Images.forgotPBackGround
          }>
          {/* <View style={[CustomStyles.container]}> */}
          <Header darkmode={this.props.darkmode} />
          <View
            style={{
              backgroundColor: this.props.darkmode
                ? TRANSPARENT_COLOR
                : 'white',
              marginTop: 30,
              margin: 10,
              paddingBottom: 15,
            }}>
            <View>
              <Text
                style={{
                  color: this.props.darkmode ? 'white' : 'black',
                  fontSize: 18,
                  textAlign: 'center',
                  marginTop: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  fontFamily: FontFamilyMedium,
                }}>
                Set your pin code
              </Text>
              <Text
                style={{
                  color: this.props.darkmode ? 'white' : 'black',
                  fontSize: 12,
                  width: '90%',
                  textAlign: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: 10,
                  marginBottom: 40,
                  fontFamily: FontFamilyMedium,
                }}>
                Will be requested when making a transaction
              </Text>
            </View>
            <View
              style={{
                marginTop: 20,
                paddingBottom: 20,
                justifyContent: 'center',
                flex: 1,
                alignItems: 'center',
              }}>
              <InputPin
                value={this.state.codePin}
                codeLength={6}
                cellStyle={{
                  backgroundColor: this.props.darkmode
                    ? COLOR_GREY
                    : COLOR_GREY,
                  borderColor: 'gray',
                }}
                cellStyleFocused={{
                  borderColor: 'black',
                  backgroundColor: COLOR_GREY,
                }}
                onTextChange={(code) => this.setState({codePin: code})}
                textStyle={{fontSize: 24, color: 'black'}}
                // onFulfill={() => {
                //     Keyboard.dismiss();
                // }}
              />
            </View>
            <TouchableOpacity
              onPress={this.SetPin}
              style={{
                backgroundColor: 'rgb(227,30,45)',
                width: '60%',
                marginBottom: 20,
                textAlign: 'center',
                justifyContent: 'center',
                padding: 20,
                borderRadius: 10,
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: 80,
              }}>
              {this.state.loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    color: 'white',
                    textAlign: 'center',
                    justifyContent: 'center',
                    fontFamily: FontFamilyMedium,
                    textTransform: 'uppercase',
                  }}>
                  Verify
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {/* </View> */}
        </ImageBackground>
        {/* </KeyboardAwareScrollView> */}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  customWriting: {
    fontSize: 18,
    color: '#7882A2',
    marginBottom: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
});
function mapStateToProps(state) {
  return {
    pincode: state.Auth.pincode,
    user_id: state.Auth.user_id,
    darkmode: state.Auth.darkmode,
  };
}
export default connect(mapStateToProps, {authSetPincode})(
  withTheme(SetPincodeScreen),
);
