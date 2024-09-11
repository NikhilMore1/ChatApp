import React, { useState } from 'react';
import './WelcomePage.css';
import { useNavigate } from 'react-router-dom';
import WelcomeNav from '../Pages/WelcomeNav';

const WelcomePage = () => {
  const [Name, setName] = useState({ name: '',category:'', image: null });
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setName({
        ...Name,
        [name]: value
    });
};
const handleFileChange = (e) => {
  setName({
      ...Name,
      image: e.target.files[0]
  });
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', Name.name);
    data.append('category', Name.category);
    data.append('image', Name.image);
    try {
      const response = await fetch('http://localhost:5000/api/saveName', {
        method:'POST',
        body:data
      });
      const result = await response.json();
      console.log(result);
      localStorage.setItem('name', Name.name);
      localStorage.setItem('image', result.image_url);
      if (response.ok) {
        alert('Profile Registered Successfully');
        setName({ name: '',category:'', image: null });
        navigate('/Users');
      }
      else{
        alert("You have already registered",result.error);
        navigate('/Users');
      }
    } catch (error) {
      console.error('Error registering profile:', error);
    }
  };

  return (
    <div>
      <div style={{ width: '100vw' }}>
        <WelcomeNav />
      </div>
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
              <h1 style={{fontWeight:'bold',fontStyle:'italic'}}>Log in</h1>
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
              <label htmlFor="category" className='mt-3' style={{ fontSize: '20px' }}>Who you are</label> <br />
              <select
                name="category"
                id="category"
                className="input-box"
                style={{width:'80%',height:'40px',border:'1px solid black',borderRadius:'5px'}}
                value={Name.category}
                onChange={handleChange}
                required
              >
                <option value="">Choose</option>
                <option value="Doctor">Doctor</option>
                <option value="Patient">Patient</option>
              </select>
              <br />
              <label htmlFor="image" className='mt-3' style={{ fontSize: '20px' }}>Upload your Image</label>
              <input
                id="image"
                name="image"
                type="file"
                className="input-box"
                onChange={handleFileChange}
              />
              <br />
              <button className="submit-btn" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
