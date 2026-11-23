/**
 * BruA1 private master inventory -> staging catalog + SQL
 * Usage: node scripts/build-instrumental-bulk-catalog.mjs
 * No network access or Cloudflare credentials required.
 * All generated products are deliberately disabled (active=0).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const INPUT = "data/instrumental-bulk-staging.csv";
const OUTPUT_DIR = "generated";
const REQUIRED = [
  "product_id", "title", "basic_price_cents", "clean_mp3_r2_key",
  "tagged_preview_r2_key", "genre", "bpm", "musical_key", "qa_status"
];

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  text = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') {
      if (field !== "") throw Error("Malformed CSV: unexpected quote");
      quoted = true;
    } else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (quoted) throw Error("Malformed CSV: unclosed quoted field");
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(v => v.trim() !== ""));
}

function clean(value) { return (value ?? "").trim(); }
function sqlString(value) { return "'" + value.replace(/'/g, "''") + "'"; }
function validKey(value, extension) {
  return value.endsWith(extension) &&
    !value.startsWith("/") && !value.includes("\\") &&
    !value.split("/").includes("..") && !/[\r\n\0]/.test(value);
}

const parsed = parseCsv(readFileSync(INPUT, "utf8"));
if (!parsed.length) throw Error("CSV is empty");
const headers = parsed.shift().map(clean);
for (const name of REQUIRED) {
  if (!headers.includes(name)) throw Error("Missing required CSV column: " + name);
}
const seen = new Set();
const records = parsed.map((values, index) => {
  const rowNum = index + 2;
  if (values.length !== headers.length) throw Error("CSV row " + rowNum + " has wrong column count");
  const row = Object.fromEntries(headers.map((key, i) => [key, clean(values[i])]));
  if (!/^BRUA1-INS-\d{4}$/.test(row.product_id)) throw Error("Invalid product ID on row " + rowNum);
  if (seen.has(row.product_id)) throw Error("Duplicate product ID " + row.product_id);
  seen.add(row.product_id);
  if (!row.title || /[\r\n\0]/.test(row.title)) throw Error("Invalid title on row " + rowNum);
  if (!/^\d+$/.test(row.basic_price_cents) || Number(row.basic_price_cents) !== 2999) {
    throw Error("Basic price must be 2999 cents on row " + rowNum);
  }
  if (!validKey(row.clean_mp3_r2_key, ".mp3")) {
    throw Error("Invalid private clean MP3 R2 key on row " + rowNum);
  }
  if (row.tagged_preview_r2_key && !validKey(row.tagged_preview_r2_key, ".mp3")) {
    throw Error("Invalid tagged preview R2 key on row " + rowNum);
  }
  if (row.bpm && (!/^\d+$/.test(row.bpm) || Number(row.bpm) < 30 || Number(row.bpm) > 300)) {
    throw Error("Invalid BPM on row " + rowNum);
  }
  if (!["pending", "owner_playback_passed"].includes(row.qa_status)) {
    throw Error("Invalid QA status on row " + rowNum);
  }
  return row;
});
if (!records.length) throw Error("No product rows found");

const sql = ["-- STAGING ONLY. Every record remains active=0.", "-- Verify private R2 objects before importing.", ""];
for (const row of records) {
  const id = sqlString(row.product_id), title = sqlString(row.title);
  const key = sqlString(row.clean_mp3_r2_key);
  sql.push(
    "INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)",
    "VALUES (" + [id, title, "'basic'", "2999", "'USD'", key, "0"].join(", ") + ")",
    "ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,",
    "  price_cents=excluded.price_cents, currency=excluded.currency,",
    "  r2_object_key=excluded.r2_object_key, active=0;",
    ""
  );
}
const publicReview = records.map(r => ({
  product_id: r.product_id,
  title: r.title,
  price_cents: Number(r.basic_price_cents),
  genre: r.genre || null,
  bpm: r.bpm ? Number(r.bpm) : null,
  musical_key: r.musical_key || null,
  tagged_preview_r2_key: r.tagged_preview_r2_key || null,
  qa_status: r.qa_status,
  sale_enabled: false
}));

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_DIR + "/staging-basic-products.sql", sql.join("\n"), "utf8");
writeFileSync(OUTPUT_DIR + "/staging-public-review.json",
  JSON.stringify({ storefront_status: "staging", products: publicReview }, null, 2) + "\n",
  "utf8");
console.log("Prepared " + records.length + " staged instrumentals. No Cloudflare changes made.");
