import React, { Component } from 'react';
import './LikesAnalyzer.css';

class MediaTable extends Component {
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
      return this.props.tableData.map((mediaInfo, index) => {
        const {picture, text, likesCount, commentCount } = mediaInfo
        return (
          <tr key={index}>
            <td><img src={picture} alt="userImage" className="tablePicture round"></img></td>
            <td>{text}</td>
            <td>{likesCount}</td>
            <td>{commentCount}</td>
          </tr>
        )
      })
    }
  
    renderTableHeader() {
        if(this.props.tableData.length===0){return<th></th>}
      let header = Object.keys(this.props.tableData[0])
      return header.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>
      })
    }
  }

  export default MediaTable