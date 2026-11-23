# BruA1 instrumental bulk catalog — STAGING ONLY

This feature branch prepares upload/registration of BruA1 instrumental masters. **Do not merge, publish, or activate products until QA, licensing and secure checkout integration are complete.**

## Current validated example

- Product `BRUA1-INS-0001`: `108 in the Shade`, Basic `$29.99`, untagged MP3 key `BruA1 - 108 in the Shade - Untagged.mp3`.
- Private bucket: `brua1-instrumentals-masters` (public access disabled).
- Preview bucket: `brua1-instrumental-previews` (a separate public/preview bucket).
- D1 database: `brua1-orders-sandbox`; binding `ORDERS_DB`.
- This first MP3 passed manual playback and secure Sandbox download. Independent licensing, store QA, and real-payment security still pending.

## Bulk upload workflow

1. On your local computer, make separate folders of **tagged previews**, **untagged clean MP3s**, and **master WAVs**. Never put clean masters in the public preview bucket.
2. Batch-upload clean MP3 and WAV files into the **private** `brua1-instrumentals-masters` bucket via Cloudflare R2. Keep public access disabled.
3. Match each track to its preview file already in `brua1-instrumental-previews`, if a verified matching preview exists. Never guess a preview filename or track title.
4. Add **one row per track** to `data/instrumental-bulk-staging.csv`. Give each item a unique sequential `BRUA1-INS-NNNN` product ID. Keep `basic_price_cents=2999` unless a price change has been approved.
5. Validate titles and filenames; listen to each clean MP3 and verify the preview has tags. Mark `qa_status=owner_playback_passed` only after checking. Keep unverified tracks `pending`.
6. Run `node scripts/build-instrumental-bulk-catalog.mjs` in the repository root. This creates a **review-only public metadata JSON** and **D1 staging SQL**. No real API calls or file uploads occur.
7. Review output against actual R2 objects before applying SQL to D1. SQL always writes `active=0` so a staging import cannot activate sales.
8. Future work: make Cloudflare checkout select a catalog product ID dynamically instead of its current hardcoded `BRUA1-INS-0001`. Until that is implemented and independently tested, other entries CANNOT be sold automatically.

### CSV columns

- `product_id` — unique identifier, e.g. `BRUA1-INS-0002`.
- `title` — exact customer-facing instrumental title.
- `basic_price_cents` — 2999 for $29.99.
- `clean_mp3_r2_key` — exact R2 private object key for clean MP3 (NOT an R2 URL).
- `tagged_preview_r2_key` — optional exact tagged public preview object key, leave empty until matched.
- `genre`, `bpm`, `musical_key` — optional track metadata, no guesses.
- `qa_status` — `pending` or `owner_playback_passed`.

Keep the actual audio files outside GitHub. Do not commit PayPal credentials, Cloudflare API tokens, download tokens, or user/customer data. Rotate previously exposed secrets before real sales.
