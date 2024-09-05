import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/Toast.css';

let showToastFunc; 

const Toast = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    showToastFunc = (msg) => {
      setMessage(msg);
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 3000);
    };
  }, []);

  return show ? <div className="toast">{message}</div> : null;
};

const ToastPortal = () => {
  return ReactDOM.createPortal(<Toast />, document.body);
};

export const showToast = (message) => {
  showToastFunc(message);
};

export default ToastPortal;