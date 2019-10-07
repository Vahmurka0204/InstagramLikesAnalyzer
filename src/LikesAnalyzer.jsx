import React, { Component } from 'react';
import mainUserImage from './mainUserImage.png'
import './LikesAnalyzer.css';
import userImage from './userImage.png'

class LikesAnalyzer extends Component {
  constructor(props) {
    super(props)
    this.loadTableData = this.loadTableData.bind(this)
    this.state = {
      tableData: [{ photo: userImage, username: "user1", countOfPosts: 1 },
      { photo: userImage, username: "user2", countOfPosts: 3 },
      { photo: userImage, username: "user3", countOfPosts: 5 }]
    };
  }
  render() {
    return (
      <div>
        <UserHeader />
        <div>
          <NumberPostsToAnalyze />
          <Table tableData={this.state.tableData} />
          <button onClick={this.loadTableData}>Analyze</button>
        </div>
      </div>
    );
  }

  loadTableData() {
    //load data from Instagram
  }
}

function UserHeader() {
  return (
    <div id="userHeader">
      <img src={mainUserImage} className="UserImage" alt="mainUserImage" />
      <h3>main username</h3>
    </div>
  )
}

function NumberPostsToAnalyze() {
  return (
    <div>
      <p>Choose the number of recent posts to analyze</p>
      <input type="number" />
    </div>
  )
}

class Table extends Component {
  render() {
    return (

      <table id="likesAnalyzeTable" style={{ marginTop: "20px" }}>
        <tbody>
          <tr className="tableTitle">{this.renderTableHeader(this.props.tableData)}</tr>
          {this.renderTableData(this.props.tableData)}
        </tbody>
      </table>
    )
  }

  renderTableData() {
    return this.props.tableData.map((userInfo, index) => {
      const { photo, username, countOfPosts } = userInfo
      return (
        <tr key={index}>
          <td><img src={photo} alt="userImage"></img></td>
          <td>{username}</td>
          <td>{countOfPosts}</td>
        </tr>
      )
    })
  }

  renderTableHeader() {
    let header = Object.keys(this.props.tableData[0])
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }
}
export default LikesAnalyzer;
