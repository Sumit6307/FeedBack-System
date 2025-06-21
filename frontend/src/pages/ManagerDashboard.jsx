import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackForm from '../components/FeedbackForm.jsx';
import FeedbackList from '../components/FeedbackList.jsx';

const ManagerDashboard = ({ user }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/team', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setTeamMembers(res.data));
    axios.get('http://localhost:8000/feedback', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setFeedback(res.data));
  }, []);

  const handleEdit = (feedbackData) => {
    setEditingFeedback(feedbackData);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingFeedback) return;
    try {
      await axios.put(`http://localhost:8000/feedback/${editingFeedback._id}`, {
        strengths: editingFeedback.strengths,
        areas_to_improve: editingFeedback.areas_to_improve,
        sentiment: editingFeedback.sentiment,
        comments: editingFeedback.comments
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Feedback updated successfully!');
      setFeedback(prev => prev.map(item => 
        item._id === editingFeedback._id ? editingFeedback : item
      ));
      setEditingFeedback(null);
    } catch (err) {
      alert('Error updating feedback');
    }
  };

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
          {editingFeedback && (
            <form onSubmit={handleUpdate} className="mb-4 p-4 bg-gray-50 rounded">
              <textarea
                value={editingFeedback.strengths}
                onChange={(e) => setEditingFeedback({ ...editingFeedback, strengths: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
                rows="3"
              />
              <textarea
                value={editingFeedback.areas_to_improve}
                onChange={(e) => setEditingFeedback({ ...editingFeedback, areas_to_improve: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
                rows="3"
              />
              <select
                value={editingFeedback.sentiment}
                onChange={(e) => setEditingFeedback({ ...editingFeedback, sentiment: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              >
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
              <textarea
                value={editingFeedback.comments || ''}
                onChange={(e) => setEditingFeedback({ ...editingFeedback, comments: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
                rows="3"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update
              </button>
              <button
                onClick={() => setEditingFeedback(null)}
                className="ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </form>
          )}
          <FeedbackList items={feedback} onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;