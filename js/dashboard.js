/**
 * GreenPulse - Dashboard Controller (dashboard.js)
 * 
 * Orchestrates the main dashboard screen:
 * - Station selection & state synchronization.
 * - Environmental telemetry card updates (temperature, humidity, air quality, noise, etc.).
 * - Prominent Eco-Metric Score (EMS) gauge & status badge.
 * - 24-hour EMS trend chart via ChartManager.
 * - Station quick-list with real-time status pills.
 */

(function (window) {
  'use strict';

  const DashboardController = {
    selectedLocationId: 'ward-lake', // default initial selection
    locations: [],
    
    async init() {
      if (!window.DataService) return;
      this.locations = await window.DataService.getLocations();
      
      this.renderLocationSelectorOptions();
      this.renderLocationQuickList();
      this.bindEvents();
      
      // Initialize Leaflet Map with selection callback
      if (window.MapController) {
        window.MapController.init('leaflet-map', (id) => {
          this.selectLocation(id, false); // select without cyclic map trigger
        });
        window.MapController.setLocations(this.locations, this.selectedLocationId);
      }

      // Initial render for selected location
      await this.updateDashboardView(this.selectedLocationId);
    },

    bindEvents() {
      // Dropdown location selector in topbar/dashboard header
      const locationSelect = document.getElementById('location-dropdown');
      if (locationSelect) {
        locationSelect.addEventListener('change', (e) => {
          this.selectLocation(e.target.value, true);
        });
      }

      // Map reset zoom button
      const resetMapBtn = document.getElementById('btn-reset-map');
      if (resetMapBtn && window.MapController) {
        resetMapBtn.addEventListener('click', () => {
          window.MapController.resetBounds();
        });
      }

      // Bind Topbar Refresh button
      const topbarRefreshBtn = document.getElementById('btn-topbar-refresh');
      if (topbarRefreshBtn) {
        topbarRefreshBtn.addEventListener('click', async () => {
          topbarRefreshBtn.classList.add('opacity-75');
          if (window.DataService) {
            window.DataService.simulateLivePulse();
          }
          await this.refreshCurrentLocationData();
          setTimeout(() => {
            topbarRefreshBtn.classList.remove('opacity-75');
          }, 400);
        });
      }
    },

    /**
     * Render the station select options
     */
    renderLocationSelectorOptions() {
      const select = document.getElementById('location-dropdown');
      if (!select || !this.locations) return;

      select.innerHTML = this.locations.map(loc => `
        <option value="${loc.id}" ${loc.id === this.selectedLocationId ? 'selected' : ''}>
          ${loc.name} (EMS: ${loc.current.ems})
        </option>
      `).join('');
    },

    /**
     * Render horizontal/vertical quick-select list of stations
     */
    renderLocationQuickList() {
      const container = document.getElementById('station-quick-list');
      if (!container || !this.locations) return;

      container.innerHTML = this.locations.map(loc => {
        const isSelected = loc.id === this.selectedLocationId;
        const statusClass = `status-${loc.current.status}`;
        
        return `
          <button type="button" 
                  class="station-card-item ${isSelected ? 'is-selected' : ''}" 
                  data-location-id="${loc.id}"
                  id="station-card-${loc.id}">
            <div class="station-card-top">
              <span class="station-card-name">${loc.name}</span>
              <span class="status-badge ${statusClass}">${loc.current.ems} EMS</span>
            </div>
            <div class="station-card-meta">
              <span>${loc.current.temperature}°C</span>
              <span>•</span>
              <span>AQI ${loc.current.aqiRaw}</span>
              <span>•</span>
              <span>${loc.category.split(' ')[0]}</span>
            </div>
          </button>
        `;
      }).join('');

      // Attach click events
      container.querySelectorAll('.station-card-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const locId = btn.getAttribute('data-location-id');
          this.selectLocation(locId, true);
        });
      });
    },

    /**
     * Switch currently selected station
     */
    async selectLocation(locationId, updateMap = true) {
      if (!locationId || locationId === this.selectedLocationId) {
        if (updateMap && window.MapController) {
          window.MapController.selectLocation(locationId, false);
        }
        return;
      }

      this.selectedLocationId = locationId;

      // Update dropdown selection if present
      const select = document.getElementById('location-dropdown');
      if (select && select.value !== locationId) {
        select.value = locationId;
      }

      // Update quick list item highlights
      const items = document.querySelectorAll('.station-card-item');
      items.forEach(item => {
        const isSelected = item.getAttribute('data-location-id') === locationId;
        item.classList.toggle('is-selected', isSelected);
      });

      // Update Leaflet map
      if (updateMap && window.MapController) {
        window.MapController.selectLocation(locationId, false);
      }

      // Update telemetry display
      await this.updateDashboardView(locationId);
    },

    /**
     * Update all DOM elements reflecting the selected station
     */
    async updateDashboardView(locationId) {
      const loc = await window.DataService.getLocationById(locationId);
      if (!loc) return;

      // Update Station Header info
      this._setElementText('selected-station-name', loc.name);
      this._setElementText('selected-station-code', loc.code);
      this._setElementText('selected-station-elevation', loc.elevation);
      this._setElementText('selected-station-category', loc.category);
      this._setElementText('selected-station-desc', loc.description);
      this._setElementText('selected-station-coords', `${loc.coordinates[0].toFixed(4)}° N, ${loc.coordinates[1].toFixed(4)}° E`);

      // Update Topbar Title and Breadcrumb District
      const topbarDistrict = document.getElementById('topbar-district');
      if (topbarDistrict) {
        topbarDistrict.textContent = loc.district || 'East Khasi Hills';
      }
      const topbarTitle = document.getElementById('topbar-view-title');
      if (topbarTitle && window.NavigationManager && window.NavigationManager.currentView === 'dashboard') {
        topbarTitle.textContent = `${loc.district || 'Meghalaya'}: ${loc.name}`;
      }

      // Update Map Header Badges
      const mapAqi = document.getElementById('map-header-aqi');
      if (mapAqi) {
        const aqiLabel = loc.current.airQuality >= 80 ? 'AQI: Optimal' : loc.current.airQuality >= 65 ? 'AQI: Moderate' : 'AQI: Advisory';
        mapAqi.textContent = aqiLabel;
      }
      const mapTemp = document.getElementById('map-header-temp');
      if (mapTemp) {
        mapTemp.textContent = `Temp: ${loc.current.temperature}°C`;
      }

      // Update Status Badge
      const statusBadge = document.getElementById('selected-station-status-badge');
      if (statusBadge) {
        statusBadge.className = `status-badge status-${loc.current.status}`;
        statusBadge.textContent = loc.current.statusLabel;
      }

      // Update Primary Eco-Metric Score (EMS)
      this._setElementText('ems-score-value', loc.current.ems);
      const emsRing = document.getElementById('ems-gauge-circle');
      if (emsRing) {
        // Circumference is 2 * PI * 42 ~= 264
        const strokeDashoffset = 264 - (264 * loc.current.ems) / 100;
        emsRing.style.strokeDashoffset = strokeDashoffset;
      }

      // Update EMS Progress Fill & Descriptions
      const emsProgressFill = document.getElementById('ems-progress-fill');
      if (emsProgressFill) {
        emsProgressFill.style.width = `${Math.min(100, Math.max(0, loc.current.ems))}%`;
      }
      const emsTitle = document.getElementById('ems-banner-title');
      const emsDesc = document.getElementById('ems-banner-desc');
      if (emsTitle && emsDesc) {
        if (loc.current.ems >= 80) {
          emsTitle.textContent = 'The environment is currently thriving';
          emsDesc.textContent = 'All primary indicators are within safe thresholds.';
        } else if (loc.current.ems >= 65) {
          emsTitle.textContent = 'Ecosystem within acceptable margins';
          emsDesc.textContent = 'Moderate variance in air quality or acoustic levels detected.';
        } else {
          emsTitle.textContent = 'Elevated ecological variance detected';
          emsDesc.textContent = 'Environmental sensors indicate active advisory condition.';
        }
      }

      // Update Sensor Grid Values
      this._setElementText('val-temp', `${loc.current.temperature}°C`);
      this._setElementText('val-humidity', `${loc.current.humidity}%`);
      this._setElementText('val-airquality', `${loc.current.airQuality} / 100`);
      this._setElementText('val-aqi-sub', `AQI ${loc.current.aqiRaw} • PM2.5 ${loc.current.pm25} µg/m³`);
      this._setElementText('val-soil', `${loc.current.soilMoisture} / 100`);
      this._setElementText('val-noise', `${loc.current.noiseLevel} dB`);
      this._setElementText('val-light', `${loc.current.lightIntensity} / 100`);
      this._setElementText('val-crowd', `${loc.current.crowdIndex} / 100`);
      this._setElementText('val-co2', `${loc.current.co2} ppm`);

      // Update Insights list
      const insightsList = document.getElementById('selected-station-insights');
      if (insightsList && loc.insights) {
        insightsList.innerHTML = loc.insights.map(item => `
          <li class="insight-bullet">
            <span class="bullet-dot"></span>
            <span>${item}</span>
          </li>
        `).join('');
      }

      // Update 24h EMS Line Chart
      if (window.ChartManager) {
        const history = await window.DataService.getEMSHistory(locationId, '24h');
        window.ChartManager.renderEMSTrend('chart-ems-trend', history.labels, history.values, loc.name);
      }
    },

    /**
     * Refresh data without resetting map bounds (used for live ticks)
     */
    async refreshCurrentLocationData() {
      if (!this.selectedLocationId) return;
      await this.updateDashboardView(this.selectedLocationId);
      this.renderLocationQuickList();
      if (window.MapController && this.locations) {
        window.MapController.setLocations(this.locations, this.selectedLocationId);
      }
    },

    _setElementText(id, text) {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    }
  };

  window.DashboardController = DashboardController;
})(window);
