import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackList from '../components/FeedbackList';

const EmployeeDashboard = ({ user }) => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/feedback', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setFeedback(res.data));
  }, []);

  const handleAcknowledge = async (feedbackId) => {
    try {
      await axios.post(`http://localhost:8000/api/feedback/${feedbackId}/acknowledge`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Feedback acknowledged successfully!');
      setFeedback(prev => prev.map(item => 
        item._id === feedbackId ? { ...item, acknowledged: true } : item
      ));
    } catch (err) {
      alert('Error acknowledging feedback');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Feedback Timeline</h2>
      <div className="bg-white p-4 rounded shadow">
        <FeedbackList items={feedback} onAcknowledge={handleAcknowledge} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;