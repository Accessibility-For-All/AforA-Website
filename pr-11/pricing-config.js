// Pricing feature flags + Stripe Payment Link slots.
// This file is the pricing kill switch — see docs/ROLLBACK-PRICING.md.
//
//   selfServe: false  -> every paid CTA becomes "Get a quote" (scrolls to the form).
//   showPrices: false -> tier cards hide dollar amounts ("Contact us for pricing").
//   checkout URLs     -> Stripe Payment Links, created in the A4A Stripe account.
//                        An empty string disables that tier's checkout (CTA falls
//                        back to the quote form) even when selfServe is true.
window.A4A_PRICING = {
  selfServe: false, // flip to true once Stripe Payment Links below are filled in
  showPrices: true,
  checkout: {
    starter: { monthly: "", annual: "" },
    growth:  { monthly: "", annual: "" },
    scale:   { monthly: "", annual: "" },
  },
};
