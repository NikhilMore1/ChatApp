import React from 'react';

const Feedback = ({ feedback }) => {
  return feedback ? (
    <li className="message-feedback">
      <p className="feedback" id="feedback">{feedback}</p>
    </li>
  ) : null;
};
export default Feedback;
