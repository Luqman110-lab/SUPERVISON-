
import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Allow for fade-out transition
    }, 2700);
    return () => clearTimeout(timer);
  }, [message, type, onClose]);

  const bgColor = type === 'success' ? 'bg-success' : 'bg-danger';

  return (
    <div
      className={`fixed bottom-20 md:bottom-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } ${bgColor}`}
    >
      {message}
    </div>
  );
};

export default Toast;