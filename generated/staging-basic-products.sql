-- STAGING ONLY. Every record remains active=0.
-- Verify private R2 objects before importing.

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0001', '108 in the Shade', 'basic', 2999, 'USD', 'BruA1 - 108 in the Shade - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0002', 'Anxiety', 'basic', 2999, 'USD', 'BruA1 - Anxiety - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0003', 'Blaze', 'basic', 2999, 'USD', 'BruA1 - Blaze - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0004', 'Chopan', 'basic', 2999, 'USD', 'BruA1 - Chopan - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0005', 'Cypher', 'basic', 2999, 'USD', 'BruA1 - Cypher - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0006', 'Dallar and a Dream', 'basic', 2999, 'USD', 'BruA1 - Dallar and a Dream - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0007', 'Danger', 'basic', 2999, 'USD', 'BruA1 - Danger - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0008', 'decater', 'basic', 2999, 'USD', 'BruA1 - decater - Utagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0009', 'Drawdown', 'basic', 2999, 'USD', 'BruA1 - Drawdown - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0010', 'DreSlide', 'basic', 2999, 'USD', 'BruA1 - DreSlide - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0011', 'DrPepperFlavoredListerineJ', 'basic', 2999, 'USD', 'BruA1 - DrPepperFlavoredListerineJ - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0012', 'Elon Free', 'basic', 2999, 'USD', 'BruA1 - Elon Free - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0013', 'Fck Stress', 'basic', 2999, 'USD', 'BruA1 - Fck Stress - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0014', 'Get Em', 'basic', 2999, 'USD', 'BruA1 - Get Em - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0015', 'Ginu', 'basic', 2999, 'USD', 'BruA1 - Ginu - Untqgged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0016', 'Gnosis', 'basic', 2999, 'USD', 'BruA1 - Gnosis - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0017', 'JRSHIT2', 'basic', 2999, 'USD', 'BruA1 - JRSHIT2 - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0018', 'Just2Inspire', 'basic', 2999, 'USD', 'BruA1 - Just2Inspire - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0019', 'LaidBackNLitty', 'basic', 2999, 'USD', 'BruA1 - LaidBackNLitty - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0020', 'Litty', 'basic', 2999, 'USD', 'BruA1 - Litty - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0021', 'LovinU', 'basic', 2999, 'USD', 'BruA1 - LovinU - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0022', 'Mailvoi', 'basic', 2999, 'USD', 'BruA1 - Mailvoi - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0023', 'Messy', 'basic', 2999, 'USD', 'BruA1 - Messy - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0024', 'Morf', 'basic', 2999, 'USD', 'BruA1 - Morf - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0025', 'Nawlins', 'basic', 2999, 'USD', 'BruA1 - Nawlins - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0026', 'paralyzed', 'basic', 2999, 'USD', 'BruA1 - paralyzed- Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0027', 'Phareal', 'basic', 2999, 'USD', 'BruA1 - Phareal - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0028', 'realfocus_2', 'basic', 2999, 'USD', 'BruA1 - realfocus_2 - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0029', 'Ride With Me', 'basic', 2999, 'USD', 'BruA1 - Ride With Me - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0030', 'Shake it like', 'basic', 2999, 'USD', 'BruA1 - Shake it like - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0031', 'Shop Open', 'basic', 2999, 'USD', 'BruA1 - Shop Open - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0032', 'SpaceX', 'basic', 2999, 'USD', 'BruA1 - SpaceX - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0033', 'Steel', 'basic', 2999, 'USD', 'BruA1 - Steel - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0034', 'Stranger', 'basic', 2999, 'USD', 'BruA1 - Stranger - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0035', 'Street Dreams', 'basic', 2999, 'USD', 'BruA1 - Street Dreams - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0036', 'The Flu', 'basic', 2999, 'USD', 'BruA1 - The Flu - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0037', 'Whoa Naa', 'basic', 2999, 'USD', 'BruA1 - Whoa Naa - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0038', 'Worse', 'basic', 2999, 'USD', 'BruA1 - Worse - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;

INSERT INTO products (id, title, license_type, price_cents, currency, r2_object_key, active)
VALUES ('BRUA1-INS-0039', 'Zayoo', 'basic', 2999, 'USD', 'BruA1 - Zayoo - Untagged.mp3', 0)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, license_type=excluded.license_type,
  price_cents=excluded.price_cents, currency=excluded.currency,
  r2_object_key=excluded.r2_object_key, active=0;
