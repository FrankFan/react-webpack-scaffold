import './PayConfirm.css';
import React from 'react';
import FinanceActions from '../../actions/FinanceActions';
import FinanceData from '../../data/FinanceData';
import classNames from 'classnames';
import _ from 'lodash';
import {
  LuPage,
  BCs,
  Utils,
} from 'lubase';
const {
  ValidateUtils,
  CurrencyUtils,
  CommonUtils,
  Statistic,
} = Utils;
const {
  ListItem,
  InputOTP,
  InputIcon,
  InputPassword,
} = BCs;
import {
  Button,
} from 'luui';

class PayConfirm extends LuPage {
  constructor(props) {
    super(props);
    this.payConfirmCache = FinanceData.PayConfirmCache;

    ['otpNoInputChangeCallback',
      'clickOtpCallback',
      'otpNoCountDownStartCallback',
      'otpNoCountDownStopCallback',
      'switchToVoice',
      'bankNoInputChangeCallback',
      'clickBankIconCallback',
      'telNoInputChangeCallback',
      'clickTelIconCallback',
      'quickPayOtpNoInputChangeCallback',
      'clickQuickPayOtpCallback',
      'quickPayOtpNoCountDownStartCallback',
      'quickPayOtpNoCountDownStopCallback',
      'tradePwdInputFilter',
      'tradePwdChangeCallback',
      'setPwdInputFilter',
      'setPwdChangeCallback',
      'goToPayCallback',
    ].forEach((method) => {
      this[method] = (this[method]).bind(this);
    });

    this.state = {
      isDataReady: false,
      titleName: '确认支付',
      // 共4中方式: 1.仅余额 2.仅银行卡代扣 3.仅快捷支付 4.余额+银行卡代扣 5.余额+快捷支付(暂时不支持)
      paymentMethod: [], // ['balance','withhold','quickpay'],
      // 是否需要设置支付密码
      isSetPassword: '1', // 1/0
      itemData: [], // 支付数据
      otpData: {
        otpType: '',
        dynamicType: '',
        isVoiceOTP: false,
        voicePhoneNo: '',
        otpMobileNo: '',
        otpInactive: true,
        otpCountdown: false,
        otpCountdownSeconds: 0,
        showOtpFeedback: false,
        otpReset: false,
      },
      btnActiveStatus: false,
    };
    this.data = {};
  }

  getPaymentMethod() {
    // 1-账户余额，2-充值代扣，3-快捷支付，6-陆金宝支付，8-组合支付
    let paymentMethod = '';
    if (this.state.paymentMethod.indexOf('balance') >= 0 & this.state.paymentMethod.indexOf('withhold') >= 0) {
      paymentMethod = '2';
    } else if (this.state.paymentMethod.indexOf('balance') >= 0) {
      paymentMethod = '1';
    } else if (this.state.paymentMethod.indexOf('withhold') >= 0) {
      paymentMethod = '2';
    } else if (this.state.paymentMethod.indexOf('quickpay') >= 0) {
      paymentMethod = '3';
    }
    return paymentMethod;
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    const title = {
      naviBar: {
        title: '确认支付',
      },
      leftView: true,
    };
    this.setTitle(title);

    this.getInitData();
    // 下面两者互斥
    this.getOtpType();
    this.getSupportBanks();
  }

  getInitData() {
    const state = this.getState();

    this.data.payment = state.payment;
    this.state.isSetPassword = state.isSetPassword;
    this.data.supportedMethods = state.supportedMethods;
    this.data.paymentAmount = state.paymentAmount;
    this.data.coins = state.coins;
    this.data.sid = state.sid;
    this.data.source = state.source;
    this.data.productId = state.productId;
    this.data.productCategory = state.productCategory;
    this.data.ver = state.ver;

    this.setViewData(this.data.payment);
  }

