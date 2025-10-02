/**
 * Announcement Type Definitions
 *
 * This file contains TypeScript type definitions for the Announcements feature.
 * These types are used throughout the application for type safety and consistency.
 *
 * Note: Actual announcement data is stored in /mockData/announcements.json
 * and accessed via the /api/announcements REST API endpoint.
 */

export type Announcement = {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'academic' | 'administrative' | 'emergency' | 'event' | 'holiday';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'scheduled' | 'expired';
  visibility: 'all' | 'learners' | 'educators' | 'admins' | 'guardians' | 'employees';
  publishDate: string;
  expiryDate: string | null;
  isSticky: boolean;
  emailNotification: boolean;
  pushNotification: boolean;
  createdBy: {
    userId: string;
    userName: string;
  };
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  readReceipts: string[];
  tags: string[];
  attachments: string[];
};

export type AnnouncementTemplate = {
  id: string;
  name: string;
  type: Announcement['type'];
  priority: Announcement['priority'];
  templateContent: string;
};
