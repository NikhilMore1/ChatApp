import React, { useState } from 'react';
import './WelcomePage.css';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  // Using useState to manage input value
  const [name, setName] = useState('');

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = () => {
    localStorage.setItem("name", name);
  };

  return (
    <div className="bodys">
      <div className="welcome-container">
        <div className="Heading">
          <p>Live Consultation System</p>
        </div>
        <hr />
        <div className="sec1">
          <p>
            <marquee direction="left">
              👨‍⚕️Consult any available Doctors from our System directly via Chat👨‍⚕️
            </marquee>
          </p>
        </div>
        <hr />
        <div className="form-container">
          <h1>Hello</h1>
          <label htmlFor="name" className="mt-5" style={{ fontSize: '20px' }}>
            Enter Your Name
          </label>
          <br />
          <input
            id="name"
            type="text"
            placeholder="e.g Nikhil More"
            className="input-box"
            value={name}
            onChange={handleInputChange} // Updating state on input change
          />
          <br />
          <button className="submit-btn" onClick={handleSubmit}>
            <Link className="link-btn" to="/ChatApp">Submit</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
