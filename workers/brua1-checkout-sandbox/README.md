# BruA1 checkout sandbox delivery v2

This branch is REVIEW ONLY. Do not merge or deploy into the live storefront before QA.
Source file: `workers/brua1-checkout-sandbox/worker.js` (478 lines).

## Working context
- Existing production checkout Worker remains on a previous working version.
- PayPal stays sandbox-only; product `BRUA1-INS-0001` remains inactive (`active=0`) in D1.
- Private R2 bucket `brua1-instrumentals-masters`, object `BruA1 - 108 in the Shade - Untagged.mp3`.
- D1 binding `ORDERS_DB`; private R2 binding `INSTRUMENTAL_MASTERS`.
- Existing Cloudflare secrets `PAYPAL_CLIENT_SECRET`, `CHECKOUT_TEST_KEY` remain in Cloudflare. Do not commit them.

## Deployment caution
Cloudflare Git integration appears connected to `main`; commits to this feature branch must not affect the live Worker.
Before configuring Git auto-deployment verify compatibility with existing Cloudflare Worker and secret preservation. Deploy only after syntax/security review and explicit sandbox test approval.

## Test requirements
Local unit tests previously passed 8/8; **no Cloudflare live delivery tests have passed yet**.
Verify `/health`, sandbox `/test`, authorized `/api/test-r2`, unauthorized requests,
order payment validation, one-time token issuance, 24-hour expiration,
3-download concurrent limit, and rejected direct R2 access.
Rotate exposed PayPal credentials before production.
