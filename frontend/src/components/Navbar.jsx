import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ logout, user }) => {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Feedback System</Link>
      <div>
        <span className="mr-4">{user.email} ({user.role})</span>
        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;