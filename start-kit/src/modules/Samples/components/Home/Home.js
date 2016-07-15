import React, {
  Component,
} from 'react';
import {
  Link,
} from 'react-router';

class Home extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="Home">
        <div className="Home-container">
          <ul>
            <li><Link to="#">通用投资流程</Link></li>
            <li><Link to="#">一账通</Link></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Home;
