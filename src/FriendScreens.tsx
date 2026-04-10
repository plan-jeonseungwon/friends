import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Ellipsis, Frown, Medal, Search, Settings, UserPlus, Users, X } from 'lucide-react';

type Friend = {
  id: string;
  name: string;
  avatar: string;
  steps: number;
  friendCount?: number;
};

type MockUser = {
  id: string;
  name: string;
  recommendCode: string;
  avatar: string;
  friendCount: number;
};

type RequestItem = {
  id: string;
  name: string;
  avatar: string;
  cover: string;
};

type LoadMode = 'all' | 'page' | 'infinite';

type ViewState =
  | 'home'
  | 'challenge'
  | 'rewards'
  | 'play'
  | 'feeds'
  | 'friends_main'
  | 'settings'
  | 'friendManagement'
  | 'ranking'
  | 'friendRequests'
  | 'lockscreen';

const leaderboardDemoNames = [
  'Cashwalker1',
  'Cashwalker2',
  'KRKRKR7',
  'Cashwalker3',
  'StepMaster',
  'MomoRun',
  'DailySpark',
  'NightWalker',
  'SunnyPace',
  'MoveMint',
  'WalkerBee',
  'StrideLab',
  'UrbanFox',
  'BlueMile',
  'RoadBuddy',
  'FitLemon',
  'LuckyStride',
  'PebbleRun',
  'MoonStep',
  'PaceNote',
  'AirWalker',
  'Stepberry',
  'DawnDash',
  'WaveFeet',
  'MovePulse',
  'AprilStride',
  'LoopRunner',
  'ParkMile',
  'SeedWalk',
  'GlowPacer',
];

const shellClass =
  'min-h-screen max-w-md mx-auto overflow-x-hidden bg-[#ededed] font-sans text-[#1f1f1f] shadow-xl';

const contentPanelClass = 'mx-3 mt-3 rounded-[14px] bg-white min-h-[calc(100vh-116px)] overflow-hidden';

function Header({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#ffd100]">
      <div className="flex h-12 items-center justify-between px-3">
        <button onClick={onBack} className="flex h-7 w-7 items-center justify-center text-black">
          <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2.25} />
        </button>
        <h1 className="text-[15px] font-semibold tracking-[-0.01em] text-black">{title}</h1>
        <div className="flex min-w-[28px] items-center justify-end gap-2">{right}</div>
      </div>
    </header>
  );
}

function RequestsPreviewSheet({ item, onClose }: { item: RequestItem; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-[110] bg-black/35" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-[120] mx-auto max-w-md overflow-hidden rounded-t-[22px] bg-white">
        <div className="relative h-[132px] overflow-hidden">
          <img src={item.cover} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          <button onClick={onClose} className="absolute left-3 top-3 text-white">
            <X className="h-4.5 w-4.5" strokeWidth={2.5} />
          </button>
        </div>
        <div className="-mt-7 pb-8 text-center">
          <div className="mx-auto h-14 w-14 overflow-hidden rounded-full border-[3px] border-white bg-white">
            <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <p className="mt-3 text-[12px] font-medium text-[#757575]">{item.name}</p>
        </div>
      </div>
    </>
  );
}

