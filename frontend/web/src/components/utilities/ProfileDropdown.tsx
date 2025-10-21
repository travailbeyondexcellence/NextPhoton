'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import {
  User,
  Settings,
  LogOut,
  Bell,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

/**
 * ProfileDropdown Component
 * 
 * User profile dropdown with account settings and logout
 */
export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Mock user data - replace with actual user data from auth context
  const user = {
    name: 'John Educator',
    email: 'john.educator@nextphoton.com',
    role: 'Educator',
    initials: 'JE'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          "glass-button border",
          "transition-all duration-200"
        )}
        aria-label="User menu"
      >
        <span className="text-sm font-semibold">{user.initials}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 z-50">
          <div className="glass-panel shadow-2xl overflow-hidden">
            {/* User Info Header */}
            <div className="p-4 border-b theme-border-glass">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <span className="text-lg font-semibold">{user.initials}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                  <div className="text-xs text-primary mt-0.5">{user.role}</div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={() => {
                  // Navigate to profile page
                  router.push('/profile');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Profile</span>
              </button>

              <button
                onClick={() => {
                  // Navigate to account settings page
                  router.push('/settings');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Account Settings</span>
              </button>

              <button
                onClick={() => {
                  // Navigate to notifications page
                  router.push('/admin/Notifications');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left"
              >
                <Bell className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm">Notifications</span>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">3</span>
                </div>
              </button>

              <button
                onClick={() => {
                  // Navigate to help and support page
                  router.push('/help-support');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left"
              >
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Help & Support</span>
              </button>

              {/* Divider */}
              <div className="my-2 border-t border-border" />

              <button
                onClick={async () => {
                  // Perform logout directly using authClient - same as logout page
                  try {
                    await authClient.signOut();
                    // Redirect to sign-in page after successful logout
                    router.push('/sign-in');
                  } catch (error) {
                    console.error("Logout error:", error);
                    // Still redirect even if logout fails
                    router.push('/sign-in');
                  }
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/15 hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-200 ease-in-out text-left text-destructive transform"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}