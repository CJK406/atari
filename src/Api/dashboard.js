/* eslint-disable */

import {getAPI, postAPI, getGraphAPI} from './base';

export async function currency_convert(currency, value) {
  return await postAPI('transaction/currency-convert', {
    currency: currency,
    value: value,
  });
}
// export async function get_allHistory() {
//   return await getAPI('getGroupedTransactionHistoryByUser');
// }

export async function get_allHistory() {
  return await getAPI('transaction/getGroupedTransactionHistoryByUser');
}

export async function get_History(currency) {
  return await getAPI('transactions/' + currency);
}
export async function get_Graph(currency, period) {
  return await getGraphAPI(
    'https://api.coingecko.com/api/v3/coins/' +
      currency +
      '/ohlc?vs_currency=usd&days=' +
      period,
  );
}

export async function get_percent(currency, period) {
  return await getGraphAPI(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' +
      currency +
      '&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=' +
      period,
  );
}
export async function get_receive_address() {
  return await getAPI('transaction/get_receive_address');
}

export async function sendAttari(data) {
  return await postAPI('transaction/transferToken', data);
}

export async function sendOTP() {
  return await getAPI('transaction/sendOTPTransaction');
}
// export async function reset_pin() {
//   return await getAPI('forgetPincode');
// }

export async function reset_pin() {
  return await postAPI('user/forgotpincode');
}

export async function getBalance() {
  return await getAPI('transaction/getBalOff');
}

export async function exchange(currency, amount) {
  return await postAPI('transaction/exchangeToAttari', {
    token: currency,
    amount: amount,
  });
}

export async function appConfig() {
  return await getAPI('user/app_config');
}
