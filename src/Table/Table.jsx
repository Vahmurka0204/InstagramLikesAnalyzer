import React from 'react';
import './Table.css';

function Table(props) {
  const { tableData } = props;

  if (tableData.length === 0) {
    return (<div> no one likes your posts :(</div>)
  }
  
  return (
    <table className='table'>
      <tbody>
        <TableHeader />
        <TableBody tableData={tableData} />
      </tbody>
    </table>
  )
}

function TableHeader() {
  return (
    <tr className='table__header'>
      <th>Photo</th>
      <th>Name</th>
      <th>Satistics</th>
    </tr>
  )
}

function TableBody(props) {
  const { tableData } = props;

  return tableData.map((userInfo) => {
    const { name, photo, statistics } = userInfo;
    return (
      <tr key={name} className='table__row'>
        <td>
          <img src={photo} alt={name} className="table__image" />
        </td>
        <td>{name}</td>
        <td>{statistics}</td>
      </tr>
    )
  })
}

export default Table