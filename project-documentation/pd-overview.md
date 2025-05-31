# NextPhoton EduCare Management System - Project Overview

## Project Vision
NextPhoton is an "Uber for Educators" - a comprehensive platform that connects students with educators for personalized one-on-one and small batch tutoring, with a unique focus on **outside-classroom monitoring and micromanagement** of student progress.

## Core Mission
Unlike competitors who focus solely on content delivery, NextPhoton solves the **micro-details** of learning challenges through:
- **80-90% focus on outside-classroom activities**
- **Day-to-day student monitoring**
- **Personalized approach** for different skill levels (expert, intermediate, below-average)
- **EduCare Manager (ECM) driven support system**

## Target Market
- **Primary**: B2C (Direct to families and students)
- **Secondary**: B2B (Schools and coaching centers - selling animations, video resources, curriculum, exam portals)
- **Geographic Scope**: Starting in India, expanding globally

## Unique Value Proposition
1. **Micromanagement Focus**: Day-to-day monitoring vs competitors' information delivery
2. **Human-Centric**: ECMs provide personalized guidance and progress tracking
3. **Curriculum Control**: Strict, time-allocated curriculum provided by platform
4. **Multi-Modal Learning**: Both online and offline tutoring modes
5. **Comprehensive Ecosystem**: Educators + EduCares working together

## Key Stakeholders

### Primary Users
- **Learners**: K-12, College, Adult learners seeking personalized education
- **Guardians**: Parents/family members who book sessions, monitor progress, make payments
- **Educators**: Independent tutors who set rates (pending approval) and follow platform curriculum

### Platform Team
- **EduCare Managers (ECMs)**: Core role - student progress monitoring, guardian communication, task assignment
- **Employees**: HR executives/managers, Content creators, Platform admins
- **Interns**: Student educator interns, Video editor interns, Content creator interns, HR interns
- **Admins**: Platform owners who manage system permissions and operations

## Business Model
- **Revenue Source**: Commission from educator payments (e.g., ₹1,200 parent payment → ₹300-400 educator fee → ₹700-900 platform profit)
- **Payment Methods**: 
  - Hourly educator rates
  - Complete course packages (with intelligent educator allocation algorithms)
- **ECM Compensation**: Hourly-based payment model
- **Expense Categories**: Educator fees, ECM salaries, rent, cloud infrastructure, subscriptions

## Technology Stack
- **Frontend**: Next.js 15 (Web), Flutter (Mobile)
- **Backend**: NestJS with Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better-auth with ABAC (Attribute-Based Access Control)
- **Architecture**: Turbo-managed monorepo with multi-tenant support
- **Video**: Custom solution → Google Meet → Zoom (fallback hierarchy)
- **Payments**: UPI → Razorpay → Paytm (India), Stripe → PayPal (International)

## Core Features
1. **Session Management**: Dual approval system (Educator availability + ECM approval)
2. **Progress Tracking**: Comprehensive monitoring of homework, attendance, performance
3. **Task Assignment**: Pre-built and custom task library
4. **Curriculum Management**: Exam-specific curriculum with difficulty levels (Beginner, Intermediate, Advanced)
5. **Real-time Communication**: Live video sessions, chat, instant notifications
6. **File Management**: Google Drive integration for qualifications and documents
7. **Analytics**: Comprehensive business intelligence and decision-making tools

## Success Metrics
- **For Students**: Improved exam performance, better study habits, increased engagement
- **For Guardians**: Transparency in progress, efficient communication, value for money
- **For Educators**: Steady income, professional growth, platform support
- **For Platform**: Revenue growth, user retention, operational efficiency, market expansion

This platform represents a paradigm shift from information delivery to **comprehensive educational support ecosystem** focused on individual student success through personalized monitoring and guidance.