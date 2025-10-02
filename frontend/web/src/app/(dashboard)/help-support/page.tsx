"use client"

import { HelpCircle, Book, MessageCircle, Mail, Phone, FileText, ExternalLink } from "lucide-react"

export default function HelpSupportPage() {
  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <HelpCircle className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
            <p className="text-muted-foreground">Get assistance and find answers to your questions</p>
          </div>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Documentation Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <Book className="h-6 w-6 text-primary" />
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Documentation</h3>
          <p className="text-sm text-muted-foreground">Browse comprehensive guides and tutorials</p>
        </div>

        {/* FAQs Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <FileText className="h-6 w-6 text-primary" />
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">FAQs</h3>
          <p className="text-sm text-muted-foreground">Find answers to frequently asked questions</p>
        </div>

        {/* Contact Support Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <MessageCircle className="h-6 w-6 text-primary" />
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Contact Support</h3>
          <p className="text-sm text-muted-foreground">Get in touch with our support team</p>
        </div>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Methods */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4">Contact Methods</h2>
          <div className="space-y-4">
            {/* Email Support */}
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">support@nextphoton.com</p>
                <p className="text-xs text-muted-foreground mt-1">Response time: 24-48 hours</p>
              </div>
            </div>

            {/* Phone Support */}
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-muted-foreground">+91-1234567890</p>
                <p className="text-xs text-muted-foreground mt-1">Mon-Fri: 9:00 AM - 6:00 PM IST</p>
              </div>
            </div>

            {/* Live Chat */}
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Live Chat</p>
                <p className="text-sm text-muted-foreground">Chat with our support team</p>
                <p className="text-xs text-muted-foreground mt-1">Available: 9:00 AM - 9:00 PM IST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Topics */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4">Popular Help Topics</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <p className="font-medium text-sm">Getting Started with NextPhoton</p>
            </button>
            <button className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <p className="font-medium text-sm">Account and Profile Management</p>
            </button>
            <button className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <p className="font-medium text-sm">Course Creation and Management</p>
            </button>
            <button className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <p className="font-medium text-sm">Payment and Billing Issues</p>
            </button>
            <button className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <p className="font-medium text-sm">Technical Troubleshooting</p>
            </button>
            <button className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <p className="font-medium text-sm">Student Progress Tracking</p>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Support */}
      <div className="mt-6 bg-primary/10 backdrop-blur-sm rounded-lg p-6 border border-primary/20">
        <h3 className="text-lg font-semibold mb-2">Need Urgent Help?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          For urgent technical issues or emergencies, please call our priority support line.
        </p>
        <div className="flex items-center gap-4">
          <Phone className="h-5 w-5 text-primary" />
          <span className="font-medium">Priority Support: +91-9876543210</span>
        </div>
      </div>
    </div>
  )
}