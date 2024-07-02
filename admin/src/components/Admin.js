import React from 'react';
import jQuery from 'jquery';
import EditComponent from './Edit';
import LoadingComponent from './Loading';
import {apiUrl, frontUrl} from '../data/info';
import imgChevron from '../assets/images/chevron.png';
import imgThumbCustom from '../assets/images/thumb-custom.jpg';
import imgThumbPremade from '../assets/images/thumb-premade.jpg';
import imgThumbProto from '../assets/images/thumb-proto.jpg';
import imgThumbOption from '../assets/images/thumb-option.jpg';
import imgThumbCatLabel from '../assets/images/thumb-cat-label.jpg';
import imgThumbLabel from '../assets/images/thumb-label.jpg';

export default class AdminComponent extends React.Component {
	constructor(props) {
		super(props);
		const tabOpen = {premade:false, custom:false, option:false, cat:false, label:false};
		this.state = {pageKey:props.pageKey, optionArr:[], loading:props.loading, premadeArr:[], customArr:[], protoArr:[], catArr:[], labelArr:[], tabOpen};
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.pageKey !== nextProps.pageKey) {
			this.setState({pageKey:nextProps.pageKey});
		}
		if (this.state.userInfo !== nextProps.userInfo) {
			this.setState({userInfo:nextProps.userInfo}, () => {
				if (this.state.userInfo) this.getMainOption();
			});
		}
	}

	getMainOption = () => {
		this.setState({loading:true});
		const {email, token} = this.state.userInfo, curTime = new Date().getTime();
		jQuery.ajax({ type: "POST", url: apiUrl+'getMainOption.php', dataType: 'json',
			data: {email, token, curTime},
			success: (res) => {
				if (res.error) { window.alert(res.error); }
				else { this.setState({optionArr:res.data}); }
				this.setState({loading:false});
			}
		});
		jQuery.ajax({ type: "POST", url: apiUrl+'getMainModel.php', dataType: 'json',
			data: {email, token, curTime},
			success: (res) => {
				if (res.error) { window.alert(res.error); }
				else {res.label_data.shift(); this.setState({catArr:res.category_data, customArr:res.custom_data, premadeArr:res.premade_data, protoArr:res.proto_data, labelArr: res.label_data}); }
			}
		});
	}

	onClickEdit = (idx, dataType) => {
		const modalInfo = idx===-1?{}:{...this.state[dataType][idx], dataType};
		this.setState({modalInfo}); 
		setTimeout(() => { this.setState({modalInner:true}) }, 100);
	}

	setTabOpen = (key) => {
		var {tabOpen} = this.state;
		tabOpen[key] = !tabOpen[key];
		this.setState({tabOpen});
	}

	render() {
		const {pageKey, optionArr, customArr, premadeArr, protoArr, catArr, labelArr, modalInfo, modalInner, loading, tabOpen} = this.state;
		return (
			<div className={`page-back admin-page ${pageKey==='admin'?'active':''}`}>
				<div className='admin-wrapper'>
					<div className='content'>
						<div className='title-wrapper' onClick={()=>this.setTabOpen('custom')}>
							<img className={`chevron ${tabOpen.custom?'open':''}`} src={imgChevron} alt=''></img> <label className='big-title'>Custom Models</label>
							<img className={`thumb`} src={imgThumbCustom} alt=''></img>
						</div>
						<div className={`table-wrapper table-custom ${tabOpen.custom?'open':''}`}>
							<table>
								<tr>
									<th className='th td-no'>No</th>
									<th className='th td-name'>Name</th>
									<th className='th td-price'>Base Price</th>
									<th className='th td-img'>Thumbnail Image</th>
									<th className='th td-description'>Description</th>
									<th className='th td-edit'>Edit</th>
								</tr>
								{customArr.map((item, idx) =>
									<tr key={idx}>
										<td className='td td-no'>{idx+1}</td>
										<td className='td td-name'><div>{item.label}</div> <div className='label-de'>({item.label_de})</div> </td>
										<td className='td td-price'>{item.price}</td>
										<td className='td td-img'><img src={frontUrl+'images/'+item.img+'.jpg'}></img></td>
										<td className='td td-description'>
											<div>{item.description}</div>
											<div className='label-de'>({item.description_de})</div>
										</td>
										<td className='td td-edit'>
											<div  onClick={()=>this.onClickEdit(idx, 'customArr')}>Edit</div>
										</td>
									</tr>
								) }
							</table>
						</div>

						<div className='title-wrapper' onClick={()=>this.setTabOpen('premade')}>
							<img className={`chevron ${tabOpen.premade?'open':''}`} src={imgChevron} alt=''></img> <label className='big-title'>Premade Models</label>
							<img className={`thumb`} src={imgThumbPremade} alt=''></img>
						</div>
						<div className={`table-wrapper table-premade ${tabOpen.premade?'open':''}`}>
							<table>
								<tr>
									<th className='th td-no'>No</th>
									<th className='th td-name'>Name</th>
									<th className='th td-price'>Base Price</th>
									<th className='th td-img'>Thumbnail Image</th>
									<th className='th td-description'>Description</th>
									<th className='th td-edit'>Edit</th>
								</tr>
								{premadeArr.map((item, idx) =>
									<tr key={idx}>
										<td className='td td-no'>{idx+1}</td>
										<td className='td td-name'><div>{item.label}</div> <div className='label-de'>({item.label_de})</div> </td>
										<td className='td td-price'>{item.price}</td>
										<td className='td td-img'><img src={frontUrl+'images/'+item.img+'.jpg'}></img></td>
										<td className='td td-description'>
											<div>{item.description}</div>
											<div className='label-de'>({item.description_de})</div>
										</td>
										<td className='td td-edit'>
											<div  onClick={()=>this.onClickEdit(idx, 'premadeArr')}>Edit</div>
										</td>
									</tr>
								) }
							</table>
						</div>

						<div className='title-wrapper' onClick={()=>this.setTabOpen('proto')}>
							<img className={`chevron ${tabOpen.proto?'open':''}`} src={imgChevron} alt=''></img> <label className='big-title'>ProtoType Models</label>
							<img className={`thumb`} src={imgThumbProto} alt=''></img>
						</div>
						<div className={`table-wrapper table-proto ${tabOpen.proto?'open':''}`}>
							<table>
								<tr>
									<th className='th td-no'>No</th>
									<th className='th td-name'>Name</th>
									<th className='th td-price'>Base Price</th>
									<th className='th td-img'>Thumbnail Image</th>
									<th className='th td-description'>Description</th>
									<th className='th td-edit'>Edit</th>
								</tr>
								{protoArr.map((item, idx) =>
									<tr key={idx}>
										<td className='td td-no'>{idx+1}</td>
										<td className='td td-name'><div>{item.label}</div> <div className='label-de'>({item.label_de})</div> </td>
										<td className='td td-price'>{item.price}</td>
										<td className='td td-img'><img src={frontUrl+'images/'+item.img+'.jpg'}></img></td>
										<td className='td td-description'>
											<div>{item.description}</div>
											<div className='label-de'>({item.description_de})</div>
										</td>
										<td className='td td-edit'>
											<div onClick={()=>this.onClickEdit(idx, 'protoArr')}>Edit</div>
										</td>
									</tr>
								) }
							</table>
						</div>

						<div className='title-wrapper' onClick={()=>this.setTabOpen('option')}>
							<img className={`chevron ${tabOpen.option?'open':''}`} src={imgChevron} alt=''></img> <label className='big-title'>Select Options</label>
							<img className={`thumb`} src={imgThumbOption} alt=''></img>
						</div>
						<div className={`table-wrapper table-option ${tabOpen.option?'open':''}`}>
							<table>
								<tr>
									<th className='th td-no'>No</th>
									<th className='th td-part'>Part</th>
									<th className='th td-name'>Name</th>
									<th className='th td-price'>Price</th>
									<th className='th td-img'>Thumbnail Image</th>
									<th className='th td-description'>Description</th>
									<th className='th td-edit'>Edit</th>
								</tr>
								{optionArr.map((item, idx) =>
									<tr key={idx}>
										<td className='td td-no'>{idx+1}</td>
										<td className='td td-part'>{item.part}</td>
										<td className='td td-name'>
											<div>{item.label || item.name}</div>
											<div className='label-de'>({item.label_de})</div>
										</td>
										<td className='td td-price'>{item.price}</td>
										<td className={`td td-img`}>
											{item.part==='color'?
												<div className='color-img' style={{backgroundColor:'#'+item.piece}}></div>:
												<img src={frontUrl+'images/'+item.img+'.jpg'}></img>
											}
										</td>
										<td className='td td-description'>
											<div>{item.part==='color'?'':item.description||''}</div>
											<div className='label-de'>{item.description_de?'('+item.description_de+')':''}</div>
										</td>
										<td className='td td-edit'>
											<div  onClick={()=>this.onClickEdit(idx, 'optionArr')}>Edit</div>
										</td>
									</tr>
								) }
							</table>
						</div>

						<div className='title-wrapper' onClick={()=>this.setTabOpen('cat')}>
							<img className={`chevron ${tabOpen.cat?'open':''}`} src={imgChevron} alt=''></img> <label className='big-title'>Category Labels</label>
							<img className={`thumb`} src={imgThumbCatLabel} alt=''></img>
						</div>
						<div className={`table-wrapper table-cat ${tabOpen.cat?'open':''}`}>
							<table>
								<tr>
									<th className='th td-no'>No</th>
									<th className='th td-name'>Name</th>
									<th className='th td-edit'>Edit</th>
								</tr>
								{catArr.map((item, idx) =>
									<tr key={idx}>
										<td className='td td-no'>{idx+1}</td>
										<td className='td td-name'>{item.label} <label className='label-de'>({item.label_de})</label> </td>
										<td className='td td-edit'>
											<div  onClick={()=>this.onClickEdit(idx, 'catArr')}>Edit</div>
										</td>
									</tr>
								) }
							</table>
						</div>

						<div className='title-wrapper' onClick={()=>this.setTabOpen('label')}>
							<img className={`chevron ${tabOpen.label?'open':''}`} src={imgChevron} alt=''></img> <label className='big-title'>General Labels</label>
							<img className={`thumb`} src={imgThumbLabel} alt=''></img>
						</div>
						<div className={`table-wrapper table-label ${tabOpen.label?'open':''}`}>
							<table>
								<tr>
									<th className='th td-no'>No</th>
									<th className='th td-name'>Label</th>
									<th className='th td-img'>Position</th>
									<th className='th td-edit'>Edit</th>
								</tr>
								{labelArr.map((item, idx) =>
									<tr key={idx}>
										<td className='td td-no'>{idx+1}</td>
										<td className='td td-name'>{item.label} <label className='label-de'>({item.label_de})</label> </td>
										<td className='td td-img'><img src={apiUrl+'image/'+ item.img+'.jpg'} alt=''></img></td>
										<td className='td td-edit'>
											<div  onClick={()=>this.onClickEdit(idx, 'labelArr')}>Edit</div>
										</td>
									</tr>
								) }
							</table>
						</div>

						{/* <div className='button add-button' onClick={()=>this.onClickEdit(-1)}>Add new item</div> */}
					</div>
				</div>
				<div className='logout button' onClick={() => this.props.setPageKey('login')}>Logout</div>
				<EditComponent
					modalInfo={modalInfo}
					modalInner={modalInner}
					closeModal={(key, submit)=>{
						this.setState({[key]:false});
						this.getMainOption();
					}}
				></EditComponent>
				<LoadingComponent
					loading={loading}
				></LoadingComponent>
			</div>
		);
	}
}
