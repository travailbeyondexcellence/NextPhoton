/**
 * Blog page for NextPhoton
 * Educational insights, product updates, and industry news
 */

"use client";

import { useState } from "react";
import { PageLayout } from "@/components/landing/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Calendar,
  Clock,
  User,
  Tag,
  Search,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Megaphone,
  Filter,
  ArrowRight,
  Heart,
  MessageCircle,
  Share2
} from "lucide-react";

// Blog categories
const categories = [
  { name: "All", count: 24 },
  { name: "Product Updates", count: 8 },
  { name: "Education Insights", count: 10 },
  { name: "Success Stories", count: 4 },
  { name: "Industry News", count: 2 },
];

// Featured posts
const featuredPost = {
  id: 1,
  title: "Revolutionizing Education Management: The NextPhoton Approach",
  excerpt: "Discover how NextPhoton is transforming the way educational institutions manage their operations, from student monitoring to guardian engagement.",
  category: "Education Insights",
  author: "Sarah Chen",
  authorRole: "CEO & Co-founder",
  date: "December 15, 2024",
  readTime: "8 min read",
  image: "/api/placeholder/800/400",
  tags: ["Education Technology", "Innovation", "Platform"],
};

// Blog posts
const blogPosts = [
  {
    id: 2,
    title: "New Feature: Advanced Analytics Dashboard",
    excerpt: "We're excited to introduce our new analytics dashboard that provides deeper insights into student performance and engagement.",
    category: "Product Updates",
    author: "Mike Rodriguez",
    date: "December 10, 2024",
    readTime: "5 min read",
    tags: ["Product", "Analytics"],
  },
  {
    id: 3,
    title: "The Future of Personalized Learning",
    excerpt: "Exploring how AI and data analytics are shaping the future of education and enabling truly personalized learning experiences.",
    category: "Education Insights",
    author: "Dr. Priya Sharma",
    date: "December 5, 2024",
    readTime: "10 min read",
    tags: ["AI", "Personalization"],
  },
  {
    id: 4,
    title: "Success Story: Elite Academy's Digital Transformation",
    excerpt: "How Elite Academy increased student engagement by 40% and streamlined operations using NextPhoton.",
    category: "Success Stories",
    author: "Jennifer Lee",
    date: "November 28, 2024",
    readTime: "6 min read",
    tags: ["Case Study", "Success"],
  },
  {
    id: 5,
    title: "Guardian Engagement: Building Stronger Connections",
    excerpt: "Tips and strategies for educational institutions to improve guardian involvement and communication.",
    category: "Education Insights",
    author: "David Kumar",
    date: "November 20, 2024",
    readTime: "7 min read",
    tags: ["Guardian", "Engagement"],
  },
  {
    id: 6,
    title: "Mobile Learning: Education on the Go",
    excerpt: "The rise of mobile learning and how NextPhoton's mobile app is making education accessible anywhere, anytime.",
    category: "Product Updates",
    author: "Alex Thompson",
    date: "November 15, 2024",
    readTime: "5 min read",
    tags: ["Mobile", "Accessibility"],
  },
  {
    id: 7,
    title: "Industry Report: EdTech Trends 2025",
    excerpt: "Our comprehensive analysis of emerging trends in educational technology and what they mean for institutions.",
    category: "Industry News",
    author: "Research Team",
    date: "November 10, 2024",
    readTime: "12 min read",
    tags: ["Trends", "Research"],
  },
];

// Popular tags
const popularTags = [
  "Education Technology",
  "Product Updates",
  "Best Practices",
  "Student Success",
  "Analytics",
  "Mobile Learning",
  "AI in Education",
  "Guardian Engagement",
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageLayout
      title="NextPhoton Blog"
      subtitle="Insights, updates, and stories from the world of education technology"
    >
      {/* Search and Filter Section */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-white/50 focus:border-primary focus:outline-none"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-4">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category.name
                      ? 'bg-primary text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-5xl mx-auto">
              <div className="rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                <div className="grid lg:grid-cols-2 gap-8 p-8">
                  <div className="order-2 lg:order-1">
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary">
                        {featuredPost.category}
                      </span>
                      <span className="text-white/50 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </span>
                      <span className="text-white/50 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>

                    <p className="text-white/70 mb-6">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary" />
                        <div>
                          <p className="font-medium text-white">{featuredPost.author}</p>
                          <p className="text-sm text-white/50">{featuredPost.authorRole}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                        <span className="font-medium">Read More</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="order-1 lg:order-2">
                    <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredPosts.map((post, index) => (
              <ScrollReveal key={post.id} delay={index * 0.1}>
                <div className="h-full rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10" />
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3 text-sm">
                      <span className="px-2 py-1 rounded-full bg-white/10 text-white/70">
                        {post.category}
                      </span>
                      <span className="text-white/50 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-white/70 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
                        <div>
                          <p className="text-sm font-medium text-white">{post.author}</p>
                          <p className="text-xs text-white/50">{post.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-white/50">
                        <Heart className="w-4 h-4 hover:text-red-500 cursor-pointer transition-colors" />
                        <MessageCircle className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
                        <Share2 className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Load More */}
          <ScrollReveal>
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20">
                Load More Articles
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Sidebar Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Newsletter Signup */}
            <ScrollReveal>
              <div className="lg:col-span-2 p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Megaphone className="w-8 h-8 text-primary" />
                  <h3 className="text-2xl font-bold text-white">Stay Updated</h3>
                </div>
                <p className="text-white/70 mb-6">
                  Get the latest insights and updates delivered to your inbox weekly
                </p>
                <form className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </ScrollReveal>

            {/* Popular Tags */}
            <ScrollReveal delay={0.1}>
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Tag className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold text-white">Popular Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white/10 text-sm text-white/70 hover:bg-white/20 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/10">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Have a Story to Share?
              </h2>
              <p className="text-lg text-white/70 mb-8">
                We're always looking for guest contributors to share their insights and experiences
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Submit Your Article
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}