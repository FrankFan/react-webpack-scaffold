import './List.css';
import React from 'react';
import {
  BCs,
  LuPage,
  Utils,
} from 'lubase';
const {
  Statistic,
  Platform,
  HashUtils,
} = Utils;
const {
  ListCard,
  EmptyPage,
} = BCs;
import ProductListActions from '../../actions/ProductListActions';

class List extends LuPage {
  constructor(props) {
    super(props, {
      PVKey: 'h5_list',
    });

    ['getProductList', 'goToDetailPage'].forEach((methodName) => {
      this[methodName] = this[methodName].bind(this);
    });

    this.state = {
      productListData: {
        list: [],
      },
      isDataReady: false,
    };
  }

  componentWillMount() {
    const title = {
      naviBar: {
        title: '投资理财',
      },
    };
    this.setTitle(title);
    this.getProductList();
  }

  getChannel() {
    let channel = '';
    const browser = Platform.browser;
    if (browser.iPhone === true || browser.iPad === true || browser.iPod === true) {
      channel = 'H5_IOS';
    } else if (browser.android === true) {
      channel = 'H5_ANDROID';
    } else {
      channel = 'H5_OTHER';
    }
    return channel;
  }

  getActionId() {
    const actionId = HashUtils.getHashQuery('actionId') || '';
    return actionId;
  }

  getMarketFeedbackCode() {
    const valueArray = location.search.split('marketFeedbackCode=');
    let marketFeedbackCodeValue = '';
    if (valueArray.length > 1) {
      marketFeedbackCodeValue = valueArray[valueArray.length - 1].split('&')[0];
    }
    const marketFeedbackCode = marketFeedbackCodeValue;
    return marketFeedbackCode ? marketFeedbackCode : '';
  }

  getProductList() {
    let channel = this.getChannel();

    ProductListActions.getProductList(channel, (nData) => {
      if (nData && nData.result) {
        const result = nData.result;
        this.formateData(result);
      }
    }, (err) => {
      console.log(err);
    });
  }

  formateData(result) {
    const arrList = [];
    // result = { "list": []};

    result.list.forEach((item) => {
      let arrAttrIcons = [];
      let arrPromoteIcons = [];
      // 有人组信息
      if (item.groupInfo && item.groupInfo.length > 0) {
        arrAttrIcons = item.groupInfo.map((itemTxt) => {
          return {
            type: '',
            iconTxt: itemTxt,
            content: '',
          };
        });
      }

      // 有奖励信息
      if (item.investRewardInfo && item.investRewardInfo.length > 0) {
        arrPromoteIcons = item.investRewardInfo.map((itemReward) => {
          const giftIcon = {};
          if (itemReward.ruleType && itemReward.description) {
            giftIcon.iconTxt = itemReward.ruleName;
            giftIcon.content = itemReward.description;
          }
          return giftIcon;
        });
      }

      let lockPeriod = item.lockPeriod || '';

      arrList.push({
        title: item.productNameDisplay,
        interestRate: (+item.interestRatePerSevenDay * 100).toFixed(2),
        interestRateUnit: '%',
        lockPeriod: lockPeriod,
        lockPeriodUnit: lockPeriod === '' ? '灵活赎回' : '天锁定期',
        interestDesc: '七日年化收益率',
        minInvestAmount: item.minInvestAmount,
        minInvestUnit: '元起',
        productCategory: item.productCategory,
        productId: item.productId,
        discount: {
          attrIcons: arrAttrIcons,
          promoteIcons: arrPromoteIcons,
        },
      });
    });

    this.setState({
      productListData: {
        list: arrList,
      },
      isDataReady: true,
    });
  }

  goToDetailPage(event, productId, productCategory) {
    Statistic.logEvent({
      title: `h5_list_${productId}`,
      category: this.props.route.path || 'list',
    });
    const channel = this.getChannel();
    const actionId = this.getActionId();
    const marketFeedbackCode = this.getMarketFeedbackCode();    
    // const url = `https://m.lu.com/m-h5/product/lhb#/productDetail?productId=${productId}&channel=${channel}`;
    const url = `${location.origin}/m-h5/product/lhb#/productDetail?productId=${productId}&channel=${channel}&actionId=${actionId}&marketFeedbackCode=${marketFeedbackCode}`;
    // console.log(url)
    this.jump(url);
  }

  render() {
    if (this.state.isDataReady === false) {
      return null;
    }

    if (this.state.productListData.list && this.state.productListData.list <= 0) {
      return (<EmptyPage type="list" description="暂无投资理财项目" />);
    }

    const listDOM = this.state.productListData.list.map((item, index) => {
      return (
        <ListCard
          key={index}
          className="Item"
          data={item}
          attrIcons={item.discount.attrIcons}
          promoteIcons={item.discount.promoteIcons}
          callback={this.goToDetailPage}
        />
      );
    });

    return (
      <section className="List line-bottom">
        {listDOM}
      </section>
    );
  }
}

export default List;
