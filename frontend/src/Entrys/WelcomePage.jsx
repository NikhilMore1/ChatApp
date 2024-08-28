import React, { useState } from 'react';
import './WelcomePage.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const WelcomePage = () => {
  const [UserName, setUserName] = useState('');
  const [Name, setName] = useState({ name: '' });
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserName(value);
    setName({
      ...Name,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem('name', UserName);
    const Datas = new FormData();
    Datas.append('name', Name.name);

    try {
      const response = await fetch('http://localhost:5000/api/saveName', {
        method: 'POST',
        body: Datas,
      });
      const result = await response.json();
      if (response.ok) {
        alert('Name Registered Successfully');
        setName({ name: '' });
        navigate('/Users'); // Redirect to Users page after successful registration
      } else {
        alert('Error occurred: ' + result.error);
      }
    } catch (error) {
      alert('Internal Error occurred during Registration');
      console.log(error);
    }
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
          <form onSubmit={handleSubmit}>
            <h1>Hello</h1>
            <label htmlFor="name" className="mt-5" style={{ fontSize: '20px' }}>
              Enter Your Name
            </label>
            <br />
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g Nikhil More"
              className="input-box"
              value={Name.name}
              onChange={handleChange}
              required
            />
            <br />
            <button className="submit-btn" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
