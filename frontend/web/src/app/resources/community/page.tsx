/**
 * Community page for NextPhoton
 * Forums, events, and user community hub
 */

import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Users,
  MessageSquare,
  Calendar,
  Award,
  Heart,
  Star,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  BookOpen,
  Mic,
  Globe,
  TrendingUp,
  Zap,
  Coffee,
  Map,
  Video,
  ExternalLink,
  ChevronRight
} from "lucide-react";

// Community stats
const communityStats = [
  { value: "15K+", label: "Active Members" },
  { value: "50+", label: "Countries" },
  { value: "1K+", label: "Discussions" },
  { value: "100+", label: "Contributors" },
];

// Community channels
const channels = [
  {
    title: "Discussion Forums",
    icon: MessageSquare,
    description: "Connect with educators, share experiences, and get answers",
    link: "#forums",
    stats: "2.5K active topics",
  },
  {
    title: "Events & Webinars",
    icon: Calendar,
    description: "Join live sessions, workshops, and educational events",
    link: "#events",
    stats: "Weekly events",
  },
  {
    title: "Success Stories",
    icon: Star,
    description: "Learn from institutions achieving great results",
    link: "#stories",
    stats: "100+ case studies",
  },
  {
    title: "Developer Hub",
    icon: Github,
    description: "Contribute to NextPhoton and build integrations",
    link: "#developers",
    stats: "Open source projects",
  },
];

// Featured discussions
const featuredDiscussions = [
  {
    title: "Best Practices for Student Engagement in Remote Learning",
    author: "Sarah Chen",
    replies: 45,
    views: 1200,
    category: "Best Practices",
    time: "2 hours ago",
  },
  {
    title: "How to Use Analytics to Improve Learning Outcomes",
    author: "Mike Rodriguez",
    replies: 32,
    views: 890,
    category: "Analytics",
    time: "5 hours ago",
  },
  {
    title: "Creative Ways to Involve Parents in Education",
    author: "Priya Sharma",
    replies: 28,
    views: 650,
    category: "Guardian Engagement",
    time: "1 day ago",
  },
  {
    title: "Tips for Managing Large Virtual Classrooms",
    author: "David Kumar",
    replies: 51,
    views: 1500,
    category: "Classroom Management",
    time: "2 days ago",
  },
];

// Upcoming events
const upcomingEvents = [
  {
    date: "Jan 15",
    time: "2:00 PM EST",
    title: "NextPhoton Platform Overview",
    type: "Webinar",
    description: "Introduction to key features and best practices",
    attendees: 250,
  },
  {
    date: "Jan 22",
    time: "3:00 PM EST",
    title: "Advanced Analytics Workshop",
    type: "Workshop",
    description: "Deep dive into analytics and reporting features",
    attendees: 180,
  },
  {
    date: "Feb 5",
    time: "1:00 PM EST",
    title: "Education Innovation Summit",
    type: "Virtual Summit",
    description: "Annual gathering of education technology leaders",
    attendees: 500,
  },
];

// Community champions
const champions = [
  {
    name: "Jennifer Williams",
    role: "Power User",
    institution: "Bright Academy",
    contributions: 150,
    badge: "🏆",
  },
  {
    name: "Alex Thompson",
    role: "Forum Moderator",
    institution: "Tech Institute",
    contributions: 320,
    badge: "⭐",
  },
  {
    name: "Lisa Chen",
    role: "Content Creator",
    institution: "Global School",
    contributions: 85,
    badge: "✨",
  },
  {
    name: "Robert Singh",
    role: "Developer",
    institution: "Code Academy",
    contributions: 200,
    badge: "💻",
  },
];

// Social channels
const socialChannels = [
  { icon: Twitter, label: "Twitter", followers: "12K", link: "#" },
  { icon: Linkedin, label: "LinkedIn", followers: "25K", link: "#" },
  { icon: Youtube, label: "YouTube", followers: "8K", link: "#" },
  { icon: Github, label: "GitHub", followers: "5K", link: "#" },
];

