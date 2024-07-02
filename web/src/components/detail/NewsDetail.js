
import React from 'react';
import jQuery from 'jquery';
import { Editor } from "@tinymce/tinymce-react";

import { Icon } from '../../data/common';
import { apiUrl, htmlEditorKey, serverUrl } from '../../data/config';

import imgEmptyNews from '../../assets/images/empty-news.jpg';
import imgPenEdit from '../../assets/images/pen-edit-red.png';
import imgDelete from '../../assets/images/delete.png';
import TitleComponent from '../layout/Title';

const emptyInfo = {title:'', description:''};

export default class NewsDetail extends React.Component {
	constructor(props) {
		super(props);
		const {detailNews, imageName, loginType} = props;
		this.newsInfo = detailNews || emptyInfo;
		const {id, title, description} = this.newsInfo;
		this.state = {detailNews, loginType, typeMain:id!==undefined?'read':'edit', id, imageName, title, description, oriDescription:description};
	}

	componentDidMount() {
		this.docH = document.documentElement.offsetHeight;
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['detailNews', 'imageName', 'loginType'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='detailNews') {
					this.newsInfo = nextProps.detailNews || emptyInfo;
					const {id, title, description} = this.newsInfo;
					this.setState({typeMain:id!==undefined?'read':'edit', id, title, description, oriDescription:description});
				}
			}
		});
	}

	onChangeInput = (e, itemKey) => {
		const str = e.target.value;
		const realStr = itemKey==='passd'?str.toUpperCase():str;
		this.setState({[itemKey]:realStr});
	}

	checkDisableSubmit = () => {
		const {typeMain, title, description} = this.state;
		return (typeMain==='read' || !title || !description);
	}

	submitMain = () => {
		if (this.checkDisableSubmit()) return;
		const {id, title, description, imageName} = this.state;
		const updateData = {id, title, description, image:imageName};
		this.callAPI('updateNews', updateData);
	}

	callAPI = (apiName, updateData) => {
		this.props.setLoading(true);
		jQuery.ajax({ type: "POST", url: apiUrl+'update_data/'+apiName+'.php', dataType: 'json', data: updateData,
			success: (res) => {
				this.props.setLoading(false);
				const {success, error, maxId} = res;
				if (success) {
					this.props.callNewsAPI();
					if (updateData.id===undefined) {
						const newsId = parseInt(maxId[0]);
						this.setState({typeMain:'read', id: newsId});
					} else {
						this.setState({typeMain:'read'});
						if (updateData.updateType==='delete') {
							this.props.setPageKey('news');
						}
					}
				} else {
					const errorStr = error || "Failed to save the data";
					window.alert(errorStr);
				}
			}
		});
	}

	onClickDelete = () => {
		if (window.confirm('Are you sure to delete the news?')) {
			const updateData = {id:this.state.id, updateType:'delete'};
			this.callAPI('updateNews', updateData);
		}
	}

	onClickIcon = e => {
		this.props.closeNewsDetail();
	}

	render() {
		const {detailNews, loginType, id, typeMain, imageName, title, description, oriDescription} = this.state;
		return (
			<div className={`detail-content ${detailNews?'active':''} content-detailNews`}>
				<TitleComponent
					pageKey={'news'}
					disableCreate={true}
					profile={true}
					onClickIcon={this.onClickIcon}
					createItem={e=>{}}
					setFilter={e=>{}}
					removeMargin={true}
				></TitleComponent>
				<div className='main-content-wrapper'>
					<div className={`main-content flex-column ${detailNews?'active':''} ${typeMain}`}>
						<img className='news-image' src={imageName?serverUrl+'other/images/'+imageName+'.jpg' : imgEmptyNews} alt=''></img>
						{loginType === 'employee' &&
							<div className='button button-grey button-image' onClick={e=>this.props.openImageModal(imageName)}>Edit Image</div>
						}
						
						<div className='input-wrapper'>
							<div className='input-item'>
								<div className='label'>Title : </div>
								<input className='inputBox' value={title} readOnly={typeMain==='read'} onChange={e=>this.onChangeInput(e, 'title')}></input>
							</div>

							<div className='input-item'>
								<div className='label'>Description : </div>
								<Editor
									apiKey={htmlEditorKey}
									disabled={typeMain==='read'}
									initialValue={oriDescription}
									init={{
										branding: false,
										width: 630,
										height: Math.min(this.docH - 660, 400),
										menubar: false,
										plugins: "autolink link",
										toolbar: "bold italic underline link",
										image_advtab: false
									}}
									onEditorChange={(str) => { this.setState({description:str}); }}
								></Editor>
							</div>
						</div>

						<div className='bottom-row flex' style={{display:loginType==='employee'?'flex':'none'}}>
							{typeMain === 'read' &&
								<div className='button empty-back' onClick={e=>this.setState({typeMain:'edit'})}>
									<div className='button-row'>
										<Icon img={imgPenEdit}></Icon>
										<label>Daten bearbeiten</label>
									</div>
								</div>
							}
							{typeMain === 'edit' &&
								<>
									<div className={`button ${this.checkDisableSubmit()?'disable':''}`} onClick={e=>this.submitMain()}>
										{id===undefined?'Anlegen':'Bestätigen'} 
									</div>
									{id!==undefined &&
										<div className={`button empty-back`} onClick={e=>this.setState({typeMain:'read'})}>
											Lesen
										</div>
									}
								</>
							}
							
						</div>
						{id !== undefined && loginType === 'employee' &&
							<div className='button delete-button empty-back' onClick={()=>this.onClickDelete()}>
								<div className='button-row'>
									<Icon img={imgDelete}></Icon>
									<label>Kunde löschen</label>
								</div>
							</div>
						}
					</div>
				</div>

			</div>
		);
	}
}
