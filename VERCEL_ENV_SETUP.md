# 🚀 VERCEL ENVIRONMENT VARIABLES - QUICK SETUP GUIDE

## THE PROBLEM

Your site isn't appearing in Google search for "mietaaf" because the critical environment variable `NEXT_PUBLIC_SITE_URL` is not set in Vercel Production.

This causes:

- ❌ Sitemap to use wrong domain (vercel-app.vercel.app instead of www.mietaaf.com)
- ❌ Canonical URLs pointing to wrong domain
- ❌ Open Graph URLs pointing to wrong domain
- ❌ Google indexes the Vercel URL, not your real domain

---

## SOLUTION: Set Environment Variables in Vercel

### Step 1: Go to Vercel Project Settings

```
1. Open https://vercel.com/dashboard
2. Click your "Mietaaf" project
3. Click "Settings" tab (top navigation)
4. Click "Environment Variables" (left sidebar)
```

### Step 2: Add NEXT_PUBLIC_SITE_URL (CRITICAL) 🔴

**DO THIS IMMEDIATELY:**

| Field            | Value                     |
| ---------------- | ------------------------- |
| **Name**         | `NEXT_PUBLIC_SITE_URL`    |
| **Value**        | `https://www.mietaaf.com` |
| **Environments** | ✅ Production             |
|                  | ☐ Preview                 |
|                  | ☐ Development             |

**Steps:**

1. Click **"Add New..."** button
2. In the "Name" field, type: `NEXT_PUBLIC_SITE_URL`
3. In the "Value" field, type: `https://www.mietaaf.com`
4. Under "Environment," select **Production ONLY** (uncheck Preview & Development)
5. Click **"Save"**

**⚠️ IMPORTANT**:

- Do NOT include trailing slash
- Use `www.mietaaf.com` (not just `mietaaf.com`)
- Production environment only (Preview should stay different)

---

### Step 3: Add Google Site Verification

| Field            | Value                                  |
| ---------------- | -------------------------------------- |
| **Name**         | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` |
| **Value**        | (See Step 3 below)                     |
| **Environments** | ✅ Production                          |

**Steps:**

1. Go to Google Search Console: https://search.google.com/search-console/welcome
2. Select your property (www.mietaaf.com)
3. Go to **Settings → Verification**
4. Click the **HTML tag** button/option
5. You'll see: `<meta name="google-site-verification" content="XXXXX...XXXXX">`
6. Copy ONLY the content value (the long string between quotes, no <meta> tag)
7. Return to Vercel Environment Variables
8. Click **"Add New..."**
9. Name: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
10. Value: (paste the content value from step 6)
11. Environments: **Production ONLY**
12. Click **"Save"**

**Example:**

```
If Google gives you:
<meta name="google-site-verification" content="q7x8p9z1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7">

Copy ONLY: q7x8p9z1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7
```

---

### Step 4: Add Google Analytics ID (RECOMMENDED)

| Field            | Value               |
| ---------------- | ------------------- |
| **Name**         | `NEXT_PUBLIC_GA_ID` |
| **Value**        | (See below)         |
| **Environments** | ✅ Production       |

**Steps:**

1. Go to Google Analytics 4: https://analytics.google.com/
2. Select your Mietaaf property
3. Go to **Admin → Data Streams → Web**
4. Find "Measurement ID" (looks like: `G-XXXXXXXXXX`)
5. Copy it
6. Return to Vercel Environment Variables
7. Click **"Add New..."**
8. Name: `NEXT_PUBLIC_GA_ID`
9. Value: (paste your Measurement ID, e.g., `G-XXXXXXXXXX`)
10. Environments: **Production ONLY**
11. Click **"Save"**

---

### Step 5: Review Your Environment Variables

After adding all three, your Vercel Environment Variables should look like:

```
Production Environment:
├── NEXT_PUBLIC_SITE_URL              → https://www.mietaaf.com
├── NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION → q7x8p9z1a2b3c4d5...
├── NEXT_PUBLIC_GA_ID                 → G-XXXXXXXXXX
├── NEXT_PUBLIC_FIREBASE_API_KEY      → (existing)
├── NEXT_PUBLIC_FIREBASE_PROJECT_ID   → (existing)
└── ... other Firebase/Email variables
```

---

## STEP 6: Trigger a Redeployment ⚡

After adding environment variables, you MUST redeploy for changes to take effect:

### Option A: Deploy via Vercel Dashboard (EASIEST)

1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest commit
3. Select **"Redeploy"** when prompted
4. Wait for deployment to complete (usually 2-5 minutes)
5. Check the build logs for any errors

### Option B: Deploy via Git Push

```powershell
# If you have this repo cloned locally:
git push origin main

