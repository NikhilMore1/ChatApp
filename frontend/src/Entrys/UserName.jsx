import React from 'react';

const UserName = ({ name, setName }) => {
  return (
    <div className="name">
      <span><i className="fa fa-user"></i></span>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength="20"
        id="name-input"
        className="name-input"
      />
    </div>
  );
};

export default UserName;