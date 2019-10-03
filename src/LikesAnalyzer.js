import React, { Component } from 'react';
import mainUserImage from './mainUserImage.png'
import './LikesAnalyzer.css';
import userImage from './userImage.png'

function LikesAnalyzer() {
  return (
    <body className="App">
      <UserHeader/>
      <div style={{clear: "left"}}>
      <NumberPostsToAnalyze/>
      <button>Analyze</button>
      <Table/>
      </div>
    </body>
  );
}

function UserHeader(){
  return(
    <div>
      <div style={{float: "left"}}>
        <img src={mainUserImage} style={{marginRight:"10px"}} className = "UserImage" width="60px" height="60px" alt = "mainUserImage" />
      </div>
      <div >
        <h3 style={{marginLeft:"10px"}}>main username</h3>
      </div>
    </div>
  )
}

function NumberPostsToAnalyze(){
  return(
    <div>
      <p>Choose the number of recent posts to analyze</p>
      <input type = "number"/>
    </div>
  )
}

class Table extends Component{
  constructor(props){
    super(props)
    this.state={tableData: [{photo: userImage, username:"user1", countOfPosts:1},
    {photo: userImage, username:"user2", countOfPosts:3},
    {photo: userImage, username:"user3", countOfPosts:5}]}
  }
  render(){
  return(
    <table id="likesAnalyzeTable" style={{marginTop:"20px"}}>
      <tbody>
        <tr className="tableTitle">{this.renderTableHeader()}</tr>
        {this.renderTableData()}
      </tbody>
    </table>
  )}

  renderTableData(){
    return this.state.tableData.map((userInfo, index)=>{
      const {photo, username, countOfPosts} = userInfo
      return(
        <tr key={index}>
          <td><img src={photo} alt="userImage"></img></td>
          <td>{username}</td>
          <td>{countOfPosts}</td>
        </tr>
      )
    })
  }

  renderTableHeader() {
    let header = Object.keys(this.state.tableData[0])
    return header.map((key, index) => {
       return <th key={index}>{key.toUpperCase()}</th>
    })
 }
}
export default LikesAnalyzer;
