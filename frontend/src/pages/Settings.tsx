import React, { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { Tabs } from '@/components/ui/Tabs'
import { Avatar } from '@/components/ui/Avatar'
import { User, Shield, Building, Sliders, Bell } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const [activeTab, setActiveTab] = useState('profile')

  const [firstName, setFirstName] = useState(user?.first_name || 'Admin')
  const [lastName, setLastName] = useState(user?.last_name || 'Demo')
  const [phone, setPhone] = useState(user?.phone || '')
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifSms, setNotifSms] = useState(false)
  const [notifPush, setNotifPush] = useState(true)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Profile settings saved successfully')
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in all fields')
      return
    }
    toast.success('Password changed successfully')
    setCurrentPassword('')
    setNewPassword('')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, account preferences, and notification setups."
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <Card className="p-2 space-y-1">
            {[
              { id: 'profile', label: 'User Profile', icon: User },
              { id: 'company', label: 'Company Profile', icon: Building },
              { id: 'security', label: 'Security & Auth', icon: Shield },
              { id: 'preferences', label: 'Preferences', icon: Sliders },
              { id: 'notifications', label: 'Notifications Settings', icon: Bell },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                    : 'text-secondary hover:bg-surface-secondary'
                }`}
                style={activeTab !== item.id ? { color: 'var(--text-secondary)' } : {}}
              >
                <item.icon className="w-4.5 h-4.5" />
                {item.label}
              </button>
            ))}
          </Card>
        </div>

        {/* Configurations Panel */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card title="User Profile" description="Update your personal details and public profile info.">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex items-center gap-4 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <Avatar name={user?.full_name || 'Admin'} size="lg" />
                  <div>
                    <Button type="button" variant="outline" className="text-xs">Change Avatar</Button>
                    <p className="text-[10px] text-muted mt-1">Recommended: JPG or PNG, max 2MB.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                  <Input label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
                <Input label="Email address" value={user?.email || ''} disabled helperText="Email address cannot be changed." />
                <Input label="Phone number" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 000-0000" />
                
                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary">Save Changes</Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'company' && (
            <Card title="Company Profile" description="Review logistics company business metrics and registration keys.">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Company Name" value="Western Haul Transport" disabled />
                  <Input label="Subdomain / Slug" value="westernhaul" disabled />
                  <Input label="GSTIN Registration" value="29AAFCC7124F1Z5" disabled />
                  <Input label="PAN Identifier" value="AAFCC7124F" disabled />
                </div>
                <Input label="Headquarters Address" value="742 Evergreen Terrace, Sector 4, Indiranagar, Bangalore, KA, 560038" disabled />
                <div className="p-4 rounded-xl border bg-surface-secondary flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold">Verification Badge</p>
                    <p className="text-[10px] text-muted mt-0.5">Your organization identity has been fully verified.</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Verified</span>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card title="Security & Authentication" description="Change your password and configure authentication methods.">
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <Input type="password" label="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                <Input type="password" label="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" helperText="Must be at least 8 characters long." />
                
                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary">Change Password</Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card title="Preferences" description="Customize display languages, units, and themes.">
              <div className="space-y-6">
                <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div>
                    <p className="text-sm font-semibold">Dark Theme Mode</p>
                    <p className="text-xs text-muted">Toggle interface look-and-feel color palette.</p>
                  </div>
                  <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                </div>

                <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div>
                    <p className="text-sm font-semibold">Measurement Units</p>
                    <p className="text-xs text-muted">Use Miles/Pounds (Imperial) or Kilometers/Tons (Metric).</p>
                  </div>
                  <select
                    className="form-input max-w-xs"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    defaultValue="imperial"
                  >
                    <option value="imperial">Imperial (mi, lbs)</option>
                    <option value="metric">Metric (km, kg)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-semibold">Timezone</p>
                    <p className="text-xs text-muted">Configure default schedule tracking timezone.</p>
                  </div>
                  <select
                    className="form-input max-w-xs"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    defaultValue="ist"
                  >
                    <option value="ist">Asia/Kolkata (IST)</option>
                    <option value="utc">Coordinated Universal Time (UTC)</option>
                    <option value="est">Eastern Standard Time (EST)</option>
                  </select>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card title="Notification Settings" description="Setup notification templates and channels.">
              <div className="space-y-4">
                {[
                  { id: 'email', label: 'Email Alerts', desc: 'Receive transactional order invoices and summaries via email.', checked: notifEmail, set: setNotifEmail },
                  { id: 'sms', label: 'SMS Carrier Messages', desc: 'Send emergency alerts and updates straight to phone carrier.', checked: notifSms, set: setNotifSms },
                  { id: 'push', label: 'Desktop Push Messages', desc: 'Show toast alerts for critical dispatch updates in real-time.', checked: notifPush, set: setNotifPush },
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                    </div>
                    <Switch checked={item.checked} onCheckedChange={item.set} />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
export { Settings }
