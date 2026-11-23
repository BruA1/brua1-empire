# BruA1 Instrumental Masters — Drive batch inventory

Source: https://drive.google.com/drive/folders/1dTtYPYcSUuP5fu6DuGhL6z-_7pyQ5P2s?usp=drive_link
Scope: direct children of folder only, checked November 23, 2026.

- 75 audio files: 39 MP3, 36 WAV.
- 35 MP3s have an exact title-matching WAV file.
- 4 MP3s have no exact title-matching WAV filename.
- 1 WAV master has no exact title-matching MP3 filename.
- 2 MP3 filenames have likely mis-typed "Untagged" suffixes.
- Unique MP3 titles entered in staging catalog: 39.
- Drive storage does NOT prove the same files are present in Cloudflare R2; only `108 in the Shade` is confirmed in private R2.
- File name matching is not acoustic QA. New titles stay `pending` and all D1 imports must use `active=0`.

## Missing exact-match WAV files for MP3 titles
- `Chopan`: `BruA1 - Chopan - Untagged.mp3`
- `LovinU`: `BruA1 - LovinU - Untagged.mp3`
- `LaidBackNLitty`: `BruA1 - LaidBackNLitty - Untagged.mp3`
- `paralyzed`: `BruA1 - paralyzed- Untagged.mp3`

## Unmatched WAV masters
- `LuvinU`: `BruA1 - LuvinU - Master.wav`

## Unusual MP3 labeling
- `BruA1 - decater - Utagged.mp3` uses suffix `Utagged`; do not rename or assume it is clean until listened to.
- `BruA1 - Ginu - Untqgged.mp3` uses suffix `Untqgged`; do not rename or assume it is clean until listened to.

## Notes
- `LovinU` (MP3) and `LuvinU` (WAV) may be related, but are **not automatically paired**: artist confirmation or audio verification required.
- Keep exactly uploaded filenames in R2 and in D1; changing titles for marketing does not change the private key.
- This inventory is based on Google Drive file metadata, not extracted audio contents.
