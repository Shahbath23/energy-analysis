

// Validate input for heat gain calculation
export const validateAnalysisInput = (req, res, next) => {
  const { designId, city } = req.query; // Change from req.body to req.query

  if (!designId) {
    return res.status(400).json({ message: "designId is required." });
  }

  if (!city || !validCities.includes(city)) {
    return res.status(400).json({
      message: "A valid city (Bangalore, Mumbai, Kolkata, Delhi) is required.",
    });
  }

  next();
};

// Validate input for design comparison



export const validateCityRankingsInput = (req, res, next) => {
    const { designId } = req.query;
  
    // Ensure that the designId is provided in the query
    if (!designId) {
      return res.status(400).json({ message: "designId is required in query parameters." });
    }
  
    // Optionally, check if the designId is a valid MongoDB ObjectId format (if using MongoDB)
    if (!/^[0-9a-fA-F]{24}$/.test(designId)) {
      return res.status(400).json({ message: "Invalid designId format." });
    }
  
    next();
  };
  



export const validateCompareInput = (req, res, next) => {
    const { designIds, city } = req.query;
  
    if (!designIds || !city) {
      return res.status(400).json({ message: "Both city and designIds are required." });
    }
  
    // Convert designIds into an array (split by commas)
    const designIdsArray = designIds.split(',');
  
    if (designIdsArray.length < 2) {
      return res
        .status(400)
        .json({ message: "At least two valid designIds are required for comparison." });
    }
  
    // Ensure valid city
    const validCities = ["Bangalore", "Mumbai", "Kolkata", "Delhi"];
    if (!validCities.includes(city)) {
      return res.status(400).json({
        message: "A valid city (Bangalore, Mumbai, Kolkata, Delhi) is required.",
      });
    }
  
    // Attach the parsed array back to the request
    req.query.designIds = designIdsArray;
  
    next();
  };
  

  
