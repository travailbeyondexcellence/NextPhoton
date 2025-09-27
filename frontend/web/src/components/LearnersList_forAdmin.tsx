// Component for displaying learners in a table/list view for admin
'use client';

import React, { useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getInitials } from '@/lib/utils';
import { learners } from '@/app/(dashboard)/admin/learners/learnersDummyData';

// Icons
import { 
    ChevronUp, 
    ChevronDown, 
    MoreVertical,
    TrendingUp,
    TrendingDown,
    Minus,
    AlertCircle,
    CheckCircle,
    Clock,
    School,
    GraduationCap,
    Target,
    Users
} from 'lucide-react';

// Define view type
type ViewType = 'table' | 'list';

const LearnersList_forAdmin = ({ initialView = 'table' }: { initialView?: ViewType }) => {
    const [view, setView] = useState<ViewType>(initialView);
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: 'asc' | 'desc';
    } | null>(null);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

    const router = useRouter();

    // Sort learners based on current sort configuration
    const sortedLearners = React.useMemo(() => {
        let sortableLearners = [...learners];
        if (sortConfig) {
            sortableLearners.sort((a, b) => {
                let aValue: any = a;
                let bValue: any = b;
                
                // Handle nested properties
                const keys = sortConfig.key.split('.');
                for (const key of keys) {
                    aValue = aValue?.[key];
                    bValue = bValue?.[key];
                }

                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;
                if (aValue === bValue) return 0;

                if (sortConfig.direction === 'asc') {
                    return aValue > bValue ? 1 : -1;
                }
                return aValue < bValue ? 1 : -1;
            });
        }
        return sortableLearners;
    }, [sortConfig]);

    // Handle sorting
    const handleSort = (key: string) => {
        setSortConfig(current => {
            if (current?.key === key) {
                return current.direction === 'asc' 
                    ? { key, direction: 'desc' }
                    : null;
            }
            return { key, direction: 'asc' };
        });
    };

    // Toggle row expansion
    const toggleRowExpansion = (learnerId: string) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(learnerId)) {
                newSet.delete(learnerId);
            } else {
                newSet.add(learnerId);
            }
            return newSet;
        });
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-green-500 bg-green-50 border-green-200';
            case 'on-break': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'inactive': return 'text-red-500 bg-red-50 border-red-200';
            default: return 'text-gray-500 bg-gray-50 border-gray-200';
        }
    };

    // Get trend icon
    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
            case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
            case 'stable': return <Minus className="w-4 h-4 text-gray-500" />;
            default: return null;
        }
    };

    // Get attendance color
    const getAttendanceColor = (percentage: number) => {
        if (percentage >= 90) return 'text-green-600';
        if (percentage >= 75) return 'text-yellow-600';
        return 'text-red-600';
    };

    // Get payment status icon
    const getPaymentStatusIcon = (status: string) => {
        switch (status) {
            case 'paid': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'overdue': return <AlertCircle className="w-4 h-4 text-red-500" />;
            default: return null;
        }
    };

    if (view === 'table') {
        return (
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-white/20">
                            <th className="text-left p-4 font-medium text-muted-foreground">
                                <button 
                                    onClick={() => handleSort('name')}
                                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                                >
                                    Learner
                                    {sortConfig?.key === 'name' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                                    )}
                                </button>
                            </th>
                            <th className="text-left p-4 font-medium text-muted-foreground">
                                <button 
                                    onClick={() => handleSort('grade')}
                                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                                >
                                    Grade/School
                                    {sortConfig?.key === 'grade' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                                    )}
                                </button>
                            </th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Target Exams</th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Educators</th>
                            <th className="text-center p-4 font-medium text-muted-foreground">
                                <button 
                                    onClick={() => handleSort('attendance.overall')}
                                    className="flex items-center gap-1 hover:text-foreground transition-colors mx-auto"
                                >
                                    Attendance
                                    {sortConfig?.key === 'attendance.overall' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                                    )}
                                </button>
                            </th>
                            <th className="text-center p-4 font-medium text-muted-foreground">
                                <button 
                                    onClick={() => handleSort('performance.averageScore')}
                                    className="flex items-center gap-1 hover:text-foreground transition-colors mx-auto"
                                >
                                    Performance
                                    {sortConfig?.key === 'performance.averageScore' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                                    )}
                                </button>
                            </th>
                            <th className="text-center p-4 font-medium text-muted-foreground">Status</th>
                            <th className="text-center p-4 font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedLearners.map((learner) => (
                            <React.Fragment key={learner.id}>
                                <tr 
                                    className="border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/admin/learners/${learner.id}`)}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {learner.profileImage && !imageErrors.has(learner.id) ? (
                                                <Image
                                                    src={learner.profileImage}
                                                    alt={learner.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full object-cover"
                                                    onError={() => setImageErrors(prev => new Set(prev).add(learner.id))}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-primary">
                                                        {getInitials(learner.name)}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-foreground">{learner.name}</p>
                                                <p className="text-sm text-muted-foreground">{learner.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-medium">{learner.grade}</p>
                                        <p className="text-sm text-muted-foreground">{learner.school}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {learner.targetExams.map((exam, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full"
                                                >
                                                    {exam}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleRowExpansion(learner.id);
                                            }}
                                            className="text-sm text-primary hover:text-primary/80"
                                        >
                                            {learner.assignedEducators.length} educators
                                            {expandedRows.has(learner.id) ? 
                                                <ChevronUp className="w-3 h-3 inline ml-1" /> : 
                                                <ChevronDown className="w-3 h-3 inline ml-1" />
                                            }
                                        </button>
                                    </td>
                                    <td className="p-4 text-center">
                                        <p className={`font-semibold ${getAttendanceColor(learner.attendance.overall)}`}>
                                            {learner.attendance.overall}%
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Last month: {learner.attendance.lastMonth}%
                                        </p>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="font-semibold">{learner.performance.averageScore}%</span>
                                            {getTrendIcon(learner.performance.trend)}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Last: {learner.performance.lastTestScore}%
                                        </p>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(learner.status)}`}>
                                            {learner.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Handle actions menu
                                            }}
                                            className="p-1 hover:bg-white/10 rounded"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                                {expandedRows.has(learner.id) && (
                                    <tr className="bg-white/5">
                                        <td colSpan={8} className="p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-medium mb-2">Assigned Educators</h4>
                                                    <div className="space-y-1">
                                                        {learner.assignedEducators.map((edu, idx) => (
                                                            <div key={idx} className="text-sm">
                                                                <span className="font-medium">{edu.educatorName}</span>
                                                                <span className="text-muted-foreground"> - {edu.subject}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">Guardians</h4>
                                                    <div className="space-y-1">
                                                        {learner.guardians.map((guardian, idx) => (
                                                            <div key={idx} className="text-sm">
                                                                <span className="font-medium">{guardian.guardianName}</span>
                                                                <span className="text-muted-foreground"> ({guardian.relation})</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            {learner.remarkTags && learner.remarkTags.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="font-medium mb-2">Tags</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {learner.remarkTags.map((tag, idx) => (
                                                            <span 
                                                                key={idx} 
                                                                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // List view
    return (
        <div className="space-y-4">
            {sortedLearners.map((learner) => (
                <div 
                    key={learner.id}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/learners/${learner.id}`)}
                >
                    <div className="flex items-start gap-4">
                        {learner.profileImage && !imageErrors.has(learner.id) ? (
                            <Image
                                src={learner.profileImage}
                                alt={learner.name}
                                width={60}
                                height={60}
                                className="rounded-xl object-cover"
                                onError={() => setImageErrors(prev => new Set(prev).add(learner.id))}
                            />
                        ) : (
                            <div className="w-[60px] h-[60px] rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                                <span className="text-lg font-bold text-primary">
                                    {getInitials(learner.name)}
                                </span>
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-foreground">{learner.name}</h3>
                                    <p className="text-sm text-muted-foreground">{learner.username} • {learner.email}</p>
                                    <p className="text-sm mt-1">
                                        <span className="inline-flex items-center gap-1">
                                            <GraduationCap className="w-3 h-3" />
                                            {learner.grade} • {learner.school} • {learner.board}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(learner.status)}`}>
                                        {learner.status}
                                    </span>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle actions
                                        }}
                                        className="p-1 hover:bg-white/10 rounded"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                                <div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Target className="w-3 h-3" /> Target Exams
                                    </p>
                                    <p className="text-sm font-medium">
                                        {learner.targetExams.join(', ')} ({learner.targetExamYear})
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Attendance</p>
                                    <p className={`text-sm font-medium ${getAttendanceColor(learner.attendance.overall)}`}>
                                        {learner.attendance.overall}% 
                                        <span className="text-xs text-muted-foreground ml-1">
                                            (Last: {learner.attendance.lastMonth}%)
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Performance</p>
                                    <p className="text-sm font-medium flex items-center gap-1">
                                        {learner.performance.averageScore}% {getTrendIcon(learner.performance.trend)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Users className="w-3 h-3" /> Educators
                                    </p>
                                    <p className="text-sm font-medium">{learner.assignedEducators.length} assigned</p>
                                </div>
                            </div>
                            {learner.remarkTags && learner.remarkTags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {learner.remarkTags.map((tag, idx) => (
                                        <span 
                                            key={idx} 
                                            className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LearnersList_forAdmin;