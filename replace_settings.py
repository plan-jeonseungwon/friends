import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Toggle color
content = content.replace("bg-orange-500", "bg-[#FFCC00]")

# 2. Update Settings block
settings_start = content.find("if (view === 'settings') {")
settings_end = content.find("<ProfileBottomSheet {...profileBottomSheetProps} />", settings_start) + len("<ProfileBottomSheet {...profileBottomSheetProps} />")
settings_end = content.find("</div>", settings_end) + len("</div>")
settings_end = content.find(");", settings_end) + len(");")
settings_end = content.find("}", settings_end) + 1

new_settings = '''  if (view === 'settings') {
    return (
      <div className="min-h-screen bg-white font-sans text-[#1A1A1A] max-w-md mx-auto shadow-xl relative overflow-x-hidden">
        {renderHeader("Friends Settings", false)}

        <div className="bg-[#F2F2F2] px-4 py-2 text-[12px] text-[#8C8C8C]">Privacy</div>
        <div className="bg-white">
          <div className="px-4 py-4 flex items-center justify-between border-b border-[#F2F2F2]">
            <div className="pr-4">
              <div className="text-[15px] text-[#1A1A1A] leading-snug">Allow Search by Referral Code</div>
              <div className="text-[13px] text-[#A6A6A6] mt-1 leading-snug">Let others find you using your referral code.</div>
            </div>
            <div className="shrink-0"><Toggle enabled={allowSearch} setEnabled={setAllowSearch} /></div>
          </div>
          <div className="px-4 py-4 flex items-center justify-between border-b border-[#F2F2F2]">
            <div className="pr-4">
              <div className="text-[15px] text-[#1A1A1A] leading-snug">Allow Suggested Friends</div>
              <div className="text-[13px] text-[#A6A6A6] mt-1 leading-snug">Receive friend suggestions and<br/>be suggested to others.</div>
            </div>
            <div className="shrink-0"><Toggle enabled={showRecommendedInRanking} setEnabled={setShowRecommendedInRanking} /></div>
          </div>
        </div>

        <div className="bg-[#F2F2F2] px-4 py-2 text-[12px] text-[#8C8C8C]">Notifications</div>
        <div className="bg-white border-b border-[#F2F2F2]">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="pr-4">
              <div className="text-[15px] text-[#1A1A1A] leading-snug">Friend Request Alerts</div>
              <div className="text-[13px] text-[#A6A6A6] mt-1 leading-snug">Get notified when someone sends you a<br/>friend request.</div>
            </div>
            <div className="shrink-0"><Toggle enabled={pushNotifications} setEnabled={setPushNotifications} /></div>
          </div>
        </div>

        <ProfileBottomSheet {...profileBottomSheetProps} />
      </div>
    );
  }'''

if settings_start != -1 and settings_end != -1:
    content = content[:settings_start] + new_settings + content[settings_end:]
else:
    print("Could not find settings block")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
