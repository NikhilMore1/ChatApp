import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./CSS/Users.css";
import Navbars from "./Navbar";

const Users = () => {
  const [Names, setNames] = useState([]);

  const fetchdata = async () => {
    try {
      const resp = await axios.get("http://localhost:5000/api/saveName");
      if (resp.data && resp.data.UsersName) {
        const MyData = Array.isArray(resp.data.UsersName)
          ? resp.data.UsersName
          : Object.values(resp.data.UsersName);
        setNames(MyData);
      } else {
        console.log(
          "Response data does not contain UsersName or is not an object",
          resp.data
        );
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div>
      <div>
        <Navbars />
      </div>
      <div className="full_page">
        <div className="row content_wrapper mt-5">
          <div className="column left_column col">
            <h2 style={{color:'white',fontFamily:'sans-serif',fontStyle:'italic',fontWeight:'bold'}}>Doctors</h2>
            {Names.filter(item => item.category === "Doctor").map((item) => (
              <div className="name_row" key={item.id}>
                <button className="name_button" style={{textDecoration:'none'}}>
                  <Link to={`/ChatApp/${item.name}`}>
                    <div className="name" style={{textDecoration:'none'}}>
                      <li style={{textDecoration:'none',color:'white',listStyle:'none',textUnderlineOffset:'none'}}>Dr. {item.name}</li>
                    </div>
                  </Link>
                </button>
              </div>
            ))}
          </div>
          <div className="column right_column col">
            <h2 style={{color:'white',fontFamily:'sans-serif',fontStyle:'italic',fontWeight:'bold',marginRight:'14rem'}}>Patients</h2>
            {Names.filter(item => item.category !== "Doctor").map((item) => (
              <div className="name_row" key={item.id}>
                <button className="name_button">
                  <Link to={`/ChatApp/${item.name}`}>
                    <div className="name">
                      <li style={{color:'white',listStyle:'none',textUnderlineOffset:'none'}}>Pt. {item.name}</li>
                    </div>
                  </Link>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
