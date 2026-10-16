# 🔍 GOOGLE SEARCH CONSOLE COMPLETE SETUP GUIDE

> For the current Mietaaf Couture configuration and rollout, start with [SEO_LAUNCH_CHECKLIST.md](SEO_LAUNCH_CHECKLIST.md). This older walkthrough can help with account setup, but its environment assumptions, page counts and timing estimates may be outdated. Search Console manages and measures search visibility; it does not guarantee indexing or ranking. GA4 is optional.

## Overview

Google Search Console (GSC) is where Google tells you about your site's presence in search results. It's critical for:

- Verifying site ownership
- Submitting sitemap
- Monitoring indexing status
- Checking for crawl errors
- Viewing search impressions and rankings

---

## PART 1: VERIFY YOUR DOMAIN

### Step 1: Access Google Search Console

1. Go to: https://search.google.com/search-console/welcome
2. Sign in with your Google Account (preferably business/owner account)
3. Click **"Add property"** (top left)

### Step 2: Choose Verification Method

You'll see two options:

```
┌─────────────────────────────────────────────┐
│ (Recommended) Property type: Domain        │
│ ✓ Covers: www.mietaaf.com + mietaaf.com   │
│ ✓ Fast setup with DNS verification         │
│ ✓ Works across subdomains                  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Alternative: URL prefix                     │
│ Covers only: https://www.mietaaf.com      │
│ Slower: HTML meta tag verification         │
└─────────────────────────────────────────────┘
```

**SELECT**: Domain (Recommended)

### Step 3: Domain Verification Setup

1. In GSC, enter your domain: `mietaaf.com` (without www or https)
2. Click **"Continue"**
3. Choose **DNS verification method** (most reliable)
4. You'll see instructions:

   ```
   Verify ownership by adding this TXT record:

   Name: mietaaf.com
   Type: TXT
   Value: google-site-verification=q7x8p9z1a2b3c4d5e6f7g8h9i0j1k2l3
   ```

### Step 4: Add DNS Record to Domain Registrar

**Your domain registrar** (where you bought mietaaf.com):

1. Go to your domain registrar's dashboard (GoDaddy, Namecheap, Route53, etc.)
2. Find **DNS Settings** or **DNS Records** section
3. Click **Add Record** or **Add DNS Entry**
4. Fill in:
   - **Type**: TXT
   - **Name/Host**: @ (or mietaaf.com - varies by registrar)
   - **Value**: `google-site-verification=q7x8p9z1a2b3c4d5e6f7g8h9i0j1k2l3` (from GSC)
   - **TTL**: 3600 (or default)
5. **Save/Add**
6. DNS can take 5-48 hours to propagate (usually 15-30 min)

### Step 5: Verify in GSC

1. Return to Google Search Console tab
2. Click **"Verify"** button
3. GSC will check for the DNS record
4. When successful, you'll see: ✅ **Verification successful**

**Status**: Your domain is now verified and GSC recognizes ownership

---

## PART 2: SUBMIT SITEMAP

### Step 1: Go to Sitemaps Section

1. In GSC, go to **Sitemaps** (left sidebar menu)
2. You'll see an empty list initially

### Step 2: Submit Your Sitemap

1. Click **"Add/test sitemap"** (top right button)
2. In the field that appears, type: `sitemap.xml`
3. Click **"Submit"** (or "Test")

**Result**: GSC starts processing your sitemap

### What Happens Next

- **Immediately**: GSC queues the sitemap for processing
- **5-30 minutes**: Shows "Pending" status
- **30 minutes - 2 hours**: Shows "Success" or "Processed"
- **Behind the scenes**: Google crawls all URLs in your sitemap

### View Sitemap Status

1. Go to **Sitemaps** in GSC
2. You should see:

   ```
   sitemap.xml
   Status: ✅ Processed

   Submitted: [date]
   Indexed: [count]
   Errors: [count]
   Warnings: [count]
   ```

**Good**: Processed ✅  
**Better**: Processed + Indexed > 0  
**Best**: Processed + all green ✅

---

## PART 3: MONITOR INDEXING COVERAGE

### Step 1: Go to Coverage Report

1. In GSC, click **"Coverage"** (left menu)
2. You'll see a graph with different categories:
   - **Valid** (✅ Green) - Pages successfully indexed
   - **Valid with warnings** (🟨 Yellow) - Indexed but with issues
   - **Excluded** (⚪ Gray) - Not indexed (intentional)
   - **Error** (🔴 Red) - Failed to index

### Step 2: Interpret Your Data

**Expected Timeline**:

```
Day 1: Most pages show "Excluded" (not crawled yet)
       ↓
Day 2-3: "Valid" count increases as Google crawls
         Some "Excluded" remain (expected)
       ↓
Week 1: 50-80% should be "Valid"
       ↓
Week 2-4: 80-95% should be "Valid"
```

### What to Monitor

1. **Valid** count should increase daily for first 2 weeks
2. **Error** count should stay at 0 (or very low)
3. **Warnings** are OK (usually Mobile usability, etc.)

### If You See Errors

Click on **"Error"** tab and:

1. See error details
2. Common errors:
   - "404 Not found" - Page deleted or URL wrong
   - "Redirect error" - Chain of redirects
   - "Server error (5xx)" - Website down

**Fix**: Address the error on your site, then request re-indexing

---

## PART 4: REQUEST INDEXING FOR KEY PAGES

### For Homepage (Priority 1)

1. In GSC, click **"URL Inspection"** (top search bar)
2. Enter: `https://www.mietaaf.com`
3. Review the report
4. Click **"Request indexing"** (if available)
5. Google will re-crawl this URL

