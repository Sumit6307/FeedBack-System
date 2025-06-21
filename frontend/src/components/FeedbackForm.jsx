import React, { useState } from 'react';
import axios from 'axios';
import { marked } from 'marked';

const FeedbackForm = ({ employeeId }) => {
  const [strengths, setStrengths] = useState('');
  const [areasToImprove, setAreasToImprove] = useState('');
  const [sentiment, setSentiment] = useState('positive');
  const [comments, setComments] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/feedback', {
        employee_id: employeeId,
        strengths,
        areas_to_improve: areasToImprove,
        sentiment,
        comments
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Feedback submitted successfully!');
      setStrengths('');
      setAreasToImprove('');
      setSentiment('positive');
      setComments('');
    } catch (err) {
      alert('Error submitting feedback');
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Submit Feedback</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Strengths"
          value={strengths}
          onChange={(e) => setStrengths(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          rows="3"
        />
        <textarea
          placeholder="Areas to Improve"
          value={areasToImprove}
          onChange={(e) => setAreasToImprove(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          rows="3"
        />
        <select
          value={sentiment}
          onChange={(e) => setSentiment(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>
        <textarea
          placeholder="Comments (Markdown supported)"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          rows="3"
        />
        <div className="mt-2" dangerouslySetInnerHTML={{ __html: marked(comments) }} />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;