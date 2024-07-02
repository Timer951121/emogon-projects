import React from 'react';
import { apiUrl, serverUrl } from '../../data/config';
import imgClose from '../../assets/images/close.png';
import ImageResize from 'image-resize';
import imgEmptyCheck from '../../assets/images/empty-check.jpg';

export default class ImageResizeModal extends React.Component {
	constructor(props) {
		super(props);
		const {imageResizeIn, imageResizeOut, imageName} = props;
		this.state = {imageResizeOut, imageResizeIn};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['imageResizeOut', 'imageResizeIn', 'imageName'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='imageName') {
					const sourceImg = document.getElementById('sourceImg');
					const pathStr = this.state.imageResizeOut==='check'?'check_images':'images'
					const imgSrc = nextProps.imageName?serverUrl+'other/'+pathStr+'/'+nextProps.imageName+'.jpg':undefined;
					sourceImg.src = imgSrc;
				}
			}
		});
	}

	closeImageModal = () => {
		this.props.closeModal('imageResizeIn');
		setTimeout(() => {
			const inputImageFile = document.getElementById('inputImageFile');
			inputImageFile.value = '';
			this.setState({imgSrc:undefined, oriSrc:undefined});
			this.props.closeModal('imageResizeOut');
		}, 300);
	}

	onSelectFile = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			const srcFile = e.target.files[0], reader = new FileReader();
			// this.setState({imgType:srcFile.type});
			reader.addEventListener('load', (loadE) => {
				this.setState({oriSrc:reader.result?reader.result.toString() : '', srcFile});
			} )
			reader.readAsDataURL(srcFile);
		}
	}

	onLoadImage = (e) => {
		const {width, height} = e.currentTarget;
		const imageResize = new ImageResize();
		var resizeOption = { width: 900 };
		if (height>width) resizeOption = { height: 900 };
		imageResize.updateOptions().play(this.state.srcFile).then(e=>{
			this.setState({imgSrc:e || ''});
		})
	}

	submitImage = () => {
		const {imgSrc, imageResizeOut} = this.state;
		if (!imgSrc) return;
		const sourceImg = document.getElementById('sourceImg');
		const canvas = document.createElement("canvas");
		canvas.width = sourceImg.width;
		canvas.height = sourceImg.height;

		// Copy the image contents to the canvas
		const ctx = canvas.getContext("2d");
		ctx.drawImage(sourceImg, 0, 0);

		const dataURL = canvas.toDataURL();
		const blobBin = atob(dataURL.split(',')[1]);
		const array = [];
		for(var i = 0; i < blobBin.length; i++) {
			array.push(blobBin.charCodeAt(i));
		}
		const file=new Blob([new Uint8Array(array)], {type: 'image/jpg'});

		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", imageResizeOut);

		this.props.setLoading(true);
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", apiUrl+'other/uploadImgFile.php', true);
		xhttp.onreadystatechange = (e) => {
			const result = e.target;
			if (result.readyState === 4 && result.status === 200) {
				const res = JSON.parse(result.responseText);
				this.props.setImageName(res.file_name, );
				setTimeout(() => {
					this.props.setLoading(false);
					this.closeImageModal();
				}, 500);
			}
		};
		xhttp.send(formData);
	}

	deleteImage = () => {
		this.props.setImageName(false);
		this.setState({imgSrc:undefined});
		const inputImageFile = document.getElementById('inputImageFile');
		inputImageFile.value = '';
	}

	render() {
		const {imageResizeOut, imageResizeIn, imageName, imgSrc, oriSrc} = this.state;
		return (
			<div className={`modal-back image-modal flex ${imageResizeOut?'active':''}`}>
				<div className={`modal-wrapper ${imageResizeIn?'active':''}`}>
					<div className='modal-title'>Select {imageResizeOut} image</div>
					<input id='inputImageFile' type="file" accept="image/*" onChange={e=>this.onSelectFile(e)} />
					<img style={{maxWidth:'900px', maxHeight:'450px', position:'absolute', zIndex:-1}} src={oriSrc}  onLoad={e=>this.onLoadImage(e)}></img>
					<div className='image-wrapper modal-content'>
						<img id='sourceImg' src={imgSrc} style={{maxWidth:'100%', maxHeight:'100%', display:imageName?'block':'none'}} crossOrigin="anonymous"></img>
						<img src={imgEmptyCheck} style={{maxWidth:'100%', maxHeight:'100%', display:imageName?'none':'block'}}></img>
					</div>
					<div className='' style={{display:'flex'}}>
						<div className={`button ${imgSrc?'':'disable'}`} onClick={e=>this.submitImage()}>Upload</div>
						{imageName &&
							<div className={`button`} onClick={e=>this.deleteImage()} style={{marginLeft:'20px'}}>Delete</div>
						}
					</div>
					<div className='close-icon' onClick={e=>this.closeImageModal()}>
						<img src={imgClose}></img>
					</div>
				</div>
			</div>
		);
	}
}