### For Other Important Pages (Priority 2)

Repeat for:

- `/shop`
- `/lookbook`
- `/about`
- Your newest products

**Impact**: These pages get crawled/indexed within 24-48 hours instead of waiting for sitemap crawl

---

## PART 5: MONITOR PERFORMANCE

### Check Search Performance

1. Click **"Performance"** (left menu)
2. You'll see a graph with metrics:
   - **Total clicks** - People clicked your link in search
   - **Total impressions** - People saw your site in search results
   - **Average CTR** - Percentage that clicked (click-through rate)
   - **Average position** - Your ranking position (1 = first)

### Expected Timeline

```
Week 1-2: 0 impressions (site not yet ranking)
Week 2-3: 1-10 impressions (appearing for brand name)
Week 3-4: 10-50 impressions (expanding keywords)
Week 4+: 50+ impressions (growing reach)
```

**Example for "mietaaf" search**:

- Week 1: Not in top 100
- Week 2-3: Might appear on page 2-3
- Week 3-4: Should be on page 1
- Week 4+: Top 3 positions

---

## PART 6: CHECK FOR CRAWL ERRORS

### Go to Crawl Stats (Optional but Useful)

1. Click **"Settings"** (left menu)
2. Click **"Crawl statistics"**
3. You'll see:
   - **Crawl requests/day** - How many times Google crawls
   - **Response time** - How fast pages load
   - **Robots.txt fetched** - Google checks permissions

**Good signs**:

- ✅ Requests increasing (shows Google is crawling more)
- ✅ Response time < 1 second
- ✅ No 404s or 500s

---

## QUICK REFERENCE: TIMELINES

| Action                    | When      | Status                  |
| ------------------------- | --------- | ----------------------- |
| Add domain to GSC         | TODAY     | Domain added            |
| Verify DNS                | 24-48 hrs | ✅ Verified             |
| Submit sitemap            | TODAY     | Submitted               |
| GSC processes sitemap     | 1-2 hrs   | ✅ Processed            |
| Google crawls pages       | 24-48 hrs | Started                 |
| Pages appear in index     | 1-2 weeks | 50-80% indexed          |
| Search impressions appear | 1-2 weeks | First impressions       |
| Mietaaf ranks #1          | 2-4 weeks | Possible for brand name |
| Long-tail keywords rank   | 4-8 weeks | Growing organic traffic |

---

## COMMON GSC MESSAGES & FIXES

| Message                           | Meaning                                  | Fix                      |
| --------------------------------- | ---------------------------------------- | ------------------------ |
| "Submitted and crawled - indexed" | ✅ Great! Page is indexed                | None needed              |
| "Submitted but not indexed"       | ⚠️ Google found page but won't index     | Check for no-index tags  |
| "Discovered but not indexed"      | ⚠️ Google found via link but won't index | Usually temporary        |
| "Crawled but not indexed"         | ⚠️ Google crawled but refused to index   | Check for quality issues |
| "404 Not found"                   | ❌ Page doesn't exist                    | Fix the URL or remove    |
| "Blocked by robots.txt"           | ❌ robots.txt forbids crawling           | Update robots.txt        |

---

## TROUBLESHOOTING

### GSC Says "URL Not Crawled"

**Possible Causes**:

1. Domain verification incomplete
2. Sitemap not submitted
3. Robots.txt blocking crawlers
4. DNS verification failed

**Fix**:

- Verify DNS record was added correctly
- Wait 24-48 hours for DNS to propagate
- Resubmit sitemap
- Check robots.txt doesn't have `Disallow: /`

### GSC Shows Errors

1. Click on error
2. Read the error description
3. Fix it on your website
4. Click **"Request validation"** in GSC

### Still Not Ranking After 4 Weeks

Possible issues:

1. Site content too thin (write more unique content)
2. No backlinks (other sites linking to you)
3. Low quality score (improve content/UX)
4. Too new site (give it more time)
5. Manual penalty (unlikely if you followed setup)

---

## NEXT STEPS AFTER SETUP

### Week 1

- [ ] Domain verified in GSC
- [ ] Sitemap submitted
- [ ] Homepage indexed (should show in Coverage)
- [ ] No errors in Coverage report

### Week 2

- [ ] 50%+ of pages indexed
- [ ] Request indexing for key product pages
- [ ] Check Performance tab (early impressions)
- [ ] Monitor for crawl errors

### Week 3-4

- [ ] 80%+ of pages indexed
- [ ] Impressions for "mietaaf" appear
- [ ] Monitor position (should be page 1 or rising)
- [ ] Create content for high-value keywords

### Month 2

- [ ] Monitor rankings and traffic
- [ ] Fix any low-performing pages
- [ ] Create content for new keywords
- [ ] Build backlinks (get other sites to link to you)

---

## HELPFUL RESOURCES

- GSC Help Center: https://support.google.com/webmasters
- Verify site ownership: https://support.google.com/webmasters/answer/9008080
- Understand Coverage: https://support.google.com/webmasters/answer/7440203
- Sitemaps guide: https://support.google.com/webmasters/answer/183668

---

## STATUS CHECKLIST

- [ ] Domain added to GSC
- [ ] DNS verification completed
- [ ] Sitemap submitted
- [ ] Homepage appearing in Coverage
- [ ] No critical errors
- [ ] Monitoring Performance tab
- [ ] Waiting for impressions (2-4 weeks normal)

**Next check**: In 1 week, verify 50%+ pages are indexed
