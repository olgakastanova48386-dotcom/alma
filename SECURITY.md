# ALMA Security

## Reporting a vulnerability

Please report suspected security issues privately to olgakastanova48386@gmail.com.
Do not publish credentials, access tokens, personal data, or exploit details in a public issue.

## Current baseline

- HTTPS is provided by Cloudflare Workers.
- Production response headers restrict framing, MIME sniffing, referrers, browser permissions and external content sources.
- Secrets must never be committed to this repository or exposed through client-side environment variables.
- Future authenticated features (reviews, prices, complaints, favorites sync) must enforce server-side validation, authorization, rate limiting and database Row Level Security before launch.
- User-generated content must be escaped/rendered as text and pass moderation rules before public display.

## Before accounts and reviews launch

1. Configure Supabase Row Level Security for every user-owned table.
2. Keep service-role keys server-side only.
3. Add rate limits for authentication, reviews, price reports and complaints.
4. Add anti-bot protection to abuse-prone forms.
5. Log administrative moderation actions.
6. Maintain database backups and test restore procedures.
7. Review Cloudflare WAF/security rules and analytics for abusive traffic.
