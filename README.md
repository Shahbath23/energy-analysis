# Building Energy Analysis System

A full-stack web application that enables users to analyze and compare energy efficiency of different building designs by calculating heat gain through windows and estimating associated cooling costs across different cities.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Calculation Methodology](#calculation-methodology)
- [User Guide](#user-guide)

## Overview

This application helps architects, engineers, and building designers evaluate and optimize the energy performance of their building designs. Users can input building configurations, analyze heat gain through windows, estimate cooling costs, and compare different design alternatives across various cities in India.

## Features

### Building Configuration
- Configure building dimensions for each facade (height, width)
- Set Window-to-Wall Ratio (WWR) for each facade (value between 0-1)
- Specify Solar Heat Gain Coefficient (SHGC) (value between 0-1)
- Add optional skylight dimensions

### Analysis & Visualization
- Detailed heat gain calculations per facade
- Cooling cost estimations based on local electricity rates
- City-wise performance rankings
- Interactive data visualizations using charts
- Comparative analysis between different designs



## Technology Stack

### Frontend
- React with javaScript
- Material UI v5 (UI components)
- React Charts (data visualization)

### Backend
- Node.js + Express.js with Javascript
- MongoDB (database)


### Installation

#### Clone the repository
```bash
git clone https://github.com/shahbath23/energy-analysis.git
cd energy-analysis
```

#### Backend setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with the following variables
# Replace values as needed

PORT=3090
MONGODB_URI=mongodb://localhost:27017/building-energy-analysis

# Start the development server
npm run dev
```

#### Frontend setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file for API endpoint
cat > .env << EOL
REACT_APP_API_URL=http://localhost:3090/api
EOL

# Start the development server
npm start
```

The application should now be running at `http://localhost:3000`

## API Documentation

### Building Designs

#### Create a new design
```
POST /api/designs
```
Request body:
```json
{
  "name": "Design 1",
  "facades": [
    {
      "orientation": "North",
      "height": 10,
      "width": 15,
      "wwr": 0.4,
      "shgc": 0.6
    },
    {
      "orientation": "South",
      "height": 10,
      "width": 15,
      "wwr": 0.3,
      "shgc": 0.5
    },
    {
      "orientation": "East",
      "height": 8,
      "width": 12,
      "wwr": 0.2,
      "shgc": 0.4
    },
    {
      "orientation": "West",
      "height": 8,
      "width": 12,
      "wwr": 0.2,
      "shgc": 0.4
    }
  ],
  "skylight": {
    "width": 5,
    "height": 3,
    "shgc": 0.7
  }
}
```

#### List all designs
```
GET /api/designs
```

#### Get a specific design
```
GET /api/designs/:id
```

#### Update a design
```
PUT /api/designs/:id
```
Request body: Same as POST request

#### Delete a design
```
DELETE /api/designs/:id
```

### Analysis

#### Calculate heat gain and costs for a design
```
POST /api/analysis/calculate
```


#### Compare multiple designs
```
GET /api/analysis/compare?city=Mumbai&designIds=60d21b4667d0d8992e610c85,60d21b4667d0d8992e610c86
```

#### Get city-wise rankings
```
GET /api/analysis/cities?designId=60d21b4667d0d8992e610c85
```



## Calculation Methodology

### Heat Gain Calculation
The system calculates heat gain through windows using the formula:
```
Q = A × SHGC × G × Δt
```
Where:
- Q = Solar heat gain through windows (BTU)
- A = Total window area (square feet)
- SHGC = Solar Heat Gain Coefficient (0-1)
- G = Solar radiation intensity (BTU/square feet-hr)
- Δt = Duration of exposure (hours)

### Energy Conversion
BTUs are converted to kilowatt-hours (kWh):
```
Cooling Load (kWh) = Heat Gain (BTU) / 3,412
```

### Energy Consumption
Actual energy consumed is calculated using Coefficient of Performance (COP):
```
Energy Consumed (kWh) = Cooling Load (kWh) / COP
```
Note: The system uses COP = 4 as default for all calculations.

## User Guide

1. Start by creating a new building design using the Building Configuration interface
2. Input facade details (dimensions, WWR, SHGC) for each orientation
3. Add skylight details if applicable
4. Save your design
5. Run analysis to see heat gain and cooling costs
6. Create alternative designs and compare their performance
7. Use the analysis dashboard to visualize results and optimize your design

