// Dynamic learner detail page - displays comprehensive information about a specific learner
// Route: /admin/learners/[id]
'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery, GET_LEARNER_BY_ID } from '@/lib/apollo';
import { getInitials } from '@/lib/utils';
import {
    ArrowLeft,
    Mail,
    Phone,
    School,
    GraduationCap,
    Target,
    Calendar,
    Users,
    TrendingUp,
    TrendingDown,
    Minus,
    Edit,
    Trash2,
    Star,
    BookOpen,
    Activity,
    Clock,
    User,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

// Helper function to check if URL is valid for Next.js Image component
const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        if (!hostname || hostname.includes('.') === false || hostname.startsWith('example')) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
};

// Get status color helper
const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'text-green-500 bg-green-50 border-green-200';
        case 'on-break': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        case 'inactive': return 'text-red-500 bg-red-50 border-red-200';
        default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
};

// Get trend icon helper
const getTrendIcon = (trend: string) => {
    switch (trend) {
        case 'improving': return <TrendingUp className="w-5 h-5 text-green-500" />;
        case 'declining': return <TrendingDown className="w-5 h-5 text-red-500" />;
        case 'stable': return <Minus className="w-5 h-5 text-gray-500" />;
        default: return null;
    }
};

// Get attendance color helper
const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
};

// Get note type icon helper
const getNoteTypeIcon = (type: string) => {
    switch (type) {
        case 'academic': return <BookOpen className="w-4 h-4 text-blue-500" />;
        case 'behavioral': return <Activity className="w-4 h-4 text-purple-500" />;
        case 'general': return <AlertCircle className="w-4 h-4 text-gray-500" />;
        default: return null;
    }
};

export default function LearnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [imageError, setImageError] = React.useState(false);

    // Fetch learner by ID using Apollo
    const { data, loading, error } = useQuery(GET_LEARNER_BY_ID, {
        variables: { id: resolvedParams.id },
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
    });

    const learner = data?.learner;

    // Loading state
    if (loading) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Skeleton loader */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-pulse">
                        <div className="flex items-center gap-6">
                            <div className="w-32 h-32 rounded-xl bg-white/10" />
                            <div className="flex-1 space-y-3">
                                <div className="h-8 bg-white/10 rounded w-1/3" />
                                <div className="h-4 bg-white/10 rounded w-1/2" />
                                <div className="h-4 bg-white/10 rounded w-2/3" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-pulse">
                                <div className="h-6 bg-white/10 rounded w-1/3 mb-4" />
                                <div className="space-y-2">
                                    <div className="h-4 bg-white/10 rounded" />
                                    <div className="h-4 bg-white/10 rounded w-5/6" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !learner) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-red-400 mb-2">Learner Not Found</h2>
                        <p className="text-red-300">
                            {error ? `Error: ${error.message}` : 'The learner you are looking for does not exist.'}
                        </p>
                        <button
                            onClick={() => router.push('/admin/learners')}
                            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                        >
                            Back to Learners List
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header with back button and actions */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => router.push(`/admin/learners/${learner.id}/edit`)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg btn-primary-action transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                if (confirm(`Are you sure you want to delete ${learner.name}?`)) {
                                    // TODO: Implement delete mutation
                                    router.push('/admin/learners');
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Profile Header Card */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-start gap-6">
                        {/* Profile Image */}
                        {isValidImageUrl(learner.profileImage) && !imageError ? (
                            <Image
                                src={learner.profileImage!}
                                alt={learner.name}
                                width={128}
                                height={128}
                                className="rounded-xl object-cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                                <span className="text-4xl font-bold text-primary">
                                    {getInitials(learner.name)}
                                </span>
                            </div>
                        )}

                        {/* Profile Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground">{learner.name}</h1>
                                    <p className="text-lg text-muted-foreground mt-1">{learner.username}</p>
                                </div>
                                <span className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(learner.status)}`}>
                                    {learner.status}
                                </span>
                            </div>

                            {/* Contact & Academic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm">{learner.email}</span>
                                </div>
                                {learner.phone && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="w-4 h-4" />
                                        <span className="text-sm">{learner.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <GraduationCap className="w-4 h-4" />
                                    <span className="text-sm">{learner.grade} • {learner.board}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <School className="w-4 h-4" />
                                    <span className="text-sm">{learner.school}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">Enrolled: {new Date(learner.enrollmentDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">Last Active: {new Date(learner.lastActive).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Tags */}
                            {learner.remarkTags && learner.remarkTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {learner.remarkTags.map((tag: string, idx: number) => (
                                        <span
                                            key={idx}
                                            className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Attendance */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Attendance</h3>
                            <Activity className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className={`text-2xl font-bold ${getAttendanceColor(learner.attendance.overall)}`}>
                            {learner.attendance.overall}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Last month: {learner.attendance.lastMonth}%
                        </p>
                    </div>

                    {/* Performance */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Avg. Performance</h3>
                            <Star className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold text-foreground">{learner.performance.averageScore}%</p>
                            {getTrendIcon(learner.performance.trend)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Last test: {learner.performance.lastTestScore}%
                        </p>
                    </div>

                    {/* Educators */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Educators</h3>
                            <Users className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">{learner.assignedEducators.length}</p>
                        <p className="text-xs text-muted-foreground mt-1">Assigned educators</p>
                    </div>

                    {/* Target Exams */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Target Year</h3>
                            <Target className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">{learner.targetExamYear}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {learner.targetExams.join(', ')}
                        </p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Assigned Educators */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Assigned Educators
                        </h2>
                        <div className="space-y-3">
                            {learner.assignedEducators.map((educator: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div>
                                        <p className="font-medium text-foreground">{educator.educatorName}</p>
                                        <p className="text-sm text-muted-foreground">{educator.subject}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Guardians */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Guardians
                        </h2>
                        <div className="space-y-3">
                            {learner.guardians.map((guardian: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div>
                                        <p className="font-medium text-foreground">{guardian.guardianName}</p>
                                        <p className="text-sm text-muted-foreground">{guardian.relation}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Educator Reviews */}
                    {learner.reviewedEducators && learner.reviewedEducators.length > 0 && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5" />
                                Educator Reviews
                            </h2>
                            <div className="space-y-4">
                                {learner.reviewedEducators.map((review: any, idx: number) => (
                                    <div key={idx} className="p-4 bg-white/5 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-medium text-foreground">{review.educatorName}</p>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-2">{review.exam} • {new Date(review.date).toLocaleDateString()}</p>
                                        <p className="text-sm text-foreground">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Learner Notes */}
                    {learner.learnerNotes && learner.learnerNotes.length > 0 && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                Notes & Observations
                            </h2>
                            <div className="space-y-4">
                                {learner.learnerNotes.map((note: any, idx: number) => (
                                    <div key={idx} className="p-4 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            {getNoteTypeIcon(note.type)}
                                            <p className="font-medium text-foreground text-sm">{note.author}</p>
                                            <span className="text-xs text-muted-foreground">•</span>
                                            <p className="text-xs text-muted-foreground">{new Date(note.timestamp).toLocaleDateString()}</p>
                                        </div>
                                        <p className="text-sm text-foreground">{note.note}</p>
                                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full inline-block mt-2">
                                            {note.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
