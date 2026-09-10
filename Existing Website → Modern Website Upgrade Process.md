## Goal

Keep the existing domain:

**`example.com`**

But replace the old HTML/legacy website with your new modern website.

Think of it like this:

**Old domain + existing Google reputation + existing traffic → New modern website**

You are **not starting SEO from zero** as long as the migration is handled properly. Google specifically recommends mapping old URLs to their new equivalents and using permanent redirects when URLs change.

---

# Phase 1 — Get Access to Everything

- [ ] Domain registrar account
- [ ] DNS access
- [ ] Current hosting account
- [ ] Existing website files
- [ ] Google Search Console
- [ ] Google Analytics / GA4
- [ ] Google Business Profile
- [ ] Existing email configuration
- [ ] Any databases
- [ ] Existing forms/contact systems
- [ ] Current SSL certificate information

### Very important

Do **not immediately change DNS**.

First understand where everything currently points.

Example:

```text
Domain:
giovannisshrimptruck.com

Registrar:
GoDaddy / Namecheap / Cloudflare/etc.

DNS:
A Record → old server IP

Website:
Old HTML website

Email:
Google Workspace / Outlook

Analytics:
Google Analytics

Search:
Google Search Console
```

Changing the wrong DNS records can accidentally break email even if the website itself works.

---

# Phase 2 — Back Up the Existing Website

Before changing anything:

- [ ] Download all HTML files
- [ ] Download images
- [ ] Download PDFs
- [ ] Save menus
- [ ] Save logos/branding
- [ ] Export database if one exists
- [ ] Save `.htaccess`
- [ ] Save DNS records
- [ ] Screenshot important pages
- [ ] Export current URL list

Create something like:

```text
/client-backup
   /old-website
   /images
   /documents
   /database
   dns-records.txt
   old-urls.csv
```

Never destroy the old site before the new site is confirmed working.

---

# Phase 3 — Audit the Existing SEO

This is one of the most important steps.

Find out what Google already knows about the website.

### Check Google Search Console

Look at:

- [ ] Top-performing pages
- [ ] Top search queries
- [ ] Clicks
- [ ] Impressions
- [ ] Indexed URLs
- [ ] Broken URLs
- [ ] Backlinks
- [ ] Sitemap

Example:

```text
/                  ← ranks well
/menu.html         ← ranks for "shrimp kahuku"
/contact.html      ← indexed
/location.html     ← backlinks
/about.html        ← indexed
```

These URLs are valuable.

Do not casually delete them.

---

# Phase 4 — Crawl the Old Website

Create a complete list of existing URLs.

For example:

```text
https://example.com/
https://example.com/menu.html
https://example.com/about.html
https://example.com/contact.html
https://example.com/gallery.html
```

You can use tools such as:

```text
Screaming Frog
Google Search Console
Ahrefs
Semrush
Sitebulb
```

Then create a migration spreadsheet.

| Old URL | New URL | Action |
|---|---|---|
| `/` | `/` | Keep |
| `/menu.html` | `/menu` | 301 |
| `/about.html` | `/about` | 301 |
| `/contact.html` | `/contact` | 301 |
| `/gallery.html` | `/gallery` | 301 |

---

# Phase 5 — Decide What URLs You Can Preserve

The BEST scenario is:

```text
Old:
example.com/menu

New:
example.com/menu
```

Nothing changes.

That reduces migration complexity.

But sometimes the old website has URLs like:

```text
/menu.html
/about-us-old.html
/contactus.php
```

and you want:

```text
/menu
/about
/contact
```

That's fine.

You create:

```text
/menu.html
       ↓ 301
/menu
```

A permanent server-side redirect tells users and search engines that the page has moved. Google treats redirects as a strong canonicalization signal.

---

# Phase 6 — Build the New Website Separately

Do NOT build directly on the live domain.

Build somewhere like:

```text
localhost
```

or

```text
dev.example.com
```

or

```text
staging.example.com
```

or your hosting preview URL.

Example:

```text
giovannis-v2.vercel.app
```

Your production domain remains:

