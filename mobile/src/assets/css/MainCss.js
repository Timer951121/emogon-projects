import { StyleSheet, Dimensions } from 'react-native';

export const wholeWidth = Dimensions.get('window').width, wholeHeight = Dimensions.get('window').height;
export const red = '#D9271C', white = '#FFFFFF', black = '#000000';

export default StyleSheet.create({
	backBoard:{ width: wholeWidth, height: wholeHeight, position: 'absolute', left: 0, top:  0, backgroundColor:white},
	flex: { display:'flex', alignItems: 'center', justifyContent: 'center', flexDirection:'row' },
	flexColumn: {display:'flex', alignItems: 'center', justifyContent: 'center', flexDirection:'column'},
	labelWrapper:{marginVertical:20},
	label: {color:black, fontSize:16},
	button:{height: 40, width: wholeWidth - 70, backgroundColor: red, borderRadius: 23, borderColor: red, borderWidth:3, marginVertical:10, display: 'flex', justifyContent: 'center', alignItems:'center', flexDirection:'row'},
	buttonIcon:{width: 27, height: 27, marginLeft: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'},
	buttonImg:{maxWidth:23, maxHeight:23},
	buttonLabel:{textAlign:'center', fontSize:16, flex:1},
	buttonIconLabel:{textAlign:'center', fontSize:16, flex:1, marginLeft:-20},
	input:{width: wholeWidth - 70, paddingLeft: 10, color:black},
});
