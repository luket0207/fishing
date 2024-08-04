import React, { useEffect } from 'react';

const Notification = ({ message, good, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Display for 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 20px',
      backgroundColor: good ? 'green' : 'red',
      color: 'white',
      borderRadius: '5px',
      zIndex: 1000,
      transition: 'opacity 0.5s ease-out'
    }}>
      {message}
    </div>
  );
};

export default Notification;
