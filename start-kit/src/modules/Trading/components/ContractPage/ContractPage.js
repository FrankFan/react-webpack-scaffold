import React from 'react';
import {
  LuPage,
  BCs,
} from 'lubase';

const {
  Contract
} = BCs;

class ContractPage extends LuPage {

  constructor(props) {
    super(props);
    this.data = {};
  }

  componentWillMount() {
    this.getInitData();
    this.setTitle({
      naviBar: {
        title: (this.data.title === '平台免责声明') ? this.data.title : '相关协议',
      },
      leftView: true,
    });

    window.scrollTo(0, 0);
  }

  getInitData() {
    const state = this.getState();
    this.data.title = state.title;
    this.data.type = state.type;
    this.data.link = state.link;
    this.data.html = state.html;
  }

  render() {

    let linkContractPage = (<Contract type={this.data.type} link={this.data.link} html={this.data.html} />);

    return (
      <section className="ContractPage">
        {linkContractPage}
      </section>
    );
  }
}

export default ContractPage;
