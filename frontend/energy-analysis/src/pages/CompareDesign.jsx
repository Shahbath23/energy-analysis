import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';
import Navbar from '../components/navbar';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const CompareDesign = () => {
  const [designs, setDesigns] = useState([]);
  const [firstDesign, setFirstDesign] = useState('');
  const [secondDesign, setSecondDesign] = useState('');
  const [comparisonData, setComparisonData] = useState([]);
  const [city, setCity] = useState('Mumbai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await axios.get('http://localhost:3090/api/designs');
        setDesigns(response.data);
      } catch (err) {
        console.error('Error fetching designs:', err);
      }
    };
    fetchDesigns();
  }, []);

  const handleCompare = async () => {
    try {
      setLoading(true);
      setComparisonData([]);
      setError('');

      const selectedDesignIds = [firstDesign, secondDesign];

      if (selectedDesignIds.includes('') || selectedDesignIds.length < 2) {
        setError('Please select two designs for comparison.');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        city: city,
        designIds: selectedDesignIds.join(','),
      });

      const response = await axios.get(
        `http://localhost:3090/api/analysis/compare?${params.toString()}`
      );
      setComparisonData(response.data.comparisonResults);
    } catch (error) {
      console.error('Error comparing designs:', error);
      setError('Failed to compare designs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Updated chart options for white theme
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#333',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#333',
        },
        grid: {
          color: '#f0f0f0',
        }
      },
      y: {
        ticks: {
          color: '#333',
        },
        grid: {
          color: '#f0f0f0',
        }
      },
    },
  };

  const heatGainChartData = {
    labels: comparisonData.map(item => item.design.name),
    datasets: [
      {
        label: 'Total Heat Gain (BTU)',
        data: comparisonData.map(item => item.analysis.totalHeatGain),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const coolingCostChartData = {
    labels: comparisonData.map(item => item.design.name),
    datasets: [
      {
        label: 'Cooling Cost (USD)',
        data: comparisonData.map(item => item.analysis.coolingCost),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const energyEfficiencyChartData = {
    labels: comparisonData.map(item => item.design.name),
    datasets: [
      {
        label: 'Energy Efficiency',
        data: comparisonData.map(item => item.analysis.energyConsumedKWh),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const materialUsageChartData = {
    labels: comparisonData.map(item => item.design.name),
    datasets: [
      {
        data: comparisonData.map(item => item.analysis.coolingLoadKWh),
        backgroundColor: ['rgba(255, 159, 64, 0.5)', 'rgba(54, 162, 235, 0.5)'],
        borderColor: ['rgba(255, 159, 64, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ padding: 0, width: '100vw', maxWidth: '100%' }}>
      <Navbar />
      
      <Box sx={{ 
        width: '100%',
        minHeight: 'calc(100vh - 64px)', // Subtract navbar height
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        padding: '20px',
        boxSizing: 'border-box',
        margin: 0,
        position: 'relative',
        overflow: 'auto',
      }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#333' }}>Compare Multiple Designs</Typography>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 2, 
          mb: 3,
          width: '100%', 
        }}>
          <FormControl fullWidth>
            <InputLabel>Select City</InputLabel>
            <Select 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
            >
              {['Mumbai', 'Delhi', 'Kolkata', 'Bangalore'].map(city => (
                <MenuItem key={city} value={city}>{city}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>First Design</InputLabel>
            <Select 
              value={firstDesign} 
              onChange={(e) => setFirstDesign(e.target.value)}
            >
              {designs.filter((design) => design._id !== secondDesign).map((design) => (
                <MenuItem key={design._id} value={design._id}>{design.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Second Design</InputLabel>
            <Select 
              value={secondDesign} 
              onChange={(e) => setSecondDesign(e.target.value)}
            >
              {designs.filter((design) => design._id !== firstDesign).map((design) => (
                <MenuItem key={design._id} value={design._id}>{design.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCompare} 
            disabled={loading}
            sx={{ height: '56px' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Compare Designs'}
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {comparisonData.length > 0 ? (
          <Box sx={{ color: '#333', width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 3 }}>Comparison Results:</Typography>

            <Box display="flex" flexWrap="wrap" justifyContent="space-between" width="100%">
              <Box width={{ xs: '100%', md: '48%' }} height="300px" mb={3} sx={{ backgroundColor: '#fff', borderRadius: '4px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Typography variant="subtitle1" textAlign="center" sx={{ mb: 1 }}>Heat Gain Comparison</Typography>
                <Bar data={heatGainChartData} options={chartOptions} />
              </Box>
              
              <Box width={{ xs: '100%', md: '48%' }} height="300px" mb={3} sx={{ backgroundColor: '#fff', borderRadius: '4px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Typography variant="subtitle1" textAlign="center" sx={{ mb: 1 }}>Cooling Cost Comparison</Typography>
                <Bar data={coolingCostChartData} options={chartOptions} />
              </Box>
              
              <Box width={{ xs: '100%', md: '48%' }} height="300px" mb={{ xs: 3, md: 0 }} sx={{ backgroundColor: '#fff', borderRadius: '4px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Typography variant="subtitle1" textAlign="center" sx={{ mb: 1 }}>Energy Efficiency</Typography>
                <Line data={energyEfficiencyChartData} options={chartOptions} />
              </Box>
              
              <Box width={{ xs: '100%', md: '48%' }} height="300px" sx={{ backgroundColor: '#fff', borderRadius: '4px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Typography variant="subtitle1" textAlign="center" sx={{ mb: 1 }}>Cooling Load Distribution</Typography>
                <Doughnut data={materialUsageChartData} options={chartOptions} />
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ 
            width: '100%', 
            minHeight: '400px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            borderRadius: '4px',
            border: '1px dashed #ddd',
            background: '#f9f9f9',
            mt: 2,
            flex: 1,
          }}>
            <Typography variant="body1" color="text.secondary">
              Select two designs and click "Compare Designs" to view results
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CompareDesign;