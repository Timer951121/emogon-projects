import React from 'react';
import { View, ScrollView } from 'react-native';
import RenderHtml from 'react-native-render-html';

import TopMenuComponent from '../layout/TopMenu';

import { MainCss, wholeHeight, wholeWidth } from '../../assets/css';

const htmlStr = `<div>
<h1 style="color:black; text-align: center;"><strong>Allgemeine Geschäftsbedingungen (AGB)</strong></h1>
</div>
<div>
<p style="color:black; text-align: center;"><strong>Stand September 2022</strong></p>
<p style="color:black;"><strong>1. Grundlagen und Geltungsbereich</strong></p>
<p style="color:black;">1.1 Die vorliegenden Allgemeinen Geschäftsbedingungen gelten für das Vertragsverhältnis zwischen dem Kunden und der ENERQ GmbH (Unternehmer).</p>
<p style="color:black;">Abweichende Vereinbarungen bedürfen der gegenseitigen Schriftform, (per E-Mail zulässig).</p>
<p style="color:black;">1.2 Von diesen AGB abweichende Vereinbarungen, insbesondere AGB der Kunden oder Dritter, werden nur anerkannt, wenn der Unternehmer ausdrücklich schriftlich zustimmt.</p>
<p style="color:black;">1.3 Sollte eine Bestimmung der vorliegenden AGB nichtig oder nicht durchsetzbar sein oder werden, so werden die AGB insgesamt dadurch nicht berührt. An die Stelle der unwirksamen oder nicht durchsetzbaren Bestimmungtritt eine neue Klausel, die nach Sinn und Zweck den AGB und in ihrer wirtschaftlichen Auswirkung der zu ersetzenden Bestimmung möglichst entspricht.</p>
<p style="color:black;">1.4 Sollte kein Werkvertrag existieren, oder sollte im Werkvertrag keine Reihenfolge festgelegt sein, so treten diese AGB an die erste Stelle.</p>
<p style="color:black;">1.5 In Ergänzung zu den vorliegenden AGB gelangen folgende Normen in untenstehender Reihenfolge zur Anwendung:</p>
<p style="color:black;">SIA Norm 118: Allgemeine Bedingungen für Bauarbeiten (soweit in diesen AGB nicht davon abgewichen wird)</p>
<p style="color:black;">SIA Norm 137: Elektrische Anlagen</p>
<p style="color:black;">SIA Norm 108: Ordnung für Leistungen und Honorare der Maschinen- / Elektroingenieure etc.</p>
<p style="color:black;">Bestimmungen des Schweizerischen Obligationenrechts.</p>
<p style="color:black;"><br></p>
<p style="color:black;"><strong>2. Angebot und Auftragserteilung</strong></p>
<p style="color:black;">2.1 Ein Auftrag wird<strong>schriftlich</strong>abgeschlossen.Der Kunde erteilt den Auftrag mit Bezug auf das entsprechende Angebot.</p>
<p style="color:black;">2.2 Anlagebeschriebe, Entwürfe, Modelle, Zeichnungen und Berechnungen sind Eigentum des Unternehmers und dürfen ohne<strong>schriftliche</strong>Genehmigung weder vervielfältigt noch Drittpersonen zugänglich gemacht werden. Angebote sind in Bezug auf Preise und Lieferfristen freibleibend. Lohn- und Materialpreisänderungen könnenin Rechnung gestellt werden.</p>
<p style="color:black;">2.3 Wo nicht ausdrücklich spezifiziert, ist der Unternehmer in der Fabrikatswahl frei.</p>
<p style="color:black;">2.4 Erfolglose Angebote, können im Aufwand verrechnet werden.</p>
<p style="color:black;">2.5 Der Unternehmer unterbreitet dem Kunden ein<strong>schriftliches</strong>Angebot. Wenn im Angebot nichts anderes festgehalten ist, bleibt der Unternehmer während drei Monaten ab Datum des Angebots gebunden.</p>
<p style="color:black;">2.6 Im Angebot sind die Leistungen und Lieferungen des Unternehmers abschliessend umschrieben.</p>
<p style="color:black;">Vorbehalten bleiben Zusatzarbeiten/Nachträge und Änderungen/Mehrleistungen.</p>
<p style="color:black;">2.7 Enthält das Angebot Richtpreise, so sind diese nicht verbindlich. Die entsprechenden Lieferungen und Leistungen werden bei der Erstellung laufend erfasst und zu Vertragskonditionen in Rechnung gestellt, sofern<strong>schriftlich</strong>nichts anderes vereinbart ist. Wird der Richtpreis überschritten, wird dies dem Kunden mitgeteilt.</p>
<p style="color:black;">2.8 Wenn im Angebot nichts anders erwähnt ist, werden geleistete Überzeit-, Nacht- und Sonntagsarbeit nach den Verrechnungsansätzen für Regie in Rechnung gestellt.</p>
<p style="color:black;"><br></p>
<p style="color:black;"><strong>3. Zusatzarbeiten, Änderungen, Nachträge</strong></p>
<p style="color:black;">3.1 Zusatzarbeiten/Nachträge respektive Auftragserweiterungen erfolgen auf<strong>schriftlichen</strong>Wunsch des Kunden.</p>
<p style="color:black;">3.2 Änderungen/Mehrleistungen liegt dem Angebot ein Werkbeschrieb zu Grunde, so bedürfen Abweichungen der<strong>gegenseitigen Schriftlichkeit</strong>. Der daraus resultierende Aufwand wird entschädigt, sofern<strong>schriftlich</strong>nichtsanderes vereinbart ist.</p>
<p style="color:black;">3.3 Stellt der Unternehmer fest, dass die vereinbarte Ausführung des Werkes Mehrleistungen (Arbeit, Material etc.) zur Folge hat, die er bei der Erstellung des Angebots nicht kannte oder kennen konnte, hat er den Kunden<strong>schriftlich</strong>zu informieren. Ohne<strong>schriftliche Einsprache</strong>durch den Kunden innerhalb von 5 Arbeitstagen nach Erhalt, gelten die Mehrleistungen als genehmigt und die Kosten gehen zu Lasten des Kunden.</p>
<p style="color:black;">3.4 Äussere Umstände, welche die Vertragserfüllung des Unternehmers tangieren, teilt der Kunde unmittelbar nach Kenntnisnahme<strong>schriftlich</strong>mit. Sofern nichts anderes vereinbart ist, ist der daraus resultierende Mehraufwand zu entschädigen.</p>
<p style="color:black;"><br></p>
<p style="color:black;"><strong>4. Regiearbeiten</strong></p>
<p style="color:black;">4.1 Unter Regiearbeiten werden Arbeiten und Leistungen verstanden, welche nicht auf einem Angebot basieren bzw. vom Kunden zusätzlich gewünscht werden. Ebenso gelten Arbeiten und Leistungen bei fehlenden Einheitspreisen sowie Änderungen und Schäden als Folge von, vom Kunden zu verantwortende Projektierungsfehlern, als Regiearbeiten.</p>
<p style="color:black;">4.2 Ausgeführte Regiearbeiten (inkl. Material) werden mittels Arbeitsrapport erfasst, welcher dem Kunden oderseiner Vertretung zur Kenntnisnahme unterbreitet wird und von dieser Person zu unterschreiben ist.Ohne<strong>schriftliche Einsprache</strong>durch den Kunden innerhalb von<strong>5 Arbeitstagen</strong>nach Erhalt, gelten die Mehrleistungen als genehmigt und die Kosten gehen zu Lasten des Kunden.</p>
<p style="color:black;">4.3 Die Reisezeit wird als normale Arbeitszeit verrechnet.Pro Arbeitstag wird eine Fahrzeugpauschale in Rechnung gestellt.</p>
<p style="color:black;">4.4 Material und Apparatepreise gelten ab Lager. Transport-/Verpackungskosten werden separat in Rechnung gestellt.</p>
<p style="color:black;">4.5 Zuschläge für Spezialwerkzeuge wie Schlagbohrmaschine, Mauerfräse, Elektrohammer, Fahrgerüste usw.werden pro Betriebsstunde verrechnet.</p>
<p style="color:black;">4.6 Sämtliche Regiearbeiten werden zu den aktuellen Stundenansätzen des vblei.ch verrechnet.</p>
<p style="color:black;"><br></p>
<p style="color:black;"><strong>5. Rechte und Pflichten des Kunden</strong></p>
<p style="color:black;">5.1 Der Kunde stellt dem Unternehmer die zur Auftragserfüllung erforderlichen Baustelleninstallationen zur Verfügung.</p>
<p style="color:black;">5.2 Der Kunde hat dem Unternehmer bei Installationen, Bohrungen, Durchbrüchen oder Spitzarbeiten sämtliche aktuellen Pläne und notwendigen Informationen über die bestehenden Unterputz-Installationen 5 Arbeitstage vor Ausführung zu übergeben.</p>
<p style="color:black;">5.3 Arbeiten und Dienstleistungen, welche durch Verschulden Dritter notwendig werden, gehen zu Lasten des Kunden und werden separat verrechnet.</p>
<p style="color:black;">5.4 Der Kunde muss freien und sicheren Zugang zur Baustelle gewährleisten. Müssen die Arbeitnehmer des Unternehmers sich für die Arbeiten, den Weg frei machen (z. B. Möbel verschieben etc.), wird dies in Rechnung gestellt und das Unternehmen übernimmt keine Haftung falls bei sorgfältigen Umgang Schäden entstehen.</p>
<p style="color:black;">5.5 Der Kunde muss um die sanitären Anlagen zur Verfügung stellen. Geschieht dies nicht, so wird eine Tagespauschale von 180.00 CHF exkl. Rechnung gestellt.</p>
<p style="color:black;"><br></p>
<p style="color:black;"><strong>6. Rechte und Pflichten des Unternehmers</strong></p>
<p style="color:black;">6.1 Die Vertragserfüllung hat nach den bewährten und anerkannten Arbeitsgrundsätzen und Regeln der Technik,unter Verwendung von geeignetem Material zu erfolgen.</p>
<p style="color:black;">6.2 Der Unternehmer ist berechtigt, zur Erfüllung der im Angebot definierten Leistungen Dritte beizuziehen, welche über die erforderlichen Fachkenntnisse verfügen.</p>
<p style="color:black;"><br></p>
<p style="color:black;"><strong>7. Auftreten / Vorfinden von gesundheitsgefährdender Stoffe, insbesondere Asbest</strong></p>
<p style="color:black;">7.1 Der Kunde nimmt zur Kenntnis, dass der Unternehmer aus gesetzlichen Gründen verpflichtet ist, die Arbeiten sofort einzustellen, wenn in deren Verlauf ein besonders gesundheitsgefährdender Stoff wie Asbest vorgefunden wird. In diesem Fall wird der Kunde sofort darüber orientiert.</p>
<p style="color:black;">7.2 Vor Aufnahme der Arbeiten durch den Unternehmer, muss das unterschriebene Asbest-Formular beim Unternehmer vorliegen.</p>
<p style="color:black;">7.3 Der Kunde ist verpflichtet, den Unternehmer im Voraus auf ihm bekannte Vorkommen von Asbest oder andere gesundheitsgefährdende Stoffe hinzuweisen.</p>
<p style="color:black;">7.4 Die verabredeten Fristen und Termine verschieben sich beim Einstellen der Arbeiten aus diesem Grund bis auf weiteres und werden erst nach Abschluss der notwendigen Massnahmen oder nach der Risikobewertung fortgesetzt.</p>
<p style="color:black;">7.5 Der Kunde hat die eingehende Gefahrenermittlung und Risikobewertung sowie allfällige Massnahmen einzuleiten. Die Kosten dafür wie auch für die fachgerechte Entsorgung gehen zu Lasten des Kunden.</p>
<p style="color:black;">7.6 Für Schäden und Verzögerungen, welche im Zusammenhang mit gesundheitsgefährdenden Stoffen entstehen, übernimmt der Unternehmer keinerlei Haftung. Insbesondere kann der Unternehmer bei Asbestsanierungen nicht haftbar gemacht werden.</p>
<p style="color:black;"><br></p>
<p style="color:black;"><strong>8. Termine</strong></p>
<p style="color:black;">8.1 Die Einhaltung der<strong>schriftlich</strong>vereinbarten Termine setzt die rechtzeitige Instruktion und Übergabe sämtlicher technischen Ausführungsunterlagen sowie die Einhaltung der Lieferfristen durch die Unterlieferanten und die rechtzeitige Fertigstellung der bauseitigen Vor- und Nebenarbeiten voraus. Können Termine vom Unternehmer infolge verspäteter Instruktion oder Dokumentation durch den Kunden nicht eingehalten werden, lehnt derUnternehmer jede Haftung für daraus entstehende Schäden und Kosten ab.</p>
<p style="color:black;">8.2 Änderungen jeglicher Art (z.B. Pläne, Termine) müssen mind. 4 Arbeitstage im Voraus<strong>schriftlich</strong>eingegeben werden.</p>
<p style="color:black;"><br></p>
<p style="color:black;"><strong>9. Haftung</strong></p>
<p style="color:black;">9.1 Die Haftung des Unternehmers beschränkt sich auf die gesetzlich zwingende Haftung für Schäden, welche durch vorsätzliche und grobfahrlässige Handlungen ihrer Arbeitnehmer, gesetzlichen Vertreter und Erfüllungsgehilfen verursacht werden.</p>
<p style="color:black;">9.2 Der Unternehmer haftet nur für direkte Schäden. Jede weitergehende Haftung wird ausgeschlossen.</p>
<p style="color:black;">9.3 Der Unternehmer übernimmt keine Haftung für Schäden oder Folgeschäden, welche trotz sorgfältiger, die vorgelegten Pläne berücksichtigender Auftragserfüllung entstehen.
Insbesondere kann er nicht für Schäden an bestehenden, verdeckten und in den Plänen nicht eingezeichneten Leitungen haftbar gemacht werden.</p>
<p style="color:black;">9.4 Wenn Kunden Lieferungen und/oder Leistungen von Unterlieferanten oder Subunternehmern vom Unternehmer direkt beziehen oder in Auftrag geben, besteht für diese Leistungen keinerlei Haftungs- bzw. Garantieanspruch gegenüber dem Unternehmer.</p>
<p style="color:black;"><br></p>
<p style="color:black;"><strong>10. Abnahme und Garantie</strong></p>
<p style="color:black;">10.1 Die Garantieleistungen des Unternehmers richten sich nach den Bestimmungen von SIA Norm 118 (Art. 172 ff.). Die maximale Garantiefrist beträgt jedoch in jedem Fall zwei Jahre ab Abnahme des Werkes.</p>
<p style="color:black;">10.2 Nach Beendigung der Arbeiten wird in der Regel das Werk durch den Kunden und den Unternehmer gemeinsam abgenommen. Es kann ein Abnahmeprotokoll erstellt werden, welches von beiden Parteien zu unterzeichnen ist.Wird das Werk vom Kunden vor der gemeinsamen Abnahme und der Schlussrechnung in Gebrauch genommen, gilt das Werk als abgenommen.</p>
<p style="color:black;">10.3 Sofern keine Abnahme nach Ziffer 10.2 stattfindet, kann der Kunde innert 20 Tagen nach Versand der Schlussrechnung<strong>schriftlich</strong>eine Abnahme gemäss Ziffer
10.2 verlangen. Nach unbenutztem Ablauf der Fristgilt die Abnahme als stillschweigend erfolgt und es beginnt die Garantiefrist gemäss SIA-Norm zu laufen.</p>
<p style="color:black;">10.4 Weist das Werk bei der Abnahme keine oder nur unwesentliche Mängel auf, so gilt das Werk als abgenommen und die Garantiefrist beginnt zu laufen.</p>
<p style="color:black;">10.5 Weist das Werk wesentliche Mängel auf, welche die Funktionstüchtigkeit beeinträchtigen, werden die Mängel protokolliert, die Abnahme wird zurückgestellt und zur Behebung der Mängel wird<strong>schriftlich</strong>eine Frist vereinbart.Danach erfolgt eine erneute Prüfung im Sinne der vorstehenden Ziffern.</p>
<p style="color:black;">10.6 Für Geräte gelten die Garantiebestimmungen des Herstellers, wobei der Unternehmer für maximal zwei Jahre eine Garantie übernimmt.</p>
<p style="color:black;">10.7 Für gelieferte Fremdfabrikate tritt die Garantie der Herstellerfirmen an die Stelle des Unternehmers.</p>
<p style="color:black;">10.8 Für bauseitige Lieferungen (z.B. vom Architekten, Bauherren) wird jede Haftung abgelehnt.</p>
<p style="color:black;">10.9 Bei unsachgemässer Behandlung der Anlageteile, oder Einwirkung durch Drittpersonen, erlischt die Garantie per sofort.</p>
<p style="color:black;"><br></p>
<p style="color:black;"><strong>11. Akontozahlungen / Teilzahlungen / Vorauszahlungen</strong></p>
<p style="color:black;">11.1 Der Unternehmer behält sich vor, vor Arbeitsbeginn eines Projektes eine<strong>Vorauszahlung von 50%</strong>zu verlangen. Kosten für eine allfällige Erfüllungsgarantie gehen zu Lasten des Kunden und wird auf den Schlussrechnungsbetrag aufgerechnet.</p>
<p style="color:black;">11.2 Mit dem Arbeitsfortschritt können jederzeit angemessene Akonto- oder Teilzahlungen verlangt werden.</p>
<p style="color:black;">11.3 Die Zahlungsfrist für Akontozahlungen und Teilzahlungen beträgt<strong>10 Tage ab Rechnungsstellung</strong>. Die Zahlungsfrist kann jedoch, je nach Projekt angepasst werden.</p>
<p style="color:black;">11.4 Ist der Kunde mit der Rechnung nicht einverstanden, kann er innert 5 Arbeitstagen ab Rechnungstellungsdatum,<strong>schriftlich</strong>Einspruch erheben.</p>
<p style="color:black;">11.5 Selbst bei Vorabzustellung der Rechnung an den Architekten oder an die Bauleitung zur Kontrolle, erhalten die Endkunden jeweils eine Kopie der Rechnung zur Orientierung.</p>
<p style="color:black;">11.6 Die Schlussrechnung erfolgt nach Abschluss des Auftrages bzw. nach Abnahme des Werkes.</p>
<p style="color:black;"><br></p>
<p style="color:black;"><strong>12. Rechnungsstellung / Zahlungsbedingungen / Mahnungen</strong></p>
<p style="color:black;">12.1 Die Zahlungsfrist beträgt<strong>10 Tage netto ab Rechnungsstellung</strong>. Die Zahlungsfrist kann je nach Projekt/Auftrag angepasst werden. Dies wird aber im Werkvertrag<strong>schriftlich</strong>festgelegt.<strong>Schriftlich</strong>vereinbarte besondere Zahlungskonditionen wie z.B. Rabatte werden bei der Rechnungsstellung berücksichtigt und in Abzug gebracht.</p>
<p style="color:black;">12.2 Bei Nichteinhaltung der Zahlungsfristen werden Mahnspesen fällig:</p>
<p style="color:black;"><strong>1. Mahnung CHF 20.00 / Letzte Mahnung – Betreibungsandrohung CHF 50.00</strong></p>
<p style="color:black;">12.3 Verzugszins<strong>von 7%</strong>– ab Ablauf der vereinbarten Zahlungsfrist.</p>
<p style="color:black;">12.4 Solange ein Kunde die gelieferten Produkte und Leistungen nicht vollständig bezahlt hat, befinden sich diese weiterhin im Eigentum des Unternehmers. Der Unternehmer kann die Herausgabe solcher Produkte verlangen, wenn die Zahlung nach erfolgter Letzter Mahnung nicht geleistet wird.</p>
<p style="color:black;">12.5 Zahlt der Kunde innert 5 Arbeitstagen nach Eingang der<strong>Mahnung</strong>nicht, stellt die ENERQ GmbH die Arbeiten per sofort auf dieser Baustelle ein, bis zum Zahlungseingang der Rechnung inkl. Mahnspesen. Für entstandene Verzögerungen / Zusatz- und Folgekosten übernimmt der Unternehmer keine Haftung.Zudem ist der Unternehmer berechtigt, vom Vertrag zurückzutreten und vom Kunden die entstandenen Verzugskosten sowie den entgangenen Gewinn einzufordern.</p>
<p style="color:black;">12.6 Die Zahlungsfrist für die Mahnung beträgt<strong>5Tage netto ab Ausstellung der Mahnung</strong>. Geht der Rechnungsbetrag inkl. Mahnspesen nicht in der angegebenen Frist auf das Konto des Unternehmers ein, wird eine Betreibungsandrohung mit einer Zahlungsfrist von<strong>5 Tagen netto ab Rechnungsstellung</strong>versendet.</p>
<p style="color:black;">12.7 Der Unternehmer ist berechtigt, die Fakturaaufwände über ein Factoring-Unternehmen abzuwickeln.</p>
<p style="color:black;"><br></p>
<p style="color:black;"><strong>13. Anwendbares Recht und Gerichtsstand</strong></p>
<p style="color:black;">13.1 Dieser Vertragsbestandteil untersteht dem Schweizer Recht. Gerichtsstand ist der Sitz des Unternehmers in Gelterkinden, Kanton Basel-Landschaft.</p>
</div>`;

export default class AGBComponent extends React.Component {
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
					label={'AGB'}
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