  setViewData(payment) {
    let balanceData = null;
    let bankData = null;
    let quickpayData = null;
    this.data.paymentData = {};

    for (let i = 0; i < payment.length; i++) {
      const paymentMethod = payment[i].paymentMethod;
      const isPaymentTypeValid = (payment[i].isPaymentTypeValid === '1');
      if (paymentMethod === '1' && isPaymentTypeValid) {
        this.state.paymentMethod.push('balance');
        balanceData = {
          title: payment[i].paymentDisplay,
          subtitle: payment[i].availableAmountDisplay || '陆金所',
          message: payment[i].amountDisplay,
          messageUnit: '',
        };
        this.state.itemData.push(balanceData);
        this.data.paymentData.balance = payment[i];
      } else if (paymentMethod === '2' && isPaymentTypeValid) {
        this.state.paymentMethod.push('withhold');
        bankData = {
          title: payment[i].paymentDisplay,
          subtitle: payment[i].availableAmountDisplay,
          message: payment[i].amountDisplay,
          messageUnit: '',
        };
        this.state.itemData.push(bankData);
        this.data.paymentData.withhold = payment[i];
      } else if (paymentMethod === '3') { // 此处isPaymentTypeValid只判断非快捷支付的场景，返回快捷支付方式时，默认为有效
        this.state.paymentMethod.push('quickpay');
        quickpayData = {
          title: payment[i].paymentDisplay,
          message: CurrencyUtils.formatCurrencyWithTwoDecimal(this.data.paymentAmount), // 快捷支付方式后端无该字段
          messageUnit: '元',
        };
        this.state.itemData.push(quickpayData);
        this.data.paymentData.quickpay = payment[i];
      }
    }
    this.setState(this.state);

    // 页面打点
    let traceKey = '';
    const paymentMethod = this.state.paymentMethod;
    const isBalance = (paymentMethod.indexOf('balance') >= 0);
    const isWithhold = (paymentMethod.indexOf('withhold') >= 0);
    const isQuickPay = (paymentMethod.indexOf('quickpay') >= 0);
    if (isBalance && isWithhold) {
      traceKey = 'h5_balancebankcardpayment';
    } else if (isBalance) {
      traceKey = 'h5_balancepayment';
    } else if (isWithhold) {
      traceKey = 'h5_bankcardpayment';
    } else if (isQuickPay) {
      traceKey = 'h5_quickpayment';
    }
    Statistic.logPage({
      title: traceKey,
      category: this.props.route.path,
    });
  }

  getOtpType() {
    // 非快捷支付且无密码才调该接口
    const paymentMethod = this.state.paymentMethod;
    const isSetPassword = (this.state.isSetPassword === '1');
    if (paymentMethod.indexOf('quickpay') < 0 && isSetPassword) {
      const isPE = (this.data.productCategory === 'C01');
      FinanceActions.getOtpType({
        // 设置交易密码：setTradingPwd 私募投资：investPE
        channel: !isPE ? 'setTradingPwd' : 'investPE',
      }, (data) => {
        this.state.otpData.otpType = data.result.otpType;
        this.state.otpData.dynamicType = data.result.dynamicType;
        this.state.otpData.isVoiceOTP = (data.result.dynamicType === '3');
        data.result.phoneNo && (this.state.otpData.voicePhoneNo = data.result.phoneNo.replace(/\ /g, '-'));
        this.state.otpData.waitTime = data.result.waitTime;
        this.state.otpData.otpCountdownSeconds = +data.result.countdownSeconds;
      });
    }
  }

  getSupportBanks() {
    // 快捷支付才调该接口
    const paymentMethod = this.state.paymentMethod;
    if (paymentMethod.indexOf('quickpay') >= 0) {
      FinanceActions.getQuickPayAvailableBank({}, (data) => {
        this.payConfirmCache.setAttr('avail_bank', data.result.data);
      });
    }
  }

  getSupportBanksText() {
    const bankData = this.payConfirmCache.getAttr('avail_bank');
    const banksStr = this.bulidSupportBanks(bankData);
    const htmlBanks = (
      <ul className="PayConfirm-banks-text">
        <li>请填写以您本人姓名开户的借记卡</li>
        <li>目前支持的银行： {banksStr}</li>
        <li>支付成功后， 该卡将作为您在陆金所唯一的资金进出卡， 请谨慎填写 </li>
      </ul>
    );
    return htmlBanks;
  }

