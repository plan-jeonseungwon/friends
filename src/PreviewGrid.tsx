import React from 'react';
import App, { ViewState } from './App';
import './index.css';

const views: { id: ViewState; label: string }[] = [
  { id: 'home', label: 'Home (has friends)' },
  { id: 'friends_main', label: 'Friends Main' },
  { id: 'ranking', label: 'Ranking' },
  { id: 'friendManagement', label: 'Add Friends' },
  { id: 'friendRequests', label: 'Friend Requests' },
  { id: 'settings', label: 'Friends Settings' },
];

export default function PreviewGrid() {
  return (
    <div className="bg-[#E0E0E0] min-h-screen p-8 font-sans">
      <div className="flex flex-wrap gap-x-[80px] gap-y-[40px] justify-center items-start max-w-[1400px] mx-auto">
        {views.map((v) => (
          <div key={v.id} className="flex flex-col items-center gap-3">
            <h2 className="text-sm font-bold text-[#555]">{v.label}</h2>
            <div 
              className="relative rounded-[40px] border-[12px] border-[#1a1a1a] shadow-2xl overflow-hidden bg-white"
              style={{ width: '375px', height: '812px', transform: 'scale(0.8)', transformOrigin: 'top center', marginBottom: '-160px' }}
            >
              <div className="w-full h-full overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none' }}>
                <App initialView={v.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
