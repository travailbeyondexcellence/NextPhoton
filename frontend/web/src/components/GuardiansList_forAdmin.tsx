// Component for displaying guardians in a table/list view for admin
'use client';

import React, { useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getInitials } from '@/lib/utils';
import guardiansData from '../../../mock-data/guardians.json';

const guardians = guardiansData.data;

// Icons
import { 
    ChevronUp, 
    ChevronDown, 
    MoreVertical,
    Phone,
    Mail,
    MapPin,
    CreditCard,
    Users,
    CheckCircle,
    Clock,
    AlertCircle,
    MessageSquare,
    Bell
} from 'lucide-react';

// Define view type
type ViewType = 'table' | 'list';

const GuardiansList_forAdmin = ({ initialView = 'table' }: { initialView?: ViewType }) => {
    const [view, setView] = useState<ViewType>(initialView);
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: 'asc' | 'desc';
    } | null>(null);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

    const router = useRouter();

    // Sort guardians based on current sort configuration
    const sortedGuardians = React.useMemo(() => {
        let sortableGuardians = [...guardians];
        if (sortConfig) {
            sortableGuardians.sort((a, b) => {
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
        return sortableGuardians;
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
    const toggleRowExpansion = (guardianId: string) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(guardianId)) {
                newSet.delete(guardianId);
            } else {
                newSet.add(guardianId);
            }
            return newSet;
        });
    };

    // Get payment status color and icon
    const getPaymentStatus = (status: string) => {
        switch (status) {
            case 'paid': 
                return {
                    color: 'text-green-500 bg-green-50 border-green-200',
                    icon: <CheckCircle className="w-3 h-3" />
                };
            case 'pending': 
                return {
                    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
                    icon: <Clock className="w-3 h-3" />
                };
            case 'overdue': 
                return {
                    color: 'text-red-500 bg-red-50 border-red-200',
                    icon: <AlertCircle className="w-3 h-3" />
                };
            default: 
                return {
                    color: 'text-gray-500 bg-gray-50 border-gray-200',
                    icon: null
                };
        }
    };

    // Get contact method icon
    const getContactMethodIcon = (method: string) => {
        switch (method) {
            case 'phone': return <Phone className="w-3 h-3" />;
            case 'whatsapp': return <MessageSquare className="w-3 h-3" />;
            case 'email': return <Mail className="w-3 h-3" />;
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
                                    Guardian
                                    {sortConfig?.key === 'name' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                                    )}
                                </button>
                            </th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Learner(s)</th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Contact</th>
                            <th className="text-center p-4 font-medium text-muted-foreground">
                                <button 
                                    onClick={() => handleSort('paymentInfo.paymentStatus')}
                                    className="flex items-center gap-1 hover:text-foreground transition-colors mx-auto"
                                >
                                    Payment Status
                                    {sortConfig?.key === 'paymentInfo.paymentStatus' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                                    )}
                                </button>
                            </th>
                            <th className="text-center p-4 font-medium text-muted-foreground">Preferences</th>
                            <th className="text-center p-4 font-medium text-muted-foreground">
                                <button 
                                    onClick={() => handleSort('lastInteraction')}
                                    className="flex items-center gap-1 hover:text-foreground transition-colors mx-auto"
                                >
                                    Last Contact
                                    {sortConfig?.key === 'lastInteraction' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                                    )}
                                </button>
                            </th>
                            <th className="text-center p-4 font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedGuardians.map((guardian) => {
                            const paymentStatus = getPaymentStatus(guardian.paymentInfo.paymentStatus);
                            return (
                                <React.Fragment key={guardian.id}>
                                    <tr 
                                        className="border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/admin/guardians/${guardian.id}`)}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {guardian.profileImage && !imageErrors.has(guardian.id) ? (
                                                    <Image
                                                        src={guardian.profileImage}
                                                        alt={guardian.name}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full object-cover"
                                                        onError={() => setImageErrors(prev => new Set(prev).add(guardian.id))}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                                                        <span className="text-sm font-semibold text-primary">
                                                            {getInitials(guardian.name)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-foreground">{guardian.name}</p>
                                                    <p className="text-sm text-muted-foreground">{guardian.occupation}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleRowExpansion(guardian.id);
                                                }}
                                                className="text-sm text-primary hover:text-primary/80"
                                            >
                                                {guardian.assignedLearners.length} learner(s)
                                                {expandedRows.has(guardian.id) ? 
                                                    <ChevronUp className="w-3 h-3 inline ml-1" /> : 
                                                    <ChevronDown className="w-3 h-3 inline ml-1" />
                                                }
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <p className="text-sm flex items-center gap-1">
                                                    {getContactMethodIcon(guardian.preferredContactMethod)}
                                                    <span className="font-medium">{guardian.phone}</span>
                                                </p>
                                                <p className="text-xs text-muted-foreground">{guardian.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${paymentStatus.color}`}>
                                                    {paymentStatus.icon}
                                                    {guardian.paymentInfo.paymentStatus}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {guardian.paymentInfo.billingCycle}
                                            </p>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <div className="group relative">
                                                    <Bell 
                                                        className={`w-4 h-4 ${
                                                            guardian.communicationPreferences.generalNotifications 
                                                                ? 'text-green-500' 
                                                                : 'text-gray-400'
                                                        }`}
                                                    />
                                                    <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                                        Notifications: {guardian.communicationPreferences.generalNotifications ? 'On' : 'Off'}
                                                    </span>
                                                </div>
                                                <div className="group relative">
                                                    <Mail 
                                                        className={`w-4 h-4 ${
                                                            guardian.communicationPreferences.academicUpdates 
                                                                ? 'text-green-500' 
                                                                : 'text-gray-400'
                                                        }`}
                                                    />
                                                    <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                                        Academic Updates: {guardian.communicationPreferences.academicUpdates ? 'On' : 'Off'}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {guardian.preferredContactTime}
                                            </p>
                                        </td>
                                        <td className="p-4 text-center">
                                            <p className="text-sm text-foreground">
                                                {new Date(guardian.lastInteraction).toLocaleDateString()}
                                            </p>
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
                                    {expandedRows.has(guardian.id) && (
                                        <tr className="bg-white/5">
                                            <td colSpan={7} className="p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <h4 className="font-medium mb-2 flex items-center gap-1">
                                                            <Users className="w-4 h-4" /> Assigned Learners
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {guardian.assignedLearners.map((learner, idx) => (
                                                                <div key={idx} className="text-sm bg-white/5 p-2 rounded">
                                                                    <p className="font-medium">{learner.learnerName}</p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {learner.relation} • {learner.grade} • {learner.school}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium mb-2 flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" /> Address
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {guardian.address.street}<br/>
                                                            {guardian.address.city}, {guardian.address.state}<br/>
                                                            PIN: {guardian.address.pincode}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium mb-2 flex items-center gap-1">
                                                            <CreditCard className="w-4 h-4" /> Payment Details
                                                        </h4>
                                                        <p className="text-sm">
                                                            Method: <span className="font-medium">{guardian.paymentInfo.method}</span><br/>
                                                            Last Payment: {new Date(guardian.paymentInfo.lastPaymentDate).toLocaleDateString()}<br/>
                                                            Next Due: <span className="font-medium text-primary">
                                                                {new Date(guardian.paymentInfo.nextDueDate).toLocaleDateString()}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                {guardian.notes.length > 0 && (
                                                    <div className="mt-4">
                                                        <h4 className="font-medium mb-2">Recent Notes</h4>
                                                        <div className="space-y-2">
                                                            {guardian.notes.slice(0, 2).map((note, idx) => (
                                                                <div key={idx} className="text-sm bg-white/5 p-2 rounded">
                                                                    <p className="font-medium">{note.author} - {note.timestamp}</p>
                                                                    <p className="text-muted-foreground">{note.note}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    // List view
    return (
        <div className="space-y-4">
            {sortedGuardians.map((guardian) => {
                const paymentStatus = getPaymentStatus(guardian.paymentInfo.paymentStatus);
                return (
                    <div 
                        key={guardian.id}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer"
                        onClick={() => router.push(`/admin/guardians/${guardian.id}`)}
                    >
                        <div className="flex items-start gap-4">
                            {guardian.profileImage && !imageErrors.has(guardian.id) ? (
                                <Image
                                    src={guardian.profileImage}
                                    alt={guardian.name}
                                    width={60}
                                    height={60}
                                    className="rounded-xl object-cover"
                                    onError={() => setImageErrors(prev => new Set(prev).add(guardian.id))}
                                />
                            ) : (
                                <div className="w-[60px] h-[60px] rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                                    <span className="text-lg font-bold text-primary">
                                        {getInitials(guardian.name)}
                                    </span>
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-foreground">{guardian.name}</h3>
                                        <p className="text-sm text-muted-foreground">{guardian.occupation} • {guardian.relation}</p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <p className="text-sm flex items-center gap-1">
                                                {getContactMethodIcon(guardian.preferredContactMethod)}
                                                <span>{guardian.phone}</span>
                                            </p>
                                            <p className="text-sm text-muted-foreground">{guardian.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${paymentStatus.color}`}>
                                            {paymentStatus.icon}
                                            {guardian.paymentInfo.paymentStatus}
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
                                <div className="mt-3">
                                    <h4 className="text-sm font-medium mb-2">Learners Under Guardian:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {guardian.assignedLearners.map((learner, idx) => (
                                            <div 
                                                key={idx} 
                                                className="bg-white/5 px-3 py-1 rounded-lg text-sm border border-white/10"
                                            >
                                                <span className="font-medium">{learner.learnerName}</span>
                                                <span className="text-muted-foreground"> • {learner.grade} • {learner.school}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Payment Method</p>
                                        <p className="text-sm font-medium">{guardian.paymentInfo.method}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Billing Cycle</p>
                                        <p className="text-sm font-medium">{guardian.paymentInfo.billingCycle}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Preferred Time</p>
                                        <p className="text-sm font-medium">{guardian.preferredContactTime}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Last Contact</p>
                                        <p className="text-sm font-medium">
                                            {new Date(guardian.lastInteraction).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GuardiansList_forAdmin;