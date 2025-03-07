import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // import useHistory hook
import toast from 'react-hot-toast'; // import react-hot-toast
import { TextField, Button, Grid, Typography, Box, Paper } from '@mui/material';
import Navbar from '../components/navbar';


const CreateDesign = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        dimensions: {
            north: { width: '', height: '' },
            south: { width: '', height: '' },
            east: { width: '', height: '' },
            west: { width: '', height: '' },
        },
        wwr: {
            north: '',
            south: '',
            east: '',
            west: '',
        },
        shgc: '',
        skylight: {
            width: '',
            height: '',
        },
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e, section, direction, field) => {
        const { value } = e.target;
        if (direction && field) {
            setFormData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [direction]: {
                        ...prev[section][direction],
                        [field]: value,
                    },
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [direction]: value,
                },
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert string values to numbers where needed
        const dimensions = {
            north: {
                width: parseFloat(formData.dimensions.north.width),
                height: parseFloat(formData.dimensions.north.height),
            },
            south: {
                width: parseFloat(formData.dimensions.south.width),
                height: parseFloat(formData.dimensions.south.height),
            },
            east: {
                width: parseFloat(formData.dimensions.east.width),
                height: parseFloat(formData.dimensions.east.height),
            },
            west: {
                width: parseFloat(formData.dimensions.west.width),
                height: parseFloat(formData.dimensions.west.height),
            },
        };

        const wwr = {
            north: parseFloat(formData.wwr.north),
            south: parseFloat(formData.wwr.south),
            east: parseFloat(formData.wwr.east),
            west: parseFloat(formData.wwr.west),
        };

        const shgc = parseFloat(formData.shgc);

        const dataToSend = {
            name: formData.name,
            dimensions: dimensions,
            wwr: wwr,
            shgc: shgc,
            skylight: formData.skylight,
        };

        try {
            const response = await axios.post('http://localhost:3090/api/designs', dataToSend);

            // Show success toast message
            toast.success('Design created successfully!');
            
            // Wait for 2 seconds before navigating
            setTimeout(() => {
                navigate('/designs');
            }, 2000);
        } catch (error) {
            console.error('Error creating design:', error.response.data);
            toast.error('Failed to create design. Please try again.');
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Navbar/>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>Create a New Building Design</Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Design Name */}
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

                        {/* Dimensions (Width & Height) */}
                        <Grid item xs={12}>
                            <Typography variant="h6">Dimensions (Width & Height)</Typography>
                            {['north', 'south', 'east', 'west'].map((dir) => (
                                <Box key={dir} sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        label={`${dir} Width`}
                                        variant="outlined"
                                        value={formData.dimensions[dir].width}
                                        onChange={(e) => handleChange(e, 'dimensions', dir, 'width')}
                                        type="number"
                                        required
                                    />
                                    <TextField
                                        label={`${dir} Height`}
                                        variant="outlined"
                                        value={formData.dimensions[dir].height}
                                        onChange={(e) => handleChange(e, 'dimensions', dir, 'height')}
                                        type="number"
                                        required
                                    />
                                </Box>
                            ))}
                        </Grid>

                        {/* WWR (Window-to-Wall Ratio) */}
                        <Grid item xs={12}>
                            <Typography variant="h6">Window-to-Wall Ratio (0-1)</Typography>
                            {['north', 'south', 'east', 'west'].map((dir) => (
                                <TextField
                                    key={dir}
                                    label={`${dir} WWR`}
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
                            ))}
                        </Grid>

                        {/* SHGC (Solar Heat Gain Coefficient) */}
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

                        {/* Skylight (Optional) */}
                        <Grid item xs={12}>
                            <Typography variant="h6">Skylight (Optional)</Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
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
                            </Box>
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Design'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default CreateDesign;