  bulidSupportBanks(data) {
    const banks = data;
    let bankName = '';
    let banksStr = '';

    if (banks.length > 0) {
      for (let i = 0; i < banks.length; i++) {
        bankName = banks[i].bankName;
        if (i !== banks.length - 1) {
          bankName += '，';
        }
        banksStr += bankName;
      }
    }
    return banksStr;
  }

  getReservePhone() {
    return (<div className="PayConfirm-phone-text">银行预留的手机号是办理该银行卡时填写的手机号。 没有预留、 忘记或停用手机号的， 请联系银行客服更新处理</div>);
  }

  otpNoInputChangeCallback(val) {
    // 输入otp,非快捷支付场景
    this.data.otpValue = val;
    this.data.otpValueStatus = !!val;
    // 控制是否active
    this.state.otpData.otpInactive = !val;
    this.checkBtnStatus();
  }

  clickOtpCallback() {
    let traceKey = '';
    const paymentMethod = this.state.paymentMethod;
    const isBalance = (paymentMethod.indexOf('balance') >= 0);
    const isWithhold = (paymentMethod.indexOf('withhold') >= 0);
    if (isBalance && isWithhold) {
      traceKey = 'h5_balancebankcardpayment_getotp';
    } else if (isBalance) {
      traceKey = 'h5_balancepayment_getotp';
    } else if (isWithhold) {
      traceKey = 'h5_bankcardpayment_getotp';
    }
    Statistic.logEvent({
      title: traceKey,
      category: this.props.route.path,
    });
    this.sendTradeOtp();
  }

  switchToVoice() {
    this.state.otpData.otpReset = true;
    this.state.otpData.isVoiceOTP = true;
    this.sendTradeOtp();
  }

  sendTradeOtp() {
    const isPE = (this.data.productCategory === 'C01');
    FinanceActions.sendTradeOtp({
      isVoiceOTP: this.state.otpData.isVoiceOTP,
      // 设置交易密码：setTradingPwd 私募投资：investPE
      otpChannel: !isPE ? 'setTradingPwd' : 'investPE',
      isSetPassword: this.state.isSetPassword,
      paymentAmount: this.data.paymentAmount || '', // 私募投资需要
      productName: this.data.productName || '', // 私募投资需要
    }, (data) => {
      this.state.otpData.otpMobileNo = data.result.mobileNo;
      this.state.otpData.otpCountdown = true;
      this.state.otpData.otpInactive = true;
      this.setState({
        otpData: this.state.otpData,
      });
    });
  }

  bankNoInputChangeCallback(val) {
    // 输入银行卡,快捷支付场景
    this.data.bankNo = val;
    this.data.bankNoStatus = !!val;
    this.checkBtnStatus();
  }

  telNoInputChangeCallback(val) {
    // 预留手机号,快捷支付场景
    this.data.reserveMobile = val;
    this.data.reserveMobileStatus = !!val;
    this.checkBtnStatus();
  }

  quickPayOtpNoInputChangeCallback(val) {
    // 输入otp,快捷支付场景
    this.data.otpValue = val;
    this.data.otpValueStatus = !!val;
    this.state.otpData.otpInactive = !val;
    this.checkBtnStatus();
  }

  clickBankIconCallback() {
    const htmlBanks = this.getSupportBanksText();
    const confirm = {
      title: '银行卡说明',
      text: (htmlBanks),
      buttons: [{
        label: '确定',
        onClick: this.hideDialog,
      }],
    };
    this.showDialog(confirm);
  }

  clickTelIconCallback() {
    const htmlPhone = this.getReservePhone();
    const confirm = {
      title: '预留手机号说明',
      text: (htmlPhone),
      buttons: [{
        label: '确定',
        onClick: this.hideDialog,
      }],
    };

    this.showDialog(confirm);
  }

  otpNoCountDownStartCallback() {
    this.state.otpData.showOtpFeedback = true;
    this.setState(this.state);
  }
  otpNoCountDownStopCallback() {
    this.state.otpData.otpCountdown = false;
    this.state.otpData.otpInactive = false;
    this.state.otpData.otpReset = false;
  }

  quickPayOtpNoCountDownStartCallback() {}

