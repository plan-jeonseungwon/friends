/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  UserPlus, 
  Settings, 
  Copy, 
  ChevronRight, 
  Users,
  Trophy,
  Frown,
  Check,
  CheckCheck,
  Menu,
  Bell,
  BarChart2,
  Camera,
  Share2,
  Gift,
  Play,
  Lock,
  Footprints,
  ShoppingBag,
  Gamepad2,
  MessageSquare,
  Eye,
  ThumbsUp,
  Bookmark,
  Edit3,
  Smartphone,
  Ticket,
  History,
  Watch,
  Clover,
  BellOff,
  Wifi,
  Search,
  MoreHorizontal,
  RefreshCw,
  ChevronUp,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import mockData from './data.json';
import { AddFriendsScreen, LeaderboardScreen, ManageRequestsScreen, ConfirmModal } from './FriendScreens';

type Tab = 'home' | 'challenge' | 'rewards' | 'play' | 'feeds';
type ViewState = Tab | 'friends_main' | 'settings' | 'friendManagement' | 'ranking' | 'friendRequests' | 'lockscreen' | 'inviteFriends';


interface Friend {
  id: string;
  name: string;
  avatar: string;
  steps: number;
  friendCount?: number;
}

interface ProfileSheetUser extends Friend {
  isRecommended?: boolean;
  isMe?: boolean;
  mutualFriends?: number;
}

interface MockUser {
  id: string;
  name: string;
  recommendCode: string;
  avatar: string;
  friendCount: number;
}

interface ProfileBottomSheetProps {
  selectedProfile: ProfileSheetUser | null;
  setSelectedProfile: (f: ProfileSheetUser | null) => void;
  profileMenuOpen: boolean;
  setProfileMenuOpen: (v: boolean) => void;
  handleRemoveFriend: (id: string) => void;
}

