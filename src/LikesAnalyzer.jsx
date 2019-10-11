import React, { Component } from 'react';
import './LikesAnalyzer.css';
import MediaTable from './MediaTable.jsx';
//import userImage from './userImage.png'

class LikesAnalyzer extends Component {

  constructor(props) {
    super(props)
    this.loadTableData = this.loadTableData.bind(this);
    this.state = {
      tableData: [],
      userData:{name:"", imageLink:"" },
      isLoadedUserData: false,
      isLoadedTableData: false,
    };
  }

  componentDidMount(){
    fetch("https://api.instagram.com/v1/users/self/?access_token=1414873883.eedef0e.001d88c181c54fd8a7d1fa823f239195")
      .then(res => res.json())
      .then(json => {
          this.setState({
            isLoadedUserData: true,
            userData: {name:json.data.username, imageLink:json.data.profile_picture}
          });
        },
        (error) => {
          this.setState({
            isLoadedUserData: true,
            error
          });
        }
      )
  } 

  render() {

    var {isLoadedUserData, userData}=this.state;

    if(!isLoadedUserData){
    return (
      <div>
        <div>
          <NumberPostsToAnalyze />
          <MediaTable tableData={this.state.tableData} />
          <button onClick={this.loadTableData}>Analyze</button>
        </div>
      </div>
    )}
    else{
      return (
          <div>
            <UserHeader userImage = {userData.imageLink} userName={userData.name}/>
            <NumberPostsToAnalyze />
            <button onClick={this.loadTableData}>Analyze</button>
            <MediaTable tableData={this.state.tableData} />
          </div>
      )
    }
  }
 

  loadTableData() {
    fetch("https://api.instagram.com/v1/users/self/media/recent?access_token=1414873883.eedef0e.001d88c181c54fd8a7d1fa823f239195")
      .then(res => res.json())
      .then(json => {
        let recentPostsCount=0;
        
          if(document.getElementById("recentPostsCount")!==null){
            let analyzeNumber=document.getElementById("recentPostsCount").value;
            recentPostsCount = analyzeNumber>json.data.length? 20: analyzeNumber;
          }

          this.setState({
            isLoadedTableData: true,
            tableData: json.data.map((mediaInfo, index)=>{

              return({
                picture: mediaInfo.images.thumbnail.url,
                text: mediaInfo.caption===null? "":mediaInfo.caption.text,
                likesCount: mediaInfo.likes.count,
                commentCount: mediaInfo.comments.count
              })
            }).splice(0,recentPostsCount)
          });
          
        },
        (error) => {
          this.setState({
            isLoadedTableData: true,
            error
          });
        }
      )
  }
}

function UserHeader(props) {
  return (
    <div id="userHeader">
      <img src={props.userImage} className="UserImage round" alt="mainUserImage" />
      <h3>{props.userName}</h3>
    </div>
  )
}

function NumberPostsToAnalyze() {
  return (
    <div>
      <p>Choose the number of recent posts to analyze</p>
      <input type="number" id="recentPostsCount"/>
    </div>
  )
}


export default LikesAnalyzer;
