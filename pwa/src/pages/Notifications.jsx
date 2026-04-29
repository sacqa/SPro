import React, { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    API.get('/notifications').then(r => setNotifications(r.data.notifications || [])).catch(() => {});
    API.post('/notifications/read-all').catch(() => {});
  }, []);
  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <div className="text-center py-16"><div className="text-5xl mb-3">🔔</div><div className="text-gray-400">No notifications yet</div></div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`card p-4 ${!n.isRead ? 'border-l-4 border-primary' : ''}`}>
              <div className="font-semibold text-sm">{n.title}</div>
              <div className="text-xs text-gray-500 mt-1">{n.message}</div>
              <div className="text-xs text-gray-300 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
