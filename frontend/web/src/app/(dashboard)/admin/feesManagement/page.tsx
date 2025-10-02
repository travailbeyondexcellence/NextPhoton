/**
 * Fees Management Page
 *
 * Administrative interface for managing student fees, payments, and financial records.
 * Features comprehensive fee tracking, payment status monitoring, and financial analytics.
 */

"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Users,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { LoadingButton, AsyncButton } from '@/components/LoadingButton';
import { SkeletonLoader } from '@/components/GlobalLoader';

interface FeeRecord {
  id: string;
  studentName: string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate?: string;
  description: string;
}

export default function FeesManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual API call
  const mockFeeRecords: FeeRecord[] = [
    {
      id: '1',
      studentName: 'Aarav Sharma',
      studentId: 'STU001',
      amount: 15000,
      dueDate: '2024-01-15',
      status: 'paid',
      paymentDate: '2024-01-10',
      description: 'Quarterly tuition fee'
    },
    {
      id: '2',
      studentName: 'Priya Patel',
      studentId: 'STU002',
      amount: 15000,
      dueDate: '2024-01-15',
      status: 'pending',
      description: 'Quarterly tuition fee'
    },
    {
      id: '3',
      studentName: 'Arjun Singh',
      studentId: 'STU003',
      amount: 15000,
      dueDate: '2023-12-15',
      status: 'overdue',
      description: 'Quarterly tuition fee'
    },
  ];

  // Calculate stats from data
  const stats = {
    totalCollected: mockFeeRecords
      .filter(record => record.status === 'paid')
      .reduce((sum, record) => sum + record.amount, 0),
    pending: mockFeeRecords
      .filter(record => record.status === 'pending')
      .reduce((sum, record) => sum + record.amount, 0),
    overdue: mockFeeRecords.filter(record => record.status === 'overdue').length,
    paidStudents: mockFeeRecords.filter(record => record.status === 'paid').length,
  };

  // Filter records based on search and status
  const filteredRecords = mockFeeRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Async actions with loading states
  const { execute: generateReport } = useAsyncAction(
    async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Simulate report generation
    },
    {
      loadingMessage: 'Generating financial report...',
      onSuccess: 'Report generated successfully!',
      useGlobalLoader: true,
    }
  );

  const { execute: exportData } = useAsyncAction(
    async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Simulate data export
    },
    {
      loadingMessage: 'Exporting fee records...',
      onSuccess: 'Data exported successfully!',
      useGlobalLoader: true,
    }
  );

  return (
    <div className="min-h-full p-6 space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fees Management</h1>
            <p className="text-muted-foreground">Manage student fees and payment records</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <AsyncButton
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={async () => {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }}
            loadingMessage="Creating..."
          >
            Add Fee Record
          </AsyncButton>

          <AsyncButton
            variant="outline"
            size="md"
            icon={<Download className="w-4 h-4" />}
            onClick={() => exportData()}
          >
            Export Data
          </AsyncButton>

          <AsyncButton
            variant="outline"
            size="md"
            icon={<TrendingUp className="w-4 h-4" />}
            onClick={() => generateReport()}
          >
            Generate Report
          </AsyncButton>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Total Collected Card */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 hover:border-green-500/30 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Total Collected</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">₹{stats.totalCollected.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">This month</p>
        </div>

        {/* Pending Card */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20 hover:border-orange-500/30 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">₹{stats.pending.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Outstanding fees</p>
        </div>

        {/* Overdue Card */}
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm rounded-xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Overdue</h3>
          </div>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</p>
          <p className="text-sm text-muted-foreground mt-1">Students with dues</p>
        </div>

        {/* Paid Students Card */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/30 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Paid Students</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.paidStudents}</p>
          <p className="text-sm text-muted-foreground mt-1">Fully paid</p>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50"
      >
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by student name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2.5 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Fee Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Student</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Due Date</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' ? 'No records match your filters' : 'No fee records found'}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, index) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-foreground">{record.studentName}</div>
                        <div className="text-sm text-muted-foreground">{record.studentId}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-foreground">₹{record.amount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{record.description}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-foreground">{new Date(record.dueDate).toLocaleDateString()}</div>
                      {record.paymentDate && (
                        <div className="text-sm text-muted-foreground">
                          Paid: {new Date(record.paymentDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        record.status === 'paid'
                          ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                          : record.status === 'pending'
                          ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400'
                          : 'bg-red-500/20 text-red-600 dark:text-red-400'
                      }`}>
                        {record.status === 'paid' && <CheckCircle className="w-3 h-3" />}
                        {record.status === 'pending' && <Clock className="w-3 h-3" />}
                        {record.status === 'overdue' && <AlertTriangle className="w-3 h-3" />}
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {record.status !== 'paid' && (
                          <AsyncButton
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              await new Promise(resolve => setTimeout(resolve, 1000));
                            }}
                            loadingMessage="Processing..."
                          >
                            Mark Paid
                          </AsyncButton>
                        )}
                        <button className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                          View
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* Payment Reminders */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Payment Reminders</h3>
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            Send automated reminders to students with pending payments.
          </p>
          <AsyncButton
            variant="outline"
            size="sm"
            className="w-full"
            onClick={async () => {
              await new Promise(resolve => setTimeout(resolve, 2000));
            }}
            loadingMessage="Sending..."
          >
            Send Reminders
          </AsyncButton>
        </div>

        {/* Fee Structure */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Fee Structure</h3>
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            Configure fee amounts and payment schedules for different courses.
          </p>
          <button className="w-full px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-all text-sm">
            Configure Fees
          </button>
        </div>

        {/* Financial Analytics */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Analytics</h3>
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            View detailed financial reports and payment trends.
          </p>
          <button className="w-full px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-all text-sm">
            View Analytics
          </button>
        </div>
      </motion.div>
    </div>
  );
}