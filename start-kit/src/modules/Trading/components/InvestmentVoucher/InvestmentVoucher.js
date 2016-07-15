import React from 'react';
import {
  LuPage,
  BCs,
} from 'lubase';
import FinanceData from '../../data/FinanceData';
const {
  SelectInvestmentVoucher,
} = BCs;

class InvestmentVoucher extends LuPage {

  constructor(props) {
    super(props);
    ['allCheckCallback',
      'btnClickCallback',
      'itemCheckCallback',
      'errorCallback',
    ].forEach((method) => {
      this[method] = (this[method]).bind(this);
    });
    this.investVoucherCache = FinanceData.InvestVoucherCache;

    this.data = {};
  }

  componentWillMount() {
    const title = {
      naviBar: {
        title: '选择投资券',
      },
      leftView: true,
    };
    this.setTitle(title);

    this.getInitData();
  }

  getInitData() {
    const state = this.getState();
    this.data.list = state.list;
    this.data.maxCoinUseAmount = state.maxCoinUseAmount;
    this.data.maxCoinUseCount = state.maxCoinUseCount;
    this.data.paymentAmount = state.paymentAmount;
  }

  allCheckCallback() {
    // TODO
    console.log('allCheckCallback');
  }

  btnClickCallback(amount, list) {
    this.investVoucherCache.set({
      hasChoickInvestVoucher: true, //(amount > 0),
      investVoucherAmount: amount,
      investVoucherList: list,
    });
    this.back();
  }

  itemCheckCallback() {
    // TODO
    console.log('itemCheckCallback');
  }

  errorCallback(errMsg) {
    this.showToast(errMsg);
  }

  render() {
    const datas = {
      list: this.data.list,
      maxCoinUseAmount: this.data.maxCoinUseAmount,
      maxCoinUseCount: this.data.maxCoinUseCount,
      paymentAmount: this.data.paymentAmount,
      errorCallback: this.errorCallback,
      allCheckCallback: this.allCheckCallback,
      btnClickCallback: this.btnClickCallback,
      itemCheckCallback: this.itemCheckCallback,
    };

    return (
      <SelectInvestmentVoucher {...datas} />
    );
  }
}

export default InvestmentVoucher;
