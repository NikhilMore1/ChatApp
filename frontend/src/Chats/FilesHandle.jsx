import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';

const FilesHandle = ({ sendMessage, sendFeedback }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Optionally, you can send the file directly when selected:
        if (selectedFile) {
            sendMessage(selectedFile); // Assuming sendMessage can handle a file object
            setFile(null); // Reset after sending
        }
    };

    return (
        <div className="mt-1">
            <div
                style={{
                    position: 'relative',
                    display: 'inline-block',
                    fontSize: '24px',
                    color: 'black',
                    cursor: 'pointer',
                    border: '1px solid black',
                    backgroundColor: 'white',
                    height: '40px',
                    borderRadius: '5px',
                    padding: '0 10px'
                }}
            >
                <FontAwesomeIcon icon={faPaperclip} />
                <input
                    type="file"
                    onChange={handleFileChange}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                    }}
                />
            </div>
        </div>
    );
};

export default FilesHandle;