  quickPayOtpNoCountDownStopCallback() {
    this.state.otpData.otpCountdown = false;
    this.state.otpData.otpInactive = false;
  }

  clickQuickPayOtpCallback() {
    const bankNo = this.data.bankNo || '';
    const retMobile = ValidateUtils.validCardNo(bankNo);
    if (retMobile !== true) {
      this.showToast(retMobile);
      return;
    }

    const reserveMobile = this.data.reserveMobile || '';
    const retBankNo = ValidateUtils.validateMobile(reserveMobile);
    if (retBankNo !== true) {
      this.showToast(retBankNo);
      return;
    }

    const paymentMethod = this.state.paymentMethod;
    const isQuickPay = (paymentMethod.indexOf('quickpay') >= 0);
    if (isQuickPay) {
      Statistic.logEvent({
        title: 'h5_quickpayment_getotp',
        category: this.props.route.path,
      });
    }

    FinanceActions.verifyQuickPayBankInfo({
      bankAccount: this.data.bankNo,
    }, (data) => {
      console.log('verify bank:', data);
      if (data.code === '0000') {
        this.sendQuickPayTradeOtp();
      }
    });
  }

  sendQuickPayTradeOtp() {
    FinanceActions.sendQuickPayTradeOtp({
      bankAccount: this.data.bankNo,
      mobileNo: this.data.reserveMobile,
      sid: this.data.sid,
      productId: this.data.productId,
      amount: this.data.paymentAmount,
    }, (data) => {
      this.data.responseNo = data.result.responseNo;

      this.data.authQuickPayOtpResultStartTime = Date.now();
      this.showLoading();
      this.authQuickPayOtpResult();
    });
  }

  authQuickPayOtpResult() {
    // 轮询确认快捷结果
    FinanceActions.authQuickPayOtpResult({
      responseNo: this.data.responseNo,
    }, (data) => {
      if (data.result.status === '1') {
        this.data.authQuickPayOtpResultEndTime = Date.now();
        if (this.data.authQuickPayOtpResultEndTime - this.data.authQuickPayOtpResultStartTime > 15 * 1000) {
          // TIMEOUT
          this.hideLoading();
          const confirm = {
            title: '',
            text: '信息提交失败，是否要重新提交？',
            buttons: [{
              label: '取消',
              onClick: this.hideDialog,
            }, {
              label: '重新提交',
              onClick: () => {
                this.data.authQuickPayOtpResultStartTime = Date.now();
                this.showLoading();
                this.authQuickPayOtpResult();

                this.hideDialog();
              },
            }],
          };
          this.showDialog(confirm);
        } else {
          // 防止内存溢出
          setTimeout(() => {
            this.authQuickPayOtpResult();
          }, 3000);
        }
      } else if (data.result.status === '2') {
        // FAIL
        this.hideLoading();
        this.handleQuickOtpError(data.result.authResultCode);
      } else if (data.result.status === '3') {
        // OK
        this.hideLoading();
        this.state.otpData.otpMobileNo = this.data.reserveMobile;
        this.state.otpData.otpCountdownSeconds = 60;
        this.state.otpData.otpCountdown = true;
        this.state.otpData.otpInactive = true;
        // 提示发送成功
        this.state.otpData.showOtpFeedback = true;
        this.setState({
          otpData: this.state.otpData,
        });
      }
    });
  }

  handleQuickOtpError(authResultCode) {
    let queryErrorMsg = '';
    let queryErrorType = '';
    switch (authResultCode) {
      case 'PBB02':
        queryErrorMsg = '该银行卡余额不足';
        queryErrorType = 'Card';
        break;
      case 'PBB101':
        queryErrorMsg = '手机号与银行预留的不一致';
        queryErrorType = 'Phone';
        break;
        // 对于PBB102 验证码错误的处理
      case 'PBB102':
        queryErrorMsg = '动态码错误';
        queryErrorType = 'Code';
        break;
      case 'PBB15':
        queryErrorMsg = '支付金额超过银行卡交易限额，无法支付';
        queryErrorType = 'Card';
        break;
      case 'PBB16':
      case 'PBB43':
        queryErrorMsg = '暂不支持该卡支付，请使用其他银行卡';
        queryErrorType = 'Card';
        break;
      case 'PBB34':
      case 'PBB35':
        queryErrorMsg = '该卡开户信息与您的信息不匹配';
        queryErrorType = 'Card';
        break;
      case 'PBB74':
      case 'PBB90':
      case 'PBBXX':
        queryErrorMsg = '系统异常，请稍后再试';
        queryErrorType = 'Other';
        break;
      default:
        queryErrorType = '';
    }
    // focus with queryErrorType
    console.log(queryErrorType);
    this.showToast(queryErrorMsg);
  }

