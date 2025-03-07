import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import Navbar from '../components/navbar';

const AllDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cityRankings, setCityRankings] = useState({}); // Store city rankings for each design
  const [visibleRanks, setVisibleRanks] = useState({}); // Track visibility of rankings for each design

  const navigate = useNavigate();

  // Fetch all designs from backend
  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3090/api/designs');
        setDesigns(response.data);
      } catch (err) {
        console.error('Error fetching designs:', err);
        setError('Failed to load designs.');
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  // Function to fetch city rankings for a specific design
  const fetchCityRankings = async (designId) => {
    try {
      const response = await axios.get('http://localhost:3090/api/analysis/cities', {
        params: { designId }
      });
      // Store the rankings by designId
      setCityRankings((prevState) => ({
        ...prevState,
        [designId]: response.data.cityRankings
      }));
    } catch (err) {
      console.error('Error fetching city rankings:', err);
      alert('Failed to fetch city rankings.');
    }
  };

  // Toggle visibility of city rankings for a specific design
  const toggleVisibility = (designId) => {
    setVisibleRanks((prevState) => ({
      ...prevState,
      [designId]: !prevState[designId]
    }));

    // Fetch city rankings if not already fetched
    if (!cityRankings[designId]) {
      fetchCityRankings(designId);
    }
  };

  // Handle Delete Design
  const handleDelete = async (designId) => {
    if (window.confirm('Are you sure you want to delete this design?')) {
      try {
        await axios.delete(`http://localhost:3090/api/designs/${designId}`);
        setDesigns((prevDesigns) => prevDesigns.filter((design) => design._id !== designId));
        alert('Design deleted successfully.');
      } catch (err) {
        console.error('Error deleting design:', err);
        alert('Failed to delete design.');
      }
    }
  };

  // Function to recursively format objects without curly braces
  const formatObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj ? obj.toString() : 'N/A';

    return Object.entries(obj)
      .map(([key, value]) =>
        typeof value === 'object' && value !== null
          ? `${key}: ${formatObject(value)}` // Recursively format the nested object without curly braces
          : `${key}: ${value}`
      )
      .join(', ');
  };

  // Format skylight with fallback for missing width and height
  const formatSkylight = (skylight) => {
    if (!skylight || typeof skylight !== 'object') return 'N/A';
    const { width, height, ...rest } = skylight;
    const widthText = width ? `width: ${width}` : 'width: Not Found';
    const heightText = height ? `height: ${height}` : 'height: Not Found';

    const otherDetails = Object.entries(rest)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    return `${widthText}, ${heightText}${otherDetails ? `, ${otherDetails}` : ''}`;
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        All Designs
      </Typography>

      {loading && <CircularProgress />}

      {error && <Alert severity="error">{error}</Alert>}

      {/* Add Design Button */}
      <Link to="/">
        <Button variant="contained" color="primary" sx={{ marginBottom: 3 }}>
          Add Design
        </Button>
      </Link>

      {/* Table for displaying design details */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Design Name</TableCell>
              <TableCell>SHGC</TableCell>
              <TableCell>Dimensions</TableCell>
              <TableCell>WWR (Window to Wall Ratio)</TableCell>
              <TableCell>Skylight</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>View City Ranks</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {designs.map((design) => (
              <TableRow key={design._id}>
                <TableCell>{design.name}</TableCell>
                <TableCell>{design.shgc}</TableCell>
                <TableCell>{formatObject(design.dimensions)}</TableCell>
                <TableCell>{formatObject(design.wwr)}</TableCell>
                <TableCell>{formatSkylight(design.skylight)}</TableCell>
                <TableCell>{new Date(design.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => toggleVisibility(design._id)}
                  >
                    {visibleRanks[design._id] ? 'Hide City Ranks' : 'View City Ranks'}
                  </Button>
                  {visibleRanks[design._id] && cityRankings[design._id] && (
                    <Box sx={{ marginTop: 2 }}>
                      <ul>
                        {cityRankings[design._id].map((rank, index) => (
                          <li key={index}>
                            Rank {rank.rank}: {rank.city} - Cooling Cost: {rank.coolingCost}
                          </li>
                        ))}
                      </ul>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/edit-design/${design._id}`)}
                    sx={{ marginRight: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(design._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllDesigns;
