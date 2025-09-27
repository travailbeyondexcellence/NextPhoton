// Individual learner card component for admin view
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getInitials } from "@/lib/utils";
import { useState } from "react";
import { 
    School, 
    Target, 
    Calendar, 
    TrendingUp, 
    TrendingDown, 
    Minus,
    Users,
    Clock,
    Award,
    AlertCircle
} from 'lucide-react';
import type { Learner } from '@/app/(dashboard)/admin/learners/learnersDummyData';

const LearnerCard_forAdmin = ({ learner }: { learner: Learner }) => {
    const router = useRouter();
    const [imageError, setImageError] = useState(false);

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500 text-white';
            case 'on-break': return 'bg-yellow-500 text-white';
            case 'inactive': return 'bg-red-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    // Get attendance color
    const getAttendanceColor = (percentage: number) => {
        if (percentage >= 90) return 'text-green-600 bg-green-50';
        if (percentage >= 75) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    // Get performance trend icon
    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
            case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
            case 'stable': return <Minus className="w-4 h-4 text-gray-500" />;
            default: return null;
        }
    };

    return (
        <div className="relative flex flex-col bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 w-full h-full hover:bg-white/15 hover:border-white/30 transition-all duration-300">
            {/* Status Badge */}
            <div className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full z-10 ${getStatusColor(learner.status)}`}>
                {learner.status}
            </div>

            {/* Header Section with Image */}
            <div className="p-5 pb-3">
                <div className="flex items-start gap-4">
                    {learner.profileImage && !imageError ? (
                        <Image
                            src={learner.profileImage}
                            alt={learner.name}
                            width={80}
                            height={80}
                            className="rounded-xl object-cover bg-white/5"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary">
                                {getInitials(learner.name)}
                            </span>
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground truncate">{learner.name}</h3>
                        <p className="text-sm text-muted-foreground">{learner.username}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <School className="w-3 h-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground truncate">
                                {learner.grade} • {learner.school}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Target Exams Section */}
            <div className="px-5 py-3 border-t border-white/10">
                <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Target Exams ({learner.targetExamYear})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {learner.targetExams.map((exam, idx) => (
                        <span 
                            key={idx} 
                            className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full border border-accent/30"
                        >
                            {exam}
                        </span>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="px-5 py-3 grid grid-cols-2 gap-3 border-t border-white/10">
                <div className="text-center p-2 rounded-lg bg-white/5">
                    <div className="flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className={`text-lg font-bold ${getAttendanceColor(learner.attendance.overall).split(' ')[0]}`}>
                            {learner.attendance.overall}%
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Attendance</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-lg font-bold text-foreground">{learner.performance.averageScore}%</span>
                        {getTrendIcon(learner.performance.trend)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Performance</p>
                </div>
            </div>

            {/* Educators Section */}
            <div className="px-5 py-3 border-t border-white/10">
                <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Educators ({learner.assignedEducators.length})</span>
                </div>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                    {learner.assignedEducators.slice(0, 3).map((edu, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground">
                            {edu.educatorName} - <span className="text-foreground">{edu.subject}</span>
                        </p>
                    ))}
                    {learner.assignedEducators.length > 3 && (
                        <p className="text-xs text-muted-foreground italic">
                            +{learner.assignedEducators.length - 3} more...
                        </p>
                    )}
                </div>
            </div>

            {/* Tags Section */}
            {learner.remarkTags && learner.remarkTags.length > 0 && (
                <div className="px-5 py-3 border-t border-white/10">
                    <div className="flex flex-wrap gap-1">
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

            {/* Action Buttons */}
            <div className="px-5 py-4 mt-auto border-t border-white/10 bg-white/5">
                <div className="grid grid-cols-2 gap-2">
                    <button
                        className="bg-primary/20 text-primary px-3 py-2 rounded-lg border border-primary/30 hover:bg-primary/30 transition-all text-sm font-medium"
                        onClick={() => router.push(`/admin/learners/${learner.id}`)}
                    >
                        View Profile
                    </button>
                    <button className="bg-white/5 px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-all text-foreground text-sm font-medium">
                        Contact Guardian
                    </button>
                </div>
            </div>

            {/* Guardians Info Footer */}
            <div className="px-5 py-3 bg-white/5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Guardians: </span>
                    <span className="text-foreground">
                        {learner.guardians.map(g => `${g.guardianName} (${g.relation})`).join(', ')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LearnerCard_forAdmin;