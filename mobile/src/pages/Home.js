import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, useColorScheme, Animated, View, } from 'react-native';
// import './Getusers.css';
import store from '../../../Components/Redux/Store/store';
import {connect} from 'react-redux';

class Home extends Component {
	constructor(props) {
		super(props)

		this.state = {
			list: []
		}

		store.subscribe(() => {
			this.setState({
				list: this.props.list
			})
		})

		console.warn(this.state.list)
	}



	render() {
		return (
			<View></View>
		)
	}
}

const mapStateToProps = state => {
	//replace Reducer name with state.'Your Reducer name' and .property
	return {
		list: state.getState.userList,
	};
};
const mapDispatchToProps = dispatch => {
	return {
		CallinComponent: () => {
			dispatch(MiddlewareName.ActionName());
		},
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);