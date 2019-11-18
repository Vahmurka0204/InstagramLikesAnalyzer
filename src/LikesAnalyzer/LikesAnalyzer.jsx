import React, { useState, useEffect } from 'react';
import './LikesAnalyzer.css';
import Table from '../Table/Table.jsx';
import VKService from '../vkService.js';
import UserHeader from '../UserHeader/UserHeader.jsx';
import Loader from '../Loader.js';
import InputRecentPostsCount from '../InputRecentPostsCount/InputRecentPostsCount';


function LikesAnalyzer() {

  const [tableData, setTableData] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoadedTableData, setIsLoadedTableData] = useState(false);
  const [recentPostsCount, setRecentPostsCount] = useState(0);
  const [id, setID] = useState('');


  useEffect(() => {
    const vkService = new VKService();
    vkService.Login((id) => { setID(id); setIsLogin(true) });
  }, []);

 const loadStatistics = () => {
    const loader = new Loader();
    loader.CreateTable(recentPostsCount, setData);
  }

  const setData = (tableData) => {
    setTableData(tableData);
    setIsLoadedTableData(true);
  }

  return (
    <div>
      {isLogin && <UserHeader id={id}></UserHeader>}
      <InputRecentPostsCount onInputChange={(e) => { setRecentPostsCount(e.target.value) }} />
      <button onClick={loadStatistics}>load statistics</button>
      {isLoadedTableData && <Table tableData={tableData}></Table>}
    </div>
  )
}

export default LikesAnalyzer;
