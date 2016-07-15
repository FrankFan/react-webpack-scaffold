import React, {
  Component,
}
from 'react';

class SideBar extends Component {

  constructor() {
    super();
    this.state = {
      SideBarList: [{
        title: 'uuu1',
        items: [{
          title: 'test',
          items: [],
        }, {
          title: 'test',
          items: [],
        }, {
          title: 'test',
          items: [],
        }, {
          title: 'test',
          items: [],
        }, {
          title: 'test',
          items: [],
        }, {
          title: 'test',
          items: [],
        }],
      }],
      yyy: 0,
    };
    this.count = 0;
    ['handleCollapse', 'handleRipple'].forEach(name => {
      this[name] = this[name].bind(this);
    });
  }

  handleCollapse(e) {
    // console.log(this);
    const el = e.currentTarget;
    const dd = el.nextElementSibling;
    const hidden = !dd.classList.contains('expand');
    // dd.hidden = hidden;
    const svgclsList = el.querySelectorAll('svg')[0].classList;
    const aLen = dd.querySelectorAll('a').length;
    const ddClsList = dd.classList;
    if (hidden) {
      svgclsList.remove('trans0');
      svgclsList.add('trans180');

      ddClsList.remove('collapse');
      ddClsList.add('expand');
      dd.style.height = `${aLen * 34}px`;
    } else {
      svgclsList.remove('trans180');
      svgclsList.add('trans0');

      ddClsList.remove('expand');
      ddClsList.add('collapse');
      dd.style.height = '0px';
    }
  }

  handleRipple(e) {
    const el = e.currentTarget;
    // const dom = (<div className="ripple-container-inner" style={{top:'20px',left:'20px'}}></div>);
    const myel = document.createElement('div');
    myel.innerText = 'ufo';
    el.appendChild(myel);
    // document.body.appendChild(myel);
    // document.querySelectorAll('#lu-logo')[0].appendChild(myel);
    this.count++;
    if (this.count === 3) {
      this.setState({
        SideBarList: [{
          title: 'yyy',
          items: [{
            title: 'test',
            items: [],
          }, {
            title: 'test',
            items: [],
          }, {
            title: 'test',
            items: [],
          }, {
            title: 'test',
            items: [],
          }, {
            title: 'test',
            items: [],
          }, {
            title: 'test',
            items: [],
          }],
        }],
        yyy: 1,
      });
    }
  }

  render() {
    let SideBarListDom = this.state.SideBarList.map((item, index) => {
      let icon = (
        <span className="item-icon">
          <svg version="1.1" x="0px" y="0px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false">
            <path d="M24 16l-12 12 2.83 2.83 9.17-9.17 9.17 9.17 2.83-2.83z"></path>
            <path d="M0 0h48v48h-48z" fill="none"></path>
          </svg>
        </span>);
      if (item.items.length === 0) {
        icon = null;
      }
      const subItems = item.items;
      const subItemDom = [];
      for (let j = subItems.length - 1; j >= 0; j--) {
        const subItem = subItems[j];
        subItemDom.push(<a key={j} data-ufo={j} onClick={this.handleRipple}>{subItem.title}</a>);
      }
      return (
        <div key={index} ufo={index} className="SideBar-wrapper">
          <dt onClick={this.handleCollapse}>
            <span className="item-text">{item.title}</span>
            {icon}
            <span className="ripple-container">
            </span>
          </dt>
          <dd className="expand" style={{ height: `${36 * subItems.length}px` }} data-yyy={this.state.yyy}>
            {subItemDom}
          </dd>
        </div>
      );
    });

    return (
      <div>
        <span id="lu-logo">
          <img src={require('../../public/images/lulogo.png')} alt="Logo" />
          <img src={require('./my.jpg')} alt="Logo" />
        </span>
        <nav className="SideBar">
          <dl className="SideBar-dl">
            {SideBarListDom}
          </dl>
        </nav>
      </div>
    );
  }
}

export default SideBar;
