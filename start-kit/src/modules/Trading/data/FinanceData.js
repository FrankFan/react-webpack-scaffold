import {
  SessionCache,
} from 'lubase';


class InvestVoucherCache extends SessionCache {
  constructor() {
    const options = {
      lifeTime: '1D',
      key: 'invest_voucher_key',
    };
    super(options);
  }
}

class TradeConfirmCache extends SessionCache {
  constructor() {
    const options = {
      lifeTime: '1D',
      key: 'finance_trade_confirm_key',
    };
    super(options);
  }
}

class PayConfirmCache extends SessionCache {
  constructor() {
    const options = {
      lifeTime: '1D',
      key: 'finance_pay_confirm_key',
    };
    super(options);
  }
}

const FinanceData = {
  InvestVoucherCache: InvestVoucherCache.getInstance(),
  TradeConfirmCache: TradeConfirmCache.getInstance(),
  PayConfirmCache: PayConfirmCache.getInstance(),
};

export default FinanceData;