# Vercel automatically triggers a deploy when you push to main
```

### Monitor the Deployment

1. Click the **"Deployments"** tab
2. Watch the latest deployment
3. When status is "✅ Ready", your changes are live
4. Usually takes 2-5 minutes

---

## STEP 7: Verify the Fix ✅

**Wait 5-10 minutes after deployment completes**, then verify:

### Quick Check (via Browser):

1. Open https://www.mietaaf.com in your browser
2. Right-click → **Inspect** (or press F12)
3. Go to **Network** tab
4. Refresh the page
5. Look for the main document request
6. Click it, go to **Response** or **Preview** tab
7. Look for these lines:
   ```html
   <link rel="canonical" href="https://www.mietaaf.com/" />
   <meta property="og:url" content="https://www.mietaaf.com" />
   <meta name="google-site-verification" content="q7x8p9z1a2b3c4d5..." />
   ```

✅ If they show `www.mietaaf.com`, the fix worked!
❌ If they still show `vercel-*.app`, the deployment didn't include the changes.

### Full Verification:

Run the PowerShell script:

```powershell
# Navigate to your project folder
cd "d:\Mietaaf Website Main"

# Run the verification script
.\verify-seo.ps1
```

All checks should show ✅

---

## STEP 8: Update Google Search Console

After deployment is verified:

1. Go to **Google Search Console**: https://search.google.com/search-console
2. Select your property: `www.mietaaf.com`
3. Go to **Sitemaps** (left menu)
4. Click **"Add/test sitemap"**
5. Enter: `sitemap.xml`
6. Click **"Submit"**
7. Status should show "✅ Success" (or "Processed")

---

## TROUBLESHOOTING

### Issue: Still seeing Vercel domain in meta tags

**Solution**:

- Deployment might not be complete
- Check Deployments tab - wait if still building
- Hard refresh browser (Ctrl+Shift+R)
- Check 15 minutes, not just 5

### Issue: Build failed error

**Solution**:

- Check build logs for errors
- Usually not related to environment variables
- Contact Vercel support if needed

### Issue: Google Search Console verification fails

**Solution**:

- Make sure `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is exactly correct
- Verify it matches GSC's HTML tag content
- Redeploy if you just added it
- Wait 24 hours for GSC to re-verify

### Issue: Sitemap returns 404

**Solution**:

- Your Vercel deployment might have failed
- Check Deployments → Latest deployment status
- Should show ✅ Ready
- If not, redeploy manually

---

## TIMELINE TO SEE RESULTS

| Time          | Expected Status                    |
| ------------- | ---------------------------------- |
| **5-10 min**  | Deployment complete, fix verified  |
| **24 hours**  | Google crawls new sitemap          |
| **2-4 weeks** | Pages appear in Google Search      |
| **4-8 weeks** | Good ranking for "mietaaf" keyword |

---

## QUICK CHECKLIST

- [ ] Set `NEXT_PUBLIC_SITE_URL = https://www.mietaaf.com` in Vercel Production
- [ ] Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` from Google Search Console
- [ ] Set `NEXT_PUBLIC_GA_ID` from Google Analytics
- [ ] Redeploy the project
- [ ] Wait 5-10 minutes
- [ ] Verify meta tags show www.mietaaf.com
- [ ] Run `.\verify-seo.ps1` script
- [ ] Submit sitemap in Google Search Console
- [ ] Monitor GSC for indexing progress

---

## NEED HELP?

If you're stuck on any step:

1. Check the screenshots in Vercel docs: https://vercel.com/docs/projects/environment-variables
2. Verify your domain in Google Search Console: https://support.google.com/webmasters/answer/9008080
3. Check Next.js SEO guide: https://nextjs.org/learn/seo

---

**STATUS**: ⚠️ AWAITING CONFIGURATION  
**ESTIMATED FIX TIME**: 10-15 minutes  
**EXPECTED RESULTS**: Site indexing within 2-4 weeks
