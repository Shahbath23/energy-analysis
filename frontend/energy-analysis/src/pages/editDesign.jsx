import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { TextField, Button, Grid, Typography, Box, Paper } from '@mui/material';
import Navbar from '../components/navbar';

const EditDesign = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch existing design data
        const fetchDesign = async () => {
            try {
                const response = await axios.get(`http://localhost:3090/api/designs/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching design:', error);
                toast.error('Failed to fetch design details.');
            }
        };
        fetchDesign();
    }, [id]);

    // Handle input changes
    const handleChange = (e, section, direction, field) => {
        const { value } = e.target;
        setFormData((prev) => {
            if (!prev) return prev;
            if (direction && field) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [direction]: {
                            ...prev[section][direction],
                            [field]: value,
                        },
                    },
                };
            } else {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [direction]: value,
                    },
                };
            }
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.put(`http://localhost:3090/api/designs/${id}`, formData);
            toast.success('Design updated successfully!');
            setTimeout(() => navigate('/designs'), 2000);
        } catch (error) {
            console.error('Error updating design:', error);
            toast.error('Failed to update design.');
        } finally {
            setLoading(false);
        }
    };

    if (!formData) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ padding: 3 }}>
            <Navbar />
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>Edit Design</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                label="Design Name"
                                variant="outlined"
                                fullWidth
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </Grid>
                        {['north', 'south', 'east', 'west'].map((dir) => (
                            <Grid item xs={6} key={dir}>
                                <Typography variant="h6">{dir.toUpperCase()} Dimensions</Typography>
                                <TextField
                                    label="Width"
                                    variant="outlined"
                                    value={formData.dimensions[dir].width}
                                    onChange={(e) => handleChange(e, 'dimensions', dir, 'width')}
                                    type="number"
                                    required
                                />
                                <TextField
                                    label="Height"
                                    variant="outlined"
                                    value={formData.dimensions[dir].height}
                                    onChange={(e) => handleChange(e, 'dimensions', dir, 'height')}
                                    type="number"
                                    required
                                />
                            </Grid>
                        ))}
                        {['north', 'south', 'east', 'west'].map((dir) => (
                            <Grid item xs={6} key={dir}>
                                <TextField
                                    label={`${dir.toUpperCase()} WWR`}
                                    variant="outlined"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={formData.wwr[dir]}
                                    onChange={(e) => handleChange(e, 'wwr', dir)}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <TextField
                                label="SHGC (0-1)"
                                variant="outlined"
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={formData.shgc}
                                onChange={(e) => setFormData({ ...formData, shgc: e.target.value })}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Skylight (Optional)</Typography>
                            <TextField
                                label="Skylight Width"
                                variant="outlined"
                                value={formData.skylight.width}
                                onChange={(e) => handleChange(e, 'skylight', 'width')}
                                type="number"
                            />
                            <TextField
                                label="Skylight Height"
                                variant="outlined"
                                value={formData.skylight.height}
                                onChange={(e) => handleChange(e, 'skylight', 'height')}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
                                {loading ? 'Updating...' : 'Update Design'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default EditDesign;
