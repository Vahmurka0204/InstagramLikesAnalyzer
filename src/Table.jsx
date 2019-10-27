import React, { Component } from 'react';
import './LikesAnalyzer.css';

class Table extends Component {
    render() {
      if(this.props.isLoadedTableData && this.props.tableData.length!==0){
      return (  
        <table id="likesAnalyzeTable" style={{ marginTop: "20px" }}>
          <tbody>
            { <tr className="tableTitle">{this.renderTableHeader(this.props.tableData)}</tr> }
            {this.renderTableData(this.props.tableData)}
          </tbody>
        </table>
      )}
      if(this.props.isLoadedTableData && this.props.tableData.length===0){
        return(<div> no one likes your posts</div>)
      }
      return(<div/>)
    }
  
    renderTableData() {
      return this.props.tableData.map((userInfo, index) => {
        const {name,photo, statistics } = userInfo
        return (
          <tr key={index}>
            <td><img src={photo} alt="userImage"  className="tablePicture round"></img></td>
            <td>{name}</td>
            <td>{statistics}</td>
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