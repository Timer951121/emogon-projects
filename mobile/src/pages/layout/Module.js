import React from 'react';
import { Image, Text, View, StyleSheet, ScrollView} from 'react-native';
import { MainCss, white } from '../../assets/css';
import { red, wholeWidth } from '../../assets/css';
import { onTouchE, onTouchS } from '../../data/common';

import imgVoltaic from '../../assets/images/voltaic.png';
import imgPump from '../../assets/images/pump.png';
import imgStorage from '../../assets/images/storage.png';
import imgCharge from '../../assets/images/charge.png';
import imgCarport from '../../assets/images/carport.png';

const styles = StyleSheet.create({
	moduleLabel:{ marginLeft: 50, width:wholeWidth},
	label:{flex:1, textAlign:'center', color:'#000'},
	iconImg:{height:36, width:36, margin:10, resizeMode: 'contain'},
	moduleButton:{height:101, width:wholeWidth/2-33, flex:1, marginVertical:5, marginHorizontal:7},
	moduleImg:{maxHeight:40, maxWidth:40, marginBottom:10, resizeMode: 'contain'},
	moduleLabel:{fontSize:16}
});

const moduleOrder = [
	{key:'voltaic', img:imgVoltaic, label:'Photovoltaik'},
	{key:'pump', img:imgPump, label:'Wärmepumpe'},
	{key:'storage', img:imgStorage, label:'Speicher'},
	{key:'charge', img:imgCharge, label:'Ladestation'},
	{key:'carport', img:imgCarport, label:'Carport'}
]

function GetModuleArr(roleInfo) {
	if (!roleInfo) return [];
	const sortRoleArr = [];
	moduleOrder.forEach(item => {
		if (roleInfo[item.key]) sortRoleArr.push({...item, value:true});
	});
	moduleOrder.forEach(item => {
		if (!roleInfo[item.key]) sortRoleArr.push({...item, value:false});
	});
	return [[sortRoleArr[0], sortRoleArr[1], sortRoleArr[4] ], [sortRoleArr[2], sortRoleArr[3], null]];
}

export default class ModuleComponent extends React.Component {
	constructor(props) {
		super(props);
		const {roleInfo} = props, moduleArr = GetModuleArr(roleInfo);
		this.state = {roleInfo, moduleArr};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['roleInfo'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				if (key==='roleInfo') {
					this.setState({moduleArr:GetModuleArr(nextProps.roleInfo)});
				}
				this.setState({[key]:nextProps[key]});
			}
		});
	}
	
	render() {
		const {moduleArr} = this.state;
		return (
			<>
				<Text style={{...MainCss.label, ...styles.moduleLabel, textAlign:'left', marginLeft:30}}>{this.props.moduleLabel}</Text>
				<View style={{width:wholeWidth, height:240}}>
					<ScrollView style={{width:wholeWidth}} horizontal={true}>
						<View style={{...MainCss.flexColumn, marginHorizontal:15}}>
							{moduleArr.map((row, rowIdx)=>
								<View key={rowIdx} style={{display:'flex', flexDirection:'row'}}>
									{row.map((item, itemIdx)=>
										item?
											<View
												onTouchStart={e=> {
													if (!item.value) return;
													onTouchS(e, this);
												} }
												onTouchEnd={e => {
													if (!item.value) return;
													onTouchE(e, this, 'module', item.key);
												} }
												style={{...MainCss.button, ...styles.moduleButton, backgroundColor:item.value?red:'#D9271C44'}}
												key={itemIdx}
											>
												<View style={{...MainCss.flexColumn}}>
													<Image source={item.img} style={{...styles.moduleImg}}></Image>
													<Text style={{...styles.moduleLabel, color:white}}>{item.label}</Text>
												</View>
											</View>:
											<View style={{...styles.moduleButton}} key={itemIdx}></View>
									)}
								</View>
							)}
						</View>
					</ScrollView>
				</View>
			</>
		);
	}
}
