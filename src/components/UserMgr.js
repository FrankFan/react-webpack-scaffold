require('normalize.css');
require('../styles/UserMgr.css');

import React from 'react';

import AddComponent from './Add';

let acImage = require('../images/ac.jpg');

class AppComponent extends React.Component {
  render() {
    return (
      <div className="userMgr">
        {/*<img src={acImage} alt="" />*/}
        <AddComponent />
      </div>
    );
  }
}

export default AppComponent;
