import React, {
  PropTypes,
  Component,
}
from 'react';

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  constructor() {
    super();
    this.state = {
      test: 'testv',
    };
    this.clickHandleProxy = this.clickHandle.bind(this);
  }

  clickHandle() {
    // let tasks = new TodoTasks();
    // console.log(tasks.task1(2));
  }


  render() {
    return !this.props.error ? (<section> {this.props.children} </section>) : this.state.test;
  }
}

export default App;
