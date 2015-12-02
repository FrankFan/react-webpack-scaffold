import React from 'react';

import TodoList from './TodoList';

class TodoApp extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	items: [],
	    	text: ''
	    };

	    // 通过代理绑定事件
	    this.onChangeProxy = this.onChange.bind(this);
	    this.onSubmitProxy = this.onSubmit.bind(this);
	}
	onChange(event) {
		event.preventDefault();
		event.stopPropagation();

		this.setState({
			'text': event.target.value
		});
	}
	onSubmit(event) {
		event.preventDefault();
		event.stopPropagation();

		var inputText = this.state.text;
		if (inputText) {
			var nextItems = this.state.items.concat([inputText]);
			var nextText = '';
			this.setState({
				items: nextItems,
				text: nextText
			});
		}
	}
	render() {

		return (
			<div>
				<h3>TODO</h3>
				<form onSubmit={this.onSubmitProxy}>
					<input type="text" onChange={this.onChangeProxy} value={this.state.text} placeholder="说点什么?"/>
					<button>{'Add #' + (this.state.items.length + 1) }</button>
				</form>
				<TodoList items={this.state.items} />
			</div>
		);
	}
}
export default TodoApp