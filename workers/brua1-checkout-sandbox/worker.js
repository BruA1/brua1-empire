const PAYPAL_BASE = "https://api-m.sandbox.paypal.com";
const PRODUCT_ID = "BRUA1-INS-0001";
const PRICE_CENTS = 2999;
const PRICE = "29.99";
const CURRENCY = "USD";
const MAX_DOWNLOADS = 3;
const TOKEN_TTL_HOURS = 24;
const FILE_NAME = "BruA1 - 108 in the Shade - Untagged.mp3";

function reply(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
  });
}

function configured(env) {
  return env.PAYPAL_ENVIRONMENT === "sandbox" &&
    !!env.PAYPAL_CLIENT_ID && !!env.PAYPAL_CLIENT_SECRET &&
    !!env.CHECKOUT_TEST_KEY && !!env.ORDERS_DB;
}

function authorized(request, env, origin) {
  return request.headers.get("Origin") === origin &&
    request.headers.get("Authorization") === "Bearer " + env.CHECKOUT_TEST_KEY;
}

async function paypal(env, path, method = "GET", body, requestId) {
  const credentials = btoa(env.PAYPAL_CLIENT_ID + ":" + env.PAYPAL_CLIENT_SECRET);
  const auth = await fetch(PAYPAL_BASE + "/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + credentials,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  if (!auth.ok) throw new Error("PayPal authentication failed");
  const authData = await auth.json();
  if (!authData.access_token) throw new Error("PayPal token unavailable");

  const headers = {
    Authorization: "Bearer " + authData.access_token,
    "Content-Type": "application/json",
    Prefer: "return=representation"
  };
  if (method === "POST") {
    headers["PayPal-Request-Id"] = requestId || crypto.randomUUID();
  }
  const response = await fetch(PAYPAL_BASE + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error("PayPal request failed: " + response.status);
  return data;
}

const testPage = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BruA1 Sandbox Checkout</title>
<style>
body{font-family:Arial,sans-serif;background:#111;color:#fff;max-width:500px;margin:45px auto;padding:20px}
button,input{padding:14px;margin:8px 0;width:100%;box-sizing:border-box}
button{background:#17a568;color:#fff;border:0;font-weight:bold;cursor:pointer}
input{background:#222;color:#fff;border:1px solid #777}
pre{white-space:pre-wrap;overflow-wrap:anywhere}
</style>
</head>
<body>
<h2>BruA1 Sandbox Checkout</h2>
<p>108 in the Shade — Basic Instrumental License — $29.99 TEST USD</p>
<p>Sandbox test only. Private MP3 delivery after verified test payment.</p>
<input id="key" type="password" autocomplete="off" placeholder="Private test key">
<button id="create">Create Test Order</button>
<button id="capture" hidden>Capture Approved Payment</button>
<button id="r2">Check Private R2 File</button>
<input id="existingOrderId" placeholder="Completed Sandbox PayPal order ID (if testing an older payment)">
<button id="issue">Issue Download Token for Completed Test Order</button>
<input id="downloadToken" placeholder="Download token (filled after payment)">
<button id="download">Download Private Test MP3</button>
<pre id="result"></pre>
<script>
const result = document.getElementById("result");
const key = document.getElementById("key");
const params = new URLSearchParams(location.search);
const orderId = params.get("token");
if (orderId) {
  document.getElementById("capture").hidden = false;
  document.getElementById("existingOrderId").value = orderId;
  result.textContent = "Order returned from PayPal. Enter your test key and capture.";
}
async function send(path, payload) {
  result.textContent = "Processing...";
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + key.value
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed");
    result.textContent = JSON.stringify(data, null, 2);
    if (data.downloadToken) document.getElementById("downloadToken").value = data.downloadToken;
    return data;
  } catch (error) {
    result.textContent = error.message;
    return null;
  }
}
document.getElementById("create").onclick = async () => {
  const data = await send("/api/create-order", {});
  if (data && data.approve) location.href = data.approve;
};
document.getElementById("capture").onclick = async () => {
  await send("/api/capture-order", { orderId });
};
document.getElementById("r2").onclick = async () => {
  await send("/api/test-r2", {});
};
document.getElementById("issue").onclick = async () => {
  const id = document.getElementById("existingOrderId").value.trim();
  await send("/api/issue-download", { orderId: id });
};
document.getElementById("download").onclick = async () => {
  const token = document.getElementById("downloadToken").value.trim();
  result.textContent = "Checking private download...";
  try {
    const response = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key.value },
      body: JSON.stringify({ token })
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Download denied");
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "BruA1 - 108 in the Shade - Untagged.mp3";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
    result.textContent = "Sandbox private MP3 download delivered. Download count increased by 1.";
  } catch (error) {
    result.textContent = error.message;
  }
};
</script>
</body>
</html>`;

async function getProduct(env) {
  return env.ORDERS_DB.prepare(
    "SELECT id, title, license_type, price_cents, currency, r2_object_key, active FROM products WHERE id = ?"
  ).bind(PRODUCT_ID).first();
}

function validProduct(product) {
  return product && product.id === PRODUCT_ID &&
    product.license_type === "basic" &&
    product.price_cents === PRICE_CENTS &&
    product.currency === CURRENCY &&
    typeof product.r2_object_key === "string" &&
    product.r2_object_key.length > 0;
}

function matchingCapture(capture) {
  return capture && capture.status === "COMPLETED" &&
    capture.amount?.currency_code === CURRENCY &&
    capture.amount?.value === PRICE && typeof capture.id === "string";
}

function findCapture(order) {
  const units = order.purchase_units;
  if (!Array.isArray(units) || units.length !== 1) return null;
  return units[0]?.payments?.captures?.find(matchingCapture) || null;
}

function validOrderId(id) {
  return typeof id === "string" && /^[A-Z0-9]{10,30}$/.test(id);
}

async function sha256(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map(n => n.toString(16).padStart(2, "0")).join("");
}

function randomDownloadToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return [...bytes].map(n => n.toString(16).padStart(2, "0")).join("");
}

async function completedOrder(env, paypalOrderId) {
  return env.ORDERS_DB.prepare(
    "SELECT id, paypal_order_id, paypal_capture_id, product_id, amount_cents, currency, status FROM orders WHERE paypal_order_id = ?"
  ).bind(paypalOrderId).first();
}

async function ensureVerifiedPaidOrder(env, paypalOrderId) {
  const order = await completedOrder(env, paypalOrderId);
  if (!order || order.status !== "COMPLETED" || !order.paypal_capture_id ||
      order.product_id !== PRODUCT_ID || order.amount_cents !== PRICE_CENTS ||
      order.currency !== CURRENCY) {
    return null;
  }
  return order;
}

async function issueDownloadToken(env, order) {
  if (!env.INSTRUMENTAL_MASTERS) {
    return { error: "Private R2 binding unavailable", status: 503 };
  }
  const product = await getProduct(env);
  if (!validProduct(product) || product.r2_object_key !== FILE_NAME) {
    return { error: "Sandbox MP3 mapping invalid", status: 503 };
  }
  const object = await env.INSTRUMENTAL_MASTERS.head(product.r2_object_key);
  if (!object || !object.size) return { error: "Private MP3 not available", status: 503 };

  const token = randomDownloadToken();
  const hash = await sha256(token);
  // A buyer gets exactly one token per order, even if capture is retried.
  // SQL insert is conditional and atomic. No raw token is stored in D1.
  const claim = await env.ORDERS_DB.prepare(
    "INSERT INTO download_tokens (token_hash, order_id, expires_at, download_count, max_downloads) " +
    "SELECT ?, id, datetime('now', '+24 hours'), 0, ? FROM orders " +
    "WHERE id = ? AND status = 'COMPLETED' AND paypal_capture_id IS NOT NULL " +
    "AND product_id = ? AND amount_cents = ? AND currency = ? " +
    "AND NOT EXISTS (SELECT 1 FROM download_tokens WHERE order_id = orders.id)"
  ).bind(hash, MAX_DOWNLOADS, order.id, PRODUCT_ID, PRICE_CENTS, CURRENCY).run();
  if (claim.meta?.changes !== 1) {
    return { error: "Download token has already been issued for this order", status: 409 };
  }
  return { downloadToken: token, expiresInHours: TOKEN_TTL_HOURS, maxDownloads: MAX_DOWNLOADS };
}

async function secureDownload(env, token) {
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) {
    return reply({ error: "Invalid download token" }, 400);
  }
  if (!env.INSTRUMENTAL_MASTERS) return reply({ error: "Private R2 unavailable" }, 503);
  const hash = await sha256(token);
  const row = await env.ORDERS_DB.prepare(
    "SELECT p.r2_object_key FROM download_tokens t " +
    "JOIN orders o ON o.id = t.order_id JOIN products p ON p.id = o.product_id " +
    "WHERE t.token_hash = ? AND t.expires_at > CURRENT_TIMESTAMP " +
    "AND t.download_count < t.max_downloads AND t.max_downloads <= 3 " +
    "AND o.status = 'COMPLETED' AND o.paypal_capture_id IS NOT NULL " +
    "AND o.product_id = ? AND o.amount_cents = ? AND o.currency = ?"
  ).bind(hash, PRODUCT_ID, PRICE_CENTS, CURRENCY).first();
  if (!row || row.r2_object_key !== FILE_NAME) {
    return reply({ error: "Download token expired, invalid, or exhausted" }, 403);
  }
  const object = await env.INSTRUMENTAL_MASTERS.get(row.r2_object_key);
  if (!object) return reply({ error: "Private MP3 not found" }, 503);
  // Reserve exactly one download atomically. Concurrent requests cannot exceed the limit.
  const used = await env.ORDERS_DB.prepare(
    "UPDATE download_tokens SET download_count = download_count + 1 " +
    "WHERE token_hash = ? AND expires_at > CURRENT_TIMESTAMP " +
    "AND download_count < max_downloads AND max_downloads <= 3 " +
    "AND EXISTS (SELECT 1 FROM orders o WHERE o.id = download_tokens.order_id " +
    "AND o.status = 'COMPLETED' AND o.paypal_capture_id IS NOT NULL " +
    "AND o.product_id = ? AND o.amount_cents = ? AND o.currency = ?)"
  ).bind(hash, PRODUCT_ID, PRICE_CENTS, CURRENCY).run();
  if (used.meta?.changes !== 1) {
    await object.body?.cancel?.().catch(() => {});
    return reply({ error: "Download limit reached or token expired" }, 403);
  }
  return new Response(object.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'attachment; filename="BruA1 - 108 in the Shade - Untagged.mp3"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer"
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/health" && request.method === "GET") {
      return reply({ service: "BruA1 sandbox checkout", mode: "sandbox", checkout: "test-only", fulfillment: "sandbox-test" });
    }

    if (path === "/test" && request.method === "GET") {
      return new Response(testPage, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
          "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'; referrer 'no-referrer'",
          "Referrer-Policy": "no-referrer"
        }
      });
    }

    if (!path.startsWith("/api/")) return reply({ error: "Not found" }, 404);
    if (request.method !== "POST") return reply({ error: "Method not allowed" }, 405);
    if (!configured(env)) return reply({ error: "Sandbox configuration invalid" }, 503);
    if (request.headers.get("Origin") !== url.origin) return reply({ error: "Invalid origin" }, 403);
    if (!authorized(request, env, url.origin)) return reply({ error: "Unauthorized" }, 401);

    try {
      if (path === "/api/test-r2") {
        if (!env.INSTRUMENTAL_MASTERS) return reply({ error: "R2 binding unavailable" }, 503);
        const product = await getProduct(env);
        if (!validProduct(product)) return reply({ error: "Sandbox product configuration invalid" }, 503);
        const object = await env.INSTRUMENTAL_MASTERS.head(product.r2_object_key);
        return reply({ sandbox: true, productFound: true, privateFileFound: !!object,
          fileSizeBytes: object?.size ?? null, downloadEnabled: false });
      }

      if (path === "/api/download") {
        const body = await request.json().catch(() => ({}));
        return secureDownload(env, body?.token);
      }

      if (path === "/api/issue-download") {
        const body = await request.json().catch(() => ({}));
        const id = body?.orderId;
        if (!validOrderId(id)) return reply({ error: "Invalid order ID" }, 400);
        const stored = await ensureVerifiedPaidOrder(env, id);
        if (!stored) return reply({ error: "Verified completed payment required" }, 403);
        // Recheck PayPal independently for a manually requested recovery token.
        const paypalOrder = await paypal(env, "/v2/checkout/orders/" + id);
        const unit = paypalOrder.purchase_units?.[0];
        const capture = findCapture(paypalOrder);
        if (paypalOrder.id !== id || paypalOrder.purchase_units?.length !== 1 ||
            unit?.custom_id !== PRODUCT_ID ||
            unit?.amount?.currency_code !== CURRENCY || unit?.amount?.value !== PRICE ||
            capture?.id !== stored.paypal_capture_id) {
          return reply({ error: "PayPal verification failed" }, 409);
        }
        const issuance = await issueDownloadToken(env, stored);
        if (issuance.error) return reply({ error: issuance.error }, issuance.status);
        return reply({ sandbox: true, verified: true, fulfillment: "sandbox-test", orderId: id, ...issuance });
      }

      if (path === "/api/create-order") {
        const product = await getProduct(env);
        if (!validProduct(product)) return reply({ error: "Sandbox product configuration invalid" }, 503);
        // Deliberately permit inactive product only behind the private sandbox test key.
        const order = await paypal(env, "/v2/checkout/orders", "POST", {
          intent: "CAPTURE",
          purchase_units: [{
            custom_id: PRODUCT_ID,
            description: "BruA1 Basic Instrumental License",
            amount: { currency_code: CURRENCY, value: PRICE }
          }],
          application_context: {
            brand_name: "BruA1",
            user_action: "PAY_NOW",
            return_url: url.origin + "/test",
            cancel_url: url.origin + "/test?cancelled=1"
          }
        });
        const approve = order.links?.find(link =>
          link.rel === "approve" || link.rel === "payer-action"
        )?.href;
        if (typeof order.id !== "string" || typeof approve !== "string" ||
            !approve.startsWith("https://www.sandbox.paypal.com/")) {
          throw new Error("Sandbox order response invalid");
        }
        await env.ORDERS_DB.prepare(
          "INSERT INTO orders (id, paypal_order_id, product_id, amount_cents, currency, status) VALUES (?, ?, ?, ?, ?, 'CREATED')"
        ).bind(crypto.randomUUID(), order.id, PRODUCT_ID, PRICE_CENTS, CURRENCY).run();
        return reply({ sandbox: true, orderId: order.id, approve });
      }

      if (path === "/api/capture-order") {
        const body = await request.json().catch(() => ({}));
        const id = body?.orderId;
        if (typeof id !== "string" || !/^[A-Z0-9]{10,30}$/.test(id)) {
          return reply({ error: "Invalid order ID" }, 400);
        }
        const stored = await env.ORDERS_DB.prepare(
          "SELECT id, product_id, amount_cents, currency, status, paypal_capture_id FROM orders WHERE paypal_order_id = ?"
        ).bind(id).first();
        if (!stored || stored.product_id !== PRODUCT_ID ||
            stored.amount_cents !== PRICE_CENTS || stored.currency !== CURRENCY) {
          return reply({ error: "Order not registered in sandbox database" }, 404);
        }
        if (stored.status === "COMPLETED") {
          return reply({ sandbox: true, verified: true, orderId: id,
            captureId: stored.paypal_capture_id, status: "COMPLETED",
            fulfillment: "sandbox-test", alreadyRecorded: true,
            note: "Use Issue Download Token for a completed order if no token was previously issued" });
        }
        if (stored.status !== "CREATED" && stored.status !== "CAPTURING") {
          return reply({ error: "Order is not eligible for capture" }, 409);
        }

        const order = await paypal(env, "/v2/checkout/orders/" + id);
        const unit = order.purchase_units?.[0];
        if (order.id !== id || order.purchase_units?.length !== 1 ||
            unit?.custom_id !== PRODUCT_ID ||
            unit?.amount?.currency_code !== CURRENCY ||
            unit?.amount?.value !== PRICE) {
          return reply({ error: "Order failed verification" }, 409);
        }

        let capture = findCapture(order);
        if (!capture) {
          if (order.status !== "APPROVED") {
            return reply({ error: "Order not approved or capture unresolved" }, 409);
          }
          if (stored.status !== "CREATED") {
            return reply({ error: "Capture pending reconciliation; review PayPal" }, 409);
          }
          const claimed = await env.ORDERS_DB.prepare(
            "UPDATE orders SET status = 'CAPTURING' WHERE id = ? AND status = 'CREATED'"
          ).bind(stored.id).run();
          if (claimed.meta?.changes !== 1) {
            return reply({ error: "Capture already in progress" }, 409);
          }
          let captured;
          try {
            captured = await paypal(env, "/v2/checkout/orders/" + id + "/capture",
              "POST", {}, "brua1-" + id);
          } catch (_) {
            return reply({ error: "Capture result uncertain; check PayPal before retrying" }, 502);
          }
          if (captured.id !== id) {
            return reply({ error: "Capture response mismatch; manual review required" }, 409);
          }
          capture = findCapture(captured);
        }
        if (!capture) return reply({ error: "Capture not verified; manual review required" }, 409);

        const updated = await env.ORDERS_DB.prepare(
          "UPDATE orders SET status = 'COMPLETED', paypal_capture_id = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ? AND status IN ('CREATED', 'CAPTURING')"
        ).bind(capture.id, stored.id).run();
        if (updated.meta?.changes !== 1) {
          const existing = await env.ORDERS_DB.prepare(
            "SELECT status, paypal_capture_id FROM orders WHERE id = ?"
          ).bind(stored.id).first();
          if (existing?.status !== "COMPLETED" || existing.paypal_capture_id !== capture.id) {
            return reply({ error: "Order record requires manual review" }, 409);
          }
        }
        const current = await ensureVerifiedPaidOrder(env, id);
        if (!current) return reply({ error: "Payment recorded but order needs review" }, 409);
        let fulfillment = "pending";
        let delivery = {};
        try {
          const issuance = await issueDownloadToken(env, current);
          if (!issuance.error) { fulfillment = "sandbox-test"; delivery = issuance; }
          else console.warn("Sandbox token issue pending", { orderId: id, status: issuance.status });
        } catch (_) {
          console.warn("Sandbox delivery pending; payment capture saved", { orderId: id });
        }
        return reply({ sandbox: true, verified: true, orderId: id,
          captureId: capture.id, status: "COMPLETED", amount: capture.amount,
          fulfillment, ...delivery });
      }

      return reply({ error: "Not found" }, 404);
    } catch (error) {
      console.error("Sandbox request failed", { path, message: error?.message || "unknown" });
      return reply({ error: "Sandbox operation failed; review Worker logs" }, 502);
    }
  }
};