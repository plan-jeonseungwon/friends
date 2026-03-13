/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  UserPlus, 
  Settings, 
  Copy, 
  ChevronRight, 
  RefreshCw, 
  ChevronUp,
  Users,
  MessageCircle,
  Trophy,
  Info,
  MoreHorizontal,
  Frown,
  Check,
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
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import mockData from './data.json';

type Tab = 'home' | 'challenge' | 'rewards' | 'play' | 'feeds';
type ViewState = Tab | 'friends_main' | 'settings' | 'friendManagement' | 'ranking' | 'friendRequests';
type FriendTab = 'myFriends' | 'findNew';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  steps: number;
  friendCount?: number;
}

interface MockUser {
  id: string;
  name: string;
  recommendCode: string;
  avatar: string;
  friendCount: number;
}

interface ProfileBottomSheetProps {
  selectedProfile: Friend | null;
  setSelectedProfile: (f: Friend | null) => void;
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
}: ProfileBottomSheetProps) => (
  <AnimatePresence>
    {selectedProfile && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setSelectedProfile(null);
            setProfileMenuOpen(false);
          }}
          className="fixed inset-0 bg-black/60 z-[60]"
        />
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[32px] z-[70] overflow-hidden"
        >
          <div className="relative h-64">
            <img 
              src={`https://picsum.photos/seed/${selectedProfile.id}_bg/600/400`} 
              alt="background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <button 
              onClick={() => {
                setSelectedProfile(null);
                setProfileMenuOpen(false);
              }}
              className="absolute top-6 left-6 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <button 
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="absolute top-6 right-6 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
            >
              <MoreHorizontal className="w-6 h-6" />
            </button>

            {profileMenuOpen && (
              <div className="absolute top-[72px] right-6 bg-white shadow-2xl rounded-xl py-1 w-32 z-[80] border border-gray-100 animate-in fade-in zoom-in duration-200">
                <button 
                  onClick={() => {
                    handleRemoveFriend(selectedProfile.id);
                    setProfileMenuOpen(false);
                    setSelectedProfile(null);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-500 font-bold hover:bg-red-50 transition-colors"
                >
                  친구 끊기
                </button>
              </div>
            )}
          </div>
          
          <div className="px-6 pb-10 -mt-12 relative bg-white rounded-t-[32px] flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-lg mb-4">
              <img 
                src={selectedProfile.avatar} 
                alt={selectedProfile.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{selectedProfile.name}</h3>
            <div className="flex items-center gap-1 text-gray-400 mb-8">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">친구 {selectedProfile.friendCount || 0}명</span>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const Toggle = ({ enabled, setEnabled }: { enabled: boolean, setEnabled: (v: boolean) => void }) => (
  <button 
    onClick={() => setEnabled(!enabled)}
    className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-orange-500' : 'bg-gray-300'}`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'left-7' : 'left-1'}`} />
  </button>
);

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [friendTab, setFriendTab] = useState<FriendTab>('myFriends');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [foundUser, setFoundUser] = useState<MockUser | null>(null);
  
  // Settings states
  const [allowSearch, setAllowSearch] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Friend | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [friendRequests, setFriendRequests] = useState(mockData.friendRequests || []);
  const [friends, setFriends] = useState<Friend[]>(mockData.friends);

  const mockUsers: MockUser[] = mockData.mockUsers;

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string) => setToast(message);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(mockData.myProfile.recommendCode);
    showToast('추천코드가 복사되었습니다.');
  };

  const filteredFriends = friends.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchCode = (query: string) => {
    setSearchQuery(query);
    const user = mockUsers.find(u => u.recommendCode === query);
    setFoundUser(user || null);
  };

  const handleRemoveFriend = (friendId: string) => {
    setFriends(friends.filter(f => f.id !== friendId));
    showToast('친구 관계가 해제되었습니다.');
  };

  const renderMoreMenu = () => {
    if (!menuOpen) return null;
    return (
      <div className="absolute right-4 top-12 bg-white shadow-2xl rounded-lg py-2 w-48 z-50 border border-gray-100 animate-in fade-in zoom-in duration-200">
        <button onClick={() => { setView('friendRequests'); setMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors">친구 요청 관리</button>
      </div>
    );
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
            setMenuOpen(false);
          }} 
        />
        {typeof title === 'string' ? (
          <h1 className="text-lg font-bold text-gray-800 tracking-tight flex-1 text-center pr-6">{title}</h1>
        ) : title}
      </div>
      {showIcons && (
        <div className="flex items-center gap-4">
          <Search className="w-6 h-6 text-gray-700 cursor-pointer" onClick={() => { setView('friendManagement'); setFriendTab('myFriends'); }} />
          <UserPlus className="w-6 h-6 text-gray-700 cursor-pointer" onClick={() => { setView('friendManagement'); setFriendTab('findNew'); }} />
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

  if (view === 'settings') {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 max-w-md mx-auto shadow-xl relative overflow-x-hidden">
        {renderHeader("캐시톡 설정", false)}
        
        <div className="bg-gray-100 px-4 py-2 text-xs font-bold text-gray-500">내 프로필</div>
        <div className="bg-white">
          <div className="px-4 py-4 flex items-center justify-between border-b border-gray-50">
            <div>
              <div className="font-bold text-gray-800">내 추천코드 검색 허용</div>
              <div className="text-xs text-gray-400">내 추천코드를 상대방이 검색 가능합니다.</div>
            </div>
            <Toggle enabled={allowSearch} setEnabled={setAllowSearch} />
          </div>
        </div>

        <div className="bg-gray-100 px-4 py-2 text-xs font-bold text-gray-500 mt-4">알림 설정</div>
        <div className="bg-white">
          <div className="px-4 py-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-gray-800">친구 요청 푸시 알림</div>
              <div className="text-xs text-gray-400">새로운 친구 요청이 오면 알림을 받습니다.</div>
            </div>
            <Toggle enabled={pushNotifications} setEnabled={setPushNotifications} />
          </div>
        </div>

        <div className="bg-gray-100 px-4 py-2 text-xs font-bold text-gray-500 mt-4">친구 관리</div>
        <div className="bg-white">
          {[
            { label: '내 친구 관리', action: () => { setView('friendManagement'); setFriendTab('myFriends'); } },
            { label: '친구 요청 관리', action: () => setView('friendRequests') },
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
      <div className="min-h-screen bg-white font-sans text-gray-900 max-w-md mx-auto shadow-xl relative overflow-x-hidden pb-20">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ArrowLeft className="w-6 h-6 text-gray-700 cursor-pointer" onClick={() => setView('friends_main')} />
              <h1 className="text-lg font-bold text-gray-800 flex-1 text-center pr-6">친구 관리</h1>
            </div>
            <MoreHorizontal className="w-6 h-6 text-gray-700 cursor-pointer" onClick={toggleMenu} />
            {renderMoreMenu()}
          </div>
          <div className="flex">
            <button 
              onClick={() => { setFriendTab('myFriends'); setSearchQuery(''); setFoundUser(null); }}
              className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${friendTab === 'myFriends' ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-400'}`}
            >
              내 친구
            </button>
            <button 
              onClick={() => { setFriendTab('findNew'); setSearchQuery(''); setFoundUser(null); }}
              className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${friendTab === 'findNew' ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-400'}`}
            >
              새 친구 찾기
            </button>
          </div>
        </header>

        <div className="p-4">
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder={friendTab === 'myFriends' ? "친구 이름 검색하기" : "추천 코드 검색하기"}
              className="w-full bg-gray-100 rounded-xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
              value={searchQuery}
              onChange={(e) => friendTab === 'myFriends' ? setSearchQuery(e.target.value) : handleSearchCode(e.target.value)}
            />
            <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>

          {friendTab === 'myFriends' ? (
            <>
              {filteredFriends.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {filteredFriends.map(friend => (
                    <div key={friend.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer" onClick={() => setSelectedProfile(friend)}>
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                        <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="font-bold text-gray-800">{friend.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center mt-20 text-center px-10">
                  <Frown className="w-12 h-12 text-gray-200 mb-4" />
                  <p className="text-gray-400 font-medium">내 친구가 없습니다.</p>
                </div>
              )}
            </>
          ) : (
            <>
              {foundUser ? (
                <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center animate-in slide-in-from-bottom-4 duration-300">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-md cursor-pointer" onClick={() => setSelectedProfile({ id: foundUser.id, name: foundUser.name, avatar: foundUser.avatar, steps: 0, friendCount: foundUser.friendCount })}>
                    <img src={foundUser.avatar} alt={foundUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{foundUser.name}</h3>
                  <p className="text-sm text-gray-400 mb-6">친구 {foundUser.friendCount}명</p>
                  <button 
                    onClick={() => showToast(`${foundUser.name}님에게 친구 신청을 보냈습니다.`)}
                    className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95"
                  >
                    친구 신청하기
                  </button>
                </div>
              ) : searchQuery ? (
                <div className="flex flex-col items-center justify-center mt-20 text-center px-8">
                  <Frown className="w-12 h-12 text-gray-200 mb-4" />
                  <p className="text-gray-400 font-medium">해당 코드로 가입된 사용자가 없습니다.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center mt-20 text-center px-8">
                  <p className="text-gray-400 font-medium leading-relaxed">
                    검색창에 친구하고 싶은 사람의<br />
                    추천코드를 검색해보세요.<br /><br />
                    추천코드는 "설정 &gt; 프로필 설정"에서<br />
                    확인 가능해요.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        <ProfileBottomSheet {...profileBottomSheetProps} />
      </div>
    );
  }

  if (view === 'friendRequests') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 max-w-md mx-auto shadow-xl relative overflow-x-hidden">
        {renderHeader("받은 친구 요청", false)}
        
        <div className="p-4">
          {friendRequests.length > 0 ? (
            <div className="flex flex-col gap-4">
              {friendRequests.map((req: any) => (
                <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      <img src={req.avatar} alt={req.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{req.name}</div>
                      <div className="text-xs text-gray-400">{req.time}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setFriendRequests(friendRequests.filter((r: any) => r.id !== req.id));
                        showToast('친구 요청을 거절했습니다.');
                      }}
                      className="px-3 py-1.5 bg-gray-200 text-gray-600 text-xs font-bold rounded-md"
                    >
                      거절
                    </button>
                    <button 
                      onClick={() => {
                        setFriendRequests(friendRequests.filter((r: any) => r.id !== req.id));
                        showToast('친구 요청을 수락했습니다.');
                      }}
                      className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-md"
                    >
                      수락
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-10">
              <Frown className="w-12 h-12 text-gray-200 mb-4" />
              <p className="text-gray-400 font-medium">받은 친구 요청이 없습니다.</p>
            </div>
          )}
        </div>
        <ProfileBottomSheet {...profileBottomSheetProps} />
      </div>
    );
  }

  if (view === 'ranking') {
    const sortedFriends = [...friends].sort((a, b) => b.steps - a.steps);
    const myRank = sortedFriends.findIndex(f => f.steps < mockData.myProfile.steps) + 1;
    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '');

    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 max-w-md mx-auto shadow-xl relative overflow-x-hidden pb-32">
        {/* Yellow Header */}
        <header className="sticky top-0 z-30 bg-[#FFD700] px-4 pt-3">
          <div className="flex items-center justify-between mb-0">
            <ArrowLeft
              className="w-6 h-6 text-gray-800 cursor-pointer"
              onClick={() => { setView(currentTab); }}
            />
            <h1 className="text-lg font-bold text-gray-800">Friends</h1>
            <div className="flex items-center gap-3">
              <Search className="w-6 h-6 text-gray-800 cursor-pointer" onClick={() => { setView('friendManagement'); setFriendTab('myFriends'); }} />
              <UserPlus className="w-6 h-6 text-gray-800 cursor-pointer" onClick={() => { setView('friendManagement'); setFriendTab('findNew'); }} />
              <Settings className="w-6 h-6 text-gray-800 cursor-pointer" onClick={() => setView('settings')} />
            </div>
          </div>
          {/* Top Tabs */}
          <div className="flex mt-1">
            <button
              onClick={() => setView('friends_main')}
              className="flex-1 py-2.5 text-sm font-bold border-b-2 border-transparent text-gray-600 transition-colors"
            >
              친구
            </button>
            <button
              onClick={() => setView('ranking')}
              className="flex-1 py-2.5 text-sm font-bold border-b-2 border-gray-800 text-gray-800 transition-colors"
            >
              랭킹
            </button>
          </div>
        </header>
        
        <div className="text-center py-4 text-xs text-gray-400 font-medium">
          {today}
        </div>

        <div className="flex flex-col">
          {sortedFriends.length > 0 ? (
            sortedFriends.map((friend, index) => {
              const rank = index + 1;
              return (
                <div key={friend.id} className={`flex items-center justify-between px-4 py-4 border-b border-gray-50 ${rank === 1 ? 'bg-orange-50/30' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-8 flex justify-center">
                      {rank === 1 ? (
                        <div className="relative">
                          <Trophy className="w-6 h-6 text-yellow-500" />
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center font-bold">1</span>
                        </div>
                      ) : rank === 2 ? (
                        <div className="relative">
                          <Trophy className="w-6 h-6 text-blue-300" />
                          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center font-bold">2</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 font-bold text-sm">{rank}</span>
                      )}
                    </div>
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 cursor-pointer" onClick={() => setSelectedProfile(friend)}>
                      <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">{friend.name}</span>
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Users className="w-3 h-3" />
                        <span>{friend.steps.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-10">
              <Frown className="w-12 h-12 text-gray-200 mb-4" />
              <p className="text-gray-400 text-sm font-medium leading-relaxed">
                조회되는 친구가 없어요.<br />
                친구추가하고 대결을 해볼까요?
              </p>
              <div className="flex flex-col gap-2 mt-6 w-full max-w-[200px]">
                <button onClick={() => { setView('friendManagement'); setFriendTab('findNew'); }} className="w-full py-3 border border-gray-200 text-gray-600 font-bold rounded-xl text-sm">새 친구 찾기</button>
              </div>
            </div>
          )}
        </div>

        {/* Floating My Rank Bar */}
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto">
          <div className="bg-white rounded-full shadow-lg border-2 border-yellow-400 p-3 flex items-center justify-between animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3">
              <div className="w-6 flex justify-center">
                <div className="relative">
                  <Trophy className="w-5 h-5 text-gray-300" />
                  <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center font-bold">{myRank || sortedFriends.length + 1}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <img src={mockData.myProfile.avatar} alt="me" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-800">{mockData.myProfile.id}</span>
                <span className="bg-gray-200 text-gray-500 text-[10px] px-1 rounded font-bold">나</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-xs font-bold mr-2">
              <Users className="w-3 h-3" />
              <span>{mockData.myProfile.steps.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <ProfileBottomSheet {...profileBottomSheetProps} />
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
              <Search className="w-6 h-6 text-gray-800 cursor-pointer" onClick={() => { setView('friendManagement'); setFriendTab('myFriends'); }} />
              <UserPlus className="w-6 h-6 text-gray-800 cursor-pointer" onClick={() => { setView('friendManagement'); setFriendTab('findNew'); }} />
              <Settings className="w-6 h-6 text-gray-800 cursor-pointer" onClick={() => setView('settings')} />
            </div>
          </div>
          {/* Top Tabs */}
          <div className="flex mt-1">
            <button
              onClick={() => setView('friends_main')}
              className="flex-1 py-2.5 text-sm font-bold border-b-2 border-gray-800 text-gray-800 transition-colors"
            >
              친구
            </button>
            <button
              onClick={() => setView('ranking')}
              className="flex-1 py-2.5 text-sm font-bold border-b-2 border-transparent text-gray-600 transition-colors"
            >
              랭킹
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex flex-col gap-4 bg-gray-50">
        {/* Profile Section */}
        <section className="bg-white p-4">
          <h2 className="text-xs font-semibold text-gray-500 mb-3">내 프로필</h2>
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
              <p className="text-[10px] text-gray-400">내 추천코드</p>
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
                <span className="text-xs font-bold text-gray-500">받은 친구 요청</span>
                <span className="text-sm font-bold text-gray-800">친구 요청 목록을 확인하세요!</span>
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

        {/* Friends List or Empty State */}
        <section className="bg-white p-4 min-h-[300px]">
          {friends.length > 0 ? (
            <>
              <h2 className="text-sm font-semibold text-gray-500 mb-4">친구 {friends.length}명</h2>
              <div className="flex flex-col gap-4">
                {friends.map(friend => (
                  <div key={friend.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedProfile(friend)}>
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
              <p className="text-gray-500 font-bold mb-1">앗, 캐시톡 친구가 없어요.</p>
              <p className="text-gray-400 text-sm mb-6">지금 친구를 맺고 캐시를 주고받아보세요.</p>
            </div>
          )}
        </section>
      </main>

      <ProfileBottomSheet {...profileBottomSheetProps} />

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
          <header className="sticky top-0 z-30 bg-[#FFD700] px-4 py-3 flex items-center justify-between">
            <Menu className="w-6 h-6 text-gray-800" />
            <h1 className="text-lg font-bold text-gray-800">Home</h1>
            <div className="flex items-center gap-3">
              <div className="bg-white/30 px-3 py-1 rounded-full flex items-center gap-1">
                <span className="font-bold text-gray-800 text-sm">342</span>
                <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-white">C</div>
              </div>
              <div className="relative cursor-pointer" onClick={() => setView('friends_main')}>
                <Users className="w-6 h-6 text-gray-800" />
                {friendRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {friendRequests.length}
                  </span>
                )}
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

          {/* Friends Ranking Widget */}
          {(() => {
            const sortedForWidget = [...friends].sort((a, b) => b.steps - a.steps);
            const mySteps = mockData.myProfile.steps;
            const myRankInWidget = sortedForWidget.filter(f => f.steps > mySteps).length + 1;
            const topFriends = sortedForWidget.slice(0, 3);
            return (
              <div
                className="mx-4 mt-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => setView('ranking')}
              >
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-bold text-gray-800">이번 주 친구 랭킹</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
                <div className="px-4 pb-3 flex flex-col gap-2">
                  {topFriends.length > 0 ? (
                    <>
                      {topFriends.map((friend, idx) => {
                        const rankColors = ['text-yellow-500', 'text-blue-400', 'text-gray-400'];
                        const rankLabels = ['1st', '2nd', '3rd'];
                        return (
                          <div key={friend.id} className="flex items-center gap-3">
                            <span className={`text-xs font-bold w-6 text-center ${rankColors[idx]}`}>{rankLabels[idx]}</span>
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 shrink-0">
                              <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 flex-1 truncate">{friend.name}</span>
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                              <Footprints className="w-3 h-3" />
                              <span className="font-bold">{friend.steps.toLocaleString()}</span>
                            </div>
                          </div>
                        );
                      })}
                      <div className="mt-1 pt-2 border-t border-gray-50 flex items-center gap-3">
                        <span className="text-xs font-bold w-6 text-center text-orange-500">{myRankInWidget}위</span>
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 shrink-0">
                          <img src={mockData.myProfile.avatar} alt="me" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 flex-1 truncate">
                          {mockData.myProfile.id}
                          <span className="ml-1 text-[10px] bg-orange-100 text-orange-500 px-1 rounded font-bold">나</span>
                        </span>
                        <div className="flex items-center gap-1 text-orange-400 text-xs">
                          <Footprints className="w-3 h-3" />
                          <span className="font-bold">{mySteps.toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-3 text-center">
                      <p className="text-xs text-gray-400 mb-2">아직 친구가 없어요. 친구를 추가하고 경쟁해보세요!</p>
                      <button
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); setView('friendManagement'); setFriendTab('findNew'); }}
                        className="text-xs font-bold text-orange-500 border border-orange-300 px-3 py-1 rounded-full"
                      >
                        친구 추가하기
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

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
