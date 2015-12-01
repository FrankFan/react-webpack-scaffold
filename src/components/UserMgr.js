require('normalize.css');
require('../styles/UserMgr.css');

import React from 'react';

import AddComponent from './Add';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="userMgr">
        <AddComponent />
      </div>
    );
  }
}

export default AppComponent;
