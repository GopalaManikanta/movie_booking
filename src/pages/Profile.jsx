import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-screen h-screen bg-white relative overflow-hidden font-sans">
      <div className="absolute top-6 right-6">
        <button
          onClick={handleLogout}
          className="bg-rose-50 hover:bg-rose-500 border border-rose-200 hover:border-rose-500 text-rose-600 hover:text-white px-5 py-2.5 rounded-full text-xs font-bold cursor-pointer flex items-center gap-2 transition-all shadow-sm"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