```text
giovannisshrimptruck.com
```

---

# Phase 7 — Protect the Staging Website

You don't want Google indexing:

```text
giovannis-v2.vercel.app
```

and then thinking it is another version of the real website.

Prefer password protection when available.

You can also use:

```html
<meta name="robots" content="noindex,nofollow">
```

Google documents `noindex` as a method for preventing pages from appearing in Google Search.

Before launch, make sure you REMOVE the `noindex`.

---

# Phase 8 — Build the New Website

Now replace the old technology.

For example:

```text
OLD

HTML
CSS
jQuery
PHP
Old hosting
```

becomes:

```text
NEW

React / Next.js
Modern CSS
APIs
Database
Analytics
SEO
CMS
Automation
```

Your stack could look like:

```text
Frontend
↓
Next.js / React

Hosting
↓
Vercel

Database
↓
Supabase / Firebase

Forms
↓
API / automation

Analytics
↓
GA4

Search
↓
Google Search Console

Automation
↓
n8n

Email / CRM
↓
Outlook / HubSpot / etc.
```

---

# Phase 9 — Reuse the Good Content

Do NOT throw away everything just because the website looks old.

There may be SEO value in:

```text
Page titles
Headings
Restaurant descriptions
History
Location information
Menu descriptions
FAQs
Images
Alt text
Internal links
Backlinks
```

Keep useful information but improve the presentation.

For example:

```text
OLD CONTENT

Giovanni's Shrimp Truck has been serving...
```

could become a beautifully designed section in the new site while keeping the underlying topic and useful information.

---

# Phase 10 — Build Proper SEO Into the New Website

Every important page should have:

- [ ] Unique `<title>`
- [ ] Meta description
- [ ] H1
- [ ] H2 structure
- [ ] Alt text
- [ ] Internal links
- [ ] Canonical URL
- [ ] Open Graph metadata
- [ ] Structured data where appropriate
- [ ] Fast images
- [ ] Mobile responsive design
- [ ] Good Core Web Vitals
- [ ] Clean URL structure

Example:

```html
<title>Giovanni's Shrimp Truck | North Shore Oahu, Hawaii</title>
```

Instead of something like:

```html
<title>Home</title>
```

---

# Phase 11 — Set Up Redirects

Before launch, make the redirect map.

Example:

```text
/menu.html
→
/menu
```

```text
/contact-us.html
→
/contact
```

```text
/our-story.html
→
/about
```

Use:

```text
301 Permanent Redirect
```

Not:

```text
old URL → homepage
```

for every page.

Each old URL should ideally redirect to the closest matching new content. Google recommends URL-to-URL mapping during migrations rather than broadly redirecting unrelated pages.

---

# Phase 12 — Set Up the New Sitemap

Your new website should generate something like:

```text
https://example.com/sitemap.xml
```

Example:

```xml
/
 /menu
 /locations
 /about
 /contact
 /faq
```

A sitemap helps search engines discover your website's URLs.

---

# Phase 13 — Configure robots.txt

Example:

```text
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

Do NOT accidentally launch with:

```text
Disallow: /
```

Otherwise search engines may be prevented from crawling the site.

---

# Phase 14 — Test Everything Before Launch

Test desktop:

- [ ] Chrome
- [ ] Edge
- [ ] Safari
- [ ] Firefox

Test mobile:

- [ ] iPhone
- [ ] Android

Test:

- [ ] Navigation
- [ ] Forms
- [ ] Phone numbers
- [ ] Email links
- [ ] Maps
- [ ] Menu
- [ ] Images
- [ ] Social links
- [ ] Analytics
- [ ] Database
- [ ] API
- [ ] Automation
- [ ] SEO titles
- [ ] Redirects
- [ ] 404 page
- [ ] SSL
- [ ] Speed

---

# Phase 15 — Prepare DNS

Now you are ready to point:

```text
example.com
```

to your new hosting.

For example:

```text
Domain
example.com

        ↓

DNS

        ↓

Vercel

        ↓

