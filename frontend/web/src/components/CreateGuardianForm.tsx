"use client";

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User, 
  Mail, 
  Phone,
  Briefcase,
  MapPin,
  CreditCard,
  Calendar,
  Users,
  Image as ImageIcon,
  FileText,
  Bell,
  DollarSign,
  MessageSquare,
  GraduationCap,
  Clock
} from 'lucide-react';

const guardianSchema = z.object({
  // Basic Information
  name: z.string().min(2, 'Name is required'),
  relation: z.string().min(1, 'Relation is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
  alternatePhone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number').optional().or(z.literal('')),
  occupation: z.string().min(2, 'Occupation is required'),
  profileImage: z.string().url('Invalid URL').optional().or(z.literal('')),
  
  // Address Information
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid PIN code'),
  
  // Assigned Learner (simplified for initial creation)
  learnerName: z.string().min(2, 'Learner name is required'),
  learnerGrade: z.string().min(1, 'Learner grade is required'),
  learnerSchool: z.string().min(2, 'Learner school is required'),
  
  // Contact Preferences
  preferredContactMethod: z.enum(['phone', 'whatsapp', 'email', 'sms']),
  preferredContactTime: z.string().min(1, 'Preferred contact time is required'),
  
  // Payment Information
  paymentMethod: z.enum(['online', 'bank-transfer', 'cheque', 'cash']),
  billingCycle: z.enum(['monthly', 'quarterly', 'semester', 'annual']),
  
  // Communication Preferences
  academicUpdates: z.boolean(),
  attendanceAlerts: z.boolean(),
  performanceReports: z.boolean(),
  paymentReminders: z.boolean(),
  generalNotifications: z.boolean(),
});

type GuardianFormData = z.infer<typeof guardianSchema>;

const defaultValues: GuardianFormData = {
  name: '',
  relation: '',
  email: '',
  phone: '',
  alternatePhone: '',
  occupation: '',
  profileImage: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
  learnerName: '',
  learnerGrade: '',
  learnerSchool: '',
  preferredContactMethod: 'phone',
  preferredContactTime: '',
  paymentMethod: 'online',
  billingCycle: 'monthly',
  academicUpdates: true,
  attendanceAlerts: true,
  performanceReports: true,
  paymentReminders: true,
  generalNotifications: true,
};

const relations = ['Father', 'Mother', 'Guardian', 'Uncle', 'Aunt', 'Grandparent', 'Other'];
const grades = ['8th Standard', '9th Standard', '10th Standard', '11th Standard', '12th Standard'];
const contactTimes = [
  'Morning (8-10 AM)',
  'Morning (10 AM - 12 PM)',
  'Afternoon (12-2 PM)',
  'Afternoon (2-4 PM)',
  'Evening (4-6 PM)',
  'Evening (6-8 PM)',
  'Late Evening (8-10 PM)',
  'Late Night (10 PM - 12 AM)',
  'Any time'
];
const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Others'
];

