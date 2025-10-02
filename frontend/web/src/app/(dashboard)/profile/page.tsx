'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Key, 
  Eye, 
  EyeOff,
  Camera,
  Save,
  Settings,
  Lock,
  Smartphone,
  Bell
} from 'lucide-react';

// Form validation schemas
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number').optional().or(z.literal('')),
  address: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

const securitySchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type SecurityFormData = z.infer<typeof securitySchema>;

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91-9876543210',
      address: 'Mumbai, Maharashtra, India',
      bio: 'Passionate educator with 5+ years of experience in Physics and Mathematics.',
    },
  });

  // Security form
  const securityForm = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    console.log('Profile data:', data);
    alert('Profile updated successfully!');
  };

  const onSecuritySubmit = (data: SecurityFormData) => {
    console.log('Security data:', data);
    alert('Password updated successfully!');
    securityForm.reset();
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full text-primary border border-white/20">
            <Settings size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account information and security settings</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-2 mb-6">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="p-6">
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Profile Picture
                </h3>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <button
                      type="button"
                      className="absolute -bottom-1 -right-1 bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary rounded-full p-1.5 hover:bg-primary/30 transition-all"
                    >
                      <Camera size={14} />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-medium">Change profile picture</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-foreground">Full Name</label>
                    <input
                      {...profileForm.register('name')}
                      className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                               text-foreground placeholder:text-muted-foreground
                               focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                               hover:bg-white/15 transition-all"
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-red-400 text-xs mt-1">{profileForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-foreground">Email Address</label>
                    <input
                      {...profileForm.register('email')}
                      type="email"
                      className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                               text-foreground placeholder:text-muted-foreground
                               focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                               hover:bg-white/15 transition-all"
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-red-400 text-xs mt-1">{profileForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-foreground">Phone Number</label>
                    <input
                      {...profileForm.register('phone')}
                      className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                               text-foreground placeholder:text-muted-foreground
                               focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                               hover:bg-white/15 transition-all"
                    />
                    {profileForm.formState.errors.phone && (
                      <p className="text-red-400 text-xs mt-1">{profileForm.formState.errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-foreground">Address</label>
                    <input
                      {...profileForm.register('address')}
                      className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                               text-foreground placeholder:text-muted-foreground
                               focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                               hover:bg-white/15 transition-all"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-foreground">Bio</label>
                  <textarea
                    {...profileForm.register('bio')}
                    rows={3}
                    placeholder="Tell us a bit about yourself..."
                    className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                             text-foreground placeholder:text-muted-foreground
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                             hover:bg-white/15 transition-all resize-none"
                  />
                  {profileForm.formState.errors.bio && (
                    <p className="text-red-400 text-xs mt-1">{profileForm.formState.errors.bio.message}</p>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary rounded-lg 
                           hover:bg-primary/30 hover:border-primary/40 transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="p-6 space-y-6">
            {/* Change Password */}
            <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)}>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-foreground">Current Password</label>
                    <div className="relative">
                      <input
                        {...securityForm.register('currentPassword')}
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="w-full rounded-lg px-4 py-2 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 
                                 text-foreground placeholder:text-muted-foreground
                                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                 hover:bg-white/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {securityForm.formState.errors.currentPassword && (
                      <p className="text-red-400 text-xs mt-1">{securityForm.formState.errors.currentPassword.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-foreground">New Password</label>
                    <div className="relative">
                      <input
                        {...securityForm.register('newPassword')}
                        type={showNewPassword ? 'text' : 'password'}
                        className="w-full rounded-lg px-4 py-2 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 
                                 text-foreground placeholder:text-muted-foreground
                                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                 hover:bg-white/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {securityForm.formState.errors.newPassword && (
                      <p className="text-red-400 text-xs mt-1">{securityForm.formState.errors.newPassword.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-foreground">Confirm New Password</label>
                    <div className="relative">
                      <input
                        {...securityForm.register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="w-full rounded-lg px-4 py-2 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 
                                 text-foreground placeholder:text-muted-foreground
                                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                 hover:bg-white/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {securityForm.formState.errors.confirmPassword && (
                      <p className="text-red-400 text-xs mt-1">{securityForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary rounded-lg 
                             hover:bg-primary/30 hover:border-primary/40 transition-all duration-200
                             focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium flex items-center gap-2"
                  >
                    <Lock size={16} />
                    Update Password
                  </button>
                </div>
              </div>
            </form>

            {/* Two-Factor Authentication */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                Two-Factor Authentication
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground font-medium">Enable 2FA</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/60"></div>
                </label>
              </div>
              {twoFactorEnabled && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-muted-foreground">
                    Two-factor authentication is enabled. Use your authenticator app to generate verification codes when signing in.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="p-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {[
                  { id: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                  { id: 'push', label: 'Push Notifications', description: 'Receive browser push notifications' },
                  { id: 'sms', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
                  { id: 'updates', label: 'Product Updates', description: 'Get notified about new features and updates' },
                  { id: 'marketing', label: 'Marketing Communications', description: 'Receive promotional emails and offers' },
                ].map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-all">
                    <div>
                      <p className="text-sm text-foreground font-medium">{pref.label}</p>
                      <p className="text-xs text-muted-foreground">{pref.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/60"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;