class FundHomepageActions {

  constructor() {
    this.state = {
      test: 'testv',
    };
  }
  static propTypes = {
    error: 'yyyyyy',
  };

  addHotFundList() {
    const datas = [{
      title: 'title',
      desc: 'desc',
      increaseRate: 125,
      increaseRateDesc: 'increaseRateDesc',
    }, {
      title: 'title',
      desc: 'desc',
      increaseRate: 125,
      increaseRateDesc: 'increaseRateDesc',
    }, {
      title: 'title',
      desc: 'desc',
      increaseRate: 125,
      increaseRateDesc: 'increaseRateDesc',
    }];
    return Promise.resolve(datas);
  }

  pushView() {
    window.Bridge.call({
      task: 'push_view',
      module: 'todos1',
      webUrl: '/finance/ljbopen/finance_ljbopen.html',
      naviBarTitle: 'baidu',
      refreshType: '0',
    });
  }
}

export default new FundHomepageActions();
