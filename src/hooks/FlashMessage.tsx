import React, { useState, useEffect } from 'react';
import './FlashMessage.scss';

interface FlashMessageProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

const FlashMessage: React.FC<FlashMessageProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - (100 / (duration / 100)), 0));
    }, 100);

    const timeout = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration, onClose]);

  return (
    <div className={`flash-message ${type}`}>
      <div className="flash-message-content">
        <span>{message}</span>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ inlineSize: `${progress}%` }} />
      </div>
    </div>
  );
};

export default FlashMessage;
