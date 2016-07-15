import {
  CAs,
  Http,
} from 'lubase';

class ProductListActions extends CAs {
  getProductList(channel, succ, fail) {
    const options = {
      url: '/m-h5/service/product/h5-list',
      query: {
        channel: channel
      }
    };

    Http.get(options, (nData) => {
      succ(nData);
    }, (err) => {
      fail(err);
    });
  }

}

export default new ProductListActions('ProductListActions');
