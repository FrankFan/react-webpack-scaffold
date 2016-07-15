import './TradeResult.css';
import React from 'react';
import FinanceActions from '../../actions/FinanceActions';
import FinanceData from '../../data/FinanceData';
import {
  LuPage,
  BCs,
  Utils,
  UrlManager,
} from 'lubase';
import {
  Button,
} from 'luui';
const {
  CurrencyUtils,
  Platform,
  Statistic,
} = Utils;
const {
  TimeLine,
  ConfirmHeader,
  Download,
} = BCs;

class TradeResult extends LuPage {

  constructor(props) {
    super(props, {
      PVKey: 'h5_investmentresult',
    });

    this.tradeConfirmCache = FinanceData.TradeConfirmCache;
    this.payConfirmCache = FinanceData.PayConfirmCache;
    this.investVoucherCache = FinanceData.InvestVoucherCache;

    ['btmLeftButtonCallback',
      'btmRightButtonCallback',
      'downloadCallback',
    ].forEach((method) => {
      this[method] = (this[method]).bind(this);
    });

    this.state = {
      isDataReady: false,
      // 现在只存在"投资申请已提交"情况
      status: 'success', // success/fail
      titleName: '提示',
      resultTitle: '',
      displayNameCode: '',
      investAmount: '1000',
      investFinishSteps: [],
    };
    this.data = {};
  }

  componentWillMount() {
    const title = {
      naviBar: {
        title: '提示',
      },
      leftView: true,
    };
    this.setTitle(title);
    this.getInitData();
    this.getInvestResult();

    this.context.router.setRouteLeaveHook(this.props.route, this.onBack);
  }

  onBack() {
    Statistic.logEvent({
      title: 'h5_investmentresultpage_done',
      category: this.props.route.path,
    });

    this.clearTradeData();

    let detailUrl = '';
    if (Platform.isLU) {
      detailUrl = this.data.enterDetailUrl;
    } else {
      const listUrl = encodeURIComponent(UrlManager.getUrl().list);
      // https://m.lu.com/m-h5/lhb#/productDetail?productId=13276297&channel=H5_OTHER&from=listUrl;
      detailUrl = `${this.data.enterDetailUrl}#/productDetail?productId=${this.data.productId}&channel=${this.data.source}&from=${listUrl}`;
    }
    this.jump(detailUrl, {
      isBack: true,
    });
    return false;
  }

  clearTradeData() {
    this.tradeConfirmCache.remove();
    this.payConfirmCache.remove();
    this.investVoucherCache.remove();
  }

  getInitData() {
    const state = this.getState();

    this.data.trxId = state.trxId;
    this.data.source = state.source;
    this.data.ver = state.ver;
    this.data.investmentRequestId = state.investmentRequestId;
    this.data.salesArea = state.salesArea;
  }

  getInvestResult() {
    FinanceActions.getInvestResult({
      trxId: this.data.trxId,
      source: this.data.source,
      ver: this.data.ver,
      investmentRequestId: this.data.investmentRequestId,
      salesArea: '', // 点金计划需要,后期补充 trade-info
    }, (data) => {
      this.setViewData(data);
    });
  }

  setViewData(data) {
    const result = data.result;
    const resultTitle = result.extra.title;
    const displayName = result.displayName;
    const code = result.code;
    const investAmount = result.investAmount;
    const investFinishSteps = result.extra.investFinishSteps;

    this.data.productId = result.productId;
    this.data.browseProductInfo = result.extra.browseProductInfo;
    this.data.enterMyProductList = result.extra.enterMyProductList;
    this.data.enterDetailUrl = result.extra.enterDetailUrl;

    this.setState({
      isDataReady: true,
      resultTitle,
      displayNameCode: `${displayName} ${code}`,
      investAmount,
      investFinishSteps,
    });
  }

  btmLeftButtonCallback() {
    const url = this.data.browseProductInfo.schemeUrl;
    this.jump(url);
  }

  btmRightButtonCallback() {
    const url = this.data.enterMyProductList.schemeUrl;
    this.jump(url);
  }

  downloadCallback() {
    Statistic.logEvent({
      title: 'h5_investmentresultpage_downloadapp',
      category: this.props.route.path,
    });
  }

  render() {
    const {
      isDataReady,
      status,
      resultTitle,
      displayNameCode,
      investAmount,
      investFinishSteps,
    } = this.state;

    if (!isDataReady) return null;


    // const success = (status === 'success') ? true : false;
    const success = (status === 'success');
    const timelineData = investFinishSteps.map((item, index) => {
      return {
        title: item.title,
        desc: item.result[0],
        success: (index === 0)
      };
    });

    let htmlBtns = null;
    if (this.data.browseProductInfo && this.data.enterMyProductList) {
      htmlBtns = (
        <div className="TradeResult-buttons flex-hrz">
          <div className="flex-full TradeResult-left">
            <Button
              className="ButtonPage-button TradeResult-button"
              name={this.data.browseProductInfo.buttonTitle}
              callback={this.btmLeftButtonCallback}
              type="Secondary" />
          </div>
          <div className="flex-full TradeResult-right">
            <Button
              className="ButtonPage-button TradeResult-button"
              name={this.data.enterMyProductList.buttonTitle}
              callback={this.btmRightButtonCallback} />
          </div>
        </div>
      );
    }

    const source = this.data.source;
    const showDownload = (source.indexOf('H5_') >= 0);

    return (
      <div className="TradeResult">
        <div className={`TradeResult-success line-bottom ${success ? '' : 'hidden'}`}>
          <div className="TradeResult-confirmheader">
            <ConfirmHeader
              tip={resultTitle}
              subtip={`${CurrencyUtils.formatCurrencyWithTwoDecimal(investAmount)}元 | ${displayNameCode}`} />
          </div>
          <div className="TradeResult-progress"><TimeLine itemData={timelineData} /></div>
          {htmlBtns}
        </div>
        <div className={`TradeResult-failure line-bottom ${success ? 'hidden' : ''}`}>
          <div className="TradeResult-confirmheader">
            <ConfirmHeader
              status="fail"
              tip="投资未成功" />
          </div>
          <div className="TradeResult-readme normal-color-1">
            <span> 投资未成功提示</span>
          </div>
          {htmlBtns}
        </div>
        <div className="TradeResult-download">
          {
            showDownload ? <Download downloadCallback={this.downloadCallback}/> : null
          }
        </div>
      </div>
    );
  }
}

export default TradeResult;
