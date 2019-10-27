import React, { Component } from 'react';
import './LikesAnalyzer.css';
import Table from './Table.jsx';

class LikesAnalyzer extends Component {

  constructor(props) {
    super(props)    
    this.loadStatistics = this.loadStatistics.bind(this)

    this.state = {
      tableData: [],
      userData: { id: "", name: "", photo: "" },
      isLoadedUserData: false,
      isLoadedTableData: false,
      recentPostsCount: 0,
    };
  }

  componentDidMount() {
    const VK = window.VK;
    VK.Auth.login((response) => this.setUserData(response));
  }

  setUserData(props) {
    const VK = window.VK;
    VK.Api.call('users.get', { user_ids: props.session.mid, v: "5.102", fields: "photo_100" }, (r) => {
      if (r.response) {
        this.setState({
          userData: {
            id: r.response[0].id,
            name: r.response[0].first_name + " " + r.response[0].last_name,
            photo: r.response[0].photo_100
          },
          isLoadedUserData: true
        })
      }
    });
  }

  render() {

    let { isLoadedUserData, userData, isLoadedTableData, tableData } = this.state;

    return (
      <div>
        <UserHeader userData={userData} isLoadedUserData={isLoadedUserData}></UserHeader>
        <NumberPostsToAnalyze />
        <button onClick={this.loadStatistics}>load statistics</button>
        <Table tableData={tableData} isLoadedTableData={isLoadedTableData}></Table>
      </div>
    )
  }

  loadStatistics() {
    const VK = window.VK;
    let getLikesStatisticsPromise = new Promise((resolve, reject) => {
      resolve(this.getRecentPostsCount())
    })
      .then((recentPostsCount) =>
        new Promise((resolve, reject) => {
          VK.Api.call('wall.get', { filter: 'owner', count: recentPostsCount, v: '5.102' }, (r) => { resolve(r.response.items.map((item) => item.id)) });
        }))
      .then((postsID) =>  this.getLikesStatistics(postsID) );

    let getFriendsPromise = new Promise((resolve, reject) => {
    VK.Api.call('friends.get', { friends_only: 1, fields: 'photo_50', v: '5.102' }, (r) => resolve(this.setFriendsData(r)))
    });

    Promise.all([getLikesStatisticsPromise, getFriendsPromise]).then((response) => { this.getTableData(response) });

  }

  getRecentPostsCount() {
    this.setState({
      recentPostsCount: document.getElementById("recentPostsCount").value
    });
    return document.getElementById("recentPostsCount").value;
  }

  makeLikesStatistics(response) {

    let tempLikesStatistics = {}
    let likesID= response.flat();
    likesID.forEach((id) => {
      if (tempLikesStatistics[id] === undefined) {
        tempLikesStatistics[id] = 1;
      }
      else {
        tempLikesStatistics[id]++;
      }
    });

    console.log(tempLikesStatistics);
    return tempLikesStatistics;    
  }


  getLikesStatistics(postsID){
    const VK = window.VK;
    let vkAPICallPromise= postsID.map((postID)=>new Promise((resolve,reject)=>{VK.Api.call('likes.getList', { friends_only: 1, item_id: postID, type: 'post', v: '5.102' }, (r) => resolve(r.response.items))}));
    return Promise.all(vkAPICallPromise).then((response)=>new Promise((resolve, reject) => {resolve(this.makeLikesStatistics(response))}))
  }

  setFriendsData(r) {
    let tempFriendsData = {}
    r.response.items.forEach(friendInfo => {
      tempFriendsData[friendInfo.id] = { name: friendInfo.first_name + " " + friendInfo.last_name, photo: friendInfo.photo_50 }
    })
    return tempFriendsData;
  }

  getTableData(response) {
    let likesStatistics= response[0]
    let friendsData=response[1];
    let { recentPostsCount } = this.state;
    this.setState({
      tableData: Object.keys(likesStatistics).map((userID) => {
        return (
          {
            photo: friendsData[userID].photo,
            name: friendsData[userID].name,
            statistics: likesStatistics[userID] + "/" + recentPostsCount
          }
        )
      }),
      isLoadedTableData: true
    })
  }
}

function UserHeader(props) {
  if (props.isLoadedUserData) {
    return (
      <div id="userHeader">
        <img src={props.userData.photo} className="UserImage round" alt="mainUserImage" />
        <h3>{props.userData.name}</h3>
      </div>)
  }
  return (
    <div />
  )
}

function NumberPostsToAnalyze() {
  return (
    <div>
      <p>Choose the number of recent posts to analyze</p>
      <input type="number" id="recentPostsCount" min={0} placeholder="0" />
    </div>
  )
}


export default LikesAnalyzer;
