# BruA1 private media sync (manual/secure first)

**This is a staged GitHub Actions workflow. It is NOT active and transfers NOTHING until deployed to a repository's default branch, secrets are configured, and a human runs it.** `main` is connected to Cloudflare Builds; review that deployment connection before merging any commits. We deliberately keep this workflow on a separate branch for now to avoid unintended Worker deployment.

The job copies 39 untagged MP3s and 36 WAV masters (per November 23, 2026 Google Drive inventory) from Google Drive folder `1dTtYPYcSUuP5fu6DuGhL6z-_7pyQ5P2s` to **private** R2 bucket `brua1-instrumentals-masters`. It accepts typo variants `Utagged` and `Untqgged` to preserve existing filenames. Already-present destination keys are skipped. No deletion or replacement. Tagged promotional previews are excluded by file pattern. A dry-run is the default; upload mode must be selected explicitly.

## Step 1: Google Drive reader identity (no secrets in chat)

1. Visit https://console.cloud.google.com/ and select or create a project **BruA1 Media Sync**.
2. Enable **Google Drive API** for that project under APIs & Services > Library.
3. Visit IAM & Admin > Service Accounts > Create Service Account, name it `brua1-drive-media-reader`. No Google Cloud IAM roles required.
4. Open that service account > Keys > Add key > Create new key > JSON. Keep the downloaded JSON file private. It is a sensitive credential; don't upload to a public repository or send in a chat.
5. In Google Drive, share **only** the **Brua1 Instrumental Masters** source folder with the service-account email (Viewer).
6. In GitHub repository Settings > Secrets and variables > Actions > New repository secret, add secret `GDRIVE_SERVICE_ACCOUNT_JSON` containing the **full JSON**. JSON private keys must remain secret. Consider using a private, separate media-automation repository to isolate this credential from a public storefront repository.

## Step 2: R2 bucket-only S3 credentials

1. In https://dash.cloudflare.com/ go to **R2 Object Storage > Manage R2 API tokens**. This is **not** the Workers Editor token or a normal account API token.
2. Create a token named `BruA1-Private-Masters-Sync`, **Object Read & Write**, **specific bucket only**: `brua1-instrumentals-masters`. Do not grant account-wide or admin permissions.
3. Capture the **S3 Access Key ID** and **S3 Secret Access Key** shown upon creation.
4. Save these two values in separate GitHub Actions repository secrets:
   - `CLOUDFLARE_R2_ACCESS_KEY_ID`
   - `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
5. Don't share keys or screenshots showing their values, and rotate any older exposed Cloudflare credentials.

## Step 3: Run safely

1. Confirm R2 bucket Public Access remains Disabled and the Worker only runs PayPal Sandbox.
2. Once this isolated workflow has been added to a **safe automation repository's default branch** (or Cloudflare auto-build behavior is explicitly handled), open GitHub > Actions > **BruA1 Drive to Private R2 Masters** > Run workflow.
3. Choose **dry-run** to review which files would be transferred. It changes nothing.
4. After checking names, choose **copy** to upload only missing files. The job then checks the copied files' sizes in R2.
5. Use independent QA for clean MP3 playback, WAV-master verification and license terms. The catalog and products remain inactive.

## Limits / security

- GitHub-hosted runner downloads Drive files and uploads to R2; this uses network bandwidth, may incur service charges, and depends on GitHub Actions availability.
- `rclone copy --ignore-existing` does not replace changed files: replacements require a separately reviewed procedure.
- Jobs have a 3 GB transfer cap and 120-minute timeout; batch or adjust after assessing your catalog.
- Source Drive access is read-only; R2 credentials are bucket-limited. Neither secret belongs in JS Worker code.
- This does NOT change the checkout Worker, D1 database, product statuses, previews or your live website.
- If a Google service account cannot access the shared folder, verify folder-sharing permissions, project Drive API activation, and service account account restrictions before switching to OAuth.
- After initial QA, schedule a daily recurrence if desired, but ensure R2 costs, QC and credential rotation procedures first.
