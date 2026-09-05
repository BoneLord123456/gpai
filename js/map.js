/**
 * GreenPulse - Leaflet Map Integration (map.js)
 * 
 * Manages environmental geographic telemetry across Meghalaya:
 * - High performance, lightweight custom Leaflet SVG pin markers.
 * - Reactive CartoDB tile switching between Light & Dark themes.
 * - Click-to-inspect interaction updating active dashboard telemetry.
 * - Auto-centering and smooth flyTo on selection.
 */

(function (window) {
  'use strict';

  const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  const TILE_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  const MapController = {
    map: null,
    tileLayer: null,
    markers: {},
    selectedLocationId: null,
    onLocationSelectCallback: null,

    init(containerId = 'leaflet-map', onSelectCallback = null) {
      this.onLocationSelectCallback = onSelectCallback;
      const container = document.getElementById(containerId);
      if (!container || typeof L === 'undefined') return;

      // Initial center over Shillong Plateau
      const defaultCenter = [25.5788, 91.8900];
      const defaultZoom = 12;

      this.map = L.map(containerId, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false,
        attributionControl: true
      });

      // Add zoom control at bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(this.map);

      // Add appropriate theme tile layer
      this.updateTileLayer();

      // Listen for theme change events
      window.addEventListener('themeChanged', () => {
        this.updateTileLayer();
      });

      // Handle window resize cleanly
      window.addEventListener('resize', () => {
        this.invalidateSize();
      });
    },

    updateTileLayer() {
      if (!this.map) return;
      const isDark = window.ThemeManager ? window.ThemeManager.isDark() : false;
      const targetUrl = isDark ? TILE_DARK : TILE_LIGHT;

      if (this.tileLayer) {
        this.map.removeLayer(this.tileLayer);
      }

      this.tileLayer = L.tileLayer(targetUrl, {
        attribution: TILE_ATTR,
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(this.map);
    },

    /**
     * Populate location markers
     * @param {Array} locations 
     * @param {string} activeId 
     */
    setLocations(locations, activeId = null) {
      if (!this.map || !locations) return;

      // Clear existing markers
      Object.values(this.markers).forEach(m => this.map.removeLayer(m));
      this.markers = {};

      locations.forEach(loc => {
        const isSelected = loc.id === activeId;
        const icon = this._createCustomPinIcon(loc, isSelected);

        const marker = L.marker(loc.coordinates, {
          icon: icon,
          title: loc.name
        }).addTo(this.map);

        // Tooltip on hover
        marker.bindTooltip(`
          <div class="map-tooltip">
            <strong>${loc.name}</strong>
            <span>EMS: ${loc.current.ems} • ${loc.current.temperature}°C</span>
          </div>
        `, {
          direction: 'top',
          offset: [0, -18],
          className: 'custom-map-tooltip'
        });

        marker.on('click', () => {
          this.selectLocation(loc.id, true);
        });

        this.markers[loc.id] = marker;
      });

      if (activeId) {
        this.selectedLocationId = activeId;
      }
    },

    selectLocation(locationId, triggerCallback = true) {
      if (!this.map) return;

      const prevId = this.selectedLocationId;
      this.selectedLocationId = locationId;

      // Update marker icons to reflect active state
      if (prevId && this.markers[prevId] && window.environmentalData) {
        const prevLoc = window.environmentalData.locations.find(l => l.id === prevId);
        if (prevLoc) {
          this.markers[prevId].setIcon(this._createCustomPinIcon(prevLoc, false));
        }
      }

      if (locationId && this.markers[locationId] && window.environmentalData) {
        const currLoc = window.environmentalData.locations.find(l => l.id === locationId);
        if (currLoc) {
          this.markers[locationId].setIcon(this._createCustomPinIcon(currLoc, true));
          // Center smoothly with balanced zoom
          this.map.flyTo(currLoc.coordinates, 13.5, {
            animate: true,
            duration: 0.8
          });
        }
      }

      if (triggerCallback && typeof this.onLocationSelectCallback === 'function') {
        this.onLocationSelectCallback(locationId);
      }
    },

    _createCustomPinIcon(location, isSelected) {
      const ems = location.current.ems;
      const status = location.current.status;
      
      let statusColor = '#279655'; // default GreenPulse primary
      if (status === 'moderate') statusColor = '#D97706';
      if (status === 'alert') statusColor = '#DC2626';

      const selectedClass = isSelected ? 'is-active-marker' : '';

      const html = `
        <div class="gp-map-pin ${selectedClass}" style="--pin-color: ${statusColor};">
          <div class="gp-pin-pulse"></div>
          <div class="gp-pin-bubble">
            <span class="gp-pin-score">${ems}</span>
          </div>
          <div class="gp-pin-needle"></div>
        </div>
      `;

      return L.divIcon({
        html: html,
        className: 'gp-pin-container',
        iconSize: [36, 44],
        iconAnchor: [18, 42]
      });
    },

    invalidateSize() {
      if (this.map) {
        setTimeout(() => {
          this.map.invalidateSize();
        }, 100);
      }
    },

    resetBounds() {
      if (!this.map || !window.environmentalData) return;
      const coords = window.environmentalData.locations.map(l => l.coordinates);
      const bounds = L.latLngBounds(coords);
      this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  };

  window.MapController = MapController;
})(window);
