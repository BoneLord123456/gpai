/**
 * GreenPulse - Charts Controller (charts.js)
 * 
 * Powered by Chart.js.
 * Built with professional SaaS design principles:
 * - Disciplined color palette: primary green, neutral slate grays.
 * - Restrained grid lines (subtle, non-distracting).
 * - Full reactivity on theme change (Light / Dark mode).
 * - Proper destruction of existing chart instances to prevent memory leaks or canvas corruption.
 */

(function (window) {
  'use strict';

  // Palette tokens for Chart.js
  function getThemeColors() {
    const isDark = window.ThemeManager ? window.ThemeManager.isDark() : false;
    return {
      isDark,
      primary: '#279655',
      primaryTransparent: isDark ? 'rgba(39, 150, 85, 0.25)' : 'rgba(39, 150, 85, 0.12)',
      primaryLight: isDark ? '#34d399' : '#1e7e45',
      secondary: isDark ? '#4ade80' : '#22c55e',
      text: isDark ? '#9CA3AF' : '#4B5563',
      textStrong: isDark ? '#F3F4F6' : '#111827',
      grid: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
      border: isDark ? '#26332B' : '#E2E8E4',
      tooltipBg: isDark ? '#1F2823' : '#FFFFFF',
      tooltipText: isDark ? '#F3F4F6' : '#111827',
      tooltipBorder: isDark ? '#2A352F' : '#E5E9E7',
      advisoryColor: '#D97706',
      alertColor: '#DC2626'
    };
  }

  const ChartManager = {
    instances: {},

    init() {
      // Listen for theme switch to update chart visuals dynamically
      window.addEventListener('themeChanged', () => {
        this.updateAllChartsTheme();
      });
    },

    /**
     * Safely destroy an existing chart instance
     * @param {string} key 
     */
    destroyChart(key) {
      if (this.instances[key]) {
        this.instances[key].destroy();
        delete this.instances[key];
      }
    },

    /**
     * Render the EMS 24-hour trend line chart on Dashboard
     */
    renderEMSTrend(canvasId, labels, dataPoints, locationName) {
      const canvas = document.getElementById(canvasId);
      if (!canvas || typeof Chart === 'undefined') return;

      this.destroyChart(canvasId);
      const colors = getThemeColors();
      const ctx = canvas.getContext('2d');

      // Create subtle gradient fill
      const gradient = ctx.createLinearGradient(0, 0, 0, 180);
      gradient.addColorStop(0, colors.primaryTransparent);
      gradient.addColorStop(1, 'rgba(39, 150, 85, 0.00)');

      this.instances[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `${locationName} EMS`,
            data: dataPoints,
            borderColor: colors.primary,
            backgroundColor: gradient,
            borderWidth: 2.2,
            tension: 0.35,
            fill: true,
            pointBackgroundColor: colors.primary,
            pointBorderColor: colors.tooltipBg,
            pointBorderWidth: 2,
            pointRadius: 3.5,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: colors.primary,
            pointHoverBorderColor: colors.tooltipBg,
            pointHoverBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: colors.tooltipBg,
              titleColor: colors.tooltipText,
              bodyColor: colors.text,
              borderColor: colors.tooltipBorder,
              borderWidth: 1,
              padding: 10,
              boxPadding: 4,
              usePointStyle: true,
              callbacks: {
                label: function (context) {
                  return `EMS Index: ${context.parsed.y} / 100`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false,
                drawBorder: false
              },
              ticks: {
                color: colors.text,
                font: { size: 11, family: 'inherit' },
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 6
              }
            },
            y: {
              min: 50,
              max: 100,
              grid: {
                color: colors.grid,
                drawBorder: false
              },
              ticks: {
                color: colors.text,
                font: { size: 11, family: 'inherit' },
                stepSize: 10
              }
            }
          }
        }
      });
    },

    /**
     * Render the Comparative Location Bar Chart on Analytics view
     */
    renderLocationComparison(canvasId, locations) {
      const canvas = document.getElementById(canvasId);
      if (!canvas || typeof Chart === 'undefined' || !locations) return;

      this.destroyChart(canvasId);
      const colors = getThemeColors();
      const ctx = canvas.getContext('2d');

      // Sort locations descending by EMS
      const sorted = [...locations].sort((a, b) => b.current.ems - a.current.ems);
      const labels = sorted.map(l => l.name);
      const emsScores = sorted.map(l => l.current.ems);
      
      // Color bars according to status (restrained)
      const barColors = sorted.map(l => {
        if (l.current.status === 'moderate') return colors.advisoryColor;
        if (l.current.status === 'alert') return colors.alertColor;
        return colors.primary;
      });

      this.instances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Eco-Metric Score (EMS)',
            data: emsScores,
            backgroundColor: barColors,
            borderRadius: 4,
            borderSkipped: false,
            maxBarThickness: 34
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: colors.tooltipBg,
              titleColor: colors.tooltipText,
              bodyColor: colors.text,
              borderColor: colors.tooltipBorder,
              borderWidth: 1,
              padding: 10,
              callbacks: {
                afterLabel: function(ctx) {
                  const loc = sorted[ctx.dataIndex];
                  return `Category: ${loc.category}\nStatus: ${loc.current.statusLabel}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false, drawBorder: false },
              ticks: {
                color: colors.text,
                font: { size: 11, family: 'inherit' },
                maxRotation: 25,
                minRotation: 0
              }
            },
            y: {
              min: 40,
              max: 100,
              grid: { color: colors.grid, drawBorder: false },
              ticks: {
                color: colors.text,
                font: { size: 11, family: 'inherit' },
                stepSize: 15
              }
            }
          }
        }
      });
    },

    /**
     * Render Regional 7-day Historical Trend on Analytics
     */
    renderRegionalTrend(canvasId, regionalTrends) {
      const canvas = document.getElementById(canvasId);
      if (!canvas || typeof Chart === 'undefined' || !regionalTrends) return;

      this.destroyChart(canvasId);
      const colors = getThemeColors();
      const ctx = canvas.getContext('2d');

      this.instances[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: regionalTrends.dates,
          datasets: [
            {
              label: 'Regional Average EMS',
              data: regionalTrends.averageEMS,
              borderColor: colors.primary,
              backgroundColor: 'transparent',
              borderWidth: 2.2,
              tension: 0.35,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: colors.primary,
              pointBorderColor: colors.tooltipBg,
              yAxisID: 'y'
            },
            {
              label: 'Avg Temperature (°C)',
              data: regionalTrends.averageTemp,
              borderColor: '#0284C7', // subtle blue-slate for temperature
              backgroundColor: 'transparent',
              borderWidth: 1.8,
              borderDash: [4, 4],
              tension: 0.35,
              pointRadius: 3,
              pointBackgroundColor: '#0284C7',
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              align: 'end',
              labels: {
                boxWidth: 12,
                boxHeight: 12,
                color: colors.text,
                font: { size: 11, family: 'inherit' },
                usePointStyle: true
              }
            },
            tooltip: {
              backgroundColor: colors.tooltipBg,
              titleColor: colors.tooltipText,
              bodyColor: colors.text,
              borderColor: colors.tooltipBorder,
              borderWidth: 1,
              padding: 10
            }
          },
          scales: {
            x: {
              grid: { display: false, drawBorder: false },
              ticks: { color: colors.text, font: { size: 11, family: 'inherit' } }
            },
            y: {
              type: 'linear',
              position: 'left',
              min: 75,
              max: 95,
              grid: { color: colors.grid, drawBorder: false },
              ticks: {
                color: colors.text,
                font: { size: 11, family: 'inherit' },
                callback: v => `${v} EMS`
              }
            },
            y1: {
              type: 'linear',
              position: 'right',
              min: 15,
              max: 30,
              grid: { display: false, drawBorder: false },
              ticks: {
                color: colors.text,
                font: { size: 11, family: 'inherit' },
                callback: v => `${v}°C`
              }
            }
          }
        }
      });
    },

    /**
     * Render Radar Chart for Multi-Sensor Parameter Comparison
     */
    renderSensorRadar(canvasId, location) {
      const canvas = document.getElementById(canvasId);
      if (!canvas || typeof Chart === 'undefined' || !location) return;

      this.destroyChart(canvasId);
      const colors = getThemeColors();
      const ctx = canvas.getContext('2d');

      // Normalized parameters: Air Quality, Soil, Quietude (100-noise), Thermal Comfort, Moisture, Anthropogenic Freedom (100-crowd)
      const quietudeScore = Math.max(10, 100 - (location.current.noiseLevel - 30) * 1.5);
      const crowdScore = Math.max(10, 100 - location.current.crowdIndex);
      const thermalScore = Math.max(20, 100 - Math.abs(location.current.temperature - 21) * 6);

      const labels = ['Air Quality', 'Soil Hydration', 'Acoustic Calm', 'Relative Humidity', 'Thermal Stability', 'Low Footprint'];
      const locationData = [
        location.current.airQuality,
        location.current.soilMoisture,
        Math.round(quietudeScore),
        location.current.humidity,
        Math.round(thermalScore),
        Math.round(crowdScore)
      ];

      // Regional baseline benchmark
      const baselineData = [80, 75, 70, 72, 85, 65];

      this.instances[canvasId] = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [
            {
              label: location.name,
              data: locationData,
              fill: true,
              backgroundColor: colors.primaryTransparent,
              borderColor: colors.primary,
              pointBackgroundColor: colors.primary,
              pointBorderColor: colors.tooltipBg,
              pointHoverBackgroundColor: colors.tooltipBg,
              pointHoverBorderColor: colors.primary,
              borderWidth: 2
            },
            {
              label: 'Regional Average',
              data: baselineData,
              fill: false,
              borderColor: colors.isDark ? '#4B5563' : '#9CA3AF',
              borderDash: [3, 3],
              pointRadius: 2,
              borderWidth: 1.5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,
                color: colors.text,
                font: { size: 11, family: 'inherit' },
                usePointStyle: true
              }
            },
            tooltip: {
              backgroundColor: colors.tooltipBg,
              titleColor: colors.tooltipText,
              bodyColor: colors.text,
              borderColor: colors.tooltipBorder,
              borderWidth: 1,
              padding: 8
            }
          },
          scales: {
            r: {
              angleLines: { color: colors.grid },
              grid: { color: colors.grid },
              pointLabels: {
                color: colors.text,
                font: { size: 10.5, family: 'inherit' }
              },
              ticks: {
                display: false,
                backdropColor: 'transparent',
                stepSize: 25,
                max: 100,
                min: 0
              },
              suggestedMin: 20,
              suggestedMax: 100
            }
          }
        }
      });
    },

    /**
     * Refresh all active charts when theme toggles
     */
    updateAllChartsTheme() {
      // Loop through all active instances and re-render if data exists
      Object.keys(this.instances).forEach(id => {
        const chart = this.instances[id];
        if (!chart) return;
        const colors = getThemeColors();

        if (chart.config.type === 'line' || chart.config.type === 'bar') {
          if (chart.options.scales.x) {
            chart.options.scales.x.ticks.color = colors.text;
            if (chart.options.scales.x.grid) chart.options.scales.x.grid.color = colors.grid;
          }
          if (chart.options.scales.y) {
            chart.options.scales.y.ticks.color = colors.text;
            chart.options.scales.y.grid.color = colors.grid;
          }
          if (chart.options.scales.y1) {
            chart.options.scales.y1.ticks.color = colors.text;
          }
          if (chart.options.plugins.tooltip) {
            chart.options.plugins.tooltip.backgroundColor = colors.tooltipBg;
            chart.options.plugins.tooltip.titleColor = colors.tooltipText;
            chart.options.plugins.tooltip.bodyColor = colors.text;
            chart.options.plugins.tooltip.borderColor = colors.tooltipBorder;
          }
          if (chart.options.plugins.legend) {
            chart.options.plugins.legend.labels.color = colors.text;
          }
        } else if (chart.config.type === 'radar') {
          if (chart.options.scales.r) {
            chart.options.scales.r.angleLines.color = colors.grid;
            chart.options.scales.r.grid.color = colors.grid;
            chart.options.scales.r.pointLabels.color = colors.text;
          }
          if (chart.options.plugins.legend) {
            chart.options.plugins.legend.labels.color = colors.text;
          }
        }
        chart.update();
      });
    }
  };

  window.ChartManager = ChartManager;
})(window);
