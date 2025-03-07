import BuildingDesign from "../model/buildingDesign.js";
import { calculateHeatGain } from "../utils/heatGainCalculator.js";

const analysisCltr = {};

// Analyze heat gain and cooling cost
analysisCltr.analyzeDesign = async (req, res) => {
  try {
    const { designId, city } = req.body;
    if (!designId || !city) {
      return res.status(400).json({ message: "designId and city are required" });
    }
    const design = await BuildingDesign.findById(designId);
    if (!design) return res.status(404).json({ message: "Building design not found" });
    const result = calculateHeatGain(design, city);

    res.status(200).json({ design, analysis: result });
  } catch (error) {
    res.status(500).json({ message: "Error analyzing design", error: error.message });
  }
};


analysisCltr.compareDesigns = async (req, res) => {
  try {
    const { city, designIds } = req.query;
console.log('Received city:', city);
console.log('Received designIds:', designIds);


    if (!city) {
      return res.status(400).json({ message: 'City is required for comparison.' });
    }

    let designIdsArray = Array.isArray(designIds) ? designIds : designIds.split(',');

    designIdsArray = designIdsArray.map(id => decodeURIComponent(id));

    if (designIdsArray.length < 2) {
      return res.status(400).json({ message: 'At least two valid designIds are required for comparison.' });
    }

    const designs = await BuildingDesign.find({ _id: { $in: designIdsArray } });

    if (designs.length !== designIdsArray.length) {
      return res.status(404).json({ message: 'One or more designs not found.' });
    }

    const comparisonResults = designs.map((design) => ({
      design,
      analysis: calculateHeatGain(design, city), // Assuming calculateHeatGain is a valid function
    }));

    res.status(200).json({ comparisonResults });

  } catch (error) {
    console.error('Error comparing designs:', error);
    res.status(500).json({ message: 'Error comparing designs', error: error.message });
  }
};



analysisCltr.getCityRankings = async (req, res) => {
  try {
    const { designId } = req.query;  

    const design = await BuildingDesign.findById(designId);
    if (!design) {
      return res.status(404).json({ message: "Building design not found" });
    }

    const cities = ["Bangalore", "Mumbai", "Kolkata", "Delhi"];

    const cityRankings = [];
    for (let city of cities) {
      try {
        const result = calculateHeatGain(design, city);
        cityRankings.push({
          city,
          coolingCost: parseFloat(result.coolingCost),
          energyEfficiency: result.energyEfficiency,
        });
      } catch (error) {
        console.error(`Error calculating for city ${city}:`, error);
        cityRankings.push({ city, error: "Error calculating data" });
      }
    }

    cityRankings.sort((a, b) => a.coolingCost - b.coolingCost);

    cityRankings.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    res.status(200).json({ design, cityRankings });
  } catch (error) {
    console.error('Error fetching city rankings:', error);
    res.status(500).json({ message: "Error fetching city rankings", error: error.message });
  }
};



export default analysisCltr;
