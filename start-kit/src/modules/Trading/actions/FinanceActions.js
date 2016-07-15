import {
  Http,
} from 'lubase';

class FinanceActions {
  constructor(moduleName) {
    this.moduleName = moduleName;
  }

  getContract(options, success, fail) {
    // console.log(options, 'getContract.....');
    Http.get(options, success, fail);
  }

  checkUser(options, success, fail) {
    // console.log(options, 'checkUser.....');
    // merge default option
    const opts = {
      url: '/m-h5/service/product/user-check',
      query: {},
    };
    opts.query = Object.assign(opts.query, options);
    Http.get(opts, success, fail);
  }

  checkInvest(options, success, fail) {
    // console.log(options, 'checkInvest.....');
    // merge default option
    const opts = {
      url: '/m-trading/service/trade/invest-check',
      body: {},
    };
    opts.body = Object.assign(opts.body, options);
    Http.post(opts, success, fail);
  }

  getTradeConfirmInfo(options, success, fail) {
    // merge default option
    const opts = {
      url: '/m-trading/service/trade/trade-info',
      body: {},
    };
    opts.body = Object.assign(opts.body, options);
    Http.post(opts, success, fail);
  }

  getPaymentInfo(options, success, fail) {
    // merge default option
    const opts = {
      url: '/m-trading/service/trade/get-payment-info',
      body: {},
    };
    opts.body = Object.assign(opts.body, options);
    Http.post(opts, success, fail);
  }

  getOtpType(options, success, fail) {
    // merge default option
    const opts = {
      url: '/m-trading/service/trade/get-otp-type',
      query: {},
    };
    opts.query = Object.assign(opts.query, options);
    Http.get(opts, success, fail);
  }

  sendTradeOtp(options, success, fail) {
    // merge default option
    const opts = {
      url: '/m-trading/service/trade/send-otp',
      body: {},
    };
    opts.body = Object.assign(opts.body, options);
    Http.post(opts, success, fail);
  }

  sendQuickPayTradeOtp(options, success, fail) {
    // merge default option
    const opts = {
      url: '/m-trading/service/trade/quick-pay/send-otp',
      body: {},
    };
    opts.body = Object.assign(opts.body, options);
    Http.post(opts, success, fail);
  }

  authQuickPayOtpResult(options, success, fail) {
    // merge default option
    const opts = {
      url: '/m-trading/service/trade/quick-pay/auth-result',
      query: {},
      isShowLoading: '0',
    };
    opts.query = Object.assign(opts.query, options);
    Http.get(opts, success, fail);
  }

  getQuickPayAvailableBank(options, success, fail) {
    // merge default option
    const opts = {
      url: '/m-trading/service/trade/quick-pay/get-available-bank',
      query: {},
    };
    opts.query = Object.assign(opts.query, options);
    Http.get(opts, success, fail);
  }

  verifyQuickPayBankInfo(options, success, fail) {
    // merge default option
    const opts = {
      url: '/m-trading/service/trade/quick-pay/verify-bank-info',
      body: {},
    };
    opts.body = Object.assign(opts.body, options);
    Http.post(opts, success, fail);
  }

  sendInvestRequest(options, success, fail) {
    // merge default option
    const opts = {
      url: '/m-trading/service/trade/invest-request',
      body: {},
    };
    opts.body = Object.assign(opts.body, options);
    Http.post(opts, success, fail);
  }

  getInvestResult(options, success, fail) {
    // merge default option
    const opts = {
      url: '/m-trading/service/trade/invest-result',
      query: {},
    };
    opts.query = Object.assign(opts.query, options);
    Http.get(opts, success, fail);
  }
}

export default new FinanceActions('trading');
