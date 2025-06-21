import React from 'react';
import { marked } from 'marked';

const FeedbackList = ({ items, onEdit, onAcknowledge }) => {
  return (
    <div>
      {items.map(item => (
        <div key={item._id} className="p-4 mb-2 border rounded bg-white">
          <p><strong>Strengths:</strong> <span dangerouslySetInnerHTML={{ __html: marked(item.strengths) }} /></p>
          <p><strong>Areas to Improve:</strong> <span dangerouslySetInnerHTML={{ __html: marked(item.areas_to_improve) }} /></p>
          <p><strong>Sentiment:</strong> {item.sentiment}</p>
          <p><strong>Comments:</strong> <span dangerouslySetInnerHTML={{ __html: marked(item.comments || '') }} /></p>
          <p><strong>Date:</strong> {new Date(item.created_at).toLocaleString()}</p>
          {item.acknowledged ? (
            <p className="text-green-500">Acknowledged</p>
          ) : (
            onAcknowledge && (
              <button
                onClick={() => onAcknowledge(item._id)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Acknowledge
              </button>
            )
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="mt-2 ml-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Edit
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;