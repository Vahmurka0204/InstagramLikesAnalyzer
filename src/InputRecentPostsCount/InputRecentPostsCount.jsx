import React from 'react';
import './InputRecentPostsCount.css'

function InputRecentPostsCount(props) {
    const { onInputChange } = props
    return (
      <div>
        <p className='input__text'>Choose the number of recent posts to analyze</p>
        <input type="number" onChange={onInputChange} min={0} placeholder="type number" />
      </div>
    )
  }
  
export default InputRecentPostsCount;  