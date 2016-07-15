import './TradeConfirm.css';
import React from 'react';
import FinanceActions from '../../actions/FinanceActions';
import FinanceData from '../../data/FinanceData';
import {
  LuPage,
  BCs,
  Utils,
} from 'lubase';
const {
  CurrencyUtils,
  Statistic,
} = Utils;
const {
  ProjectBannerWith2ColsReverse,
  KYCSimple,
  PanelDoc,
  Checkbox,
} = BCs;
import {
  Button,
} from 'luui';

class TradeConfirm extends LuPage {
  constructor(props) {
    super(props, {
      PVKey: 'h5_confirminginvestment',
    });
    this.tradeConfirmCache = FinanceData.TradeConfirmCache;
    this.investVoucherCache = FinanceData.InvestVoucherCache;

    ['gotoInvestTicketCallback',
      'toggleCheckbox',
      'comfirmInvest',
      'checkInvest',
      'getTradeConfirmInfo',
    ].forEach((method) => {
      this[method] = (this[method]).bind(this);
    });

    this.state = {
      isDataReady: false,
      titleName: '确认投资',
      btnActiveStatus: false,
      projectInfo: {},
      kycData: {},
      panelData: {},
      disclaimerContent: '',
      contract: [],
    };
    this.data = {};
  }

  onBack() {
    this.clearTradeData();
    super.onBack();
  }

  clearTradeData() {
    this.tradeConfirmCache.remove();
    this.investVoucherCache.remove();
  }

  // A-B-A A会重新调用该函数
  componentWillMount() {
    const title = {
      naviBar: {
        title: '确认投资',
      },
      leftView: true,
    };
    this.setTitle(title);

    // 返回时使用query才能拿到data,但如果采用state传递的数据会被销毁掉
    this.getInitData();
    this.getInitCache();

    // isBack标记在LuPage中设置，根据该标记可判断页面是否是返回，但数据还是需要重新拉取的
    if (this.isBack) {
      this.getInvestVoucherInfo();
      this.getTradeConfirmInfo();
    } else {
      this.clearTradeData();
      if (this.data.investType && this.data.sid) {
        this.getTradeConfirmInfo();
      } else {
        this.checkUser(() => {
          this.checkInvest(() => {
            this.getTradeConfirmInfo();
          });
        });
      }
    }
  }

  getInitCache() {
    // 缓存check-user/invest-check数据，防止页面返回或刷新时重新发起请求；另外，防止流程完成后脏数据问题，需要清空缓存数据
    this.data.investType = this.tradeConfirmCache.getAttr('investType');
    this.data.sid = this.tradeConfirmCache.getAttr('sid');
  }

  getInvestVoucherInfo() {
    // 从投资券页返回
    this.data.hasChoickInvestVoucher = this.investVoucherCache.getAttr('hasChoickInvestVoucher');
    this.data.investVoucherAmount = this.investVoucherCache.getAttr('investVoucherAmount');
    // 更新投资券
    this.data.investVoucherList = this.investVoucherCache.getAttr('investVoucherList');
  }

  getInitData() {
    const query = this.getQuery();
    const params = JSON.parse(decodeURIComponent(query.params));

    this.data.productId = params.productId;
    this.data.amount = params.amount;
    this.data.source = params.source;
    this.data.salesArea = params.salesArea;
    this.data.productCategory = params.productCategory || '';
    this.data.ver = params.ver || '1.0';
    this.data.hasInsurance = params.hasInsurance || ''; // for trade-info?
    // TODO 以下参数在后期场景中考虑
    // this.data.investType = params.investType || '01';// 01：H5首次投资，其余为00, 从check-user中获取
    // this.data.bidFee = params.bidFee || '0';// 只有竞拍模式才有值
    // this.data.isCheckSQ = params.isCheckSQ || '0';// 是否校验安保问题
    // this.data.salesArea = params.salesArea || '';
    // this.data.insuranceFeeFlag = params.insuranceFeeFlag || '';// LC投资检查的时候需要
  }

  checkUser(callback) {
    FinanceActions.checkUser({}, (data) => {
      // 新客投资方式
      const investType = (data.result.isNewUser === '1' ? '01' : '00');
      this.tradeConfirmCache.setAttr('investType', investType);
      this.data.investType = investType;
      callback();
    }, () => {});
  }

