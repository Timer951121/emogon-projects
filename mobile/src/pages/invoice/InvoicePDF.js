import React from 'react';
import { View, StyleSheet, ScrollView} from 'react-native';
import Pdf from 'react-native-pdf';

import { serverUrl } from '../../data/config';
import TopMenuComponent from '../layout/TopMenu';
import { MainCss, wholeHeight, wholeWidth } from '../../assets/css';


const PDFCss = StyleSheet.create({
	doc:{width:wholeWidth, height:wholeHeight-100},
});

export default class InvoicePDFComponent extends React.Component {
	constructor(props) {
		super(props);
		const {selInvoice} = props;
		this.state = {selInvoice};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		[].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	componentWillUnmount() {
		this.props.setSelInvoice(null);
	}

	render() {
		const {selInvoice} = this.props;
		const tempPDF = 'http://samples.leanpub.com/thereactnativebook-sample.pdf';
		const realPDF = serverUrl+'other/invoice_pdf/'+selInvoice+'.pdf';
		const source = { uri: realPDF, cache: true };
        //const source = require('./test.pdf');  // ios only
        //const source = {uri:'bundle-assets://test.pdf' };
        //const source = {uri:'file:///sdcard/test.pdf'};
        //const source = {uri:"data:application/pdf;base64,JVBERi0xLjcKJc..."};
        //const source = {uri:"content://com.example.blobs/xxxxxxxx-...?offset=0&size=xxx"};
        //const source = {uri:"blob:xxxxxxxx-...?offset=0&size=xxx"};
		// console.log();
		return (
			<View style={{...MainCss.backBoard, ...MainCss.flexColumn}}>
				<TopMenuComponent
					label='Rechnungen der Anlage'
					openProfile={()=>this.props.navigation.navigate('Profile')}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				<View style={{...MainCss.flex}}>
					<Pdf
						trustAllCerts={false}
						source={source}
						onLoadComplete={(numberOfPages, filePath) => { console.log(`Number of pages: ${numberOfPages}`); }}
						onPageChanged={(page, numberOfPages) => { console.log(`Current page: ${page}`); }}
						onError={(error) => { console.log(error); }}
						onPressLink={(uri) => { console.log(`Link pressed: ${uri}`); }}
						style={{...PDFCss.doc}}/>
				</View>
				{/* <FooterComponent onClickFooter={footerKey=>this.props.navigation.navigate(footerKey)}></FooterComponent> */}
			</View>
		);
	}
}
