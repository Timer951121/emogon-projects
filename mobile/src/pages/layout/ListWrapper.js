import React from 'react';
import { Image, Text, View, StyleSheet} from 'react-native';
import { MainCss, red, white, wholeWidth } from '../../assets/css';

import imgChevron from '../../assets/images/chevron.png';
import { onTouchE, onTouchS } from '../../data/common';
import { position } from 'native-base/lib/typescript/theme/styled-system';

export const ListsCss = StyleSheet.create({
	listItem: { display: 'flex', flexDirection:'row', alignItems: 'center', width: wholeWidth - 60, marginVertical: 15, marginHorizontal:30}, // ,flex: 1
	icon : {width:31, height:31, position:'relative'},
	iconImg: {maxWidth:31, maxHeight:31, resizeMode: 'contain'},
	label:{flex:1, marginLeft:20},
	chevronImg:{width:8, height:8},
});

export default class ListWrapper extends React.Component {
	constructor(props) {
		super(props);
		const {unRead} = props;
		this.state = {unRead};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['unRead'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				// if (key==='moduleStr') {
				// 	this.setState({moduleArr:JSON.parse(nextProps[key])})
				// }
			}
		});
	}

	render() {
		const {listArr, iconHide} = this.props, {unRead} = this.state;
		return (
			<View style={{...MainCss.flexColumn}}>
				{listArr.map((item, idx)=>
					<View onTouchStart={e=>onTouchS(e, this) }
						onTouchEnd={e =>onTouchE(e, this, 'list', item.key) }
						style={{...ListsCss.listItem}} key={idx}>
						{!iconHide &&
							<View style={{...ListsCss.icon}}>
								<Image source={item.img} style={{...ListsCss.iconImg}}></Image>
								{(item.key==='ticketList' || item.key==='support') && unRead > 0 &&
									<View style={{...MainCss.flex, position:'absolute', bottom:-8, right:-8, width:20, height:20, backgroundColor:red, borderRadius:10}}>
										<Text style={{color:white, marginTop:-1.5}}>{unRead}</Text>
									</View>
								}
							</View>
						}
						<Text style={{...MainCss.label, ...ListsCss.label}}>{item.label}</Text>
						<View>
							<Image source={imgChevron} style={{...ListsCss.chevronImg}}></Image>
						</View>
					</View>
				)}
			</View>
		);
	}
}