  tradePwdInputFilter(val) {
    this.data.tradePwdText = val;
    return true;
  }

  tradePwdChangeCallback(val) {
    // 输入交易密码
    this.data.tradePwd = val;
    this.data.tradePwdStatus = !!val;
    // const mesg = ValidateUtils.validateTradePassword(this.data.tradePwdText);
    // if (mesg === true) {
    //   this.data.tradePwdStatus = true;
    // } else {
    //   this.data.tradePwdStatus = false;
    // }
    this.checkBtnStatus();
  }

  setPwdInputFilter(val) {
    this.data.setPwdText = val;
    return true;
  }

  setPwdChangeCallback(val) {
    // 设置交易密码
    this.data.setPwd = val;
    this.data.setPwdStatus = !!val;
    // const mesg = ValidateUtils.validateTradePassword(this.data.setPwdText);
    // if (mesg === true) {
    //   this.data.setPwdStatus = true;
    // } else {
    //   this.data.setPwdStatus = false;
    // }
    this.checkBtnStatus();
  }

  checkBtnStatus() {
    const paymentMethod = this.state.paymentMethod;
    const isSetPassword = (this.state.isSetPassword === '1');
    const hasBalance = (paymentMethod.indexOf('balance') >= 0);
    const hasWithhold = (paymentMethod.indexOf('withhold') >= 0);
    const hasQuickpay = (paymentMethod.indexOf('quickpay') >= 0);
    let btnActiveStatus = false;
    if (hasBalance && hasWithhold) {
      if (isSetPassword) {
        btnActiveStatus = !!this.data.otpValueStatus && !!this.data.setPwdStatus;
      } else {
        btnActiveStatus = !!this.data.tradePwdStatus;
      }
    } else if (hasBalance) {
      if (isSetPassword) {
        btnActiveStatus = !!this.data.otpValueStatus && !!this.data.setPwdStatus;
      } else {
        btnActiveStatus = !!this.data.tradePwdStatus;
      }
    } else if (hasWithhold) {
      if (isSetPassword) {
        btnActiveStatus = !!this.data.otpValueStatus && !!this.data.setPwdStatus;
      } else {
        btnActiveStatus = !!this.data.tradePwdStatus;
      }
    } else if (hasQuickpay) { // 如果有余额+快捷，也包含在此判断中
      if (isSetPassword) {
        btnActiveStatus = !!this.data.bankNoStatus && !!this.data.reserveMobileStatus && !!this.data.otpValueStatus && !!this.data.setPwdStatus;
      } else {
        btnActiveStatus = !!this.data.bankNoStatus && !!this.data.reserveMobileStatus && !!this.data.otpValueStatus && !!this.data.tradePwdStatus;
      }
    }
    this.setState({
      btnActiveStatus,
    });
  }

