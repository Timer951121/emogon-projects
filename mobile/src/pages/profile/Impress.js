import React from 'react';
import { View, ScrollView } from 'react-native';
import RenderHtml from 'react-native-render-html';

import TopMenuComponent from '../layout/TopMenu';

import { MainCss, black, wholeHeight, wholeWidth } from '../../assets/css';

const htmlStr = `<div>
<p style="color: black; text-align: center;"><strong><em>Kontakt-Adresse</em></strong></p>
<p style="color: black; text-align: center;">ENERQ<br>Eiweg 10<br>4460 Gelterkinden<br>Schweiz</p>
<p style="color: black; text-align: center;">E-Mail:<br>info@enerq.ch</p>
<p style="color: black;"></p>
<p style="color: black;"><strong><em>Vertretungsberechtigte Person(en)</em></strong></p>
<p style="color: black;"><span>Marco Serrago</span><br><br><strong><em>Handelsregister-Eintrag</em></strong></p>
<p style="color: black;"><span>Eingetragener Firmenname:</span><br><strong>ENERQ</strong><br><span>Unternehmens-Nr (UID):</span><br><strong>CHE-289.095.977</strong><br><br>Mehrwertsteuer-Nummer<br><strong>CHE-289.095.977 MWST</strong><br></p>
<p style="color: black;"><strong><em>Haftungsausschluss</em></strong></p>
<p style="color: black;"><span>Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen.</span>Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen.</p>
<p style="color: black;">Alle Angebote sind unverbindlich. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne besondere Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.</p>
<p style="color: black;"></p>
<p style="color: black;"><strong><em>Haftungsausschluss für Links</em></strong></p>
<p style="color: black;">Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs. Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Der Zugriff und die Nutzung solcher Webseiten erfolgen auf eigene Gefahr des jeweiligen Nutzers.</p>
<p style="color: black;"></p>
<p style="color: black;"><strong><em>Urheberrechte</em></strong></p>
<p style="color: black;">Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf dieser Website, gehören ausschliesslich&nbsp;<strong>der Firma ENERQ</strong>&nbsp;oder den speziell genannten Rechteinhabern.Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung des Urheberrechtsträgers im Voraus einzuholen.</p>
<p style="color: black;"></p>
<p style="color: black;">Q<span>uelle:&nbsp;</span></p>
<p style="color: black;"><a href="https://www.swissanwalt.ch" target="_blank"><strong>SwissAnwalt</strong></a></p>
</div>`;

export default class ImpressComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
	}
	componentWillUnmount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
	}

	render() {
		return (
			<View style={{...MainCss.backBoard}}>
				<TopMenuComponent
					label={'Impressum'}
					hideProfile={true}
					goBack={e=>this.props.navigation.goBack()}
				></TopMenuComponent>
				<View style={{flex:1, flexGrow: 1, width:wholeWidth-40, marginLeft:20}} contentContainerStyle={{ flex:1, flexGrow: 1 }}>
					<ScrollView>
						<RenderHtml
							style={{...MainCss.label}}
							contentWidth={wholeWidth-40}
							source={{html:htmlStr}}
						/>
					</ScrollView>
				</View>
			</View>
		);
	}
}
