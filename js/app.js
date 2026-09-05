/**
 * GreenPulse - Main Application Entry (app.js)
 * 
 * Coordinates module initialization:
 * - ThemeManager
 * - DataService
 * - NavigationManager
 * - ChartManager
 * - DashboardController
 * - AnalyticsController
 * - Real-time ticker & live simulated pulse
 */

(function () {
  'use strict';

  function updateLiveClock() {
    const clockEl = document.getElementById('topbar-live-clock');
    if (!clockEl) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    clockEl.textContent = `${timeStr} IST`;
  }

  function startLivePulseLoop() {
    // Periodically pulse live data (every 20s) to give the operational feeling
    setInterval(() => {
      if (window.DataService) {
        window.DataService.simulateLivePulse();
        if (window.DashboardController) {
          window.DashboardController.refreshCurrentLocationData();
        }
      }
    }, 20000);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Theme immediately (ensures correct light/dark styles before paint)
    if (window.ThemeManager) {
      window.ThemeManager.init();
    }

    // 2. Initialize Navigation
    if (window.NavigationManager) {
      window.NavigationManager.init();
    }

    // 3. Initialize Charts Engine
    if (window.ChartManager) {
      window.ChartManager.init();
    }

    // 4. Initialize Dashboard Controller
    if (window.DashboardController) {
      await window.DashboardController.init();
    }

    // 5. Initialize Analytics Controller
    if (window.AnalyticsController) {
      await window.AnalyticsController.init();
    }

    // 6. Live Clock & Simulated Ticker
    updateLiveClock();
    setInterval(updateLiveClock, 1000);
    startLivePulseLoop();

    // 7. Initialize Lucide icons if loaded
    if (typeof window.lucide !== 'undefined' && window.lucide.createIcons) {
      window.lucide.createIcons();
    }
  });
})();
