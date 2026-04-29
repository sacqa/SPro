import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();
  React.useEffect(() => { setTimeout(() => navigate('/'), 2000); }, []);
  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center">
      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-4 animate-pulse">
        <span className="text-primary text-4xl font-black">S</span>
      </div>
      <h1 className="text-white text-3xl font-black">SPEEDO</h1>
      <p className="text-white/70 text-sm mt-2">Fast Delivery in Dipalpur</p>
    </div>
  );
}
