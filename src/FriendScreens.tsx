import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, CheckCheck, Ellipsis, Frown, Medal, Search, Settings, Share2, UserPlus, Users, X, Trophy, Footprints } from 'lucide-react';

type Friend = {
  id: string;
  name: string;
  avatar: string;
  steps: number;
  friendCount?: number;
};

type ProfileSheetUser = Friend & {
  isRecommended?: boolean;
  isMe?: boolean;
  mutualFriends?: number;
};

type MockUser = {
  id: string;
  name: string;
  recommendCode: string;
  avatar: string;
  friendCount: number;
};

type RecommendedUser = {
  id: string;
  name: string;
  avatar: string;
  steps: number;
  friendCount: number;
  mutualFriends: number;
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
  | 'lockscreen'
  | 'inviteFriends';

const shellClass =
  'min-h-screen max-w-md mx-auto overflow-x-hidden bg-gray-50 font-sans text-gray-900 shadow-xl';

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
    <header className="sticky top-0 z-30 bg-[#FFD700]">
      <div className="flex h-12 items-center justify-between px-4">
        <button onClick={onBack} className="flex items-center justify-center text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">{title}</h1>
        <div className="flex items-center justify-end gap-3">{right}</div>
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
            <X className="h-[18px] w-[18px]" strokeWidth={2.5} />
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

export function ConfirmModal({
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
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/30 px-6">
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
        right={<Ellipsis className="h-[18px] w-[18px] text-black" strokeWidth={2.25} />}
      />

      <div className="px-2.5 pt-4 pb-8 space-y-2">
        {/* Search by referral code */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchCode(e.target.value)}
            placeholder="Search by recommendation code"
            className="h-10 w-full rounded-[10px] border border-white/60 bg-white px-3 pr-10 text-[11px] text-[#202020] outline-none placeholder:text-[#c0c0c0]"
          />
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a9a9a9]" strokeWidth={2} />
        </div>

        <section className="rounded-[10px] bg-white px-3 py-4">
          {foundUser ? (
            <div className="mx-auto max-w-[196px] rounded-[10px] px-3 py-5 text-center">
              <div className="mx-auto h-12 w-12 overflow-hidden rounded-full">
                <img src={foundUser.avatar} alt={foundUser.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <p className="mt-2 text-[10px] font-medium text-black">{foundUser.name}</p>
              <p className="text-[9px] text-[#b0b0b0]">{foundUser.friendCount} Friends</p>
              <button
                onClick={() => showToast(`Sent friend request to ${foundUser.name}.`)}
                className="mt-3 h-8 w-full rounded-[4px] bg-[#ffd100] text-[10px] font-semibold text-black"
              >
                Add Friend
              </button>
            </div>
          ) : searchQuery ? (
            <div className="flex min-h-[100px] items-center justify-center px-8 text-center text-[11px] font-medium text-[#6d6d6d]">
              No user found for "{searchQuery}".
            </div>
          ) : (
            <div className="flex min-h-[100px] items-center justify-center px-8 text-center text-[11px] font-medium leading-[1.4] text-[#b0b0b0]">
              Search with recommendation code
              <br />
              to find new friends
            </div>
          )}
        </section>

        {/* OR divider */}
        <div className="flex items-center gap-3 px-1 py-0.5">
          <div className="h-px flex-1 bg-[#e0e0e0]" />
          <span className="text-[10px] font-semibold text-[#c8c8c8]">OR</span>
          <div className="h-px flex-1 bg-[#e0e0e0]" />
        </div>

        {/* Invite non-member section */}
        <section className="rounded-[10px] bg-white px-4 py-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff3cc]">
              <Share2 className="h-3.5 w-3.5 text-[#b8860b]" strokeWidth={2} />
            </div>
            <span className="text-[12px] font-bold text-[#202020]">Invite non-joined friends</span>
          </div>
          <p className="mb-3 text-[10px] leading-[1.55] text-[#9a9a9a]">
            If they join through the link and enter the code,
            <br />
            <span className="font-semibold text-[#707070]">they are automatically added as friends.</span>
          </p>
          <button
            onClick={() => setView('inviteFriends')}
            className="h-9 w-full rounded-[7px] bg-[#ffd100] text-[10px] font-semibold text-black"
          >
            Create Invite Link
          </button>
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

  const confirmRequestAction = () => {
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
      <Header title="Manage Friend Requests" onBack={() => setView('friends_main')} />

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
                Add friends and walk together.
              </p>
              <button
                onClick={() => setView('friendManagement')}
                className="mt-4 inline-flex h-9 items-center gap-2 rounded-[7px] bg-[#ffd100] px-4 text-[10px] font-semibold text-black"
              >
                <Users className="h-4 w-4" strokeWidth={2.25} />
                Add Friends
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
                : 'Cancel sent request?'
          }
          cancelLabel="Close"
          confirmLabel={modal.mode === 'accept' ? 'Accept' : modal.mode === 'decline' ? 'Decline' : 'Cancel'}
          onCancel={() => setModal(null)}
          onConfirm={confirmRequestAction}
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
  isRecommended,
  onAddFriend,
  onCancelRequest,
  isAdded,
  isMe,
}: {
  friend: Friend;
  rank: number;
  highlight?: boolean;
  onClick: () => void;
  isRecommended?: boolean;
  onAddFriend?: () => void;
  onCancelRequest?: () => void;
  isAdded?: boolean;
  isMe?: boolean;
}) {
  const medalColor =
    rank === 1 ? '#FACC15' : rank === 2 ? '#9CA3AF' : rank === 3 ? '#C27A3A' : '#9ca3af';

  return (
    <div
      className={`flex items-center justify-between px-5 py-3 ${
        highlight ? 'bg-[#fff9e6]' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex w-8 justify-center">
          {rank <= 3 ? (
            <div className="relative flex items-center justify-center">
              <Trophy
                className="h-10 w-10"
                style={{ color: medalColor, fill: medalColor }}
                strokeWidth={1}
              />
              <span className="absolute top-[8px] text-[12px] font-black text-white">{rank}</span>
            </div>
          ) : (
            <span className="text-[18px] font-bold text-black">{rank}</span>
          )}
        </div>
        <button onClick={onClick} className="flex items-center gap-3">
          <div className="h-[42px] w-[42px] overflow-hidden rounded-full bg-gray-100">
            <img
              src={friend.avatar}
              alt={friend.name}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-left">
            <div className="flex items-center">
              <p className="text-[15px] font-medium text-gray-800">{friend.name}</p>
              {isRecommended && (
                <span className="ml-[6px] rounded-[6px] border border-[#d0d0d0] px-[5px] py-[1px] text-[9px] font-medium text-[#7a7a7a]">
                  Suggested
                </span>
              )}
              {isMe && (
                <span className="ml-[6px] flex h-[16px] min-w-[20px] items-center justify-center rounded-full bg-[#5d5a5a] px-[5px] text-[8px] font-black text-white">
                  Me
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[12px] font-bold text-[#a0a0a0]">
              <Footprints className="h-3 w-3" fill="currentColor" />
              <span>{friend.steps.toLocaleString()}</span>
            </div>
          </div>
        </button>
      </div>
      {isRecommended &&
        (isAdded ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancelRequest?.();
            }}
            className="flex h-[34px] w-[54px] shrink-0 items-center justify-center rounded-[8px] border border-[#c0c0c0] bg-white text-[#7a7a7a] transition-all active:scale-95"
          >
            <CheckCheck className="h-[20px] w-[20px]" strokeWidth={2.5} />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddFriend?.();
            }}
            className="flex h-[34px] w-[54px] shrink-0 items-center justify-center rounded-[8px] bg-[#ffd100] text-[12px] font-black text-black shadow-sm transition-all active:scale-95"
          >
            + Add
          </button>
        ))}
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
  recommendedUsers,
  showRecommendedInRanking = true,
  addedRecommended,
  onAddRecommended,
  onRemoveRecommended,
  onBack,
}: {
  friends: Friend[];
  myAvatar: string;
  myId: string;
  mySteps: number;
  setSelectedProfile: (f: ProfileSheetUser) => void;
  setView: (v: ViewState) => void;
  recommendedUsers?: RecommendedUser[];
  showRecommendedInRanking?: boolean;
  addedRecommended?: Set<string>;
  onAddRecommended?: (id: string, name: string) => void;
  onRemoveRecommended?: (id: string) => void;
  onBack?: () => void;
}) {
  const isFewFriends = friends.length < 5;
  const [cancelModal, setCancelModal] = useState<string | null>(null);

  type DisplayEntry = ProfileSheetUser & { isRecommended: boolean };

  const displayList = useMemo<DisplayEntry[]>(() => {
    const realFriends: DisplayEntry[] = friends.map((f) => ({ ...f, isRecommended: false }));
    const meEntry: DisplayEntry = {
      id: myId,
      name: myId,
      avatar: myAvatar,
      steps: mySteps,
      isRecommended: false,
      isMe: true,
    };
    
    const hasMe = realFriends.some(f => f.id === myId);
    if (!hasMe) realFriends.push(meEntry);

    if (!isFewFriends || !recommendedUsers?.length || !showRecommendedInRanking) {
      return [...realFriends].sort((a, b) => b.steps - a.steps);
    }

    // if few friends, we want to show exactly 6 items total (including Me)
    const needed = 6 - realFriends.length;
    if (needed <= 0) {
      return [...realFriends].sort((a, b) => b.steps - a.steps);
    }

    const recEntries: DisplayEntry[] = recommendedUsers.slice(0, needed).map((u) => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      steps: u.steps,
      friendCount: u.friendCount,
      mutualFriends: u.mutualFriends,
      isRecommended: true,
    }));

    return [...realFriends, ...recEntries].sort((a, b) => b.steps - a.steps);
  }, [friends, recommendedUsers, isFewFriends, myId, myAvatar, mySteps]);

  const [loadMode, setLoadMode] = useState<LoadMode>('all');
  const [visibleCount, setVisibleCount] = useState(displayList.length);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageSize = 8;
  const isEmpty = displayList.length === 0;

  const myRank = useMemo(() => {
    const idx = displayList.findIndex((entry) => entry.id === myId);
    return idx === -1 ? null : idx + 1;
  }, [displayList, myId]);

  useEffect(() => {
    if (loadMode === 'all') {
      setVisibleCount(displayList.length);
    } else {
      setVisibleCount(Math.min(pageSize, displayList.length));
    }
  }, [loadMode, displayList.length]);

  const visibleList = displayList.slice(0, visibleCount);
  const hasMore = visibleCount < displayList.length;

  const loadMore = () => {
    if (!hasMore || isLoadingMore || loadMode === 'all') return;
    setIsLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + pageSize, displayList.length));
      setIsLoadingMore(false);
    }, 350);
  };

  useEffect(() => {
    if (loadMode !== 'infinite') return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: '100px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMode, hasMore, isLoadingMore, displayList.length]);

  return (
    <div className={shellClass}>
      {cancelModal && (
        <ConfirmModal
          title="Cancel friend request?"
          cancelLabel="Close"
          confirmLabel="Cancel Request"
          onCancel={() => setCancelModal(null)}
          onConfirm={() => {
            onRemoveRecommended?.(cancelModal);
            setCancelModal(null);
          }}
        />
      )}
      {/* Yellow Header with top tabs */}
      <header className="sticky top-0 z-30 bg-[#FFD700] px-4 pt-3">
        <div className="flex items-center justify-between mb-0">
          <ArrowLeft
            className="w-6 h-6 text-gray-800 cursor-pointer"
            onClick={onBack || (() => setView('friends_main'))}
          />
          <h1 className="text-lg font-bold text-gray-800">Friends</h1>
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-gray-800 cursor-pointer" onClick={() => { setView('friendManagement'); }} />
            <Settings className="w-6 h-6 text-gray-800 cursor-pointer" onClick={() => setView('settings')} />
          </div>
        </div>
        {/* Top Tabs */}
        <div className="flex mt-1">
          <button
            onClick={() => setView('friends_main')}
            className="flex-1 border-b-2 border-transparent py-2.5 text-sm font-bold text-gray-600 transition-colors"
          >
            Friends
          </button>
          <button
            onClick={() => setView('ranking')}
            className="flex-1 border-b-2 border-gray-800 py-2.5 text-sm font-bold text-gray-800 transition-colors"
          >
            Leaderboard
          </button>
        </div>
      </header>

      <div className="px-3 pt-3 pb-5">
        <section className="relative min-h-[calc(100vh-116px)] rounded-[14px] bg-white pb-20">
          <div className="pt-4 text-center text-[10px] font-medium text-[#9a9a9a]">2026. 03. 17</div>

          {/* Slim status strip for few-friends mode */}
          {isFewFriends && !isEmpty && (
            <div className="mx-3 mt-3 rounded-[8px] bg-[#f5f5f5] px-3 py-2.5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-bold text-[#8a6900]">
                  {friends.length} Friends · Add {5 - friends.length} more to start the real ranking.
                </p>
                <span className="text-[10px] font-semibold text-[#b8960b]">{friends.length}/5</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="text-[10px] text-[#999]">
                  {showRecommendedInRanking
                    ? 'Suggested friends are included in this list.'
                    : 'Suggested friends are hidden.'}
                </span>
                <button
                  onClick={() => setView('settings')}
                  className="shrink-0 text-[10px] font-semibold text-[#555] underline underline-offset-2 active:opacity-50"
                >
                  Change in Settings
                </button>
              </div>
            </div>
          )}

          {/* Load mode toggle — only for full friends list */}
          {!isFewFriends && (
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
                {visibleList.length}/{displayList.length} loaded
              </p>
            </div>
          )}

          {isEmpty ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-8 text-center">
              <p className="text-[11px] font-medium leading-[1.2] text-[#6f6f6f]">
                No friends yet.
                <br />
                Add friends and compete together!
              </p>
              <button
                onClick={() => setView('inviteFriends')}
                className="mt-4 inline-flex h-9 items-center gap-2 rounded-[7px] bg-[#ffd100] px-4 text-[10px] font-semibold text-black"
              >
                <Share2 className="h-4 w-4" strokeWidth={2} />
                Invite Friends
              </button>
              <button
                onClick={() => setView('friendManagement')}
                className="mt-2 inline-flex h-9 items-center gap-2 rounded-[7px] border border-[#e0e0e0] bg-white px-4 text-[10px] font-semibold text-[#707070]"
              >
                <Users className="h-4 w-4" strokeWidth={2.25} />
                Search by Code
              </button>
            </div>
          ) : (
            <>
              <div className="mt-3 overflow-hidden border-t border-[#efefef]">
                {visibleList.map((entry, index) => {
                  const isMe = entry.id === myId;
                  return (
                    <div key={entry.id}>
                      <LeaderboardRow
                        friend={entry}
                        rank={index + 1}
                        highlight={isMe}
                        isMe={isMe}
                        onClick={() => setSelectedProfile({ ...entry, isMe })}
                        isRecommended={entry.isRecommended}
                        isAdded={addedRecommended?.has(entry.id)}
                        onAddFriend={
                          entry.isRecommended
                            ? () => onAddRecommended?.(entry.id, entry.name)
                            : undefined
                        }
                        onCancelRequest={
                          entry.isRecommended
                            ? () => setCancelModal(entry.id)
                            : undefined
                        }
                      />
                      <div className="h-[1px] w-full bg-[#f6f6f6]" />
                    </div>
                  );
                })}
              </div>

              {loadMode === 'page' && hasMore && !isFewFriends && (
                <div className="px-3 pt-4">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="h-8 rounded-[7px] border border-[#f0c300] bg-[#ffd100] px-4 text-[10px] font-semibold text-black disabled:opacity-60"
                  >
                    {isLoadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}

              {loadMode === 'infinite' && !isFewFriends && (
                <div ref={sentinelRef} className="flex h-12 items-center justify-center text-[9px] text-[#a2a2a2]">
                    {hasMore ? (isLoadingMore ? 'Loading...' : 'Scroll to Load More') : 'End of Ranking'}
                </div>
              )}

              {/* Invite Container */}
              <div className="mx-4 mt-8 mb-28 rounded-[12px] border border-[#f0f0f0] bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD700]">
                    <Share2 className="h-5 w-5 text-black" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-black">Invite your friends to Cashwalk!</p>
                    <p className="mt-0.5 text-[11px] text-[#7a7a7a]">Invite friends and see who gets more steps!</p>
                  </div>
                </div>
                <button
                  onClick={() => setView('inviteFriends')}
                  className="mt-4 h-[40px] w-full rounded-[6px] bg-[#FFD700] text-[13px] font-bold text-black"
                >
                  Invite Friends
                </button>
              </div>
            </>
          )}

          {/* My rank floating bar */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-40">
            <div className="flex h-[64px] items-center justify-between rounded-full border-[2px] border-[#FFD700] bg-white px-5 shadow-[0_8px_16px_rgba(0,0,0,0.1)]">
              <div className="flex items-center gap-3">
                <div className="flex w-10 justify-center">
                  {myRank && myRank <= 3 ? (
                    <div className="relative flex items-center justify-center">
                      <Trophy className="h-10 w-10" style={{ color: myRank === 1 ? '#FACC15' : myRank === 2 ? '#9CA3AF' : '#C27A3A', fill: myRank === 1 ? '#FACC15' : myRank === 2 ? '#9CA3AF' : '#C27A3A' }} strokeWidth={1} />
                      <span className="absolute top-[5px] text-[13px] font-black text-white">{myRank}</span>
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center">
                      <Trophy className="h-9 w-9 text-[#FFD700]" style={{ fill: '#FFD700' }} strokeWidth={1} />
                      <span className="absolute top-[4px] text-[12px] font-black text-white">{myRank}</span>
                    </div>
                  )}
                </div>
                <div className="h-[42px] w-[42px] overflow-hidden rounded-full bg-gray-100">
                  <img src={myAvatar} alt={myId} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[13px] font-bold text-black">{myId}</span>
              </div>
              <div className="flex items-center gap-1.5 text-right font-bold text-[#b0b0b0]">
                <Footprints className="h-[14px] w-[14px]" fill="currentColor" />
                <span className="text-[15px] text-[#808080]">{mySteps.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
