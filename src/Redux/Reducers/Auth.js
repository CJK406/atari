import jwtDecode from 'jwt-decode';
import {REHYDRATE} from 'redux-persist';

import {
    AUTH_LOGOUT,
    AUTH_SET_USER_INFO,
    AUTH_SET_USER_INFO_SUCCESS,
    AUTH_SET_TOKEN, AUTH_SET_TOKEN_SUCCESS,
    SETTING_THEME, AUTH_SET_PINCODE, AUTH_SET_PINCODE_SUCCESS,
    NOTIFICATIONFLAG,
    AUTH_SET_ALL_HISTORY,
    AUTH_GET_ALL_ADDRESS,
    AUTH_GET_ALL_ADDRESS_SUCCESS,
    AUTH_UPDATE_BALLANCE,
    AUTH_UPDATE_BALLANCE_SUCCESS,
    AUTH_UPDATE_STARTSCREEN,
    AUTH_UPDATE_MENUSTATUS,
    AUTO_UPDATE_VERIFY_TOKEN,
    AUTH_SET_ALL_HISTORY_SUCCESS,
    AUTH_SET_PRICE,
    AUTH_SET_CLEAR
} from '../type';

const INITIAL = {
    loading: false,
    loggedin: false,
    token: null,
    refresh_token: null,
    balance: {atri:0,
        btc:0,
        eth:0,
        ltc:0,
        usdt:0,
        ftm:0,
        bnb:0,

        atri_usd:0,
        btc_usd:0,
        eth_usd:0,
        ltc_usd:0,
        usdt_usd:0,
        ftm_usd:0,
        bnb_usd:0,
        sum:0
    },
    messages: null,

    remember_me: false,
    email: '',
    password: '',
    darkmode: true,
    notification_Flag: true,
    pincode: "",
    user_id: "",
    user_name:'',
    all_history: {body:{obj:{ATARI:[],ETH:[],USDT:[],BTC:[],BNB:[],LTC:[]}, arr:[]}},
    get_address: {atri: "", btc: "", eth: "", ltc: "", bch: "",ftm:"",bnb:"", flag: false},
    price: {
        eth: 3225.3276441506,
        btc: 46306.911944865,
        ltc: 172.59040460829,
        usdt: 1.00048388259,
        atari: 0.047669689201542,
        bnb: 396.8088516554
    },
    start_screen_flag: false,
    menustatus: false,
    verify_token:'',
    verify_code:''
}

