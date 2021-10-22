/* eslint-disable */

import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import {withTheme} from 'react-native-material-ui';
import {CustomStyles} from '../Constant';
import {Header} from '../Components';
import {Images} from '../Assets';
import {reset_pin} from '../Api';
import Toast from 'react-native-simple-toast';
import {
  COLOR_GREY,
  FontFamilyMedium,
  SILVER_GREY_RGBA,
  TRANSPARENT_COLOR,
} from '../Utils/AppContants';

class ResetPinScreen extends React.Component {
  state = {
    darkmode: true,
    loading: false,
  };
  static getDerivedStateFromProps(props, state) {
    return {
      darkmode: props.darkmode,
    };
  }
  goBack = () => {
    this.props.navigation.goBack();
  };
  reset_pin = async () => {
    this.setState({
      loading: true,
    });
    const result = await reset_pin();
    Toast.show('Your pin has been successfully set to you email');
    this.setState({
      loading: false,
    });
  };
  render() {
    const {darkmode} = this.state;
    return (
      <SafeAreaView
        style={{
          ...CustomStyles.container,
          backgroundColor: darkmode ? 'rgb(33,33,33)' : 'white',
        }}>
        <ImageBackground
          style={{flex: 1}}
          source={darkmode ? Images.lightAtariBack : Images.forgotPBackGround}>
          <Header darkmode={darkmode} />
          <View style={[CustomStyles.container]}>
            {/* <View
            style={{
              backgroundColor: darkmode ? 'black' : 'white',
              height: 74,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
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
            <Text style={{fontSize: 18, color: darkmode ? 'white' : 'black'}}>
              Reset Pincode
            </Text>
          </View> */}
            <View
              style={{
                backgroundColor: darkmode ? TRANSPARENT_COLOR : 'white',
                position: 'absolute',
                width: '100%',
                bottom: 0,
                height: '58%',
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              }}>
              <View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                    resizeMode="contain"
                    source={
                      darkmode ? Images.email_notification : Images.emailalert
                    }
                    style={{
                      width: 200,
                      height: 200,
                      marginTop: '-25%',
                    }}></Image>
                </View>
                <Text
                  style={{
                    color: darkmode ? COLOR_GREY : 'black',
                    fontSize: 12,
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 30,
                    marginBottom: 30,
                    fontFamily: FontFamilyMedium,
                  }}>
                  An email will be sent to your registered email address
                </Text>
              </View>
              <TouchableOpacity
                onPress={this.reset_pin}
                style={{
                  backgroundColor: 'rgb(227,30,45)',
                  width: '60%',
                  textAlign: 'center',
                  justifyContent: 'center',
                  marginLeft: '18%',
                  padding: 9,
                  borderRadius: 100,
                  textAlign: 'center',
                  justifyContent: 'center',
                }}>
                {this.state.loading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text
                    style={{
                      fontSize: 18,
                      color: 'white',
                      textAlign: 'center',
                      justifyContent: 'center',
                      fontFamily: FontFamilyMedium,
                    }}>
                    RESET
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.goBack()}
                style={{alignSelf: 'center', marginTop: 30}}>
                <Text
                  style={{
                    fontFamily: FontFamilyMedium,
                    fontSize: 12,
                    color: SILVER_GREY_RGBA,
                    textTransform: 'uppercase',
                    textDecorationLine: 'underline',
                    textDecorationStyle: 'solid',
                    textDecorationColor: 'black',
                  }}>
                  Back to profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
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
});

function mapStateToProps(state) {
  return {
    darkmode: state.Auth.darkmode,
  };
}

export default connect(mapStateToProps, {})(withTheme(ResetPinScreen));
