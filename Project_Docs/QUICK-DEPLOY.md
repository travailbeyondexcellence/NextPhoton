# 🚀 Quick Deployment to Vercel (Mock Data Only)

**5-Minute Deployment Guide**

---

## ✅ Pre-Flight Checklist

Before deploying, ensure:
- [ ] Code is committed to Git
- [ ] You have a Vercel account
- [ ] Repository is pushed to GitHub/GitLab

---

## 🎯 Quick Deploy Steps

### **1. Test Build Locally (2 minutes)**

```bash
# Navigate to frontend
cd frontend/web

# Build the project
bun run build

# If successful, you'll see: ✓ Compiled successfully
```

**If build fails**, see [DEPLOYMENT-VERCEL.md](./DEPLOYMENT-VERCEL.md) troubleshooting section.

---

### **2. Push Code to Git (1 minute)**

```bash
# From project root
git add .
git commit -m "Deploy frontend to Vercel with mock data"
git push origin Marsha/Deployment
```

---

### **3. Deploy to Vercel (2 minutes)**

#### **Option A: Vercel Dashboard** (Easiest)

1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. **Import** your Git repository
4. Configure:
   - **Root Directory:** `frontend/web`
   - **Framework:** Next.js (auto-detected)
   - **Build Command:** Leave default or use `bun run build`
   - **Environment Variables:** None needed!
5. Click **"Deploy"**
6. Wait 2-3 minutes ⏳
7. Done! 🎉 You'll get a URL like: `https://your-app.vercel.app`

#### **Option B: Vercel CLI** (Fastest)

```bash
# Install Vercel CLI
bun install -g vercel

# Navigate to frontend
cd frontend/web

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

---

## ✅ Verify Deployment

Visit your Vercel URL and test:

1. **Homepage** - `/`
2. **Sign In** - `/sign-in`
3. **Dashboard** - `/admin/educators` (check mock data loads)
4. **API** - Visit `https://your-app.vercel.app/api/announcements`

---

## 🎉 Success!

Your app is now live at: `https://your-app.vercel.app`

**What's Working:**
- ✅ All pages and routes
- ✅ Mock data (JSON files)
- ✅ GraphQL with local resolvers
- ✅ Theme switching
- ✅ Responsive design

**What's NOT Connected:**
- ❌ Database (using mock data instead)
- ❌ Backend API (using local API routes)
- ❌ Real authentication (simulated)

---

## 🔄 Future Updates

Every push to your branch automatically redeploys:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push

# Vercel auto-deploys! 🚀
```

---

## 📚 Need More Help?

See detailed guide: [DEPLOYMENT-VERCEL.md](./DEPLOYMENT-VERCEL.md)

---

## 🐛 Quick Troubleshooting

**Build fails with Prisma error:**
- Already fixed in `frontend/web/src/lib/prisma.ts` ✅

**Environment variable error:**
- Already configured in `vercel.json` ✅

**Mock data not loading:**
- Check files exist in `frontend/web/src/mockData/`

**Other issues:**
- Check Vercel build logs in dashboard
- See [DEPLOYMENT-VERCEL.md](./DEPLOYMENT-VERCEL.md) troubleshooting

---

**That's it! Deploy in 5 minutes! 🚀**