export default function CommunityPage() {
  return (
    <PageLayout
      title="Join Our Community"
      subtitle="Connect with educators worldwide, share insights, and shape the future of education together"
    >
      {/* Community Stats */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {communityStats.map((stat, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Community Channels */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ways to Connect
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Choose how you want to engage with the NextPhoton community
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {channels.map((channel, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <a
                  href={channel.link}
                  className="block p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <channel.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                        {channel.title}
                      </h3>
                      <p className="text-white/70 mb-2">{channel.description}</p>
                      <p className="text-sm text-primary">{channel.stats}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-primary transition-colors mt-1" />
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Discussions */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Hot Discussions</h2>
              <a
                href="#forums"
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
              >
                View All Forums
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </ScrollReveal>

          <div className="space-y-4 max-w-4xl">
            {featuredDiscussions.map((discussion, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
                          {discussion.category}
                        </span>
                        <span className="text-white/50 text-sm">{discussion.time}</span>
                      </div>
                      <h3 className="text-lg font-medium text-white hover:text-primary transition-colors">
                        {discussion.title}
                      </h3>
                      <p className="text-sm text-white/50 mt-1">by {discussion.author}</p>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-white/50" />
                        <span className="text-white/70">{discussion.replies}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-white/50" />
                        <span className="text-white/70">{discussion.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mt-8">
              <button className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors">
                Join the Discussion
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Upcoming Events</span>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Learn and Connect
              </h2>
              <p className="text-lg text-white/70">
                Join our webinars, workshops, and virtual events
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {upcomingEvents.map((event, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{event.date.split(' ')[1]}</div>
                        <div className="text-xs text-white/50 uppercase">{event.date.split(' ')[0]}</div>
                      </div>
                      <div className="h-12 w-0.5 bg-white/10" />
                      <div>
                        <p className="text-sm text-white/70">{event.time}</p>
                        <p className="text-xs text-primary">{event.type}</p>
                      </div>
                    </div>
                    <Video className="w-5 h-5 text-white/30" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-white/70 mb-4">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees} registered</span>
                    </div>
                    <button className="text-primary hover:text-primary/80 font-medium text-sm transition-colors">
                      Register →
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mt-8">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                View All Events
                <Calendar className="w-4 h-4" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Community Champions */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Community Champions</span>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Our Top Contributors
              </h2>
              <p className="text-lg text-white/70">
                Recognizing members who make our community special
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {champions.map((champion, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
                  <div className="text-4xl mb-4">{champion.badge}</div>
                  <h3 className="font-semibold text-white mb-1">{champion.name}</h3>
                  <p className="text-sm text-primary mb-1">{champion.role}</p>
                  <p className="text-xs text-white/50 mb-3">{champion.institution}</p>
                  <div className="px-3 py-1 rounded-full bg-primary/10 inline-flex items-center gap-1">
                    <Heart className="w-3 h-3 text-primary" />
                    <span className="text-xs text-primary">{champion.contributions} contributions</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Community */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-4">
                      <Github className="w-5 h-5 text-white" />
                      <span className="text-sm font-medium text-white">Developer Community</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Build with NextPhoton
                    </h3>
                    <p className="text-white/70 mb-6">
                      Join our open-source community and help shape the future of education technology. 
                      Contribute code, create integrations, or build amazing things with our APIs.
                    </p>
                    
                    <div className="flex gap-4">
                      <a
                        href="#"
                        className="px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20"
                      >
                        View GitHub
                      </a>
                      <a
                        href="/resources/documentation"
                        className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
                      >
                        API Docs
                      </a>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">50+</div>
                      <p className="text-sm text-white/70">Contributors</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">1.2K</div>
                      <p className="text-sm text-white/70">GitHub Stars</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">25+</div>
                      <p className="text-sm text-white/70">Integrations</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">100+</div>
                      <p className="text-sm text-white/70">PRs Merged</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Social Channels */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Follow Us
              </h2>
              <p className="text-lg text-white/70">
                Stay updated with the latest news and updates
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {socialChannels.map((channel, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <a
                  href={channel.link}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center hover:bg-white/10 transition-all duration-300 group"
                >
                  <channel.icon className="w-8 h-8 text-white mx-auto mb-3 group-hover:text-primary transition-colors" />
                  <p className="font-medium text-white mb-1">{channel.label}</p>
                  <p className="text-sm text-white/50">{channel.followers} followers</p>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Be Part of Something Special
              </h2>
              <p className="text-lg text-white/70 mb-8">
                Join thousands of educators who are transforming education together
              </p>
              <button className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors">
                Join Community
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}