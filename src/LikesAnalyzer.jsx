import React, { Component } from 'react';
import './LikesAnalyzer.css';
import Table from './Table.jsx';

class LikesAnalyzer extends Component {

  constructor(props) {
    super(props)
    this.getRecentPostsCount = this.getRecentPostsCount.bind(this);
    this.getLikesStatistics = this.getLikesStatistics.bind(this);
    this.getWallPostsID = this.getWallPostsID.bind(this);
    this.getWallPostsLikesInfo = this.getWallPostsLikesInfo.bind(this)
    this.getFriendsData = this.getFriendsData.bind(this)
    this.getTableData = this.getTableData.bind(this)
    this.addUserData = this.addUserData.bind(this)

    this.state = {
      tableData: [],
      userData: { id: "", name: "", photo: "" },
      isLoadedUserData: false,
      isLoadedTableData: false,
      wallPostsID: [],
      userIDLikesCount: {},
      likesID: [],
      friendsData: {},
      recentPostsCount: 0
    };
  }

  componentDidMount() {
    const VK = window.VK;
    VK.Auth.login((response) => this.addUserData(response));
  }

  addUserData(props) {
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
        <button onClick={this.getRecentPostsCount}>1 set number of posts</button>
        <button onClick={this.getWallPostsID}>2 get wall post id</button>
        <button onClick={this.getWallPostsLikesInfo}>3 get wall post likes info</button>
        <button onClick={this.getLikesStatistics}>4 get likes statistics</button>
        <button onClick={this.getFriendsData}>5 get friends data</button>
        <button onClick={this.getTableData}>6 getTableData</button>
        <Table tableData={tableData} isLoadedTableData={isLoadedTableData}></Table>
      </div>
    )
  }

  getRecentPostsCount() {
    if (document.getElementById("recentPostsCount").value !== null) {
      let analyzeNumber = document.getElementById("recentPostsCount").value;
      this.setState({ recentPostsCount: analyzeNumber });
    }
  }

  getWallPostsID() {
    const VK = window.VK;
    let { recentPostsCount } = this.state
    VK.Api.call('wall.get', { filter: 'owner', count: recentPostsCount, v: '5.102' }, (r) => this.addWallPostsInfo(r))
  }

  addWallPostsInfo(props) {
    this.setState({
      wallPostsID: props.response.items.map((item) => { return (item.id) })
    })
  }
  getWallPostsLikesInfo() {
    let { wallPostsID } = this.state
    const VK = window.VK;

    wallPostsID.forEach((postID) => {
      VK.Api.call('likes.getList', { friends_only: 1, item_id: postID, type: 'post', v: '5.102' }, (r) => this.addWallPostsLikesInfo(r))
    });

    this.getLikesStatistics();
  }

  addWallPostsLikesInfo(props) {
    this.setState({
      likesID: this.state.likesID.concat(props.response.items.map((id) => { return (id) }))
    })
  }

  getLikesStatistics() {
    let { likesID } = this.state;
    let tempLikesStatistics = {}

    likesID.forEach((id) => {
      if (tempLikesStatistics[id] === undefined) {
        tempLikesStatistics[id] = 1;
      }
      else {
        tempLikesStatistics[id]++;
      }
    })

    this.setState({
      userIDLikesCount: tempLikesStatistics
    })
  }

  getFriendsData() {
    const VK=window.VK
    VK.Api.call('friends.get', { friends_only: 1, fields:'photo_50', v: '5.102' }, (r) => this.addFriendsData(r))
        
  }

  addFriendsData(props){
    let tempFriendsData = {}
    props.response.items.forEach(friendInfo => {
      tempFriendsData[friendInfo.id] = { name: friendInfo.first_name + " " + friendInfo.last_name, photo: friendInfo.photo_50 }
    })    
    this.setState({
      friendsData: tempFriendsData
    })
  }

  getTableData() {
    let { userIDLikesCount, recentPostsCount, friendsData } = this.state;
    this.setState({
      tableData: Object.keys(userIDLikesCount).map((userID) => {
        return (
          {
            photo: friendsData[userID].photo,
            name: friendsData[userID].name,
            statistics: userIDLikesCount[userID] + "/" + recentPostsCount
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