  goToPayCallback() {
    let traceKey = '';
    const paymentMethod = this.state.paymentMethod;
    const isBalance = (paymentMethod.indexOf('balance') >= 0);
    const isWithhold = (paymentMethod.indexOf('withhold') >= 0);
    const isQuickPay = (paymentMethod.indexOf('quickpay') >= 0);
    if (isBalance && isWithhold) {
      traceKey = 'h5_balancebankcardpayment_confirmingpayment';
    } else if (isBalance) {
      traceKey = 'h5_balancepayment_confirmingpayment';
    } else if (isWithhold) {
      traceKey = 'h5_bankcardpayment_confirmingpayment';
    } else if (isQuickPay) {
      traceKey = 'h5_quickpayment_confirmingpayment';
    }
    Statistic.logEvent({
      title: traceKey,
      category: this.props.route.path,
    });

    if (typeof this.data.otpData !== 'undefined' && !isQuickPay) {
      const retOptNo = ValidateUtils.validateOtp(this.data.otpValue);
      if (retOptNo !== true) {
        this.showToast(retOptNo);
        return;
      }
    }

    if (typeof this.data.setPwdText !== 'undefined') {
      const mesg = ValidateUtils.validateTradePassword(this.data.setPwdText);
      if (mesg !== true) {
        this.showToast(mesg);
        return;
      }
    }

    FinanceActions.sendInvestRequest({
      sid: this.data.sid,
      coinString: this.data.coins,
      from: this.data.source,
      password: (this.state.isSetPassword === '1') ? this.data.setPwd : this.data.tradePwd, // 交易密码或设置的交易密码
      otpType: this.state.otpData.otpType,
      otpValidationCode: this.data.otpValue, // 非快捷支付使用
      paymentMethod: this.getPaymentMethod(),
      productId: this.data.productId,
      isSetPassword: this.state.isSetPassword,
      // needWithholding: '', // ?0/1
      productCategory: this.data.productCategory,
      supportedMethods: this.data.supportedMethods,
      // 快捷支付使用
      validCode: this.data.otpValue || '',
      responseNo: this.data.responseNo || '',
      bankAccount: this.data.bankNo || '',
      bankMobileNo: this.data.reserveMobile || '',
    }, (data) => {
      if (data.code === '0000') {
        this.forward('tradeResult', {
          state: {
            trxId: data.result.trxId,
            source: this.data.source,
            ver: this.data.ver,
            investmentRequestId: data.result.investmentRequestId,
            salesArea: '', // 点金计划需要
          },
        });
      }
    });
  }

