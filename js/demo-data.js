/**
 * GreenPulse - Environmental Monitoring Platform
 * Meghalaya, India
 * 
 * Central Environmental Dataset (Demo / Baseline Data)
 * Structured for future 1:1 drop-in replacement with REST API (/api/environmental-data)
 */

const environmentalData = {
  region: {
    name: "East Khasi Hills & Surrounds",
    state: "Meghalaya",
    country: "India",
    centerCoordinates: [25.5788, 91.8900],
    defaultZoom: 13,
    timezone: "Asia/Kolkata",
    climateZone: "Sub-tropical Highland (Cwb)",
    activeSensorsCount: 56,
    networkStatus: "operational"
  },
  
  // Monitored micro-stations across Meghalaya
  locations: [
    {
      id: "ward-lake",
      name: "Ward's Lake",
      code: "GP-EKB-01",
      category: "Public Eco-Park & Water Basin",
      coordinates: [25.5762, 91.8845],
      elevation: "1,496 m",
      description: "Historic horseshoe-shaped artificial lake enveloped by lush botanical gardens, pine groves, and walking trails.",
      current: {
        temperature: 20.4, // °C
        humidity: 78,      // %
        soilMoisture: 84,  // normalized 0-100 (high organic saturation)
        noiseLevel: 46,    // dB (quiet ambient park)
        airQuality: 88,    // 0-100 score (higher = better quality)
        aqiRaw: 28,        // standard US-EPA/CPCB AQI scale (Good)
        lightIntensity: 68, // % normalized lux
        crowdIndex: 42,    // 0-100 human footprint density
        pm25: 11.2,        // µg/m³
        pm10: 22.4,        // µg/m³
        co2: 412,          // ppm
        ems: 89,           // Eco-Metric Score (0-100)
        status: "excellent",
        statusLabel: "Optimal Ecosystem",
        lastUpdated: "Just now"
      },
      emsHistory24h: [86, 87, 88, 89, 89, 90, 89, 88, 87, 88, 89, 89],
      hourlyLabels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
      insights: [
        "High canopy density dampens sound levels by 18 dB compared to downtown.",
        "Water body retains stable night temperature differential of +1.8°C.",
        "High soil moisture from perimeter wetland drainage."
      ]
    },
    {
      id: "police-bazar",
      name: "Police Bazar (Khyndailad)",
      code: "GP-EKB-02",
      category: "Urban Commercial Core",
      coordinates: [25.5788, 91.8819],
      elevation: "1,480 m",
      description: "Primary commercial and transit nucleus of Shillong with high pedestrian density, shops, and taxi stands.",
      current: {
        temperature: 23.2,
        humidity: 62,
        soilMoisture: 38,
        noiseLevel: 74,    // dB (high urban bustle)
        airQuality: 64,
        aqiRaw: 78,        // Moderate
        lightIntensity: 84,
        crowdIndex: 86,    // High crowd footprint
        pm25: 36.8,
        pm10: 64.2,
        co2: 498,
        ems: 65,
        status: "moderate",
        statusLabel: "Anthropogenic Stress",
        lastUpdated: "1 min ago"
      },
      emsHistory24h: [76, 75, 78, 80, 72, 64, 63, 62, 65, 64, 66, 65],
      hourlyLabels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
      insights: [
        "Elevated ambient acoustic level due to evening commerce peak.",
        "Micro-urban heat island creates +2.8°C delta relative to NEHU campus.",
        "Particulate levels rise during morning and evening transit rush."
      ]
    },
    {
      id: "nehu-campus",
      name: "NEHU Campus (Mawkynroh)",
      code: "GP-EKB-03",
      category: "Academic & Pine Forest Reserve",
      coordinates: [25.6080, 91.9015],
      elevation: "1,525 m",
      description: "Vast 1,000+ acre university sanctuary surrounded by Khasi pine (Pinus kesiya) and rolling hill slopes.",
      current: {
        temperature: 19.8,
        humidity: 74,
        soilMoisture: 89,
        noiseLevel: 36,    // dB (very tranquil)
        airQuality: 96,
        aqiRaw: 14,        // Pristine
        lightIntensity: 71,
        crowdIndex: 22,
        pm25: 6.1,
        pm10: 12.8,
        co2: 395,
        ems: 94,
        status: "excellent",
        statusLabel: "Benchmark Pristine",
        lastUpdated: "Just now"
      },
      emsHistory24h: [93, 94, 94, 95, 95, 94, 93, 94, 94, 94, 95, 94],
      hourlyLabels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
      insights: [
        "Top scoring ecological corridor across all Meghalaya stations.",
        "Photosynthetic carbon absorption optimal under dense Khasi pine cover.",
        "Minimal background noise (36 dB) ideal for biological acoustic baseline."
      ]
    },
    {
      id: "laitumkhrah",
      name: "Laitumkhrah",
      code: "GP-EKB-04",
      category: "Suburban Mixed Educational",
      coordinates: [25.5701, 91.8955],
      elevation: "1,510 m",
      description: "Cultural hub with historic educational institutions, hillside cafes, and residential avenues.",
      current: {
        temperature: 21.1,
        humidity: 69,
        soilMoisture: 64,
        noiseLevel: 58,
        airQuality: 78,
        aqiRaw: 42,
        lightIntensity: 76,
        crowdIndex: 56,
        pm25: 19.4,
        pm10: 38.5,
        co2: 435,
        ems: 79,
        status: "good",
        statusLabel: "Stable Suburban",
        lastUpdated: "2 mins ago"
      },
      emsHistory24h: [82, 82, 83, 84, 80, 78, 77, 78, 79, 79, 80, 79],
      hourlyLabels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
      insights: [
        "Moderate vehicular traffic with quick atmospheric dispersion due to ridge winds.",
        "Even distribution of shade trees maintains steady daytime microclimate.",
        "Soil moisture healthy following pre-monsoon precipitation."
      ]
    },
    {
      id: "mawlai",
      name: "Mawlai Nongkwar",
      code: "GP-EKB-05",
      category: "Valley Residential & Watershed",
      coordinates: [25.5925, 91.8708],
      elevation: "1,440 m",
      description: "Western township situated along descending valley terraces with active local stream catchments.",
      current: {
        temperature: 21.6,
        humidity: 72,
        soilMoisture: 77,
        noiseLevel: 53,
        airQuality: 82,
        aqiRaw: 35,
        lightIntensity: 70,
        crowdIndex: 44,
        pm25: 15.2,
        pm10: 31.0,
        co2: 420,
        ems: 82,
        status: "good",
        statusLabel: "Healthy Catchment",
        lastUpdated: "Just now"
      },
      emsHistory24h: [84, 85, 85, 84, 82, 81, 80, 81, 82, 83, 83, 82],
      hourlyLabels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
      insights: [
        "Valley orientation captures nocturnal thermal inversion layers gently.",
        "Active water drainage buffers soil against compaction.",
        "Air particulates remain consistently low due to mountain breezes."
      ]
    },
    {
      id: "elephant-falls",
      name: "Elephant Falls (Upper Shillong)",
      code: "GP-EKB-06",
      category: "Riparian Cascade Reserve",
      coordinates: [25.5358, 91.8236],
      elevation: "1,620 m",
      description: "Three-tiered mountain waterfall surrounded by fern-carpeted ravines and moist subtropical montane forest.",
      current: {
        temperature: 18.2,
        humidity: 89,
        soilMoisture: 94,
        noiseLevel: 54,    // Water rush sound dominant (natural soundscape)
        airQuality: 95,
        aqiRaw: 16,
        lightIntensity: 55,
        crowdIndex: 35,
        pm25: 7.4,
        pm10: 14.1,
        co2: 398,
        ems: 92,
        status: "excellent",
        statusLabel: "Montane Cascade",
        lastUpdated: "3 mins ago"
      },
      emsHistory24h: [91, 92, 92, 93, 93, 92, 91, 91, 92, 92, 93, 92],
      hourlyLabels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
      insights: [
        "Aerosolized water vapor generates highest relative humidity in station network (89%).",
        "Natural aquatic sound profile creates pleasant auditory profile.",
        "Dense moss layer serves as direct bio-indicator of non-acidic air."
      ]
    },
    {
      id: "umiam-lake",
      name: "Umiam Lake (Barapani)",
      code: "GP-RB-01",
      category: "Lacustrine Hydro-Catchment",
      coordinates: [25.6567, 91.8983],
      elevation: "1,020 m",
      description: "Expansive reservoir basin framed by coniferous hills, regulating regional water retention and recreation.",
      current: {
        temperature: 24.1,
        humidity: 76,
        soilMoisture: 88,
        noiseLevel: 44,
        airQuality: 89,
        aqiRaw: 24,
        lightIntensity: 88,
        crowdIndex: 38,
        pm25: 10.5,
        pm10: 21.0,
        co2: 408,
        ems: 88,
        status: "excellent",
        statusLabel: "Lakeside Open Air",
        lastUpdated: "Just now"
      },
      emsHistory24h: [87, 88, 88, 89, 89, 88, 87, 88, 88, 89, 88, 88],
      hourlyLabels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
      insights: [
        "Warmest daytime node due to lower altitude (1,020 m) vs Shillong plateau.",
        "Unobstructed surface allows high solar irradiance index.",
        "Surface evaporation supports consistent convective micro-cloud formation."
      ]
    },
    {
      id: "cherrapunji-sohra",
      name: "Sohra (Cherrapunji)",
      code: "GP-WKB-01",
      category: "Pluviometric Highland Plateau",
      coordinates: [25.2702, 91.7323],
      elevation: "1,430 m",
      description: "World-renowned high precipitation southern escarpment overlooking Bangladesh plains, rich in limestone gorges.",
      current: {
        temperature: 18.9,
        humidity: 92,
        soilMoisture: 96,
        noiseLevel: 38,
        airQuality: 98,
        aqiRaw: 10,
        lightIntensity: 62,
        crowdIndex: 28,
        pm25: 4.8,
        pm10: 9.2,
        co2: 391,
        ems: 95,
        status: "excellent",
        statusLabel: "Exceptional Ecological Purity",
        lastUpdated: "1 min ago"
      },
      emsHistory24h: [94, 95, 95, 96, 96, 95, 94, 95, 95, 95, 96, 95],
      hourlyLabels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
      insights: [
        "Cleanest air quality reading (AQI 10, PM2.5 4.8 µg/m³) recorded this cycle.",
        "Orographic wind currents continuously flush airborne particulate matter.",
        "Topsoil saturation at 96% with active moss carpet filtration."
      ]
    }
  ],

  // 7-day regional historical aggregate for analytics
  regionalTrends: {
    dates: ["Aug 30", "Aug 31", "Sep 01", "Sep 02", "Sep 03", "Sep 04", "Sep 05"],
    averageEMS: [84.2, 85.1, 83.8, 86.0, 85.4, 85.8, 86.0],
    averageTemp: [20.8, 21.2, 20.5, 21.0, 20.9, 21.4, 20.9],
    averageHumidity: [74, 76, 78, 75, 76, 73, 76],
    averageAQI: [32, 29, 31, 28, 27, 30, 28]
  },

  // Derived environmental insights for the analytics view
  environmentalInsights: [
    {
      id: "pure-air",
      title: "Cleanest Atmosphere",
      location: "Sohra (Cherrapunji)",
      value: "AQI 10 / PM2.5 4.8 µg/m³",
      type: "positive",
      summary: "Southern escarpment orographic wind flushes keep suspended particulates well below WHO target levels."
    },
    {
      id: "highest-noise",
      title: "Anthropogenic Noise Hotspot",
      location: "Police Bazar (Khyndailad)",
      value: "74 dB Peak",
      type: "advisory",
      summary: "Exceeds CPCB commercial daytime guideline of 65 dB due to transit convergence and commercial activity."
    },
    {
      id: "lowest-temp",
      title: "Coolest Microclimate",
      location: "Elephant Falls",
      value: "18.2°C (Δ -5.0°C vs Barapani)",
      type: "neutral",
      summary: "Shaded riparian gorge and adiabatic cooling effect reduce ambient temperatures by 5.0°C relative to lake level."
    },
    {
      id: "top-soil",
      title: "Maximum Soil Hydration",
      location: "Sohra Plateau & Falls",
      value: "96 / 100 Moisture Index",
      type: "positive",
      summary: "Deep root mycorrhizal network maintains water balance despite steep karst limestone runoff."
    },
    {
      id: "highest-crowd",
      title: "Highest Footprint Density",
      location: "Police Bazar",
      value: "86 / 100 Crowd Index",
      type: "advisory",
      summary: "Pedestrian density peak correlates with elevated ambient VOC and carbon dioxide (498 ppm)."
    },
    {
      id: "benchmark-purity",
      title: "Top Eco-Metric Score (EMS)",
      location: "Sohra & NEHU Sanctuary",
      value: "95 / 100 EMS Benchmark",
      type: "positive",
      summary: "Balanced synergy between pine canopy, low decibel profile, and clean particulate readings."
    }
  ]
};

// Expose on global window object for vanilla script usage
if (typeof window !== "undefined") {
  window.environmentalData = environmentalData;
}
