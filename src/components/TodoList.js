import React from 'react';

class TodoList extends React.Component {
	createItem(itemText, index) {
		return (<li key={index}>{itemText}</li>);
	}
	render() {
		return (
			<ul>{this.props.items.map(this.createItem)}</ul>
		);
	}	
}

export default TodoList