  render() {
    const {
      paymentMethod,
      itemData,
      btnActiveStatus,
    } = this.state;
    const isSetPassword = (this.state.isSetPassword === '1');
    const {
      dynamicType,
      isVoiceOTP,
      voicePhoneNo,
      otpMobileNo,
      otpInactive,
      otpCountdown,
      otpCountdownSeconds,
      showOtpFeedback,
      otpReset,
    } = this.state.otpData;

    const isBalance = (paymentMethod.indexOf('balance') >= 0);
    const isWithhold = (paymentMethod.indexOf('withhold') >= 0);
    const isQuickPay = (paymentMethod.indexOf('quickpay') >= 0);
    const isBankRelative = isWithhold || isQuickPay;

    // part 1: balance/withhold, for all
    let htmlListData = null;
    if (itemData.length) {
      // console.log('itemData',itemData);
      htmlListData = (
        <div className="PayConfirm-list">
          <ListItem rowsData={itemData} />
        </div>
      );
    }
    // part 2, for balance or withhold
    const htmlOtpFeedback = (
      <div className={classNames(showOtpFeedback ? '' : 'hidden')} >
        <div className={classNames('PayConfirm-otp-text', 'flex-hrz', !isVoiceOTP ? '' : 'hidden')}>
          <div className="flex-init">动态码已发送至{CommonUtils.getMobile(otpMobileNo)}</div>
          {(dynamicType === '1') ? (
            <div className="flex-full button">收不到？
              <span className="PayConfirm-otp-switch" onClick={this.switchToVoice}>语音获取</span>
            </div>) : null}
        </div>
        <div className={classNames('PayConfirm-otp-voice', 'flex-init', isVoiceOTP ? '' : 'hidden')}>陆金所将用{voicePhoneNo}拨打您的手机告知动态码</div>
      </div>
    );
    let htmlOtpCode = null;
    if (!isQuickPay && isSetPassword) {
      htmlOtpCode = (
        <div className="PayConfirm-otp">
          <InputOTP
            inactive={otpInactive}
            countdown={otpCountdown}
            countdownSeconds={otpCountdownSeconds}
            reset={otpReset}
            placeholder="7位数字"
            inputChangeCallback={this.otpNoInputChangeCallback}
            countDownStartCallback={this.otpNoCountDownStartCallback}
            countDownStopCallback={this.otpNoCountDownStopCallback}
            clickOtpCallback={this.clickOtpCallback} />
          {htmlOtpFeedback}
        </div>
      );
    }
    // part 3, for quickpay
    const htmlOtpFeedbackQuickPay = (
      <div className={classNames(showOtpFeedback ? '' : 'hidden')} >
        <div className={classNames('PayConfirm-otp-text', 'flex-hrz')}>
          <div className="flex-init">动态码已发送至{CommonUtils.getMobile(otpMobileNo)}</div>
        </div>
      </div>
    );
    let htmlQuickPayOtpCode = null;
    if (isQuickPay) {
      htmlQuickPayOtpCode = (
        <div>
        <div className="PayConfirm-quickpay line-topbottom">
          <InputIcon
            className="Custom-Line PayConfirm-bankno"
            labelName="银行卡号"
            placeholder="您的储蓄卡卡号"
            inputChangeCallback={this.bankNoInputChangeCallback}
            clickIconCallback={this.clickBankIconCallback} />
          <InputIcon
            className="Custom-Line PayConfirm-telno"
            labelName="手机号"
            placeholder="银行预留的手机号"
            inputChangeCallback={this.telNoInputChangeCallback}
            clickIconCallback={this.clickTelIconCallback} />
          <InputOTP
            className="Custom-Line PayConfirm-otpno"
            inactive={otpInactive}
            countdown={otpCountdown}
            countdownSeconds={otpCountdownSeconds}
            placeholder=""
            inputChangeCallback={this.quickPayOtpNoInputChangeCallback}
            countDownStartCallback={this.quickPayOtpNoCountDownStartCallback}
            countDownStopCallback={this.quickPayOtpNoCountDownStopCallback}
            clickOtpCallback={this.clickQuickPayOtpCallback} />
        </div>
        {htmlOtpFeedbackQuickPay}
        </div>
      );
    }
    // part 4, for all
    let htmlHasPwd = null;
    if (!isSetPassword) {
      htmlHasPwd = (
        <div className="PayConfirm-haspwd">
          <div className="PayConfirm-pwd">
            <InputPassword
              className="Custom-Line Password"
              labelName="交易密码"
              placeholder="输入陆金所交易密码"
              inputFilter={this.tradePwdInputFilter}
              inputChangeCallback={_.debounce(this.tradePwdChangeCallback, 200)} />
          </div>
        </div>
      );
    }
    // part 5, for all
    let htmlNoPwd = null;
    if (isSetPassword) {
      htmlNoPwd = (
        <div className="PayConfirm-nopwd">
          <div className="PayConfirm-pwdtext">
            <div className="PayConfirm-pwdtext-tip1">设置陆金所交易密码</div>
            <div className="PayConfirm-pwdtext-tip2">必须与登录密码不同，为了保护账户及资金安全请牢记</div>
          </div>
          <div className="PayConfirm-pwd">
            <InputPassword
              className="Password"
              showPassword={true}
              placeholder="6-16位字母、数字或符号的组合"
              inputFilter={this.setPwdInputFilter}
              inputChangeCallback={_.debounce(this.setPwdChangeCallback, 200)} />
          </div>
        </div>
      );
    }

    // part 6, for all
    const htmlBtn = (
      <div className={classNames('PayConfirm-btn')}>
        <Button name="立即支付" inactive={!btnActiveStatus} className="ButtonPage-button" callback={this.goToPayCallback} />
      </div>
    );

    // part 7, for withhold/quickpay
    const htmlTip = (
      <div className={classNames('PayConfirm-tip', isBankRelative ? '' : 'hidden')}>
        <span>温馨提示：请确保您的银行卡金额足够</span>
      </div>
    );

    return (
      <div className="PayConfirm">
        <div className="PayConfirm-content">
          {htmlListData}
          {htmlOtpCode}
          {htmlQuickPayOtpCode}
          {htmlHasPwd}
          {htmlNoPwd}
          {htmlBtn}
          {htmlTip}
        </div>
      </div>
    );
  }
}

export default PayConfirm;
