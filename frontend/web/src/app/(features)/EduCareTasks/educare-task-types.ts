/**
 * EduCare Task Type Definitions
 *
 * This file contains TypeScript type definitions for the EduCare Tasks feature.
 * These types are used throughout the application for type safety and consistency.
 *
 * Note: Actual educare task data is stored in mock-data/educare-tasks.json (when implemented)
 * and accessed via the /api/educare-tasks REST API endpoint.
 */

export type EduCareTask = {
  taskId: string;
  title: string;
  description: string;
  category: 'Academic Support' | 'Behavioral Guidance' | 'Parent Communication' | 'Student Wellness' | 'Career Counseling' | 'Special Needs' | 'Extracurricular';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'In Progress' | 'Pending Review' | 'Completed' | 'Overdue';
  studentName: string;
  className: string;
  assignedTo: {
    name: string;
    role: string;
  };
  dueDate: string;
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  tags: string[];
  followUpRequired?: boolean;
  parentNotificationSent?: boolean;
  progress: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
    completedBy?: string;
    completedAt?: string;
  }[];
  comments: {
    id: string;
    author: string;
    role: string;
    text: string;
    timestamp: string;
  }[];
  attachments?: string[];
};
