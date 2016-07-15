import './Home.css';
import React from 'react';
import {
  Link,
} from 'react-router';
import {
  LuPage,
} from 'lubase';

class Home extends LuPage {
  componentWillMount() {
    this.setTitle({
      naviBar: {
        title: 'Home',
      },
    });
  }

  render() {
    return (
      <div className="Home">
        <div className="Home-container">
          <ul>
            <li><Link to="/tradeConfirm?channel=H5_Other&from=https%3A%2F%2Fwww.baidu.com&params=%7B%22productId%22%3A13418762%2C%22amount%22%3A350%2C%22source%22%3A%22H5_OTHER%22%2C%22channel%22%3A%220%22%2C%22salesArea%22%3A%22%22%2C%22productCategory%22%3A%22806%22%7D">投资确认</Link></li>
            <li><Link to="/payConfirm">支付确认</Link></li>
            <li><Link to="/tradeResult">投资结果页</Link></li>
            <li><Link to="/contract">合同协议</Link></li>
            <li><Link to="/investmentVoucher">投资券组件</Link></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Home;