function ConfirmModal({
  title,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/32 px-6">
      <div className="w-full max-w-[234px] overflow-hidden rounded-[11px] bg-white shadow-xl">
        <div className="flex h-[94px] items-center justify-center border-b border-[#d9d9d9] px-4 text-center text-[10px] font-semibold text-[#242424]">
          {title}
        </div>
        <div className="grid grid-cols-2">
          <button onClick={onCancel} className="h-[48px] border-r border-[#d9d9d9] text-[10px] font-semibold text-[#2a2a2a]">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="h-[48px] text-[10px] font-semibold text-[#202020]">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AddFriendsScreen({
  searchQuery,
  setSearchQuery,
  foundUser,
  handleSearchCode,
  showToast,
  setView,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  foundUser: MockUser | null;
  handleSearchCode: (v: string) => void;
  showToast: (v: string) => void;
  setView: (v: ViewState) => void;
}) {
  return (
    <div className={shellClass}>
      <Header
        title="Add Friends"
        onBack={() => {
          setView('friends_main');
          setSearchQuery('');
        }}
        right={<Ellipsis className="h-4.5 w-4.5 text-black" strokeWidth={2.25} />}
      />

      <div className="px-2.5 pt-4">
        <div className="relative mb-2.5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchCode(e.target.value)}
            placeholder="Search referral code"
            className="h-10 w-full rounded-[10px] border border-white/60 bg-white px-3 pr-10 text-[11px] text-[#202020] outline-none placeholder:text-[#c0c0c0]"
          />
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a9a9a9]" strokeWidth={2} />
        </div>

        <section className="min-h-[calc(100vh-112px)] rounded-[10px] bg-white px-3 py-4">
          {foundUser ? (
            <div className="mx-auto mt-4 max-w-[196px] rounded-[10px] bg-white px-3 py-5 text-center">
              <div className="mx-auto h-12 w-12 overflow-hidden rounded-full">
                <img src={foundUser.avatar} alt={foundUser.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <p className="mt-2 text-[10px] font-medium text-black">{foundUser.name}</p>
              <button
                onClick={() => showToast(`Sent request to ${foundUser.name}`)}
                className="mt-2 h-8 w-full rounded-[4px] bg-[#ffd100] text-[10px] font-semibold text-black"
              >
                Add Friend
              </button>
            </div>
          ) : searchQuery ? (
            <div className="flex min-h-[500px] items-center justify-center px-8 text-center text-[11px] font-medium text-[#6d6d6d]">
              No friends found for "{searchQuery}"
            </div>
          ) : (
            <div className="flex min-h-[500px] items-center justify-center px-8 text-center text-[11px] font-medium leading-[1.25] text-[#b0b0b0]">
              Search for a referral code
              <br />
              to find new friends!
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export function ManageRequestsScreen({ setView }: { setView: (v: ViewState) => void }) {
  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [received, setReceived] = useState<RequestItem[]>([
    {
      id: 'hawkeye',
      name: 'Hawkeye',
      avatar: 'https://picsum.photos/seed/hawkeye/100/100',
      cover: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80',
    },
  ]);
  const [sent, setSent] = useState<RequestItem[]>([
    {
      id: 'cashwalker2',
      name: 'Cashwalker2',
      avatar: 'https://picsum.photos/seed/cashwalker2/100/100',
      cover: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80',
    },
  ]);
  const [preview, setPreview] = useState<RequestItem | null>(null);
  const [modal, setModal] = useState<{ mode: 'accept' | 'decline' | 'cancel'; item: RequestItem } | null>(null);

  const activeItems = tab === 'received' ? received : sent;

  const confirmModal = () => {
    if (!modal) return;
    if (modal.mode === 'cancel') {
      setSent((prev) => prev.filter((item) => item.id !== modal.item.id));
    } else {
      setReceived((prev) => prev.filter((item) => item.id !== modal.item.id));
    }
    setModal(null);
  };

  return (
    <div className={shellClass}>
      <Header title="Manage Requests" onBack={() => setView('friends_main')} />

      <div className="bg-white">
        <div className="grid grid-cols-2 text-center">
          <button
            onClick={() => setTab('received')}
            className={`relative h-11 text-[11px] font-semibold ${tab === 'received' ? 'text-black' : 'text-[#8e8e8e]'}`}
          >
            Received
            {tab === 'received' && <span className="absolute inset-x-0 bottom-0 mx-auto h-[1.5px] w-full bg-black" />}
          </button>
          <button
            onClick={() => setTab('sent')}
            className={`relative h-11 text-[11px] font-semibold ${tab === 'sent' ? 'text-black' : 'text-[#8e8e8e]'}`}
          >
            Sent
            {tab === 'sent' && <span className="absolute inset-x-0 bottom-0 mx-auto h-[1.5px] w-full bg-black" />}
          </button>
        </div>
      </div>

      <div className="px-3 pt-3">
        <section className="min-h-[calc(100vh-115px)] rounded-[14px] bg-white px-3 py-4">
          {activeItems.length > 0 ? (
            <div className="space-y-2">
              {activeItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-1.5">
                  <button onClick={() => setPreview(item)} className="flex items-center gap-3">
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-[#d8d8d8]">
                      <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[10px] font-semibold text-[#525252]">{item.name}</span>
                  </button>

                  {tab === 'received' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModal({ mode: 'accept', item })}
                        className="h-9 rounded-[4px] bg-[#f3cf4a] px-5 text-[10px] font-semibold text-white"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setModal({ mode: 'decline', item })}
                        className="h-9 rounded-[4px] border border-[#8e8e8e] bg-white px-4 text-[10px] font-semibold text-[#8e8e8e]"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setModal({ mode: 'cancel', item })}
                      className="h-9 rounded-[4px] border border-[#8e8e8e] bg-white px-4 text-[10px] font-semibold text-[#8e8e8e]"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[560px] flex-col items-center justify-center px-8 text-center">
              <Frown className="h-7 w-7 text-[#9d9d9d]" strokeWidth={1.75} />
              <p className="mt-3 text-[11px] font-medium leading-[1.25] text-[#767676]">
                No friend requests yet.
                <br />
                Add friends to walk together!
              </p>
              <button
                onClick={() => setView('friendManagement')}
                className="mt-4 inline-flex h-9 items-center gap-2 rounded-[7px] bg-[#ffd100] px-4 text-[10px] font-semibold text-black"
              >
                <Users className="h-4 w-4" strokeWidth={2.25} />
                Add New Friends
              </button>
            </div>
          )}
        </section>
      </div>

      {modal && (
        <ConfirmModal
          title={
            modal.mode === 'accept'
              ? 'Accept friend request?'
              : modal.mode === 'decline'
                ? 'Decline friend request?'
                : 'Cancel friend request?'
          }
          cancelLabel={modal.mode === 'cancel' ? 'No' : 'Cancel'}
          confirmLabel={modal.mode === 'accept' ? 'Accept' : modal.mode === 'decline' ? 'Decline' : 'Yes'}
          onCancel={() => setModal(null)}
          onConfirm={confirmModal}
        />
      )}

      {preview && <RequestsPreviewSheet item={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

function LeaderboardRow({
  friend,
  rank,
  highlight,
  onClick,
}: {
  friend: Friend;
  rank: number;
  highlight?: boolean;
  onClick: () => void;
}) {
  const medalColor =
    rank === 1 ? '#ffc700' : rank === 2 ? '#a8a8a8' : rank === 3 ? '#c78642' : '#1f1f1f';

  return (
    <div className={`flex items-center justify-between px-3 py-2 ${highlight ? 'bg-[#fff8de]' : 'bg-white'}`}>
      <div className="flex items-center gap-3">
        <div className="flex w-8 items-center justify-center">
          {rank <= 3 ? (
            <Medal className="h-5 w-5" style={{ color: medalColor }} strokeWidth={2.1} />
          ) : (
            <span className="text-[11px] font-bold text-[#2d2d2d]">{rank}</span>
          )}
        </div>
        <button onClick={onClick} className="flex items-center gap-2">
          <div className={`h-9 w-9 overflow-hidden rounded-full ${rank <= 3 ? 'border-2' : ''}`} style={{ borderColor: medalColor }}>
            <img src={friend.avatar} alt={friend.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-semibold leading-none text-[#4c4c4c]">{friend.name}</p>
            <p className="mt-1 text-[10px] leading-none text-[#bababa]">{friend.steps.toLocaleString()}</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export function LeaderboardScreen({
  friends,
  myAvatar,
  myId,
  mySteps,
  setSelectedProfile,
  setView,
}: {
  friends: Friend[];
  myAvatar: string;
  myId: string;
  mySteps: number;
  setSelectedProfile: (f: Friend) => void;
  setView: (v: ViewState) => void;
}) {
  const demoFriends = useMemo<Friend[]>(() => {
    const source = friends.length > 0 ? friends : [];

    return leaderboardDemoNames.map((name, index) => {
      const seeded = source[index % Math.max(source.length, 1)];
      const rankBoost = Math.max(0, 30 - index) * 310;
      const stepNoise = (index % 5) * 137;

      return {
        id: `leaderboard_demo_${index + 1}`,
        name,
        avatar: seeded?.avatar ?? `https://picsum.photos/seed/leaderboard-${index + 1}/100/100`,
        steps: Math.max(2100, 14800 - rankBoost - stepNoise),
        friendCount: seeded?.friendCount ?? 0,
      };
    });
  }, [friends]);

  const sortedFriends = useMemo(() => [...demoFriends].sort((a, b) => b.steps - a.steps), [demoFriends]);
  const [loadMode, setLoadMode] = useState<LoadMode>('all');
  const [visibleCount, setVisibleCount] = useState(sortedFriends.length);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageSize = 8;
  const hasOnlyMe = sortedFriends.length <= 1;

  useEffect(() => {
    if (loadMode === 'all') {
      setVisibleCount(sortedFriends.length);
    } else {
      setVisibleCount(Math.min(pageSize, sortedFriends.length));
    }
  }, [loadMode, sortedFriends.length]);

  const visibleFriends = sortedFriends.slice(0, visibleCount);
  const hasMore = visibleCount < sortedFriends.length;

  const loadMore = () => {
    if (!hasMore || isLoadingMore || loadMode === 'all') return;
    setIsLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + pageSize, sortedFriends.length));
      setIsLoadingMore(false);
    }, 350);
  };

  useEffect(() => {
    if (loadMode !== 'infinite') return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '100px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMode, hasMore, isLoadingMore, sortedFriends.length]);

  return (
    <div className={shellClass}>
      <Header
        title="Friends"
        onBack={() => setView('friends_main')}
        right={
          <>
            <Search className="h-4.5 w-4.5 text-black" strokeWidth={2.25} />
            <UserPlus className="h-4.5 w-4.5 cursor-pointer text-black" strokeWidth={2.25} onClick={() => setView('friendManagement')} />
            <Settings className="h-4.5 w-4.5 cursor-pointer text-black" strokeWidth={2.25} onClick={() => setView('settings')} />
          </>
        }
      />

      <div className="bg-white">
        <div className="grid grid-cols-2 text-center">
          <button onClick={() => setView('friends_main')} className="h-11 text-[11px] font-semibold text-[#8e8e8e]">
            Friends
          </button>
          <button onClick={() => setView('ranking')} className="relative h-11 text-[11px] font-semibold text-[#303030]">
            Leaderboard
            <span className="absolute inset-x-0 bottom-0 mx-auto h-[1.5px] w-full bg-black" />
          </button>
        </div>
      </div>

      <div className="px-3 pt-3 pb-5">
        <section className="relative min-h-[calc(100vh-116px)] rounded-[14px] bg-white pb-20">
          <div className="pt-4 text-center text-[10px] font-medium text-[#9a9a9a]">2026. 03. 17</div>

          <div className="px-3 pt-3">
            <div className="inline-flex rounded-full border border-[#e3e3e3] bg-[#fafafa] p-[2px]">
              {(['all', 'page', 'infinite'] as LoadMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLoadMode(mode)}
                  className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase ${
                    loadMode === mode ? 'bg-[#ffd100] text-black' : 'text-[#8f8f8f]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[9px] text-[#aaaaaa]">
              {visibleFriends.length}/{sortedFriends.length} loaded
            </p>
          </div>

          {hasOnlyMe ? (
            <>
              <div className="px-3 pt-2">
                <LeaderboardRow
                  friend={sortedFriends[0]}
                  rank={1}
                  highlight
                  onClick={() => setSelectedProfile(sortedFriends[0])}
                />
              </div>
              <div className="flex min-h-[420px] flex-col items-center justify-center px-8 text-center">
                <p className="text-[11px] font-medium leading-[1.2] text-[#6f6f6f]">
                  No friends found.
                  <br />
                  Add friends to compete with!
                </p>
                <button
                  onClick={() => setView('friendManagement')}
                  className="mt-4 inline-flex h-9 items-center gap-2 rounded-[7px] bg-[#ffd100] px-4 text-[10px] font-semibold text-black"
                >
                  <Users className="h-4 w-4" strokeWidth={2.25} />
                  Add New Friends
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mt-3 overflow-hidden border-y border-[#efefef]">
                {visibleFriends.map((friend, index) => (
                  <div key={friend.id}>
                    <LeaderboardRow
                      friend={friend}
                      rank={index + 1}
                      highlight={index === 2}
                      onClick={() => setSelectedProfile(friend)}
                    />
                  </div>
                ))}
              </div>

              {loadMode === 'page' && hasMore && (
                <div className="px-3 pt-4">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="h-8 rounded-[7px] border border-[#f0c300] bg-[#ffd100] px-4 text-[10px] font-semibold text-black disabled:opacity-60"
                  >
                    {isLoadingMore ? 'Loading...' : 'Load more'}
                  </button>
                </div>
              )}

              {loadMode === 'infinite' && (
                <div ref={sentinelRef} className="flex h-12 items-center justify-center text-[9px] text-[#a2a2a2]">
                  {hasMore ? (isLoadingMore ? 'Loading more...' : 'Scroll to load more') : 'End of leaderboard'}
                </div>
              )}
            </>
          )}

          <div className="absolute inset-x-0 bottom-4 px-3">
            <div className="flex h-[50px] items-center justify-between rounded-full border-2 border-[#f0c300] bg-white px-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-2.5">
                <Medal className="h-5 w-5 text-[#c78642]" strokeWidth={2.1} />
                <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-[#c78642]">
                  <img src={myAvatar} alt={myId} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[10px] font-semibold text-[#3f3f3f]">{myId}</span>
              </div>
              <span className="text-[10px] font-semibold text-[#b7b7b7]">{mySteps.toLocaleString()}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
