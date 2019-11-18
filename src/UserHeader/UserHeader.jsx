import React, { useState, useEffect } from 'react';
import VKService from '../vkService.js';
import './UserHeader.css';

function UserHeader(props) {

    const [userName, setUserName] = useState('')
    const [userPhoto, setUserPhoto] = useState('')
    
    const setUserData = (name, surname, photo) => {
        setUserName(name + " " + surname);
        setUserPhoto(photo);
    }

    useEffect(() => {
        const { id } = props;
        const vkService = new VKService();
        vkService.GetUserData(id, setUserData);
    }, []);
   
    if (userName.length === 0 && userPhoto.length === 0) {
        return null
    }

    return (<div className="header">
        <img src={userPhoto} className="header__user-image" alt="current user icon" />
        <h3>{userName}</h3>
    </div>)
}

export default UserHeader;