/* eslint-disable */

import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  FlatList,
  Linking,
  Switch,
  ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import {withTheme} from 'react-native-material-ui';
import {CustomStyles} from '../Constant';
import {Header, SettingMenu} from '../Components';
import {settingTheme, authLogout, settingNotification} from '../Redux/Actions';
import {Images} from '../Assets';
import {
  COLOR_GREY,
  FontFamilyMedium,
  FontFamilyRegular,
  SILVER_GREY,
  TRANSPARENT_COLOR,
} from '../Utils/AppContants';

const Menus = [
  {
    name: 'Currency',
    page: '',
    icon: 'logo-usd',
    description: 'Set your preferred local currency',
  },
  {
    name: 'Notifications',
    page: 'Notifications',
    icon: 'notifications-outline',
    description: 'Allow notifications for fund updates',
  },
  {
    name: 'Language',
    page: '',
    icon: 'language-outline',
    description: 'Change app language',
  },
  {
    name: 'Theme',
    page: '',
    icon: 'contrast-outline',
    description: 'Select between dark and light theme',
  },
  {name: 'Support', page: '', icon: 'help-buoy-outline', description: ''},
  {
    name: 'Reset Pincode',
    page: 'ResetPin',
    icon: 'refresh-outline',
    description: '',
  },
  {name: 'Logout', page: '', icon: 'log-out-outline', description: ''},
  {
    name: 'Version 2.08.02',
    page: '',
    icon: 'information-circle-outline',
    description: '',
  },
];
class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    themeToggle: true,
    notificationToggle: true,
  };
  static getDerivedStateFromProps(props, state) {
    return {
      themeToggle: props.darkmode,
      notificationToggle: props.notification_Flag,
    };
  }
  goToDetail = (item) => {
    this.props.navigation.navigate(item);
  };
  logout = () => {
    this.props.authLogout();
  };
  navigate = (pagename) => {
    this.props.navigation.navigate(pagename);
  };
  checkUnread = () => {
    let index = this.props.notifications.findIndex((temp) => temp.read === 0);
    return index > -1;
  };
  changeTheme = (key) => {
    this.setState({themeToggle: key});
    this.props.settingTheme(key);
  };

  changeNotificationSetting = (key) => {
    this.setState({notificationToggle: key});
    this.props.settingNotification(key);
  };

  render() {
    const {themeToggle, notificationToggle} = this.state;
    let me = this.props.me || {};

    const themeBG = themeToggle ? 'rgb(33,33,33)' : 'white';
    const txtColor = themeToggle ? 'white' : 'black';
    const renderItem = ({item}) => (
      <View
        style={{
          padding: 25,
          paddingTop: 45,
        }}>
        {/* <Text style={{fontSize:15,marginBottom:14, color:txtColor}}>General</Text> */}

        {/* <SettingMenu icon={Menus[1].icon} title={Menus[1].name}
							subTitle={Menus[1].description}
							withAction
							actionValue={notificationToggle}
							onAction={(key) => this.changeNotificationSetting(key)}
							themeToggle={this.state.themeToggle}
						/> */}

        {/* <Text style={{fontSize:15,marginBottom:14,color:txtColor}}>Advanced</Text> */}
        {/* <SettingMenu
          icon={Menus[7].icon}
          title={Menus[7].name}
          themeToggle={this.state.themeToggle}
        /> */}
        <SettingMenu
          icon={themeToggle ? Images.themeIcon : Images.settingThemeIcon}
          title={Menus[3].name}
          subTitle={Menus[3].description}
          withAction
          actionValue={this.state.themeToggle}
          onAction={(key) => this.changeTheme(key)}
          themeToggle={this.state.themeToggle}
        />
        <SettingMenu
          icon={themeToggle ? Images.supporticon : Images.supportBlackIcon}
          title={Menus[4].name}
          onPress={() => Linking.openURL('mailto:token@atari.com')}
          themeToggle={this.state.themeToggle}
        />
        <SettingMenu
          icon={themeToggle ? Images.refresh : Images.resetThemeBlackIcon}
          title={Menus[5].name}
          onPress={() => this.goToDetail('ResetPin')}
          themeToggle={this.state.themeToggle}
        />
        <SettingMenu
          icon={themeToggle ? Images.logouticon : Images.logoutThemeBlack}
          title={Menus[6].name}
          onPress={this.logout}
          themeToggle={this.state.themeToggle}
        />
        <Text
          style={{
            color: themeToggle ? SILVER_GREY : 'black',
            fontFamily: FontFamilyRegular,
            marginLeft: 15,
            marginTop: 5,
            fontSize: 14,
          }}>
          Version 2.08.01
        </Text>
      </View>
    );
    return (
      <SafeAreaView
        style={{
          ...CustomStyles.container,
        }}>
        <ImageBackground
          style={{flex: 1}}
          source={
            themeToggle ? Images.login_background_new : Images.forgotPBackGround
          }>
          {/* <ImageBackground style={{flex: 1}} source={Images.loginShadow}> */}
          <View style={[CustomStyles.container, styles.innerContainer]}>
            <Header darkmode={themeToggle} />
            <View
              style={{
                backgroundColor: themeToggle ? TRANSPARENT_COLOR : 'white',
                margin: 25,
                // justifyContent: 'center',
                // alignItems: 'center',
                // flex: 1,
                height: '70%',
                borderRadius: 7,
              }}>
              <FlatList
                data={[{id: 1}]}
                renderItem={renderItem}
                contentContainerStyle={{
                  // justifyContent: 'center',
                  // alignItems: 'center',
                  height: '90%',
                }}
                keyExtractor={(item) => item?.id}
              />
            </View>
          </View>
        </ImageBackground>
        {/* </ImageBackground> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  innerContainer: {
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  customWriting: {
    fontSize: 12,
    color: '#7882A2',
  },
  darkModeBackground: {
    backgroundColor: 'black',
  },
  whiteModeBackground: {
    backgroundColor: 'white',
  },
});

function mapStateToProps(state) {
  return {
    darkmode: state.Auth.darkmode,
    notification_Flag: state.Auth.notification_Flag,
  };
}

export default connect(mapStateToProps, {
  settingTheme,
  authLogout,
  settingNotification,
})(withTheme(ProfileScreen));