  checkInvest(callback) {
    // 请求接口invest-check
    FinanceActions.checkInvest({
      productId: this.data.productId,
      amount: this.data.amount,
      source: this.data.source,
      ver: this.data.ver,
      investType: this.data.investType,
      // bidFee: this.data.bidFee,
      // isCheckSQ: this.data.isCheckSQ,
      // salesArea: this.data.salesArea,
      // insuranceFeeFlag: this.data.insuranceFeeFlag,
      productCategory: this.data.productCategory,
    }, (data) => {
      this.tradeConfirmCache.setAttr('sid', data.result.sid);
      this.data.sid = data.result.sid;
      callback();
    }, () => {});
  }

  getTradeConfirmInfo(callback) {
    FinanceActions.getTradeConfirmInfo({
      productId: this.data.productId,
      amount: this.data.amount,
      source: this.data.source,
      ver: this.data.ver,
      sid: this.data.sid,
      // LC投资时需要
      // hasInsurance: this.data.hasInsurance || '',
    }, (data) => {
      this.setViewData(data);
      this.state.isDataReady = true;
      this.setState(this.state);
      callback && callback();
    });
  }

  setViewData(data) {
    const result = data.result;
    const product = result.product;
    const trade = result.trade;
    // TODO how to support multiple and variable product
    this.state.projectInfo = {};
    this.state.projectInfo.productNameDisplay = product.name;

    const items = product.item;
    const length = items.length;
    // TODO 糟糕的组件导致，后期需要改造ProjectPanel，适应任何情况
    if (length >= 1) {
      this.state.projectInfo.row1 = {};
      this.state.projectInfo.row1.leftText = product.item[0].key;
      this.state.projectInfo.row1.leftValue = product.item[0].value;
      if (length >= 2) {
        this.state.projectInfo.row1.rightText = product.item[1].key;
        this.state.projectInfo.row1.rightValue = product.item[1].value;
        if (length >= 3) {
          this.state.projectInfo.row2 = {};
          this.state.projectInfo.row2.leftText = product.item[2].key;
          this.state.projectInfo.row2.leftValue = product.item[2].value;
          if (length >= 4) {
            this.state.projectInfo.row2.rightText = product.item[3].key;
            this.state.projectInfo.row2.rightValue = product.item[3].value;
            this.state.projectInfo.row2.type = ' ';
          } else {
            this.state.projectInfo.row2.rightText = ' '; // 必须是空格
            this.state.projectInfo.row2.rightValue = ' '; // 必须是空格
            this.state.projectInfo.row2.type = ' ';
          }
        }
      } else {
        this.state.projectInfo.row1.rightText = ' '; // 必须是空格
        this.state.projectInfo.row1.rightValue = ' '; // 必须是空格
      }
    }

    const extra = product.extra;
    this.state.kycData = {
      riskLevel: extra.riskLevel,
      riskLevelDesc: extra.riskDescription || '本金收益稳定',
    };

    // 由于历史原因及运营配置错误导致maxCoinUseAmount=0,不加入判断条件/*&& (trade.maxCoinUseAmount > 0)*/
    const canUseCoin = trade && trade.extra && !!trade.coinSize && (trade.extra.maxCoinUseCount > 0);
    if (!this.data.hasChoickInvestVoucher) { // 从选择投资券页返回
      this.data.investVoucherList = trade.coinDetails;
    }
    this.data.maxCoinUseAmount = trade.maxCoinUseAmount;
    this.data.maxCoinUseCount = trade.extra.maxCoinUseCount;
    this.state.panelData = [];
    const row1 = {
      label: '投资金额',
      text: `${CurrencyUtils.formatCurrencyWithTwoDecimal(this.data.amount)}元`,
    };
    this.state.panelData.push(row1);
    const row2 = canUseCoin ? {
      label: '投资券抵扣',
      text: (this.data.investVoucherAmount > 0) ? `-${CurrencyUtils.formatCurrencyWithTwoDecimal(this.data.investVoucherAmount)}元` : '有可用',
      params: '',
      callback: this.gotoInvestTicketCallback,
    } : {
      label: '投资券抵扣',
      text: '无可用',
    };
    this.state.panelData.push(row2);
    this.data.paymentAmount = this.data.amount - (this.data.investVoucherAmount || 0);
    const row3 = {
      label: '实付金额',
      text: `<span class="TradeConfirm-amount">${CurrencyUtils.formatCurrencyWithTwoDecimal(this.data.paymentAmount)}<span>元`,
    };
    this.state.panelData.push(row3);
    this.state.disclaimerContent = extra.disclaimerContent;
    const contract = result.contract;
    const contracts = contract.map((item, index) => {
      return (<a key={index} onClick={this.clickContractCallback.bind(this, item)}>{(index === 0) ? '':'、'}《{item.name}》</a>);
    });

    const htmlContract = (<section>本人已阅读{contracts}，完全理解并接受上述文件的全部内容。本人的投资决策完全基于本人的独立自主判断做出，并自愿承担投资该项目所产生的相关风险和全部后果。</section>);

    this.state.checkboxData = {
      className: 'TradeConfirm-checkbox-color',
      checkboxDefaultStatus: false,
      checkedClass: 'icon-checkbox',
      uncheckedClass: 'icon-checkobxborder',
      callback: this.toggleCheckbox,
      content: htmlContract,
    };
  }

