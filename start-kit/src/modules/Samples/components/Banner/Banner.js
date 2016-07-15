import React, {
  Component,
} from 'react';

class Banner extends Component {

  constructor() {
    super();
    this.state = {
      BannerList: ['8888', '22222222222', '33333333333'],
    };
  }

  render() {
    let BannerListDom = [];
    for (let i = 0; i < this.state.BannerList.length; i++) {
      BannerListDom.push(<div key={i} className="Banner-slide">{this.state.BannerList[i]}</div>);
    }

    return (
      <div className="Banner">
        {BannerListDom}
      </div>
    );
  }
}

export default Banner;
