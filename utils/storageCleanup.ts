const DEMO_KEYS = [
  "demoUser",
  "mockUser",
  "fakeReports",
  "demoItems",
  "profileStats",
  "dashboardStats",
  "reportsCreated",
  "claimsApproved"
];

export function clearDemoStorage() {
  if (typeof window === "undefined") return;
  for (const k of DEMO_KEYS) {
    try {
      window.localStorage.removeItem(k);
    } catch {
      // ignore
    }
  }
}

