
const solarRadiation = {
    Bangalore: { north: 150, south: 250, east: 200, west: 200, roof: 300 },
    Mumbai: { north: 180, south: 350, east: 280, west: 270, roof: 400 },
    Kolkata: { north: 200, south: 400, east: 300, west: 290, roof: 450 },
    Delhi: { north: 160, south: 270, east: 220, west: 220, roof: 320 },
  };
  
  const electricityRates = {
    Bangalore: 6.5,
    Mumbai: 9.0,
    Kolkata: 7.5,
    Delhi: 8.5,
  };
  
  const COP = 4; // Coefficient of Performance (Efficiency)
  const HOURS_PER_DAY = 8; // Daily sunlight hours
  const BTU_TO_KWH = 3412; // Conversion factor
  
  // Calculate heat gain and cooling cost
  export const calculateHeatGain = (design, city) => {
    if (!solarRadiation[city] || !electricityRates[city]) {
      throw new Error("Invalid city provided for calculation.");
    }
  
    let totalHeatGain = 0;
  
    // Loop through facades (north, south, east, west)
    for (const direction of ["north", "south", "east", "west"]) {
      const { width, height } = design.dimensions[direction];
      const area = width * height * design.wwr[direction]; // Window area
      const G = solarRadiation[city][direction]; // Solar radiation intensity
      const heatGain = area * design.shgc * G * HOURS_PER_DAY;
      totalHeatGain += heatGain;
    }
  
    // Skylight calculation (optional)
    if (design.skylight?.width && design.skylight?.height) {
      const skylightArea = design.skylight.width * design.skylight.height;
      totalHeatGain += skylightArea * design.shgc * solarRadiation[city].roof * HOURS_PER_DAY;
    }
  
    // Convert Heat Gain to Cooling Load (kWh)
    const coolingLoadKWh = totalHeatGain / BTU_TO_KWH;
  
    // Energy consumed considering system efficiency (COP)
    const energyConsumedKWh = coolingLoadKWh / COP;
  
    // Cooling cost calculation
    const coolingCost = energyConsumedKWh * electricityRates[city];
  
    return {
      totalHeatGain: totalHeatGain.toFixed(2),
      coolingLoadKWh: coolingLoadKWh.toFixed(2),
      energyConsumedKWh: energyConsumedKWh.toFixed(2),
      coolingCost: coolingCost.toFixed(2),
    };
  };
  