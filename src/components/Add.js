import React from 'react';

class AddComponent extends React.Component {
	
	render() {
		return (
			<a href="#add" onClick={onClick}>新增用户</a>
		)
	}
	onClick() {
		console.log('click');
	}
}

export default AddComponent;