  clickContractCallback(item) {
    if (item.type === 'html') {
      FinanceActions.getContract({
        url: item.link,
      }, (data) => {
        this.forward('contract', {
          state: {
            title: item.name,
            type: item.type,
            html: data.result.contract, // TODO
          },
        });
      });
    } else if (item.type === 'link') {
      this.forward('contract', {
        state: {
          title: item.name,
          type: item.type,
          link: item.link,
        },
      });
    }
  }

  gotoInvestTicketCallback() {
    Statistic.logEvent({
      title: 'h5_confirminginvestment_coupon',
      category: this.props.route.path,
    });
    this.forward('investmentVoucher', {
      state: {
        list: this.data.investVoucherList,
        maxCoinUseAmount: this.data.maxCoinUseAmount,
        maxCoinUseCount: this.data.maxCoinUseCount,
        paymentAmount: this.data.amount,
      },
    });
  }

  toggleCheckbox(data) {
    this.setState({
      btnActiveStatus: data.status,
    });
  }

  comfirmInvest() {
    FinanceActions.getPaymentInfo({
      productId: this.data.productId, // in
      source: this.data.source, // in
      ver: this.data.ver, // in
      coins: '', // in coins page
      sid: this.data.sid, // in
      externalInfo: '', // 暂时不用,传空
      // 投资稳健理财需要,由用户输入
      province: '',
      city: '',
      district: '',
      address: '',
      productCategory: this.data.productCategory || '',
    }, (data) => {
      this.checkPaymentAndForward(data);
    });
  }

  checkPaymentAndForward(data) {
    Statistic.logEvent({
      title: 'h5_confirminginvestment_confirminginvestment',
      category: this.props.route.path,
    });

    const result = data.result;
    const payment = result.payment;
    const isSetPassword = result.isSetPassword;
    const supportedMethods = result.supportedMethods;
    this.forward('payConfirm', {
      state: {
        payment,
        isSetPassword,
        supportedMethods,
        paymentAmount: this.data.paymentAmount, // 付款总额
        coins: this.data.coins,
        sid: this.data.sid,
        source: this.data.source,
        productId: this.data.productId,
        productCategory: this.data.productCategory,
        ver: this.data.ver,
      },
    });
  }

  render() {
    const {
      isDataReady,
    } = this.state;

    if (!isDataReady) return null;
    const projectInfo = this.state.projectInfo;
    const kycData = this.state.kycData;
    const panelData = this.state.panelData;
    const checkboxData = this.state.checkboxData;
    return (
      <div className="TradeConfirm">
        <div className="TradeConfirm-warning"><span>为了保障资金安全，请勿连接不可信的Wi-Fi</span></div>
        <div className="TradeConfirm-projinfo">
          <ProjectBannerWith2ColsReverse type={"TwoColReverse"} projectInfo={projectInfo} />
        </div>
        <div className="TradeConfirm-kyc line-bottom">
          <KYCSimple {...kycData} />
        </div>
        <div className="TradeConfirm-panel">
          <PanelDoc className="TradeConfirm-DocPanel" body={panelData} />
        </div>
        <div className="TradeConfirm-checkbox">
          <Checkbox {...checkboxData} />
        </div>
        <div className="TradeConfirm-btn">
          <Button name="确认投资" inactive={!this.state.btnActiveStatus} className="" callback={this.comfirmInvest} />
        </div>
      </div>
    );
  }
}

export default TradeConfirm;
