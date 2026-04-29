import React, { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/analytics').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const typeTotal = data?.byType?.reduce((s, x) => s + x._count, 0) || 1;

  return (
    <div>
      <h1 className="text-xl font-bold mb-5">Analytics</h1>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold mb-4">Orders by Type</h2>
          {data?.byType?.length === 0 && <div className="text-gray-400 text-sm">No data yet</div>}
          {data?.byType?.map(t => (
            <div key={t.type} className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span>{t.type === 'SPEEDMART' ? '🛒' : t.type === 'PHARMACY' ? '💊' : t.type === 'SPEEDSEND' ? '📦' : '✏️'}</span>
                <span className="text-sm font-medium">{t.type}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (t._count / typeTotal) * 100)}%` }} />
                </div>
                <span className="text-sm font-bold text-primary w-8 text-right">{t._count}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold mb-4">Orders by Status</h2>
          {data?.byStatus?.length === 0 && <div className="text-gray-400 text-sm">No data yet</div>}
          {data?.byStatus?.map(s => (
            <div key={s.status} className="flex items-center justify-between mb-2 text-sm">
              <span className="text-gray-600">{s.status.replace(/_/g, ' ')}</span>
              <span className="font-bold text-primary">{s._count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
