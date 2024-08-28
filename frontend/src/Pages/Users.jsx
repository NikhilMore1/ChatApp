// import React, { useState, useEffect } from 'react';
// import './CSS/Users.css';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Users = () => {
//     const navigate = useNavigate();
//     // State to store the connected users
//     const [Names, setNames] = useState([]);

//     // Function to fetch data from the API
//     const fetchdata = async () => {
//         try {
//             const resp = await axios.get('http://localhost:5000/api/saveName');
            
//             // Check if the response data is an object and contains UsersName
//             if (resp.data && resp.data.UsersName) {
//                 // Convert object to array if necessary
//                 const MyData = Array.isArray(resp.data.UsersName) ? 
//                     resp.data.UsersName : 
//                     Object.values(resp.data.UsersName);
               
//                 // Update state with the array data
//                 setNames(MyData);
//             } else {
//                 console.log("Response data does not contain UsersName or is not an object", resp.data);
//             }
//         } catch (error) {
//             console.log('Error fetching data:', error);
//         }
//     };

//     useEffect(() => {
//         fetchdata();
//     }, []);

//     return (
//         <div className='full_page'>
//             <div className="row">
//                 <div className="col mt-5 col1">
//                     {Names.length > 0 ? (
//                         Names.map(item => (
//                             // Ensure 'item' has unique identifier
//                             <div className="row name_row" key={item.id}> 
//                               <button>
//                               <Link to='/ChatApp'>
//                               <li>{item.name}</li> 
//                               </Link>
//                               </button>
//                             </div>
//                         ))
//                     ) : (
//                         <p>No users connected</p>  // Handle empty state
//                     )}
//                 </div>
//                 <div className="col">
//                     <button>
//                         <Link to='/ChatApp'>Click</Link>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Users;





import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CSS/Users.css';

const Users = () => {
    // State to store the connected users
    const [Names, setNames] = useState([]);

    // Function to fetch data from the API
    const fetchdata = async () => {
        try {
            const resp = await axios.get('http://localhost:5000/api/saveName');
            
            // Check if the response data is an object and contains UsersName
            if (resp.data && resp.data.UsersName) {
                // Convert object to array if necessary
                const MyData = Array.isArray(resp.data.UsersName) ? 
                    resp.data.UsersName : 
                    Object.values(resp.data.UsersName);
               
                // Update state with the array data
                setNames(MyData);
            } else {
                console.log("Response data does not contain UsersName or is not an object", resp.data);
            }
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchdata();
    }, []);

    return (
        <div className='full_page'>
            <div className="row">
                <div className="col mt-5 col1">
                    {Names.length > 0 ? (
                        Names.map(item => (
                            // Ensure 'item' has unique identifier
                            <div className="row name_row" key={item.id}> 
                                <button>
                                    <Link to={`/ChatApp/${item.name}`}>
                                    {
                                        localStorage.setItem('gt',item.name)
                                    }
                                        <li>{item.name}</li> 
                                    </Link>
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No users connected</p>  // Handle empty state
                    )}
                </div>
                <div className="col">
                    <button>
                        <Link to='/ChatApp'>Click</Link>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Users;

