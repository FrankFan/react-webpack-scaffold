import React from 'react';

class AddComponent extends React.Component {
	onClick(e) {
		console.log('click', e);
	}

	render() {
		return (
			<a href="#add" onClick={this.onClick}>新增用户</a>
		)
	}
	
}

export default AddComponent;