New Website
```

You normally modify website-related records such as:

```text
A
AAAA
CNAME
```

depending on your hosting provider.

### Do NOT touch these unless required:

```text
MX
TXT
SPF
DKIM
DMARC
```

Those may control the client's business email.

---

# Phase 16 — Launch

When everything is ready:

### Before

```text
example.com
      ↓
Old Server
      ↓
Old HTML Website
```

### After

```text
example.com
      ↓
DNS
      ↓
Vercel / New Hosting
      ↓
Modern Website
```

The customer still types:

```text
example.com
```

Nothing changes for them.

They just suddenly see the upgraded website.

---

# Phase 17 — Verify Production Immediately

Test:

```text
https://example.com
https://www.example.com
http://example.com
http://www.example.com
```

They should resolve correctly to your preferred HTTPS version.

Then test old URLs:

```text
example.com/menu.html
```

Should become:

```text
example.com/menu
```

Not:

```text
404 Not Found
```

---

# Phase 18 — Google Search Console

Keep the existing Search Console property.

Because the actual domain hasn't changed:

```text
example.com
→
example.com
```

you normally do **NOT** use Google's Change of Address tool.

That tool is intended for moves such as:

```text
oldsite.com
→
newsite.com
```

Google explicitly describes it as a tool for moving from one domain or subdomain to another.

Instead:

- [ ] Verify the existing Search Console property
- [ ] Submit the new sitemap
- [ ] Inspect important URLs
- [ ] Request indexing for major updated pages
- [ ] Monitor indexing
- [ ] Monitor 404s
- [ ] Monitor rankings
- [ ] Monitor clicks

Google allows site owners to request recrawling for pages that have recently changed.

---

# Phase 19 — Connect GA4

Install the client's existing GA4 measurement ID if they already have one.

Do NOT automatically create a completely new Analytics property.

Otherwise you may lose historical comparison.

You want:

```text
Old Website Analytics
      +
New Website Analytics
      ↓
Same historical reporting
```

---

# Phase 20 — Monitor After Launch

Watch especially:

```text
Day 1
Day 2
Day 3
Week 1
Week 2
Week 4
```

Monitor:

- [ ] Google Search Console
- [ ] Analytics
- [ ] 404 errors
- [ ] Redirects
- [ ] Traffic
- [ ] Ranking keywords
- [ ] Form submissions
- [ ] Page speed
- [ ] Server errors

Do not delete the old backup.

---

# The Simplified Workflow

```text
1. Get access
        ↓
2. Backup old website
        ↓
3. Audit existing SEO
        ↓
4. Crawl old URLs
        ↓
5. Build URL migration map
        ↓
6. Build new website on staging
        ↓
7. Add SEO
        ↓
8. Add analytics
        ↓
9. Configure 301 redirects
        ↓
10. Test everything
        ↓
11. Connect existing domain
        ↓
12. Submit sitemap
        ↓
13. Request reindexing
        ↓
14. Monitor rankings/errors
```

# The Important Part

You are **not doing this:**

```text
Old website
↓
Delete everything
↓
Buy new domain
↓
Start SEO again
```

You're doing this:

```text
Established Domain
+ Existing Google history
+ Existing backlinks
+ Existing traffic
+ Existing Search Console

             ↓

       KEEP ALL OF IT

             ↓

Modern website
Better design
Better mobile experience
Better speed
Better conversion
Better analytics
Automation
Database
SEO improvements
```

## For a Business Like Giovanni's

A setup could eventually look like:

```text
giovannisshrimptruck.com
        ↓
      Vercel
        ↓
     Next.js
        ↓
 ┌───────────────┐
 │ Website       │
 │ Menu          │
 │ Locations     │
 │ Story         │
 │ Gallery       │
 │ Contact       │
 │ Reviews       │
 └───────────────┘
        ↓
   Supabase
        ↓
Customer / inquiry data
        ↓
       n8n
        ↓
Email / CRM / marketing automation
```

while the customer-facing domain remains exactly:

```text
giovannisshrimptruck.com
```

**That's the migration I would recommend if the current domain already has strong Google visibility: modernize the infrastructure without throwing away the domain's existing search footprint.**