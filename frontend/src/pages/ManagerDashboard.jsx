import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';

const ManagerDashboard = ({ user }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/team', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setTeamMembers(res.data));
    axios.get('http://localhost:8000/api/feedback', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setFeedback(res.data));
  }, []);

  const handleEdit = async (feedbackData) => {
    try {
      await axios.put(`http://localhost:8000/api/feedback/${feedbackData._id}`, {
        strengths: feedbackData.strengths,
        areas_to_improve: feedbackData.areasToImprove,
        sentiment: feedbackData.sentiment,
        comments: feedbackData.comments
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Feedback updated successfully!');
      setFeedback(prev => prev.map(item => 
        item._id === feedbackData._id ? feedbackData : item
      ));
      setEditingFeedback(null);
    } catch (err) {
      alert('Error updating feedback');
    }
  });

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manager Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Team Members</h3>
          {teamMembers.map(member => (
            <div key={member._id} className="mb-4">
              <p>{member.name} ({member.email})</p>
              <FeedbackForm employeeId={member._id} />
            </div>
          ))}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Feedback History</h3>
          <FeedbackList items={feedback} onEdit={setEditingFeedback} />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;