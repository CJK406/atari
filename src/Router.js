import React from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/Ionicons"
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { ArtoTabs } from './Components';
import {isInternetConnected} from './Utils/NetworkConnectivity'

import {
    StartScreen,
    LoginScreen, ForgotPasswordScreen, TradeScreen, DashboardScreen,
    ProfileScreen, NotificationScreen, ExchangeScreen, SendConfirmScreen, VerifyCodeScreen, ResetPasswordScreen, NftScreen, SendPaymentScreen, ResetPinScreen, SetPincodeScreen, TestScreen
} from './Screens'

const AuthStack = createStackNavigator()
const AuthStackScreens = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <AuthStack.Screen name="Test" component={TestScreen} test_value="aaa" />
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <AuthStack.Screen name="VerifyCode" component={VerifyCodeScreen} />
        <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />



    </AuthStack.Navigator>
)

const Tab = createBottomTabNavigator()
const tabBarIcon = (name) => ({
    focused,
    color,
    size,
}) => <Icon name={name} size={20} color={color} />

const tabsArr = {
    Dashboard1: {
        component: DashboardScreen,
        icon: 'reader-outline'
    },
    Trade: {
        component: TradeScreen,
        icon: 'pulse-outline'
    },
    QRScan: {
        component: NftScreen,
        icon: 'apps'
    },
    Exchange: {
        component: ExchangeScreen,
        icon: 'swap-horizontal-outline'
    },
    Setting: {
        component: ProfileScreen,
        icon: 'settings-outline'
    }
}
const StactTabs = (elprops) => (
    <Tab.Navigator backBehaviour="none" initialRouteName={"Dashboard1"} tabBarOptions={{ activeTintColor: 'red' }}
        tabBar={(props) => (<ArtoTabs  {...props} />)}
    >
        
        {Object.keys(tabsArr).map((value, index) => {
            return (
                <Tab.Screen listeners={{
                    tabPress: e => {
                        if (elprops?.props?.isErrorMessage && !elprops.props.isInternetConnected && index !== 4 && index !== 0) {
                            e.preventDefault();
                        }
                    },
                }} name={value} component={tabsArr[value].component} key={value}
                    options={{ tabBarIcon: tabBarIcon(tabsArr[value].icon) }} />
            )
        })}


    </Tab.Navigator>
);
const StackPinCode = createStackNavigator();
const PinCodeStack = () => (
    <StackPinCode.Navigator screenOptions={{ headerShown: false }}>
        <StackPinCode.Screen name="SetPincode" component={SetPincodeScreen} />
    </StackPinCode.Navigator>
)

const MainStack = createStackNavigator();
const MainTabScreens = (props) => (
    <MainStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeTabs" >

        <MainStack.Screen name="HomeTabs" children={() => <StactTabs props={props} />}  {...props} />
        <MainStack.Screen name="SendConfirm" component={SendConfirmScreen} />
        <MainStack.Screen name="Notifications" component={NotificationScreen} />
        <MainStack.Screen name="ResetPin" component={ResetPinScreen} />
        <MainStack.Screen name="SendPayment" component={SendPaymentScreen} />
    </MainStack.Navigator>
)

const RootStack = createStackNavigator();
const RootStackScreens = (info) => {
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {!info.loggedin
                ? <RootStack.Screen name="Auth" component={AuthStackScreens} />
                : info.pincode ? <RootStack.Screen name="App" pincode="null" darkmode={info.darkmode} children={() => <MainTabScreens
                     isInternetConnected={info?.isInternetConnected}
                    isErrorMessage={info?.isErrorMessage} get_address={info.get_address} />} />
                    : <RootStack.Screen name="PinCodeSetup" pincode="null" component={PinCodeStack} />
            }
        </RootStack.Navigator>
    );
}


class Router extends React.Component {
    constructor(props) {
        super(props);
        this.navigationRef = React.createRef();
    }



    state = {
        user_id: "",
        loggedin: false,
        pincode: "",
        start_screen_flag: false,
        menustatus: false,
        showSplash: true,
        darkmode: true
    }

    static getDerivedStateFromProps(props, state) {

        return {
            user_id: props.user_id,
            loggedin: props.loggedin,
            pincode: props.pincode,
            start_screen_flag: props.start_screen_flag,
            menustatus: props.menustatus,
            darkmode: props.darkmode,
            get_address: props?.get_address,
            balance: props?.balance,
            history: props?.all_history,

        };
    }

    hideSplash = () => {

        this.setState({
            showSplash: false
        })
    }

    isErrorMessage() {
      
        if(this.props.get_address.code === undefined ||
            this.props.all_history.code===undefined || 
            this.props.balance.code ===undefined ){
                return true
            }
       
       let isError =  (this.props.get_address.code !== undefined
            && this.props.get_address.code === 900) ||
            (this.props.all_history.code !== undefined
                && this.props.all_history.code === 900) ||
            (this.props.balance.code !== undefined
                && this.props.balance.code === 900)
               
                return isError
    }
    render() {
        const { loggedin, pincode, darkmode, user_id } = this.state;

        if (this.state.showSplash)
            return <StartScreen onFinish={this.hideSplash} />

        return (
            <NavigationContainer ref={this.navigationRef}  >
                <RootStackScreens isInternetConnected={isInternetConnected()} isErrorMessage={this.isErrorMessage()}  loggedin={loggedin} pincode={pincode} user_id={user_id} darkmode={darkmode} />
            </NavigationContainer>
        )
    }

   
}

function mapStateToProps(state) {
    return {
        loggedin: state.Auth.loggedin,
        pincode: state.Auth.pincode,
        user_id: state.Auth.user_id,
        start_screen_flag: state.Auth.start_screen_flag,
        menustatus: state.Auth.menustatus,
        darkmode: state.Auth.darkmode,
        get_address: state?.Auth?.get_address,
        balance: state?.Auth?.balance,
        all_history: state?.Auth?.all_history,
    };
}
export default connect(mapStateToProps, {})(withTheme(Router));