# CLIFF + Stripe Setup

## What was added

- `src/lib/cliff/checkout.ts` – creates Stripe Checkout sessions
- `src/lib/cliff/start-checkout.ts` – client helper
- `src/components/cliff/upgrade-modal.tsx` – reusable upgrade modal
- `src/routes/pricing.tsx` – full pricing page with monthly/annual toggle
- Plans modal in `app.tsx` now sends paid plans to Stripe

## Price IDs already configured

- Room Monthly $19 → price_1UQ9RV3TFKyEHEzqauYzmyDE
- Room Yearly $180 → price_1UQ9Ty3TFKyEHEzqqBQgyZRB
- Slate Monthly $49 → price_1UQ9SC3TFKyEHEzqSD6Jr1br
- Slate Yearly $468 → price_1UQ9Uy3TFKyEHEzqWfFz5ImC

## What you still need to do

1. Install the Stripe package:
   ```bash
   npm install stripe
   ```

2. Create a `.env` file in the project root:
   ```env
   STRIPE_SECRET_KEY=sk_test_51UQ9Bs3T...   # paste your full secret key
   APP_URL=http://localhost:8080
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open http://localhost:8080 and click the plan button in the header → choose Room or Slate.
   You should be redirected to Stripe Checkout (test mode).

5. Use test card: 4242 4242 4242 4242, any future date, any CVC.

## Later improvements

- Add webhook to actually unlock the plan after payment
- Cloud accounts instead of localStorage
- Enforce polish limits with UpgradeModal
