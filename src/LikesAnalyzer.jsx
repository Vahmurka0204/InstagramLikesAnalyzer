import React, { Component } from 'react';
import './LikesAnalyzer.css';
import Table from './Table.jsx';
import jquery from "jquery"

class LikesAnalyzer extends Component {

  constructor(props) {
    super(props)
    this.getRecentPostsCount = this.getRecentPostsCount.bind(this);
    this.getLikesStatistics = this.getLikesStatistics.bind(this);
    this.getWallPostsID = this.getWallPostsID.bind(this);
    this.getWallPostsLikesInfo = this.getWallPostsLikesInfo.bind(this)
    this.getFriendsData = this.getFriendsData.bind(this)
    this.getTableData = this.getTableData.bind(this)

    this.state = {
      tableData: [],
      userData: { name: "", photo: "" },
      isLoadedUserData: false,
      isLoadedTableData: false,
      accessToken: "e8dabbbbaa11923c9c6d994d0615ce50e13bcce8483efbfb2ad89e0ce5c7d22e23ff1f44c5d14ed25071d",
      wallPostsID: [],
      userIDLikesCount: {},
      likesID: [],
      friendsData: {},
      recentPostsCount:0
    };
  }

  componentDidMount() {
    let { accessToken } = this.state
    let link = "https://api.vk.com/method/users.get?fields=photo_100&access_token=" + accessToken + "&v=5.102"

    jquery.ajax({
      url: link,
      method: 'GET',
      dataType: 'JSONP',
      success: data => {
        this.setState({
          userData: {
            name: data.response[0].first_name + " " + data.response[0].last_name,
            photo: data.response[0].photo_100
          },
          isLoadedUserData: true
        })
      }
    })
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
    let { accessToken, recentPostsCount } = this.state

    let link = "https://api.vk.com/method/wall.get?filter=owner&access_token=" + accessToken + "&count=" + recentPostsCount + "&v=5.102";
    jquery.ajax({
      url: link,
      method: 'GET',
      dataType: 'JSONP',
      success: data => {
        this.setState({
          wallPostsID: data.response.items.map((item) => { return (item.id) })
        })
        console.log(data.response.items[0].id)
      }
    })
  }

  getWallPostsLikesInfo() {
    let { accessToken, wallPostsID } = this.state

    wallPostsID.forEach((postID) => {
      let link = "https://api.vk.com/method/likes.getList?friends_only=1&access_token=" + accessToken + "&item_id=" + postID + "&type=post&v=5.102";

      jquery.ajax({
        url: link,
        method: 'GET',
        dataType: 'JSONP',
        success: data => {
          this.setState({
            likesID: this.state.likesID.concat(data.response.items.map((id) => { return (id) }))
          })
          console.log(data)
        }
      })
    });

    this.getLikesStatistics();
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
    let { accessToken } = this.state
    let link = "https://api.vk.com/method/friends.get?fields=photo_50&access_token=" + accessToken + "&v=5.102"
    let tempFriendsData = {}

    jquery.ajax({
      url: link,
      method: 'GET',
      dataType: 'JSONP',
      success: data => {
        data.response.items.forEach(friendInfo => {
          tempFriendsData[friendInfo.id] = { name: friendInfo.first_name + " " + friendInfo.last_name, photo: friendInfo.photo_50 }
        })
      }
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
