import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ModalImage from 'react-modal-image';
import { startDeleteStatus, startDeleteImage } from '../../actions/postStatus';
import { startRemoveHashtag } from '../../actions/statusFeatures';
import Comment from '../commentComponent/Comment';
import LikeStatus from '../likeComponent/LikeStatus';
import { startRemoveComment } from '../../actions/comment';
import showHashtags from '../../selectors/showHashtags';
import sortByNewest from '../../selectors/sortByNewest';
import { userInfo } from 'os';

class PostStatusList extends React.Component {
    constructor(props) {
        super(props);
    };
    removeHashtag(description) {
        const hashtag = this.props.hashtags
        for (let i = 0; i < hashtag.length; i++) {
            try {
                const hashtagWord = description.match(/(#[a-z0-9][a-z0-9\-_]*)/ig)[0];
                if (hashtag[i].hashtag === hashtagWord) {
                    this.props.startRemoveHashtag(hashtag[i]);
                    break
                }
            } catch (e) {
                break
            };
        };
    };
    removeComment(statusId) {
        this.props.commentItem.forEach(comment => {
            if (comment.parentId === statusId) {
                this.props.startRemoveComment(comment);
            };
        });
    };
    render() {
        return (

            <div className='status-list-container'> 
                {this.props.statusItem.map(status => {
                    if (status.createdBy === this.props.user.id) {
                        if(status.type === 'post') {
                            return (
                                <div key={status.id} className='profile-status-wrapper'>
                                    <div className='profile-status-container'>
                                        <div className='profile-status'>
                                            <div>
                                                <div className='profile-status-author-details'>
                                                    <Link style={{textDecoration: 'none', color: '#303A52'}} to={`/profile/${status.createdBy}`}>
                                                        <img className='profile-status-author-picture' src={status.author.picture} style={{width: '60px', height: '60px'}}/>
                                                        <h3 className='profile-status-author-name'>{status.author.name}</h3>
                                                    </Link>
                                                </div>
                                                <div className='profile-status-remove-button-wrapper'>
                                                    {status.createdBy === this.props.currentUser.id && <div className='profile-status-remove-button-container'> <img className='profile-status-remove-icon' src="https://img.icons8.com/windows/512/cancel.png" style={{cursor: 'pointer'}} onClick={() => {
                                                        //console.log(status)
                                                        this.props.startDeleteStatus({id: status.id})
                                                        this.removeHashtag(status.description)
                                                        this.removeComment(status.id)
                                                    }}></img>
                                                    </div> 
                                                     }
                                                </div>
                                                <p className='profile-status-date'>{moment(status.createdAt).format('MMMM, Do YYYY')}</p>
                                                <div className='profile-status-description-wrapper'>
                                                    <h1 className='profile-status-description'>{status.description}</h1>
                                                </div>
                                            </div>
                                            <div>
                                                <div className='profile-status-like'>
                                                    <LikeStatus dbLocation={'statusItem'} parentId={status.id} likesAmount={status.likes}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='profile-comment-wrapper'>
                                            <Comment parentId={status.id} author={status.author.id} />
                                        </div>
                                    </div>
                                 </div>
                            )
                        } else if (status.type === 'image') {
                            return (
                                <div key={status.id} className='profile-status-image-wrapper'>
                                    <div className='profile-status-image-container'>
                                        <div>
                                        <div className='profile-remove-image-wrapper'>
                                        {status.createdBy === this.props.currentUser.id && <div className='profile-image-remove-button'><img className='profile-status-image-remove-icon' src="https://img.icons8.com/windows/512/cancel.png" style={{cursor: 'pointer'}} onClick={() => {
                                            //console.log(status)
                                            this.props.startDeleteImage(status.id, status.name)
                                            this.removeHashtag(status.description)
                                            this.removeComment(status.id)
                                        }}/></div>  }
                                        </div>
                                            <div className='profile-image-author-details '>
                                                <Link style={{textDecoration: 'none', color: '#303A52'}} to={`/profile/${status.createdBy}`}>
                                                    <img className='profile-image-author-picture' src={status.author.picture} style={{width: '60px', height: '60px'}}/>
                                                    <h3 className='profile-status-author-name'>{status.author.name}</h3>
                                                </Link>
                                            </div>
                                            <p className='profile-status-date'>{moment(status.createdAt).format('MMMM, Do YYYY')}</p>
                                            <h1 className='profile-status-description'>{status.description}</h1>
                                            <div className='profile-status-image-picture'>
                                            <ModalImage className='profile-status-modal-image' small={status.url} large={status.url} hideDownload={true} hideZoom={true} style={{width: '17%', height: '17%'}}/>
                                            </div>
                                        </div>
                                            <div className='profile-status-like'>
                                                <LikeStatus dbLocation={'uploadedImages'} parentId={status.id} likesAmount={status.likes} />
                                            </div>
                                    </div>
                                    <div>
                                        <div className='profile-image-comment-wrapper'>
                                        <Comment parentId={status.id}  author={status.author.id}/>

                                        </div>
                                    </div>
                                </div>
                                
                            )
                        }
                    }

                })}
            </div>
        );
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        startDeleteStatus: statusItem => dispatch(startDeleteStatus(statusItem)),
        startRemoveHashtag: id => dispatch(startRemoveHashtag(id)),
        startRemoveComment: comment => dispatch(startRemoveComment(comment)),
        startDeleteImage: (id, name) => dispatch(startDeleteImage(id, name))
    };

};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        statusItem: sortByNewest(showHashtags(state.statusItem, state.hashtagFilter)),
        commentItem: state.commentItem,
        hashtags: state.hashtags,
        queryHashtags: showHashtags(state.statusItem, state.hashtagFilter),
        currentUser: state.currentUser
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostStatusList);
