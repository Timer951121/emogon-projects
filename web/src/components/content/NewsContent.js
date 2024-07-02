
import React from 'react';
import { GetScrollable } from '../../data/common';

export default class NewsContent extends React.Component {
	constructor(props) {
		super(props);
		const {pageKey, newsStr} = props;
		this.newsData = JSON.parse(newsStr);
		this.state = {pageKey, newsStr};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		['pageKey', 'newsStr'].forEach(key => {
			if (this.state[key] !== nextProps[key]) {
				if (key==='newsStr') {
					this.newsData = JSON.parse(nextProps.newsStr);
				}
				this.setState({[key]:nextProps[key]});
			}
		});
	}

	render() {
		const {pageKey} = this.state;
		return (
			<div className={`main-content ${pageKey==='news'?'active':''} content-news`}>
				<div className='table-wrapper'>
					<div className={`table-header pink ${GetScrollable('newsTableContent')}`}>

					</div>
					<div className='table-content scroll scroll-y' id='newsTableContent'>
						{this.newsData.map((item, idx)=>
							<div className='table-row flex' key={idx}>
								<div className='news-image'>
									<img src={item.imgUrl} alt=''></img>
								</div>
								<div className='news-label'>
									<div className='news-time'>{item.timeStr}</div>
									<div className='news-title red'>{item.title}</div>
									<div className='news-content render-html'  dangerouslySetInnerHTML={{ __html: item.preViewStr }}></div>
									<div className='button button-read' onClick={e=>this.props.openPageDetail(item)}>Lesen</div>
								</div>
							</div>
						)}
						{this.newsData.length===0 &&
							<div className='label empty-label'>There is not any data</div>
						}
					</div>
				</div>
			</div>
		);
	}
}