export default (state = INITIAL, action) => {
    switch (action.type) {
        case REHYDRATE: {
            if (!action.payload) return state;

            const {Auth} = action.payload;
            let {loggedin, email,token, balance, darkmode, pincode, notification_Flag, all_history,user_name, get_address, price,verify_token,verify_code} = Auth;
            return {
                ...Auth,
                loggedin,
                token,
                balance,
                darkmode,
                pincode,
                notification_Flag,
                all_history,
                get_address,
                price,
                verify_token,
                verify_code,
                user_name,
                email
            };
        }

        case AUTH_SET_USER_INFO:
        case AUTH_SET_TOKEN:
        case AUTH_SET_PINCODE:
        case AUTH_GET_ALL_ADDRESS:
        case AUTH_SET_ALL_HISTORY:
        case AUTH_UPDATE_BALLANCE: {
            return {...state, loading: true, messages: null}
        }

        case AUTH_SET_CLEAR: {
            return {...state, 
                balance: {atri:0,
                    btc:0,
                    eth:0,
                    ltc:0,
                    usdt:0,
                    ftm:0,
                    bnb:0,

                    atri_usd:0,
                    btc_usd:0,
                    eth_usd:0,
                    ltc_usd:0,
                    usdt_usd:0,
                    ftm_usd:0,
                    bnb_usd:0,
                    sum:0
                },
                all_history: {body:{obj:{ATARI:[],ETH:[],USDT:[],BTC:[],BNB:[],LTC:[]}, arr:[]}},
                get_address: {atri: "", btc: "", eth: "", ltc: "", bch: "",ftm:"",bnb:"", flag: false},
                price: {
                    eth: 3225.3276441506,
                    btc: 46306.911944865,
                    ltc: 172.59040460829,
                    usdt: 1.00048388259,
                    atari: 0.047669689201542,
                    bnb: 396.8088516554
                },
            }
        }

        
        case AUTH_SET_TOKEN_SUCCESS: {
            const {notification_Flag} = action.data;
            return {...state,notification_Flag:notification_Flag};
        }
        case AUTO_UPDATE_VERIFY_TOKEN: {
        
            const {verify_token,verify_code} = action.data;
            return {...state,verify_token,verify_code };
        }

        
        case AUTH_UPDATE_MENUSTATUS: {
            const data = action.data;

            return {...state, menustatus: data};
        }


        case AUTH_SET_PINCODE_SUCCESS: {
            const data = action.data;
            return {...state, pincode: data.pinCode};
        }
        case AUTH_UPDATE_STARTSCREEN: {
            const data = action.data;

            return {...state, start_screen_flag: data};
        }

        case AUTH_SET_PRICE:{
            const price = action.data;
            return {
                ...state,
                price: price,
            };
        }

        case AUTH_SET_USER_INFO_SUCCESS: {
            const {user, token, price, balance} = action.data.data;
            return {
                ...state,
                loading: false,
                loggedin: true,
                all_history: {body:{obj:{ATARI:[],ETH:[],USDT:[],BTC:[],BNB:[],LTC:[]}, arr:[]}},

                price: price,
                pincode: user.pinCode,
                user_id: user._id,
                balance: balance,
                messages: null,
                token:token,
                email:user.email,
                password:user.password,
                user_name:user.name
            };
        }

        case AUTH_UPDATE_BALLANCE_SUCCESS: {
            const {price} = state;
            let atri_usd = action?.data?.body.atari_balance * price?.atri;
            let btc_usd  = action?.data?.body?.btc_balance * price?.btc;
            let eth_usd  = action?.data?.body?.eth_balance * price?.eth;
            let ltc_usd  = action?.data?.body?.ltc_balance * price?.ltc;
            let usdt_usd = action?.data?.body?.usdt_balance * price?.usdt;
            let ftm_usd = 0;
            let bnb_usd = 0;

            let sum = atri_usd+btc_usd+eth_usd+ltc_usd+usdt_usd+ftm_usd+bnb_usd;

            let balance = {atri:action?.data?.body?.atari_balance,
                           btc:action?.data?.body?.btc_balance,
                           eth:action?.data?.body?.eth_balance,
                           ltc:action?.data?.body?.ltc_balance,
                           usdt:action?.data?.body?.usdt_balance,
                           ftm:0,
                           bnb:0,
                           code: action?.data?.code,

                           atri_usd:atri_usd,
                           btc_usd:btc_usd,
                           eth_usd:eth_usd,
                           ltc_usd:ltc_usd,
                           usdt_usd:usdt_usd,
                           ftm_usd:0,
                           bnb_usd:0,
                           sum:sum
            };

            if(action.data.body?.atari_balance===undefined || action.data.body?.atari_balance==="undefined"){
               
                return{...state, balance: action.data};
            }
            else{
                return {...state, balance:balance};
            }



        }
        case AUTH_LOGOUT: {
            return {...state, loading: false, loggedin: false, token: null, start_screen_flag: false};
        }
        case SETTING_THEME: {
            return {...state, darkmode: action.data};
        }
        case NOTIFICATIONFLAG: {
            return {...state, notification_Flag: action.data};
        }
        case AUTH_SET_ALL_HISTORY_SUCCESS: {
            return {...state, all_history: action.data, loading: false}
        }
        case AUTH_GET_ALL_ADDRESS_SUCCESS: {
            return {...state, get_address: action.data}
        }
        default:
            return state;
    }
}
