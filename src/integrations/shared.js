// Shared contract every /integrations/<provider> adapter follows.
//
// Today every adapter's fetch methods resolve from the mock data in
// src/data/*.js after a simulated network delay, this is a MOCK LAYER, not a
// real API connection, and the UI must never claim otherwise. Swapping in a
// real integration later means rewriting the inside of these functions to
// call the provider's actual API (OAuth, pagination, rate limits, etc.) - the
// call sites in dashboard pages stay the same, since they already `await` an
// async function and read a stable shape.
//
// Provider metadata shape:
//   { id, name, color, connected, accountLabel }
//
// Every adapter also exports `getConnectionStatus()`, returning that same
// shape, since the Integrations page renders all six from one list.

export function mockDelay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
