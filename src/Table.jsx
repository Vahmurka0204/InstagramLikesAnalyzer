import React, { Component } from 'react';
import './LikesAnalyzer.css';
import userImage from './userImage.png'

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
        const {username, countOfPosts } = userInfo
        return (
          <tr key={index}>
            <td><img src={userImage} alt="userImage"></img></td>
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

  export default Table