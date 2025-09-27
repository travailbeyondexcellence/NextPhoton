// Individual guardian card component for admin view
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getInitials } from "@/lib/utils";
import { useState } from "react";
import { 
    Phone,
    Mail,
    MapPin,
    CreditCard,
    Users,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    MessageSquare,
    DollarSign,
    GraduationCap,
    Briefcase
} from 'lucide-react';
import guardiansData from '../../../mock-data/guardians.json';

type Guardian = typeof guardiansData.data[0];

const GuardianCard_forAdmin = ({ guardian }: { guardian: Guardian }) => {
    const router = useRouter();
    const [imageError, setImageError] = useState(false);

    // Get payment status color and icon
    const getPaymentStatus = (status: string) => {
        switch (status) {
            case 'paid': 
                return {
                    color: 'bg-green-500 text-white',
                    icon: <CheckCircle className="w-3 h-3" />,
                    text: 'Paid'
                };
            case 'pending': 
                return {
                    color: 'bg-yellow-500 text-white',
                    icon: <Clock className="w-3 h-3" />,
                    text: 'Pending'
                };
            case 'overdue': 
                return {
                    color: 'bg-red-500 text-white',
                    icon: <AlertCircle className="w-3 h-3" />,
                    text: 'Overdue'
                };
            default: 
                return {
                    color: 'bg-gray-500 text-white',
                    icon: null,
                    text: status
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

    const paymentStatus = getPaymentStatus(guardian.paymentInfo.paymentStatus);

    return (
        <div className="relative flex flex-col bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 w-full h-full hover:bg-white/15 hover:border-white/30 transition-all duration-300">
            {/* Payment Status Badge */}
            <div className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full z-10 flex items-center gap-1 ${paymentStatus.color}`}>
                {paymentStatus.icon}
                {paymentStatus.text}
            </div>

            {/* Header Section */}
            <div className="p-5 pb-3">
                <div className="flex items-start gap-4">
                    {guardian.profileImage && !imageError ? (
                        <Image
                            src={guardian.profileImage}
                            alt={guardian.name}
                            width={80}
                            height={80}
                            className="rounded-xl object-cover bg-white/5"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary">
                                {getInitials(guardian.name)}
                            </span>
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground truncate">{guardian.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {guardian.occupation}
                        </p>
                        <p className="text-xs text-primary mt-1">{guardian.relation} • {guardian.status}</p>
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="px-5 py-3 border-t border-white/10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        {getContactMethodIcon(guardian.preferredContactMethod)}
                        <span className="font-medium">{guardian.phone}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{guardian.preferredContactMethod}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{guardian.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Best time: {guardian.preferredContactTime}</span>
                    </div>
                </div>
            </div>

            {/* Learners Section */}
            <div className="px-5 py-3 border-t border-white/10 flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Learners ({guardian.assignedLearners.length})</span>
                </div>
                <div className="space-y-2 max-h-28 overflow-y-auto">
                    {guardian.assignedLearners.map((learner, idx) => (
                        <div key={idx} className="bg-white/5 p-2 rounded-lg text-sm">
                            <p className="font-medium text-foreground">{learner.learnerName}</p>
                            <p className="text-xs text-muted-foreground">
                                {learner.grade} • {learner.school}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Info */}
            <div className="px-5 py-3 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Payment Info</span>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">{guardian.paymentInfo.method}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <p className="text-muted-foreground">Billing Cycle</p>
                        <p className="font-medium capitalize">{guardian.paymentInfo.billingCycle}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Next Due</p>
                        <p className="font-medium text-primary">
                            {new Date(guardian.paymentInfo.nextDueDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="px-5 py-3 border-t border-white/10 bg-white/5">
                <div className="flex items-start gap-2 text-xs">
                    <MapPin className="w-3 h-3 text-muted-foreground mt-0.5" />
                    <div>
                        <p className="text-muted-foreground">
                            {guardian.address.street}, {guardian.address.city}
                        </p>
                        <p className="text-muted-foreground">
                            {guardian.address.state} - {guardian.address.pincode}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-5 py-4 border-t border-white/10">
                <div className="grid grid-cols-2 gap-2">
                    <button
                        className="bg-primary/20 text-primary px-3 py-2 rounded-lg border border-primary/30 hover:bg-primary/30 transition-all text-sm font-medium"
                        onClick={() => router.push(`/admin/guardians/${guardian.id}`)}
                    >
                        View Details
                    </button>
                    <button className="bg-white/5 px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-all text-foreground text-sm font-medium flex items-center justify-center gap-1">
                        <Phone className="w-3 h-3" />
                        Contact
                    </button>
                </div>
            </div>

            {/* Last Interaction Footer */}
            <div className="px-5 py-2 bg-white/5 text-xs text-muted-foreground text-center">
                Last interaction: {new Date(guardian.lastInteraction).toLocaleDateString()}
            </div>
        </div>
    );
};

export default GuardianCard_forAdmin;