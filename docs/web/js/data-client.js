/* ============================================================
   Sentinel Mesh — Data Client
   Fetches dashboard data from /data/*.json
   Implements polling + error handling
   ============================================================ */

(function () {
  "use strict";

  // Dashboard IDs
  const DASHBOARD_IDS = [
    "dashboard",
    "performance",
    "hitl",
    "marimo",
    "detection",
    "d3fend",
    "tame",
    "risk",
    "blast",
    "compliance",
    "cve",
    "threat",
    "custody",
  ];

  // Global data object (accessed by React components)
  window.SM_DATA = {};
  window.SM_DATA_ERRORS = {};
  window.SM_DATA_LOADING = {};

  // Fetch a single dashboard's JSON
  async function fetchDashboardData(dashboardId) {
    try {
      window.SM_DATA_LOADING[dashboardId] = true;
      const response = await fetch(`/data/${dashboardId}.json`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      window.SM_DATA[dashboardId] = data;
      window.SM_DATA_ERRORS[dashboardId] = null;
      window.SM_DATA_LOADING[dashboardId] = false;

      return data;
    } catch (error) {
      console.error(`Failed to fetch ${dashboardId}:`, error);
      window.SM_DATA_ERRORS[dashboardId] = {
        message: error.message,
        timestamp: new Date().toISOString(),
      };
      window.SM_DATA_LOADING[dashboardId] = false;
      return null;
    }
  }

  // Fetch all dashboards
  async function fetchAllDashboards() {
    console.log("[SM] Fetching all dashboard data...");
    const promises = DASHBOARD_IDS.map((id) => fetchDashboardData(id));
    await Promise.all(promises);
    console.log("[SM] All dashboards loaded");
  }

  // Setup polling for a single dashboard
  function setupPollingForDashboard(dashboardId, intervalMs = 30000) {
    // Initial fetch
    fetchDashboardData(dashboardId);

    // Setup interval
    const interval = setInterval(() => {
      fetchDashboardData(dashboardId).then((data) => {
        if (data) {
          // Dispatch custom event for React to pick up the change
          window.dispatchEvent(
            new CustomEvent("dashboardDataUpdated", {
              detail: { dashboardId, data },
            }),
          );
        }
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }

  // Setup polling for all dashboards
  function setupPolling(intervalMs = 30000) {
    console.log(`[SM] Setting up polling every ${intervalMs}ms`);
    const clearers = DASHBOARD_IDS.map((id) =>
      setupPollingForDashboard(id, intervalMs),
    );
    return () => clearers.forEach((c) => c());
  }

  // Expose to window for React access
  window.SM = {
    fetchDashboardData,
    fetchAllDashboards,
    setupPolling,
    DASHBOARD_IDS,
  };

  // Auto-start: fetch all data on page load, then setup polling
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", async () => {
      await window.SM.fetchAllDashboards();
      window.SM.stopPolling = window.SM.setupPolling(30000);
    });
  } else {
    // Already loaded
    window.SM.fetchAllDashboards().then(() => {
      window.SM.stopPolling = window.SM.setupPolling(30000);
    });
  }

  console.log("[SM] Data client initialized");
})();