export default function CreateGuardianForm() {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<GuardianFormData>({
    resolver: zodResolver(guardianSchema),
    defaultValues,
  });

  const onSubmit = (data: GuardianFormData) => {
    // Handle form submission
    console.log('Form data:', data);
    alert('Guardian created successfully!');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6">
      {/* Basic Information Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Basic Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input 
              {...register('name')} 
              placeholder="Enter guardian's full name"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">Relation to Learner</label>
            <select 
              {...register('relation')} 
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all cursor-pointer"
            >
              <option value="" className="bg-gray-800">Select relation...</option>
              {relations.map((rel) => (
                <option key={rel} value={rel} className="bg-gray-800">{rel}</option>
              ))}
            </select>
            {errors.relation && <p className="text-red-400 text-xs mt-1">{errors.relation.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <input 
              {...register('email')} 
              type="email"
              placeholder="guardian@example.com"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <Briefcase className="w-4 h-4" /> Occupation
            </label>
            <input 
              {...register('occupation')} 
              placeholder="Enter occupation"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.occupation && <p className="text-red-400 text-xs mt-1">{errors.occupation.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <Phone className="w-4 h-4" /> Primary Phone
            </label>
            <input 
              {...register('phone')} 
              placeholder="+91-9999999999"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <Phone className="w-4 h-4" /> Alternate Phone (Optional)
            </label>
            <input 
              {...register('alternatePhone')} 
              placeholder="+91-9999999999"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.alternatePhone && <p className="text-red-400 text-xs mt-1">{errors.alternatePhone.message}</p>}
          </div>
        </div>
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
            <ImageIcon className="w-4 h-4" /> Profile Image URL (Optional)
          </label>
          <input 
            {...register('profileImage')} 
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                     text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     hover:bg-white/15 transition-all"
          />
          {errors.profileImage && <p className="text-red-400 text-xs mt-1">{errors.profileImage.message}</p>}
        </div>
      </div>

      {/* Address Information Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Address Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-foreground">Street Address</label>
            <input 
              {...register('street')} 
              placeholder="Enter complete street address"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.street && <p className="text-red-400 text-xs mt-1">{errors.street.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">City</label>
            <input 
              {...register('city')} 
              placeholder="Enter city"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">State</label>
            <select 
              {...register('state')} 
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all cursor-pointer"
            >
              <option value="" className="bg-gray-800">Select state...</option>
              {states.map((state) => (
                <option key={state} value={state} className="bg-gray-800">{state}</option>
              ))}
            </select>
            {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-foreground">PIN Code</label>
            <input 
              {...register('pincode')} 
              placeholder="6-digit PIN code"
              maxLength={6}
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.pincode && <p className="text-red-400 text-xs mt-1">{errors.pincode.message}</p>}
          </div>
        </div>
      </div>

      {/* Learner Information Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          Learner Information
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Enter details of the learner this guardian is responsible for</p>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">Learner Name</label>
            <input 
              {...register('learnerName')} 
              placeholder="Enter learner's name"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.learnerName && <p className="text-red-400 text-xs mt-1">{errors.learnerName.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">Grade</label>
            <select 
              {...register('learnerGrade')} 
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all cursor-pointer"
            >
              <option value="" className="bg-gray-800">Select grade...</option>
              {grades.map((grade) => (
                <option key={grade} value={grade} className="bg-gray-800">{grade}</option>
              ))}
            </select>
            {errors.learnerGrade && <p className="text-red-400 text-xs mt-1">{errors.learnerGrade.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">School</label>
            <input 
              {...register('learnerSchool')} 
              placeholder="Enter school name"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.learnerSchool && <p className="text-red-400 text-xs mt-1">{errors.learnerSchool.message}</p>}
          </div>
        </div>
      </div>

      {/* Contact Preferences Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Contact Preferences
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">Preferred Contact Method</label>
            <div className="space-y-2">
              {[
                { value: 'phone', label: 'Phone Call', icon: Phone },
                { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                { value: 'email', label: 'Email', icon: Mail },
                { value: 'sms', label: 'SMS', icon: MessageSquare },
              ].map((method) => (
                <label key={method.value} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-all">
                  <input
                    type="radio"
                    value={method.value}
                    {...register('preferredContactMethod')}
                    className="w-4 h-4 text-primary bg-white/10 border-white/30"
                  />
                  <method.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{method.label}</span>
                </label>
              ))}
            </div>
            {errors.preferredContactMethod && <p className="text-red-400 text-xs mt-2">{errors.preferredContactMethod.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" /> Preferred Contact Time
            </label>
            <select 
              {...register('preferredContactTime')} 
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all cursor-pointer"
            >
              <option value="" className="bg-gray-800">Select preferred time...</option>
              {contactTimes.map((time) => (
                <option key={time} value={time} className="bg-gray-800">{time}</option>
              ))}
            </select>
            {errors.preferredContactTime && <p className="text-red-400 text-xs mt-1">{errors.preferredContactTime.message}</p>}
          </div>
        </div>
      </div>

      {/* Payment Information Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Payment Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">Payment Method</label>
            <div className="space-y-2">
              {[
                { value: 'online', label: 'Online Payment' },
                { value: 'bank-transfer', label: 'Bank Transfer' },
                { value: 'cheque', label: 'Cheque' },
                { value: 'cash', label: 'Cash' },
              ].map((method) => (
                <label key={method.value} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-all">
                  <input
                    type="radio"
                    value={method.value}
                    {...register('paymentMethod')}
                    className="w-4 h-4 text-primary bg-white/10 border-white/30"
                  />
                  <span className="text-sm text-foreground">{method.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">Billing Cycle</label>
            <div className="space-y-2">
              {[
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'semester', label: 'Semester' },
                { value: 'annual', label: 'Annual' },
              ].map((cycle) => (
                <label key={cycle.value} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-all">
                  <input
                    type="radio"
                    value={cycle.value}
                    {...register('billingCycle')}
                    className="w-4 h-4 text-primary bg-white/10 border-white/30"
                  />
                  <span className="text-sm text-foreground">{cycle.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Communication Preferences Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Communication Preferences
        </h3>
        <div className="space-y-3">
          {[
            { field: 'academicUpdates', label: 'Academic Updates', description: 'Receive updates about learner\'s academic progress' },
            { field: 'attendanceAlerts', label: 'Attendance Alerts', description: 'Get notified about attendance issues' },
            { field: 'performanceReports', label: 'Performance Reports', description: 'Receive periodic performance reports' },
            { field: 'paymentReminders', label: 'Payment Reminders', description: 'Get reminders for upcoming payments' },
            { field: 'generalNotifications', label: 'General Notifications', description: 'Receive general updates and announcements' },
          ].map((pref) => (
            <label key={pref.field} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/10 transition-all">
              <input
                type="checkbox"
                {...register(pref.field as keyof GuardianFormData)}
                className="w-5 h-5 text-primary bg-white/10 border-white/30 rounded mt-0.5
                         focus:ring-primary focus:ring-2 focus:ring-offset-0
                         checked:bg-primary checked:border-primary"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground block">{pref.label}</span>
                <span className="text-xs text-muted-foreground">{pref.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        <button 
          type="button" 
          className="px-6 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-foreground rounded-lg 
                   hover:bg-white/15 hover:border-white/30 transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-white/50"
          onClick={() => reset()}
        >
          Reset
        </button>
        <button 
          type="submit" 
          className="px-6 py-2.5 bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary rounded-lg 
                   hover:bg-primary/30 hover:border-primary/40 transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
        >
          Create Guardian
        </button>
      </div>
    </form>
  );
}