import React, { useState } from 'react'
import './MainPage.css';
import UserName from './UserName';
import { Link } from 'react-router-dom';
const MainPage = () => {
    const [name, setName] = useState('anonymous');
  return (
    <div className='body'>
        <div className='row container-fluid text-center'>
            <div className='text-center mt-5 bg-primary col-md-6 cols col-sm-6 justify-center'>
                <h1>Expert Care, Anytime, Anywhere</h1>
            </div>
           
        </div>
        <div className='row container-fluid text-center '>
            <div className='text-center mt-2  col-md-6  col-sm-6 justify-center row1 '>
               <label htmlFor="label">Enter Your Name:</label>
               <UserName name={name} setName={setName}/>
               <Link to="/Home">Send</Link>
            </div>
           
        </div>
    </div>
  )
}

export default MainPage