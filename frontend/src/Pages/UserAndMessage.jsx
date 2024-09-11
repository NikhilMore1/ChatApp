import React from 'react'
import Users from './Users'
import Chat from '../Chats/ChatApp'

const UserAndMessage = () => {
  return (
    <div>
        <div className="row">
            <div className="col">
                <Users/>
            </div>
            <div className="col">
                <Chat/>
            </div>
        </div>
    </div>
  )
}

export default UserAndMessage