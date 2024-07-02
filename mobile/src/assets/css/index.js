import { StyleSheet, Dimensions, StatusBar} from 'react-native';

export const wholeWidth = Dimensions.get('window').width, wholeHeight = parseInt(Dimensions.get('window').height); //  - StatusBar.currentHeight
export const red = '#D9271C', white = '#FFFFFF', black = '#000000', green = '#00BB07', grey = '#4D4D4D88', whiteGrey = '#C5C5C5';

const MainCss = StyleSheet.create({
	backBoard:{ width: parseInt(wholeWidth), height: '100%', backgroundColor:white, overflow:'hidden'}, // wholeHeight, position: 'absolute', left: 0, top:  0 parseInt(wholeHeight)
	flex: { display:'flex', alignItems: 'center', justifyContent: 'center', flexDirection:'row' },
	flexColumn: {display:'flex', alignItems: 'center', justifyContent: 'center', flexDirection:'column'},
	labelWrapper:{marginVertical:20},
	label: {color:black, fontSize:16, fontFamily:'SF Pro Rounded'},
	title:{fontSize:20, fontWeight:700, fontFamily:'SF Pro Rounded'},
	button:{height: 46, width: wholeWidth - 70, backgroundColor: red, borderRadius: 23, marginVertical:10, borderWidth:0, display: 'flex', justifyContent: 'center', alignItems:'center', flexDirection:'row'},
	buttonEmpty:{backgroundColor: white, borderColor: red, borderWidth:3},
	buttonIcon:{width: 27, height: 27, marginLeft: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', resizeMode:'contain'},
	buttonImg:{maxWidth:23, maxHeight:23, resizeMode: 'contain'},
	buttonExpand:{height:60, borderRadius:20},
	buttonLabel:{textAlign:'center', fontSize:16, flex:1, color:white, fontFamily:'SF Pro Rounded'},
	buttonIconLabel:{textAlign:'center', fontSize:16, flex:1, marginLeft:-20, color:white, fontFamily:'SF Pro Rounded'},
	input:{width: wholeWidth - 70, paddingLeft: 10, fontSize:18, color:black, borderBottomColor: '#C5C5C5', borderBottomWidth:2, paddingBottom: 3, fontFamily:'SF Pro Rounded'},
	selectButton:{width:wholeWidth - 100, backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#C9C9C9', marginBottom:20, borderRadius:7}
});

const ModalCss = StyleSheet.create({
	back: { position:'absolute', width:wholeWidth, height:wholeHeight, left:0, top:0, display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', backgroundColor:'#00000088'},
	wrapper:{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', width:wholeWidth-60, height:wholeHeight*0.6, backgroundColor:white, borderRadius:8, position:'relative', backgroundColor:white, paddingTop:20},
	image:{width:wholeWidth-80, height:480, resizeMode:'contain'},
	close:{position:'absolute', top:10, right:10, display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', width:30, height:30, backgroundColor:'white'},
	closeImg:{width:16, height:16, resizeMode:'contain', opacity:0.7}
});

export {MainCss, ModalCss};