// Component for displaying learners in a table/list view for admin
'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getInitials } from '@/lib/utils';
import { useQuery, useMutation, GET_LEARNERS, DELETE_LEARNER } from '@/lib/apollo';

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
    Users,
    Loader2
} from 'lucide-react';

// Define view type
type ViewType = 'table' | 'list';

// Helper function to check if URL is valid for Next.js Image component
const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    try {
        const urlObj = new URL(url);
        // Check if hostname is valid (not just a file extension)
        const hostname = urlObj.hostname;
        // Reject URLs where hostname is just a file extension or invalid
        if (!hostname || hostname.includes('.') === false || hostname.startsWith('example')) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
};

const LearnersList_forAdmin = ({ initialView = 'table' }: { initialView?: ViewType }) => {
    const [view, setView] = useState<ViewType>(initialView);
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: 'asc' | 'desc';
    } | null>(null);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
    const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

    const router = useRouter();

    // Fetch learners using Apollo with aggressive fetch policy
    const { data, loading, error, refetch } = useQuery(GET_LEARNERS, {
        fetchPolicy: 'network-only', // Always fetch fresh data on mount to avoid stale cache
        nextFetchPolicy: 'cache-first', // Then use cache for subsequent queries
        notifyOnNetworkStatusChange: true,
        errorPolicy: 'all',
    });

    // Delete learner mutation
    const [deleteLearner] = useMutation(DELETE_LEARNER, {
        update(cache, { data: { deleteLearner } }, { variables }) {
            if (deleteLearner && variables) {
                cache.modify({
                    fields: {
                        learners(existingLearners = [], { readField }) {
                            return existingLearners.filter(
                                (learnerRef: any) => variables.id !== readField('id', learnerRef)
                            );
                        },
                    },
                });
            }
        },
        onCompleted: () => {
            alert('Learner deleted successfully!');
        },
        onError: (error) => {
            console.error('Error deleting learner:', error);
            alert('Failed to delete learner. Please try again.');
        },
    });

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            await deleteLearner({
                variables: { id },
            });
        }
    };

    // Close action menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (openActionMenuId && !target.closest('.action-menu-container')) {
                setOpenActionMenuId(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [openActionMenuId]);

    // Toggle action menu
    const toggleActionMenu = (learnerId: string) => {
        setOpenActionMenuId(prev => prev === learnerId ? null : learnerId);
    };

    const learners = data?.learners || [];

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

    // Loading state - show skeleton while loading first time
    if (loading && !data) {
        return (
            <div className="space-y-4">
                {/* Skeleton loader */}
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/10" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-white/10 rounded w-1/4" />
                                <div className="h-3 bg-white/10 rounded w-1/3" />
                            </div>
                            <div className="w-32 h-8 bg-white/10 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400">Error loading learners: {error.message}</p>
                <button
                    onClick={() => refetch()}
                    className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

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
                                            {isValidImageUrl(learner.profileImage) && !imageErrors.has(learner.id) ? (
                                                <Image
                                                    src={learner.profileImage!}
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
                                        <div className="relative action-menu-container">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleActionMenu(learner.id);
                                                }}
                                                className="p-1 hover:bg-white/10 rounded cursor-pointer"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {/* Dropdown menu */}
                                            {openActionMenuId === learner.id && (
                                                <div className="absolute right-0 top-8 z-50 min-w-[160px] bg-background border border-white/20 rounded-lg shadow-lg overflow-hidden">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenActionMenuId(null);
                                                            router.push(`/admin/learners/${learner.id}`);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                                                    >
                                                        View Details
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenActionMenuId(null);
                                                            router.push(`/admin/learners/${learner.id}/edit`);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                                                    >
                                                        Edit Learner
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenActionMenuId(null);
                                                            handleDelete(learner.id, learner.name);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors text-red-400"
                                                    >
                                                        Delete Learner
                                                    </button>
                                                </div>
                                            )}
                                        </div>
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
                        {isValidImageUrl(learner.profileImage) && !imageErrors.has(learner.id) ? (
                            <Image
                                src={learner.profileImage!}
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
                                    <div className="relative action-menu-container">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleActionMenu(learner.id);
                                            }}
                                            className="p-1 hover:bg-white/10 rounded cursor-pointer"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        {/* Dropdown menu */}
                                        {openActionMenuId === learner.id && (
                                            <div className="absolute right-0 top-8 z-50 min-w-[160px] bg-background border border-white/20 rounded-lg shadow-lg overflow-hidden">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenActionMenuId(null);
                                                        router.push(`/admin/learners/${learner.id}`);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenActionMenuId(null);
                                                        router.push(`/admin/learners/${learner.id}/edit`);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                                                >
                                                    Edit Learner
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenActionMenuId(null);
                                                        handleDelete(learner.id, learner.name);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors text-red-400"
                                                >
                                                    Delete Learner
                                                </button>
                                            </div>
                                        )}
                                    </div>
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