const ProfileBottomSheet = ({ 
  selectedProfile, 
  setSelectedProfile, 
  profileMenuOpen, 
  setProfileMenuOpen, 
  handleRemoveFriend 
}: ProfileBottomSheetProps) => {
  if (!selectedProfile) return null;

  const showMenu = !selectedProfile.isRecommended && !selectedProfile.isMe;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          setSelectedProfile(null);
          setProfileMenuOpen(false);
        }}
        className="fixed inset-0 bg-black/55 z-[60]"
      />
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-[70] overflow-hidden rounded-t-[28px] bg-white shadow-[0_-16px_50px_rgba(0,0,0,0.16)]"
      >
        <div className="relative px-5 pt-3 pb-8">
          <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-black/10" />

          <div className="mb-4 flex items-center justify-end gap-2">
            <div className="relative">
              {showMenu && (
                <button 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-[#3a3328] transition-colors ${
                    profileMenuOpen ? 'bg-[#ece7de]' : 'bg-[#f5f5f5]'
                  }`}
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              )}

              {showMenu && profileMenuOpen && (
                <div className="absolute right-0 top-12 w-[132px] overflow-hidden rounded-2xl border border-black/5 bg-[#f7f3ec] py-1 shadow-[0_14px_32px_rgba(0,0,0,0.18)] backdrop-blur-sm">
                  <button 
                    onClick={() => {
                      handleRemoveFriend(selectedProfile.id);
                      setProfileMenuOpen(false);
                      setSelectedProfile(null);
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 transition-colors hover:bg-[#fbe9e7]"
                  >
                    Unfriend
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                setSelectedProfile(null);
                setProfileMenuOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5] text-[#3a3328]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col items-center pb-2 text-center">
            <div className="h-24 w-24 overflow-hidden rounded-full bg-[#f0f0f0]">
              <img 
                src={selectedProfile.avatar} 
                alt={selectedProfile.name} 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="mt-4 text-[24px] font-bold tracking-[-0.03em] text-[#1f1f1f]">
              {selectedProfile.name}
            </h3>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#f7f7f7] px-4 py-2.5 text-[#333]">
              <Footprints className="h-4 w-4" fill="currentColor" />
              <span className="text-[16px] font-bold">
                {selectedProfile.steps.toLocaleString()} steps
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const Toggle = ({ enabled, setEnabled }: { enabled: boolean, setEnabled: (v: boolean) => void }) => (
  <button 
    onClick={() => setEnabled(!enabled)}
    className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-orange-500' : 'bg-gray-300'}`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'left-7' : 'left-1'}`} />
  </button>
);

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewState) => void;
}

const SideDrawer = ({ isOpen, onClose, onNavigate }: SideDrawerProps) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-[100] max-w-md mx-auto"
        />
        {/* Drawer Content */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-y-0 left-0 w-[80%] max-w-[320px] bg-white z-[110] flex flex-col shadow-2xl h-screen"
        >
          {/* Header */}
          <div className="bg-[#FFD700] p-6 pb-8 flex flex-col items-center relative">
            <div className="w-full flex justify-between mb-4">
              <button onClick={onClose} className="p-1 -ml-2">
                <ArrowLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button 
                onClick={() => { onNavigate('settings'); onClose(); }}
                className="p-1 -mr-2"
              >
                <Settings className="w-6 h-6 text-gray-800" />
              </button>
            </div>
            
            <div className="w-20 h-20 rounded-full bg-[#00A9B5] flex items-center justify-center mb-3 border-4 border-white/20 shadow-inner">
              <span className="text-white text-2xl font-bold">SW</span>
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-2">Seungwon Jeon</h2>
            
            <div className="bg-white/30 px-3 py-1 rounded-full flex items-center gap-1 border border-white/20">
              <span className="font-bold text-gray-800 text-sm">345</span>
              <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-white shadow-sm">C</div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 py-4 overflow-y-auto">
            <button 
              onClick={() => { onNavigate('lockscreen'); onClose(); }}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
            >
              <Smartphone className="w-6 h-6 text-gray-400 shrink-0" />
              <span className="text-gray-700 font-medium">Open lockscreen</span>
            </button>
            <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left">
              <Ticket className="w-6 h-6 text-gray-400 shrink-0" />
              <span className="text-gray-700 font-medium">My rewards</span>
            </button>
            <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left">
              <History className="w-6 h-6 text-gray-400 shrink-0" />
              <span className="text-gray-700 font-medium">Coin History</span>
            </button>
            <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left">
              <Watch className="w-6 h-6 text-gray-400 shrink-0" />
              <span className="text-gray-700 font-medium">Wearable Device</span>
            </button>
            
            <div className="h-px bg-gray-100 my-2 mx-6" />
            
            <button 
              onClick={() => { onNavigate('friends_main'); onClose(); }}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
            >
              <UserPlus className="w-6 h-6 text-gray-400 shrink-0" />
              <span className="text-gray-700 font-medium">Invite friends</span>
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [foundUser, setFoundUser] = useState<MockUser | null>(null);
  
  // Settings states
  const [allowSearch, setAllowSearch] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [showRecommendedInRanking, setShowRecommendedInRanking] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<ProfileSheetUser | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [friendRequests, setFriendRequests] = useState<any[]>([
    {
      id: 'req_hawkeye',
      name: 'Hawkeye',
      avatar: 'https://picsum.photos/seed/hawkeye/100/100',
      time: '1h ago',
      cover: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&w=1200&q=80',
    },
  ]);
  const [sentRequests, setSentRequests] = useState<any[]>([
    {
      id: 'sent_cashwalker2',
      name: 'Cashwalker2',
      avatar: 'https://picsum.photos/seed/cashwalker2/100/100',
      time: 'just now',
      cover: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80',
    },
  ]);
  const [requestTab, setRequestTab] = useState<'received' | 'sent'>('received');
  const [requestActionModal, setRequestActionModal] = useState<{
    mode: 'accept' | 'decline' | 'cancel';
    request: any;
  } | null>(null);
  const [requestPreview, setRequestPreview] = useState<any | null>(null);
  const [friends, setFriends] = useState<Friend[]>(mockData.friends);
  const [widgetHasFriends, setWidgetHasFriends] = useState(true);
  const [simulateRank, setSimulateRank] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [addedRecommended, setAddedRecommended] = useState<Set<string>>(new Set());
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);

  const handleAddRecommended = (id: string, name: string) => {
    setAddedRecommended((prev) => new Set([...prev, id]));
    showToast(`Sent friend request to ${name}.`);
  };

  const handleRemoveRecommended = (id: string) => {
    setAddedRecommended((prev) => { const s = new Set(prev); s.delete(id); return s; });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (window.location.pathname.includes('/lock') || params.has('lock') || window.location.hash.includes('lock')) {
      setView('lockscreen');
    }
  }, []);

  const mockUsers: MockUser[] = mockData.mockUsers;

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string) => setToast(message);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(mockData.myProfile.recommendCode);
    showToast('Recommendation code copied.');
  };

  const handleSearchCode = (query: string) => {
    setSearchQuery(query);
    const user = mockUsers.find(u => u.recommendCode === query);
    setFoundUser(user || null);
  };

  const handleRemoveFriend = (friendId: string) => {
    setFriends(prev => prev.filter(f => f.id !== friendId));
    showToast('Friend removed.');
  };

  const openProfileSheet = (profile: ProfileSheetUser) => {
    setProfileMenuOpen(false);
    setSelectedProfile(profile);
  };

  const confirmRequestAction = () => {
    if (!requestActionModal) return;

    if (requestActionModal.mode === 'accept' || requestActionModal.mode === 'decline') {
      setFriendRequests((prev) => prev.filter((req: any) => req.id !== requestActionModal.request.id));
      showToast(requestActionModal.mode === 'accept' ? 'Accepted request' : 'Declined request');
    } else {
      setSentRequests((prev) => prev.filter((req: any) => req.id !== requestActionModal.request.id));
      showToast('Canceled request');
    }

    setRequestActionModal(null);
  };

  const renderHeader = (title: string | React.ReactNode, showIcons = true, onBack?: () => void) => (
    <header className="sticky top-0 z-30 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center gap-4">
        <ArrowLeft 
          className="w-6 h-6 text-gray-700 cursor-pointer" 
          onClick={() => {
            if (onBack) {
              onBack();
            } else if (view !== 'friends_main' && view !== 'home' && view !== 'challenge' && view !== 'rewards' && view !== 'play' && view !== 'feeds') {
              setView('friends_main');
              setSearchQuery('');
              setFoundUser(null);
            }
          }} 
        />
        {typeof title === 'string' ? (
          <h1 className="text-lg font-bold text-gray-800 tracking-tight flex-1 text-center pr-6">{title}</h1>
        ) : title}
      </div>
      {showIcons && (
        <div className="flex items-center gap-4">
          <UserPlus className="w-6 h-6 text-gray-700 cursor-pointer" onClick={() => { setView('friendManagement'); setSearchQuery(''); setFoundUser(null); }} />
          <Settings className="w-6 h-6 text-gray-700 cursor-pointer" onClick={() => setView('settings')} />
        </div>
      )}
    </header>
  );

  const profileBottomSheetProps = {
    selectedProfile,
    setSelectedProfile,
    profileMenuOpen,
    setProfileMenuOpen,
    handleRemoveFriend
  };

  if (view === 'lockscreen') {
    return (
      <div 
        className="min-h-screen font-sans text-gray-900 max-w-md mx-auto relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80)' }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Android Status Bar */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-2 pb-1 text-white">
          <div className="flex items-center gap-1 text-[13px] font-medium tracking-wide">
            11:03
            <MessageSquare className="w-3 h-3 ml-1 opacity-80" />
            <span className="opacity-80 text-[10px] bg-white/20 rounded-sm px-0.5">N</span>
            <Camera className="w-3 h-3 opacity-80" />
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <BellOff className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <div className="flex items-end gap-0.5 h-3 ml-0.5">
              <div className="w-0.5 h-1.5 bg-white"></div>
              <div className="w-0.5 h-2 bg-white"></div>
              <div className="w-0.5 h-2.5 bg-white"></div>
              <div className="w-0.5 h-3 bg-white"></div>
            </div>
            <div className="relative flex items-center ml-1">
              <div className="pl-1 pr-1.5 border border-white/60 rounded-sm text-[10px] font-bold h-[16px] flex items-center gap-1">
                56
              </div>
            </div>
          </div>
        </div>

        {/* Top App Icons */}
        <div className="relative z-10 flex items-center justify-end gap-5 px-6 pt-3 pb-8 text-white">
          <UserPlus className="w-[22px] h-[22px] drop-shadow-md" />
          <Trophy className="w-[22px] h-[22px] drop-shadow-md" />
          <MessageSquare className="w-[22px] h-[22px] drop-shadow-md" />
          <Camera className="w-[22px] h-[22px] drop-shadow-md" />
          <Clover className="w-[22px] h-[22px] drop-shadow-md" />
          <Gamepad2 className="w-[22px] h-[22px] drop-shadow-md" />
        </div>

        {/* Time and Date */}
        <div className="relative z-10 flex flex-col items-center pt-2 pb-12">
          <h1 className="text-[76px] leading-[0.9] font-normal text-white tracking-widest drop-shadow-lg">11:03</h1>
          <p className="text-white/90 text-[17px] font-medium tracking-wide drop-shadow-md mt-2">March 20, Friday</p>
        </div>

        {/* Circular Steps Counter */}
        <div className="relative z-10 w-64 h-64 mx-auto mt-4 pt-4">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="128" cy="128" r="126" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
            <circle cx="128" cy="128" r="126" stroke="#FFD700" strokeWidth="4" fill="none" strokeDasharray="791" strokeDashoffset="550" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
            <span className="text-[52px] font-light text-white leading-tight tracking-tight drop-shadow-md">2,749</span>
            <span className="text-[15px] font-medium text-white/60 mb-3 drop-shadow-md tracking-wider">Steps</span>
            <div className="flex items-center gap-5 text-[15px] font-medium mt-1">
              <span className="text-white drop-shadow-md">123 <span className="text-white/60 font-normal">kcal</span></span>
              <span className="text-white drop-shadow-md">1.4 <span className="text-white/60 font-normal">mi</span></span>
            </div>
          </div>
        </div>

        {/* Bottom overlapping banners */}
        <div className="absolute bottom-[6.5rem] w-full px-5 flex justify-center z-20">
          <div className="relative w-full max-w-sm">
            {/* Overlapping Update Banner */}
            <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-[#555555]/80 backdrop-blur-md rounded-full px-5 py-2 z-10 shadow-xl whitespace-nowrap">
              <span className="text-white/95 text-[13px] drop-shadow-md font-medium tracking-wide">
                A new version is available. <span className="font-bold text-white">Tap here to update</span>
              </span>
            </div>
            
            {/* NEWS Banner */}
            <div className="w-full bg-black/40 backdrop-blur-md rounded-lg px-4 py-3.5 flex items-center shadow-lg pt-4 pb-4">
              <span className="border border-white/50 text-white/90 text-[10px] font-medium tracking-wider px-1.5 py-0.5 rounded mr-3 shrink-0">NEWS</span>
              <span className="text-white/80 text-[13.5px] truncate tracking-wide">Traveling with disabilities is often hard. These too...</span>
            </div>
          </div>
        </div>

        {/* Slide to unlock */}
        <div className="absolute bottom-[3.5rem] w-full text-center z-20">
          <span className="text-white font-bold text-[15px] tracking-wide drop-shadow-md cursor-pointer hover:opacity-80 transition-opacity" onClick={() => {
            setView('home'); 
            setIsDrawerOpen(false); 
          }}>
            Slide to unlock &gt;&gt;
          </span>
        </div>
      </div>
    );
  }

  if (view === 'settings') {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 max-w-md mx-auto shadow-xl relative overflow-x-hidden">
        {renderHeader("Cashtalk Settings", false)}
        
        <div className="bg-gray-100 px-4 py-2 text-xs font-bold text-gray-500">My Profile</div>
        <div className="bg-white">
          <div className="px-4 py-4 flex items-center justify-between border-b border-gray-50">
            <div>
              <div className="font-bold text-gray-800">Allow recommendation code search</div>
              <div className="text-xs text-gray-400">Others can search for you using your recommendation code.</div>
            </div>
            <Toggle enabled={allowSearch} setEnabled={setAllowSearch} />
          </div>
        </div>

        <div className="bg-gray-100 px-4 py-2 text-xs font-bold text-gray-500 mt-4">Notification Settings</div>
        <div className="bg-white">
          <div className="px-4 py-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-gray-800">Friend Request Push Notification</div>
              <div className="text-xs text-gray-400">Get notified when you receive a new friend request.</div>
            </div>
            <Toggle enabled={pushNotifications} setEnabled={setPushNotifications} />
          </div>
        </div>

        <div className="bg-gray-100 px-4 py-2 text-xs font-bold text-gray-500 mt-4">Ranking Settings</div>
        <div className="bg-white">
          <div className="px-4 py-4 flex items-center justify-between border-b border-gray-50">
            <div>
              <div className="font-bold text-gray-800">Show Suggested Friends</div>
              <div className="text-xs text-gray-400">Shows suggested friends in ranking when you have less than 5 friends.</div>
            </div>
            <Toggle enabled={showRecommendedInRanking} setEnabled={setShowRecommendedInRanking} />
          </div>
        </div>

        <div className="bg-gray-100 px-4 py-2 text-xs font-bold text-gray-500 mt-4">Manage Friends</div>
        <div className="bg-white">
          {[
            { label: 'Add Friends', action: () => { setView('friendManagement'); setSearchQuery(''); setFoundUser(null); } },
            { label: 'Manage Friend Requests', action: () => setView('friendRequests') },
          ].map((item, idx) => (
            <button key={idx} onClick={item.action} className="w-full px-4 py-4 flex items-center justify-between border-b border-gray-50 last:border-0 hover:bg-gray-50">
              <span className="font-bold text-gray-800">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          ))}
        </div>

        <ProfileBottomSheet {...profileBottomSheetProps} />
      </div>
    );
  }

  if (view === 'friendManagement') {
    return (
      <AddFriendsScreen
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        foundUser={foundUser}
        handleSearchCode={handleSearchCode}
        showToast={showToast}
        setView={setView}
      />
    );
  }

  if (view === 'friendRequests') {
    return <ManageRequestsScreen setView={setView} />;
  }

  if (view === 'ranking') {
    return (
      <>
        <LeaderboardScreen
          friends={friends}
          myAvatar={mockData.myProfile.avatar}
          myId={mockData.myProfile.id}
          mySteps={mockData.myProfile.steps}
          setSelectedProfile={openProfileSheet}
          setView={setView}
          recommendedUsers={mockData.recommendedUsers}
          showRecommendedInRanking={showRecommendedInRanking}
          addedRecommended={addedRecommended}
          onAddRecommended={handleAddRecommended}
          onRemoveRecommended={handleRemoveRecommended}
        />
        <ProfileBottomSheet {...profileBottomSheetProps} />
      </>
    );
  }

  if (view === 'inviteFriends') {
    return (
      <div className="min-h-screen bg-[#ededed] font-sans text-[#1f1f1f] max-w-md mx-auto shadow-xl overflow-x-hidden">
        <header className="sticky top-0 z-30 bg-[#ffd100]">
          <div className="flex h-12 items-center justify-between px-3">
            <button onClick={() => setView('friendManagement')} className="flex h-7 w-7 items-center justify-center text-black">
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.25} />
            </button>
            <h1 className="text-[15px] font-semibold tracking-[-0.01em] text-black">Invite Friends</h1>
            <div className="w-7" />
          </div>
        </header>

        <div className="px-3 pt-4 pb-8 space-y-3">
          {/* How it works */}
          <div className="rounded-[12px] bg-white px-4 py-4">
            <p className="text-[12px] font-bold text-[#202020] mb-2">Automatically become friends when invited</p>
            <p className="text-[10px] leading-[1.6] text-[#8a8a8a]">
              If they join through the link below and enter the recommendation code,
              <br />
              <span className="font-semibold text-[#555]">the inviter and the invited user are automatically connected as friends.</span>
            </p>
          </div>

          {/* Deeplink card */}
          <div className="rounded-[12px] bg-white px-4 py-4">
            <p className="text-[10px] font-semibold text-[#9a9a9a] mb-2">My Invite Link</p>
            <div className="flex items-center gap-2 rounded-[8px] bg-[#f5f5f5] px-3 py-2.5">
              <span className="flex-1 truncate text-[10px] text-[#555]">
                https://cashwalk.page.link/invite/{mockData.myProfile.recommendCode}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://cashwalk.page.link/invite/${mockData.myProfile.recommendCode}`);
                  showToast('초대 링크가 복사되었습니다.');
                }}
                className="shrink-0 rounded-[5px] bg-[#ffd100] px-3 py-1.5 text-[10px] font-semibold text-black"
              >
                복사
              </button>
            </div>
          </div>

          {/* Share buttons */}
          <div className="rounded-[12px] bg-white px-4 py-4 space-y-2">
            <p className="text-[10px] font-semibold text-[#9a9a9a] mb-3">Share</p>
            {[
              { label: 'Share via KakaoTalk', bg: 'bg-[#FEE500]', text: 'text-[#3C1E1E]' },
              { label: 'Share via SMS', bg: 'bg-[#e8f0fe]', text: 'text-[#1a56c4]' },
              { label: 'Share Link', bg: 'bg-[#f0f0f0]', text: 'text-[#444]' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => showToast('Feature coming soon.')}
                className={`h-11 w-full rounded-[8px] ${item.bg} ${item.text} text-[11px] font-semibold`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }



  if (view === 'friends_main') {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20 max-w-md mx-auto shadow-xl relative overflow-x-hidden">
        {/* Yellow Header with top tabs */}
        <header className="sticky top-0 z-30 bg-[#FFD700] px-4 pt-3">
          <div className="flex items-center justify-between mb-0">
            <ArrowLeft
              className="w-6 h-6 text-gray-800 cursor-pointer"
              onClick={() => { setView(currentTab); }}
            />
            <h1 className="text-lg font-bold text-gray-800">Friends</h1>
            <div className="flex items-center gap-3">
              <UserPlus className="w-6 h-6 text-gray-800 cursor-pointer" onClick={() => { setView('friendManagement'); setSearchQuery(''); setFoundUser(null); }} />
              <Settings className="w-6 h-6 text-gray-800 cursor-pointer" onClick={() => setView('settings')} />
            </div>
          </div>
          {/* Top Tabs */}
          <div className="flex mt-1">
            <button
              onClick={() => setView('friends_main')}
              className="flex-1 py-2.5 text-sm font-bold border-b-2 border-gray-800 text-gray-800 transition-colors"
            >
              Friends
            </button>
            <button
              onClick={() => setView('ranking')}
              className="flex-1 py-2.5 text-sm font-bold border-b-2 border-transparent text-gray-600 transition-colors"
            >
              Leaderboard
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex flex-col gap-4 bg-gray-50">
        {/* Profile Section */}
        <section className="bg-white p-4">
          <h2 className="text-xs font-semibold text-gray-500 mb-3">My Profile</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <img src={mockData.myProfile.avatar} alt="me" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">{mockData.myProfile.id}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400">My Recommendation Code</p>
              <div className="flex items-center gap-1 text-gray-600 font-medium">
                <span>{mockData.myProfile.recommendCode}</span>
                <Copy className="w-3 h-3 cursor-pointer hover:text-orange-500 transition-colors" onClick={handleCopyCode} />
              </div>
            </div>
          </div>
        </section>


        {/* Received Friend Requests */}
        <section className="px-4">
          <div 
            onClick={() => setView('friendRequests')}
            className="bg-white rounded-xl p-4 flex items-center justify-between border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                <img src="https://picsum.photos/seed/req_icon/100/100" alt="req" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-500">Received Friend Requests</span>
                <span className="text-sm font-bold text-gray-800">Check your friend requests</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {friendRequests.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  {friendRequests.length}
                </span>
              )}
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </div>
          </div>
        </section>

        {/* Today's Lucky Friends */}
        <section className="bg-white p-4 pt-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-bold text-gray-800">Suggested Friends</h2>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
              <ChevronUp className="w-5 h-5 text-gray-400 cursor-pointer" />
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {mockData.recommendedUsers.slice(0, 6).map((user) => (
              <div key={user.id} className="flex flex-col items-center shrink-0 w-[110px] bg-[#f8f9fa] rounded-2xl p-4 border border-gray-50/50">
                <div className="w-14 h-14 rounded-full overflow-hidden mb-2 border-2 border-white shadow-sm">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <p className="text-xs font-bold text-gray-800 truncate w-full text-center px-1 mb-0.5">{user.name}</p>
                <p className="text-[10px] text-gray-400 mb-4">{user.friendCount || user.mutualFriends * 20} Friends</p>
                <button
                  onClick={() => {
                    if (addedRecommended.has(user.id)) {
                      setCancelModalId(user.id);
                    } else {
                      handleAddRecommended(user.id, user.name);
                    }
                  }}
                  className={`h-8 w-full rounded-lg text-[11px] font-black transition-all active:scale-95 flex items-center justify-center ${
                    addedRecommended.has(user.id)
                      ? 'bg-white text-[#7a7a7a] border border-[#c0c0c0]'
                      : 'bg-[#ffd100] text-black shadow-sm'
                  }`}
                >
                  {addedRecommended.has(user.id) ? <CheckCheck className="w-5 h-5" /> : '+ Add'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Friends List or Empty State */}
        <section className="bg-white p-4 min-h-[300px]">
          {friends.length > 0 ? (
            <>
              <h2 className="text-sm font-semibold text-gray-500 mb-4">{friends.length} Friends</h2>
              <div className="flex flex-col gap-4">
                {friends.map(friend => (
                  <div key={friend.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => openProfileSheet(friend)}>
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                        <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="font-bold text-gray-800">{friend.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center px-6">
              <p className="text-gray-500 font-bold mb-1">Oh, you have no Cashtalk friends yet.</p>
              <p className="text-gray-400 text-sm mb-6">Make friends now and exchange cash!</p>
            </div>
          )}
        </section>

        {/* Invite non-member shortcut */}
        <section className="px-4 pb-4">
          <button
            onClick={() => setView('inviteFriends')}
            className="w-full rounded-[12px] bg-white border border-gray-100 px-4 py-3.5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#fff3cc] flex items-center justify-center">
                <Share2 className="w-4 h-4 text-[#b8860b]" />
              </div>
              <div className="text-left">
                <p className="text-[12px] font-bold text-gray-800">미가입 친구 초대하기</p>
                <p className="text-[10px] text-gray-400">초대 후 가입하면 자동으로 친구가 됩니다</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        </section>
      </main>

      <ProfileBottomSheet {...profileBottomSheetProps} />

      {cancelModalId && (
        <ConfirmModal
          title="Cancel friend request?"
          cancelLabel="Close"
          confirmLabel="Cancel Request"
          onCancel={() => setCancelModalId(null)}
          onConfirm={() => {
            handleRemoveRecommended(cancelModalId);
            setCancelModalId(null);
            showToast('Canceled request');
          }}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-800/90 text-white px-6 py-3 rounded-full text-sm font-medium z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Check className="w-4 h-4 text-green-400" />
          {toast}
        </div>
      )}

      {/* Custom Styles for hiding scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-32 max-w-md mx-auto shadow-xl relative overflow-x-hidden">
      {view === 'home' && (
        <>
          <SideDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)} 
            onNavigate={(v) => { setView(v); setCurrentTab(v as Tab); }}
          />
          <header className="sticky top-0 z-30 bg-[#FFD700] px-4 py-3 flex items-center justify-between">
            <Menu 
              className="w-6 h-6 text-gray-800 cursor-pointer active:scale-95 transition-transform" 
              onClick={() => setIsDrawerOpen(true)}
            />
            <h1 className="text-lg font-bold text-gray-800">Home</h1>
            <div className="flex items-center gap-3">
              <div className="bg-white/30 px-3 py-1 rounded-full flex items-center gap-1">
                <span className="font-bold text-gray-800 text-sm">342</span>
                <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-white">C</div>
              </div>
              <Bell className="w-6 h-6 text-gray-800" />
            </div>
          </header>

          <div className="relative h-80 bg-gray-800 overflow-hidden">
            <img src="https://picsum.photos/seed/walk/600/800" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-56 h-56 rounded-full border-4 border-white/20 flex flex-col items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="#FFD700" strokeWidth="4" strokeDasharray="301.59" strokeDashoffset="150" strokeLinecap="round" className="transform -rotate-90 origin-center" />
                </svg>
                <span className="text-6xl font-bold text-white tracking-tighter">1573</span>
                <span className="text-white/80 text-sm mt-1">steps</span>
                <div className="flex items-center gap-4 mt-2 text-white/90 text-sm">
                  <span>70 kcal</span>
                  <span>0.8 mi</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-4 text-white">
              <BarChart2 className="w-6 h-6" />
              <Camera className="w-6 h-6" />
              <Share2 className="w-6 h-6" />
            </div>
          </div>

          <div className="p-4 bg-white mt-2">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-bold text-gray-800">Daily Lucky Box</h2>
              <span className="text-xs text-gray-400">Try your luck and win 10,000 C</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              <div className="min-w-[100px] bg-[#FFD700] rounded-xl p-3 flex flex-col items-center justify-center gap-2 shrink-0">
                <Gift className="w-8 h-8 text-white" />
                <span className="text-xs font-bold text-gray-800 text-center">Open the Box!</span>
                <button className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Play className="w-3 h-3 fill-current" /> Claim
                </button>
              </div>
              <div className="min-w-[100px] bg-gray-200 rounded-xl p-3 flex flex-col items-center justify-center gap-2 shrink-0 opacity-70">
                <Gift className="w-8 h-8 text-gray-400" />
                <span className="text-xs font-bold text-gray-500 text-center">Open<br/>the 2nd Box</span>
              </div>
              <div className="min-w-[100px] bg-gray-500 rounded-xl p-3 flex flex-col items-center justify-center gap-2 shrink-0">
                <Lock className="w-6 h-6 text-white" />
                <span className="text-xs font-bold text-white text-center">Walk<br/>2000 steps</span>
                <div className="w-full h-1.5 bg-gray-600 rounded-full overflow-hidden mt-1">
                  <div className="w-3/4 h-full bg-[#FFD700]"></div>
                </div>
              </div>
              <div className="min-w-[100px] bg-gray-500 rounded-xl p-3 flex flex-col items-center justify-center gap-2 shrink-0">
                <Lock className="w-6 h-6 text-white" />
                <span className="text-xs font-bold text-white text-center">Walk<br/>3000 steps</span>
                <div className="w-full h-1.5 bg-gray-600 rounded-full overflow-hidden mt-1">
                  <div className="w-1/2 h-full bg-[#FFD700]"></div>
                </div>
              </div>
            </div>
          </div>



          {/* Friends Daily Ranking Widget */}
          {(() => {
            const sortedForWidget = [...friends].sort((a, b) => b.steps - a.steps);
            const realMySteps = mockData.myProfile.steps;

            // 순위 시뮬레이션: simulateRank가 설정되면 해당 순위에 맞는 걸음수로 치환
            let mySteps = realMySteps;
            if (simulateRank !== null) {
              const totalCount = sortedForWidget.length + 1; // 친구 수 + 나
              if (simulateRank === 1) {
                mySteps = sortedForWidget[0].steps + 500;
              } else if (simulateRank > sortedForWidget.length) {
                mySteps = sortedForWidget[sortedForWidget.length - 1].steps - 500;
              } else {
                const above = sortedForWidget[simulateRank - 2].steps;
                const below = sortedForWidget[simulateRank - 1].steps;
                mySteps = Math.floor((above + below) / 2);
              }
            }

            const myRankInWidget = sortedForWidget.filter(f => f.steps > mySteps).length + 1;

            // 내가 상위권일 때: 내 슬롯이 상위 3개 안에 들어가도록 재구성
            const allParticipants = [
              ...sortedForWidget.map(f => ({ ...f, isMe: false })),
            ];
            // 나를 올바른 위치에 삽입
            const withMe = [
              ...allParticipants.slice(0, myRankInWidget - 1),
              { id: 'me', name: '나', avatar: mockData.myProfile.avatar, steps: mySteps, isMe: true },
              ...allParticipants.slice(myRankInWidget - 1),
            ];
            const top3 = withMe.slice(0, 3);
            // "나"가 top3 안에 있는지 확인
            const isMeInTop3 = myRankInWidget <= 3;

            const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
            const rankLabels = ['Rank 1', 'Rank 2', 'Rank 3', 'Rank 4', 'Rank 5', 'Last'];
            const rankValues = [1, 2, 3, 4, 5, sortedForWidget.length + 1];

            return (
              <div className="mx-4 mt-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-bold text-gray-800">Today's Friend Ranking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* 친구 있음/없음 토글 */}
                    <button
                      onClick={() => setWidgetHasFriends(v => !v)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${widgetHasFriends ? 'border-green-400 text-green-600 bg-green-50' : 'border-gray-300 text-gray-400 bg-gray-50'}`}
                    >
                      {widgetHasFriends ? 'Has Friends' : 'No Friends'}
                    </button>
                    <button
                      onClick={() => setView(widgetHasFriends ? 'ranking' : 'friends_main')}
                      className="text-[11px] text-gray-400 flex items-center gap-0.5 active:text-gray-600"
                    >
                      View All <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 🔧 순위 시뮬레이터 토글 */}
                {widgetHasFriends && (
                  <div className="px-4 pb-2 flex items-center gap-1.5">
                    <span className="text-[9px] text-gray-400 font-bold mr-0.5">Preview</span>
                    {rankLabels.map((label, i) => {
                      const val = rankValues[i];
                      const isActive = simulateRank === val;
                      return (
                        <button
                          key={label}
                          onClick={() => setSimulateRank(isActive ? null : val)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                            isActive
                              ? 'bg-orange-500 text-white border-orange-500 scale-105'
                              : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-orange-300 hover:text-orange-400'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="px-4 pb-3">
                  {widgetHasFriends ? (
                    <div className="flex gap-2">
                      {top3.map((participant, idx) => {
                        const isMe = (participant as any).isMe;
                        return (
                        <button
                          key={participant.id + idx}
                          onClick={() => setView('ranking')}
                          className="flex-1 flex flex-col items-center gap-1.5 py-2 rounded-xl active:bg-gray-50 transition-colors"
                        >
                          <div className="relative">
                            <div className={`w-10 h-10 rounded-full overflow-hidden bg-gray-100 border-2 ${ isMe ? 'border-orange-400' : 'border-transparent' }`}>
                              <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            {isMe ? (
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-orange-400 flex items-center justify-center text-[8px] font-black text-white shadow-sm">Me</span>
                            ) : (
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-sm" style={{ backgroundColor: medalColors[idx] }}>
                                {idx + 1}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-medium text-gray-600 truncate w-full text-center px-0.5">{isMe ? 'Me' : participant.name.split(' ')[0]}</span>
                          <span className={`text-[10px] font-bold ${ isMe ? 'text-orange-500' : 'text-gray-800' }`}>{isMe ? `Rank ${myRankInWidget}` : `Rank ${idx + 1}`}</span>
                        </button>
                        );
                      })}
                      {/* 내가 top3 밖이면 오른쪽에 별도 "나" 슬롯 표시 */}
                      {!isMeInTop3 && (
                        <button
                          onClick={() => setView('ranking')}
                          className="flex-1 flex flex-col items-center gap-1.5 py-2 rounded-xl active:bg-gray-50 transition-colors"
                        >
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border-2 border-orange-400">
                              <img src={mockData.myProfile.avatar} alt="me" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-orange-400 flex items-center justify-center text-[8px] font-black text-white shadow-sm">Me</span>
                          </div>
                          <span className="text-[10px] font-medium text-gray-600 truncate w-full text-center px-0.5">Me</span>
                          <span className="text-[10px] font-bold text-orange-500">Rank {myRankInWidget}</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="py-3 text-center">
                      <p className="text-xs text-gray-400 mb-2">You have no friends yet. Add some!</p>
                      <button
                        onClick={() => { setView('friendManagement'); setSearchQuery(''); setFoundUser(null); }}
                        className="text-xs font-bold text-orange-500 border border-orange-300 px-3 py-1 rounded-full"
                      >
                        Add Friends
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Friends Banner */}
          <div className="mx-4 mt-3">
            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => setView('friends_main')}
              className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-4 shadow-md shadow-orange-100 flex items-center justify-between overflow-hidden relative"
            >
              <div className="relative z-10">
                <h3 className="text-white font-bold text-sm mb-1">Find Cashtalk Friends!</h3>
                <p className="text-orange-50 text-[11px]">Walking together is more fun</p>
              </div>
              <div className="bg-white/20 p-2 rounded-xl relative z-10 backdrop-blur-sm">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              {/* Decorative circles */}
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full border border-white/5" />
              <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-white/5 rounded-full" />
            </motion.div>
          </div>

          <div className="p-4 flex gap-3 overflow-x-auto no-scrollbar">
            <div className="min-w-[140px] bg-white rounded-xl p-3 border border-gray-100 shadow-sm shrink-0">
              <div className="h-12 bg-gray-900 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-white font-bold text-xl">amazon</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Amazon.ca</span>
                <span className="text-sm font-bold">10,000 C</span>
              </div>
            </div>
            <div className="min-w-[140px] bg-white rounded-xl p-3 border border-gray-100 shadow-sm shrink-0">
              <div className="h-12 bg-blue-600 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-white font-bold text-xl">Walmart</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Walmart</span>
                <span className="text-sm font-bold">10,000 C</span>
              </div>
            </div>
          </div>
        </>
      )}

      {view === 'challenge' && (
        <>
          <header className="sticky top-0 z-30 bg-white px-4 py-3 flex items-center justify-center border-b border-gray-100">
            <h1 className="text-lg font-bold text-gray-800">Challenge</h1>
            <div className="absolute right-4 flex items-center gap-2">
              <span className="font-bold text-gray-800 text-sm">345</span>
              <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white">C</div>
            </div>
          </header>
          <div className="bg-white flex px-4 border-b border-gray-100">
            <button className="py-3 px-4 font-bold text-gray-800 border-b-2 border-gray-800">Main</button>
            <button className="py-3 px-4 font-bold text-gray-400 border-b-2 border-transparent">Board</button>
          </div>
          <div className="p-4 bg-white flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-white">C</div>
            <span className="text-gray-500 text-sm">Coins</span>
            <span className="font-bold text-gray-800">345</span>
          </div>
          <div className="bg-[#FFE4B5] p-6 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm text-gray-800 mb-1">Make a healthy habit everyday</p>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">Earn exciting coins<br/>and Bonus gifts!</h2>
            </div>
            <Gift className="absolute right-4 bottom-[-10px] w-24 h-24 text-red-500 opacity-80 transform rotate-12" />
          </div>
          <div className="p-4 bg-white mt-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 text-lg">My Challenges <span className="text-gray-400 text-sm font-normal">(1/3)</span></h2>
              <span className="text-sm text-gray-500 flex items-center">completed <ChevronRight className="w-4 h-4" /></span>
            </div>
            <div className="border border-gray-100 rounded-xl p-4 shadow-sm flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400 mb-1">4 days left • 5 times left</p>
                <h3 className="font-bold text-gray-800 mb-2">10K Steps Challen...</h3>
                <div className="inline-flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-md">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] font-bold text-white">C</div>
                  <span className="text-xs font-bold text-yellow-700">500</span>
                </div>
              </div>
              <img src="https://picsum.photos/seed/shoe/100/100" className="w-16 h-16 object-cover rounded-lg transform -rotate-12" referrerPolicy="no-referrer" />
            </div>
          </div>
          <div className="p-4 bg-white mt-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 text-lg">Hot challenge posts</h2>
              <span className="text-sm text-gray-500 flex items-center">more <ChevronRight className="w-4 h-4" /></span>
            </div>
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
              <button className="px-4 py-1.5 rounded-full border border-yellow-400 text-yellow-600 text-sm font-medium whitespace-nowrap">Live</button>
              <button className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-500 text-sm font-medium whitespace-nowrap">Weekly</button>
              <button className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-500 text-sm font-medium whitespace-nowrap">Monthly</button>
              <button className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-500 text-sm font-medium whitespace-nowrap">Commented</button>
            </div>
            <div className="flex flex-col gap-3">
              {['Beautiful skies', 'My 10K challenge day 1', 'Hoy es domingo mujeriego', 'Day 4', 'Gchfjf'].map((title, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="font-bold text-gray-800 w-5">0{i+1}</span>
                  <span className="text-gray-700 flex-1 truncate">{title}</span>
                  <span className="text-orange-500 text-sm">[{Math.floor(Math.random() * 10) + 1}]</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {view === 'rewards' && (
        <>
          <header className="sticky top-0 z-30 bg-[#FFD700] px-4 py-3 flex items-center justify-center">
            <h1 className="text-lg font-bold text-gray-800">Rewards</h1>
            <div className="absolute right-4 flex items-center gap-2 bg-white/30 px-3 py-1 rounded-full">
              <span className="font-bold text-gray-800 text-sm">345</span>
              <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-white">C</div>
            </div>
          </header>
          <div className="bg-white flex px-4 border-b border-gray-100">
            <button className="flex-1 py-3 px-4 font-bold text-gray-800 border-b-2 border-gray-800 text-center">Gift cards</button>
            <button className="flex-1 py-3 px-4 font-bold text-gray-400 border-b-2 border-transparent text-center">My rewards</button>
          </div>
          <div className="p-4 bg-white flex items-center justify-between border-b border-gray-100">
            <span className="text-gray-600">Country</span>
            <div className="w-6 h-4 bg-red-500 flex items-center justify-center rounded-sm overflow-hidden">
              <div className="w-2 h-full bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-red-500 transform rotate-45"></div>
              </div>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {[
              { name: 'Amazon.ca Gift Certificate CA', brand: 'Amazon.ca', color: 'bg-gray-900', logo: 'amazon' },
              { name: 'Walmart Gift Card CA', brand: 'Walmart Canada', color: 'bg-blue-600', logo: 'Walmart' },
              { name: "Tim Horton's E-Gift TimCard® CA", brand: 'Tim Hortons Canada', color: 'bg-red-800', logo: 'Tim Hortons' },
              { name: 'Starbucks eGift Canada CA', brand: 'Starbucks Canada', color: 'bg-green-700', logo: 'Starbucks' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                  <div className={`w-16 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>{card.logo}</div>
                  <div>
                    <p className="text-xs text-gray-500">{card.brand}</p>
                    <p className="font-bold text-gray-800 text-sm">{card.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 opacity-50">
                    <div className="bg-gray-200 text-gray-500 text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">5$ <Lock className="w-3 h-3" /></div>
                    <span className="text-sm font-bold text-gray-400">5,000 C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="bg-[#FFD700] text-gray-800 text-xs font-bold px-1.5 py-0.5 rounded">10$</div>
                    <span className="text-sm font-bold text-gray-800">10,000 C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="bg-[#FFD700] text-gray-800 text-xs font-bold px-1.5 py-0.5 rounded">15$</div>
                    <span className="text-sm font-bold text-gray-800">15,000 C</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'play' && (
        <>
          <header className="sticky top-0 z-30 bg-[#FFD700] px-4 py-3 flex items-center justify-center">
            <h1 className="text-lg font-bold text-gray-800">Play</h1>
            <div className="absolute right-4 flex items-center gap-2 bg-white/30 px-3 py-1 rounded-full">
              <span className="font-bold text-gray-800 text-sm">345</span>
              <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-white">C</div>
            </div>
          </header>
          <div className="bg-white flex px-4 border-b border-gray-100">
            <button className="flex-1 py-3 px-4 font-bold text-gray-800 border-b-2 border-gray-800 text-center">Games</button>
            <button className="flex-1 py-3 px-4 font-bold text-gray-400 border-b-2 border-transparent text-center">Missions</button>
          </div>
          <div className="bg-gradient-to-b from-cyan-400 to-blue-500 p-6 text-center text-white pb-10">
            <h2 className="text-3xl font-bold mb-2">Instant Games</h2>
            <p className="text-lg mb-6">Play free games!</p>
            
            <div className="text-left mb-3 font-bold">Top Ranked</div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {[
                { title: 'Stack Fall', img: 'https://picsum.photos/seed/game1/200/200' },
                { title: 'Dalgona Game', img: 'https://picsum.photos/seed/game2/200/200' },
                { title: 'Lottery', img: 'https://picsum.photos/seed/game3/200/200' }
              ].map((game, i) => (
                <div key={i} className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0 shadow-lg">
                  <img src={game.img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-0 left-0 bg-[#a3e635] text-gray-900 font-bold text-xl px-3 py-1 rounded-br-lg">{i+1}</div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1 backdrop-blur-sm">{game.title}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 p-4 flex items-center justify-between text-white">
            <div>
              <h3 className="text-xl font-bold italic text-white flex items-center gap-2">Amazing <span className="text-[#FFD700]">Offer</span></h3>
              <p className="text-xs text-gray-300 mt-1">Get chances to earn more coins!</p>
            </div>
            <Gift className="w-12 h-12 text-[#FFD700]" />
          </div>
          <div className="p-4 bg-white">
            <h3 className="font-bold text-gray-800 mb-4">ALL</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { title: 'Merge DOT', img: 'https://picsum.photos/seed/game4/200/200' },
                { title: 'Lottery', img: 'https://picsum.photos/seed/game5/200/200' },
                { title: 'Juicy Pang', img: 'https://picsum.photos/seed/game6/200/200' }
              ].map((game, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                    <img src={game.img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className="text-xs text-center text-gray-700 font-medium">{game.title}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {view === 'feeds' && (
        <>
          <header className="sticky top-0 z-30 bg-white px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Footprints className="w-5 h-5 text-gray-800 transform -rotate-45" />
              <span className="font-bold text-gray-800 italic">cashwalk</span>
              <span className="text-sm text-gray-500">community</span>
            </div>
            <div className="relative">
              <input type="text" placeholder="Search for information you're curious about" className="w-full border border-orange-400 rounded-full py-2 px-4 pr-10 text-sm focus:outline-none" />
              <Search className="absolute right-3 top-2 w-5 h-5 text-gray-800" />
            </div>
          </header>
          <div className="bg-white flex items-center px-4 border-b border-gray-100 overflow-x-auto no-scrollbar">
            <Menu className="w-5 h-5 text-gray-600 mr-4 shrink-0" />
            <button className="py-3 px-3 font-bold text-gray-500 whitespace-nowrap">Bookmarks</button>
            <button className="py-3 px-3 font-bold text-gray-500 whitespace-nowrap">All Posts</button>
            <button className="py-3 px-3 font-bold text-gray-500 whitespace-nowrap">Notice</button>
            <button className="py-3 px-3 font-bold text-orange-500 border-b-2 border-orange-500 whitespace-nowrap">Hot</button>
          </div>
          <div className="p-4 bg-white border-b border-gray-100">
            <h2 className="font-bold text-xl flex items-center gap-2">Hot <span className="text-yellow-400 text-2xl">⭐</span></h2>
          </div>
          <div className="bg-[#FFF8E7] px-4 py-3 flex items-center gap-2 border-b border-gray-100">
            <span className="border border-orange-400 text-orange-500 text-xs font-bold px-2 py-0.5 rounded">Notice</span>
            <span className="text-sm font-bold text-gray-800">Challenges are now available! 🎉</span>
          </div>
          <div className="bg-white">
            {[
              { title: 'Debating whether to move', author: 'Tabitha Maguire', views: '450', likes: '11', comments: '8', date: '26.02.24' },
              { title: "Can y'all answer my question please👉", author: 'Kaizlee Dean', views: '1.6K', likes: '41', comments: '41', date: '26.02.20' },
              { title: 'Lazy Kitty', author: 'Addie Deal', views: '1.4K', likes: '71', comments: '30', date: '26.02.16', img: true },
              { title: 'Hiii new here', author: 'Bella', views: '604', likes: '15', comments: '15', date: '26.02.14' }
            ].map((post, i) => (
              <div key={i} className="p-4 border-b border-gray-100 flex justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">{post.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{post.author}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {post.likes}</span>
                    <span className="flex items-center gap-1"><Bookmark className="w-3 h-3" /> 1</span>
                    <span>{post.date}</span>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  {post.img && <img src="https://picsum.photos/seed/cat/60/60" className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />}
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 flex flex-col items-center justify-center min-w-[48px]">
                    <span className="font-bold text-gray-800">{post.comments}</span>
                    <span className="text-[10px] text-gray-400">Comments</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Floating Write Button */}
          <button className="fixed bottom-36 right-4 bg-[#FFD700] text-gray-900 px-4 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 z-20">
            <Edit3 className="w-5 h-5" /> writing
          </button>
        </>
      )}

      {/* Invite Banner */}
      <div className="fixed bottom-[60px] left-0 right-0 max-w-md mx-auto bg-gray-900 text-white px-6 py-3 flex items-center justify-between z-40">
        <div className="flex flex-col">
          <span className="font-bold text-sm">Invite Your Friends and</span>
          <span className="font-bold text-sm">Get Bonus Coins!</span>
        </div>
        <div className="flex items-end h-10">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" className="w-12 h-12 -mb-2" referrerPolicy="no-referrer" />
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=transparent" className="w-10 h-10 -mb-2 -ml-4" referrerPolicy="no-referrer" />
        </div>
      </div>

      {/* Main Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 flex items-center justify-between px-2 py-1 z-50">
        <button className={`flex flex-col items-center gap-1 p-2 w-16 ${currentTab === 'home' ? 'text-gray-900' : 'text-gray-400'}`} onClick={() => { setCurrentTab('home'); setView('home'); }}>
          <Footprints className="w-6 h-6 transform -rotate-45" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button className={`flex flex-col items-center gap-1 p-2 w-16 ${currentTab === 'challenge' ? 'text-gray-900' : 'text-gray-400'}`} onClick={() => { setCurrentTab('challenge'); setView('challenge'); }}>
          <Trophy className="w-6 h-6" />
          <span className="text-[10px] font-medium">Challenge</span>
        </button>
        <button className={`flex flex-col items-center gap-1 p-2 w-16 ${currentTab === 'rewards' ? 'text-gray-900' : 'text-gray-400'}`} onClick={() => { setCurrentTab('rewards'); setView('rewards'); }}>
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] font-medium">Rewards</span>
        </button>
        <button className={`flex flex-col items-center gap-1 p-2 w-16 ${currentTab === 'play' ? 'text-gray-900' : 'text-gray-400'}`} onClick={() => { setCurrentTab('play'); setView('play'); }}>
          <Gamepad2 className="w-6 h-6" />
          <span className="text-[10px] font-medium">Play</span>
        </button>
        <button className={`flex flex-col items-center gap-1 p-2 w-16 ${currentTab === 'feeds' ? 'text-gray-900' : 'text-gray-400'}`} onClick={() => { setCurrentTab('feeds'); setView('feeds'); }}>
          <MessageSquare className="w-6 h-6" />
          <span className="text-[10px] font-medium">Feeds</span>
        </button>
      </nav>

      {/* Custom Styles for hiding scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
