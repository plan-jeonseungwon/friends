import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace Settings block
settings_start = content.find('{renderHeader("Cashtalk Settings", false)}')
settings_end = content.find('<ProfileBottomSheet {...profileBottomSheetProps} />', settings_start) + len('<ProfileBottomSheet {...profileBottomSheetProps} />')

new_settings = '''{renderHeader("Friends Settings", false)}

        <div className="bg-white mt-2">
          <div className="px-4 py-2 bg-white">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">My Profile</span>
          </div>
          <div className="px-4 py-3 flex items-start justify-between border-b border-gray-100">
            <div className="pr-4">
              <div className="font-bold text-[13px] text-gray-800">Allow Search by Friend Code</div>
              <div className="text-[11px] text-gray-400 mt-0.5 leading-snug">Others can find you by entering your code.</div>
            </div>
            <div className="mt-1"><Toggle enabled={allowSearch} setEnabled={setAllowSearch} /></div>
          </div>
          <div className="px-4 py-3 pb-5 border-b border-gray-100 bg-white">
            <div className="bg-[#FFFBE6] border-l-2 border-[#FFD700] rounded-lg p-3">
              <p className="text-[11px] text-[#886600] leading-snug">
                <span className="mr-1">💡</span>
                Only users who know your exact code can send a request. Strangers cannot browse or discover you.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white mt-2">
          <div className="px-4 py-2 bg-white">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Manage Friends</span>
          </div>
          {[
            { label: 'Add Friends', action: () => { setView('friendManagement'); setSearchQuery(''); setFoundUser(null); } },
            { label: 'Friend Requests', action: () => setView('friendRequests') },
          ].map((item, idx) => (
            <button key={idx} onClick={item.action} className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
              <span className="font-bold text-[13px] text-gray-800">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          ))}
        </div>

        <div className="bg-white mt-2 border-b border-gray-100">
          <div className="px-4 py-2 bg-white">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Notifications</span>
          </div>
          <div className="px-4 py-3 flex items-start justify-between">
            <div className="pr-4">
              <div className="font-bold text-[13px] text-gray-800">Friend Request Alerts</div>
              <div className="text-[11px] text-gray-400 mt-0.5 leading-snug">Get notified when someone sends you a friend request.</div>
            </div>
            <div className="mt-1"><Toggle enabled={pushNotifications} setEnabled={setPushNotifications} /></div>
          </div>
        </div>

        <ProfileBottomSheet {...profileBottomSheetProps} />'''

if settings_start != -1 and settings_end != -1:
    content = content[:settings_start] + new_settings + content[settings_end:]
else:
    print("Could not find settings block")

# 2. Remove 'Invite non-member shortcut'
invite_start = content.find('{/* Invite non-member shortcut */}')
if invite_start != -1:
    invite_end = content.find('</section>', invite_start) + len('</section>')
    content = content[:invite_start] + content[invite_end:]
else:
    print("Could not find invite block")

# 3. Remove '🔧 순위 시뮬레이터 토글'
sim_start = content.find('{/* 🔧 순위 시뮬레이터 토글 */}')
if sim_start != -1:
    sim_end = content.find(')}', sim_start) + 2
    # Ensure it's the right closing bracket by finding the next one after the loop
    content = content[:sim_start] + content[sim_end+1:] # Removing the trailing newline too
else:
    print("Could not find sim block")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
