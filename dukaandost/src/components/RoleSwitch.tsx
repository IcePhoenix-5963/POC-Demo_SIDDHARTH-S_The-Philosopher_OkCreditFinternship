import React from 'react';
import { UserProfile } from '../types';
import { Users, Store, UserCircle } from 'lucide-react';

interface RoleSwitchProps {
  profiles: UserProfile[];
  currentProfile: UserProfile;
  onProfileChange: (profileId: string) => void;
}

export default function RoleSwitch({ profiles, currentProfile, onProfileChange }: RoleSwitchProps) {
  const shopkeepers = profiles.filter((p) => p.role === 'shopkeeper');
  const seekers = profiles.filter((p) => p.role === 'seeker');

  return (
    <div className="bg-white border-b-2 border-[#F3F4F6] px-4 md:px-8 py-3.5 sticky top-0 z-40 shadow-xs" id="role-switch-container">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Side: ShopSync Elegant Logo Block */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white shrink-0 shadow-sm font-extrabold text-sm">
            S
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-[#4F46E5] tracking-tight font-sans">
                ShopSync
              </h1>
              <span className="bg-[#EEF2FF] text-[#4F46E5] text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-[#E0E7FF]">
                DukaanDost Hub
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Connecting Local Indian Shops with Trusted Helpers
            </p>
          </div>
        </div>

        {/* Right Side: Quick Persona Selector */}
        <div className="flex flex-wrap items-center gap-2 md:self-center">
          <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#4F46E5]" />
            Switch Profile:
          </span>

          {/* Shopkeepers selection */}
          <div className="relative inline-block">
            <select
              value={currentProfile.id}
              onChange={(e) => onProfileChange(e.target.value)}
              className="bg-white border border-gray-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 text-gray-800 hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] cursor-pointer shadow-xs"
              id="persona-selector-dropdown"
            >
              <optgroup label="💼 Shopkeepers (Dukaan Owners)">
                {shopkeepers.map((p) => (
                  <option key={p.id} value={p.id}>
                    🏪 {p.fullName} ({p.location.split(',')[0]})
                  </option>
                ))}
              </optgroup>
              <optgroup label="🎒 Job Seekers (Workers)">
                {seekers.map((p) => (
                  <option key={p.id} value={p.id}>
                    🧑 {p.fullName} ({p.location.split(',')[0]}) — Seeker
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Current Profile Card indicator */}
          <div className="flex items-center bg-[#EEF2FF] border border-[#E0E7FF] py-1 px-3 rounded-full shadow-xs text-xs ml-1">
            <div className={`w-2 h-2 rounded-full mr-2 ${currentProfile.role === 'shopkeeper' ? 'bg-[#4F46E5]' : 'bg-emerald-500'} animate-pulse`}></div>
            <span className="font-bold text-[#1F2937]">
              {currentProfile.fullName}
            </span>
            <span className="text-indigo-200 mx-1.5">|</span>
            <span className={`font-bold uppercase text-[9px] px-2 py-0.5 rounded-full ${currentProfile.role === 'shopkeeper' ? 'bg-[#4F46E5] text-white' : 'bg-emerald-100 text-emerald-800'}`}>
              {currentProfile.role === 'shopkeeper' ? 'Merchant' : 'Seeker'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
