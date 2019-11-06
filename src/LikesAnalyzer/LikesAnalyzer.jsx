import React, { Component } from 'react';
import './LikesAnalyzer.css';
import Table from '../Table/Table.jsx';
import VKService from '../vkService.js';
import UserHeader from '../UserHeader/UserHeader.jsx';
import Loader from '../Loader.js';
import InputRecentPostsCount from '../InputRecentPostsCount/InputRecentPostsCount';


class LikesAnalyzer extends Component {

  constructor(props) {
    super(props)

    this.state = {
      tableData: [],
      isLogin: false,
      isLoadedTableData: false,
      recentPostsCount: 0,
      id: ''
    };
  }

  render() {
    let { isLogin, isLoadedTableData, tableData, id } = this.state;

    return (
      <div>
        {isLogin && <UserHeader id={id}></UserHeader>}
        <InputRecentPostsCount onInputChange={this.setRecentPostsCount} />
        <button onClick={this.loadStatistics}>load statistics</button>
        {isLoadedTableData && <Table tableData={tableData}></Table>}
      </div>
    )
  }

  componentDidMount() {
    const vkService = new VKService();
    vkService.Login(this.setUserID);
  }

  setUserID = (id) => {
    this.setState({
      id,
      isLogin: true
    })
  }

  setRecentPostsCount = (e) => {
    this.setState({ recentPostsCount: e.target.value })
  }

  loadStatistics = () => {
    const { recentPostsCount } = this.state
    const loader = new Loader();
    loader.CreateTable(recentPostsCount, this.setTableData);
  }

  setTableData = (tableData) => {
    this.setState({ tableData, isLoadedTableData: true })
  }
}

export default LikesAnalyzer;
