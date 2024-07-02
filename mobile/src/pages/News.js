import React from 'react';
import { Image, Text, View, ScrollView, StyleSheet} from 'react-native';
import RenderHtml from 'react-native-render-html';

import TopMenuComponent from './layout/TopMenu';
import { apiUrl } from '../data/config';

import { MainCss, wholeWidth, red } from '../assets/css';

import imgNews from '../assets/images/news.png';
import imgEmptyNews from '../assets/images/empty-news.jpg';

export const NewsCss = StyleSheet.create({
	iconLine:{height:2, backgroundColor:'#C5C5C5', width: wholeWidth-80},
	topIcon:{height: 60, width:60, marginHorizontal:20, resizeMode: 'contain', opacity: 0.5},
	newsItem:{paddingVertical:20, paddingHorizontal:20, borderBottomColor:'#C5C5C5', borderBottomWidth:2},
	newsImg:{width:wholeWidth - 40, height:120, resizeMode:'contain', marginVertical:10}
})

export default class NewsComponent extends React.Component {
	constructor(props) {
		super(props);
		const {newsArr, mainInfo} = props;
		this.state = {newsArr, mainInfo};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['newsArr', 'mainInfo'].forEach(key => {// 'pageKey', 
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	onClickModule = (detailKey) => {
		this.props.setDetailKey(detailKey);
		this.props.navigation.navigate('Detail');
	}

	render() {
		const {newsArr, mainInfo} = this.state;
		return (
			<View style={{...MainCss.backBoard}}>
				<TopMenuComponent
					label={'Enerq News'}
					hideProfile={!(mainInfo&&mainInfo.first)}
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				<View style={{...MainCss.flex, width:wholeWidth, height:70}}>
					<View style={{...NewsCss.iconLine}}></View>
					<Image source={imgNews} style={{...NewsCss.topIcon}}></Image>
					<View style={{...NewsCss.iconLine}}></View>
				</View>
				
				<View style={{flex:1, flexGrow: 1, marginBottom:20}} contentContainerStyle={{ flex:1, flexGrow: 1 }}>
					<ScrollView>
						{newsArr.map((news, idx)=>
							<View style={{...NewsCss.newsItem}} key={idx}>
								<Text style={{...MainCss.label}}>{news.timeStr}</Text>
								<Text style={{...MainCss.label, ...MainCss.title, color:red}}>{news.title}</Text>
								{news.image !== '' &&
									<Image style={{...NewsCss.newsImg}} source={{uri : apiUrl+'other/images/'+news.image+'.jpg'}} ></Image>
								}
								{news.image === '' &&
									<Image style={{...NewsCss.newsImg}} source={imgEmptyNews} ></Image>
								}
								<RenderHtml
								 	style={{...MainCss.label}}
									contentWidth={wholeWidth}
									source={{html:news.preViewStr}}
								/>
							</View>
						)}
						
					</ScrollView>
				</View>
			</View>
		);
	}
}
