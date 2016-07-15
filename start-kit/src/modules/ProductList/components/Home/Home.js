import './Home.css';
import React from 'react';
import {
  Link,
} from 'react-router';
import { LuPage } from 'lubase';

class Home extends LuPage {

  componentWillMount() {
    this.setTitle({
      majorTitle: 'Home',
    });
  }

  render() {
    return (
      <div className="Home">
        <div className="Home-container">
          <ul>
            <li><Link to="/list">产品列表</Link></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Home;
