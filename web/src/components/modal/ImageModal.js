import React from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop, } from 'react-image-crop'
import { SetCanvasPreview } from './CanvasPreview';
import { apiUrl } from '../../data/config';
import imgClose from '../../assets/images/close.png';
import 'react-image-crop/dist/ReactCrop.css';

export default class ImageModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {modalImageOut:false, modalImageIn:false, crop:undefined, scale:1, rotate:0, aspect:1 };
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['modalImageOut', 'modalImageIn'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				this.setState({[key]:nextProps[key]});
				if (key==='modalImageOut') {
					var aspect = 1;
					if (nextProps.modalImageOut==='news') aspect = 2.5;
					this.setState({aspect});
				}
			}
		});
	}

	closeImageModal = () => {
		this.props.closeModal('modalImageIn');
		setTimeout(() => {
			const inputImageFile = document.getElementById('inputImageFile');
			inputImageFile.value = '';
			this.setState({imgSrc:undefined});
			this.props.closeModal('modalImageOut');
		}, 300);
	}

	onSelectFile = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			this.setState({crop:undefined});
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				this.setState({imgSrc:reader.result?reader.result.toString() : ''})
			} )
			reader.readAsDataURL(e.target.files[0])
		}
	}

	onImageLoad = (e) => {
		const { width, height } = e.currentTarget, {aspect} = this.state;
		if (width < height) {
			window.alert('Please use landscape photo');
			this.setState({imgSrc:undefined});
			return;
		}
		const ratioW = 900/width, ratioH = 675/height, scale = Math.min(ratioW, ratioH);
		this.setState({crop: centerCrop(
			makeAspectCrop( { unit: '%', width: 90, }, aspect, width, height, ),
			width,
			height,
		), scale})
	}

	onCompleteCrop = (crop) => {
		const imageSource = document.getElementById('imageSource');
		const canvasPreview = document.getElementById('canvasPreview');
		this.setState({completedCrop:crop}, () => {
			SetCanvasPreview(imageSource, canvasPreview, crop, this.state.scale);
		})
	}

	submitImage = () => {
		const {imgSrc, completedCrop, modalImageOut} = this.state;
		if (!imgSrc || !completedCrop) return;
		const canvasPreview = document.getElementById('canvasPreview');
		
		const dataURL = canvasPreview.toDataURL();
		const blobBin = atob(dataURL.split(',')[1]);
		const array = [];
		for(var i = 0; i < blobBin.length; i++) {
			array.push(blobBin.charCodeAt(i));
		}
		const file=new Blob([new Uint8Array(array)], {type: 'image/jpg'});

		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", modalImageOut);

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

	render() {
		const {modalImageOut, modalImageIn, imgSrc, crop, completedCrop, scale, aspect} = this.state;
		return (
			<div className={`modal-back image-modal flex ${modalImageOut?'active':''}`}>
				<div className={`modal-wrapper ${modalImageIn?'active':''}`}>
					<div className='modal-title'>Select {modalImageOut} image</div>
					<input id='inputImageFile' type="file" accept="image/*" onChange={e=>this.onSelectFile(e)} />
					<div className='image-wrapper modal-content'>
						<ReactCrop
							crop={crop}
							onChange={(_, percentCrop) => this.setState({crop:percentCrop}) }
							onComplete={(c) =>  { this.onCompleteCrop(c) }  }
							aspect={aspect}
						>
							<img id='imageSource' alt="" src={imgSrc} style={{ transform: `scale(${scale})` }} onLoad={e=>this.onImageLoad(e)}/>
						</ReactCrop>
					</div>
					<canvas
						id='canvasPreview'
						style={{
							position:'absolute',
							top:0,
							left:0,
							zIndex:-1,
							objectFit: 'contain',
							width: completedCrop?completedCrop.width:100,
							height: completedCrop?completedCrop.height:100,
						}}
					/>
					<div className={`button ${completedCrop?'':'disable'}`} onClick={e=>this.submitImage()}>Submit</div>
					<div className='close-icon' onClick={e=>this.closeImageModal()}>
						<img src={imgClose}></img>
					</div>
				</div>
			</div>
		);
	}
}
