import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';


class UserSignOut extends Component {
	render(){
		return (<Redirect to="/courses" />);
	}
}



export default UserSignOut;




