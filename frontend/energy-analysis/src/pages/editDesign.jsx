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
    const [errors,setErrors]=useState('')

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
    // Handle input changes with number conversion
const handleChange = (e, section, direction, field) => {
    const { value } = e.target;
    setFormData((prev) => {
        if (!prev) return prev;
        const numericValue = field ? parseFloat(value) || 0 : Number(value) || 0;

        if (direction && field) {
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [direction]: {
                        ...prev[section][direction],
                        [field]: numericValue,
                    },
                },
            };
        } else {
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [direction]: numericValue,
                },
            };
        }
    });
};

// SHGC input with number conversion
const handleSHGCChange = (e) => {
    setFormData((prev) => ({
        ...prev,
        shgc: parseFloat(e.target.value) || 0,
    }));
};

// Skylight input with number conversion
const handleSkylightChange = (e, field) => {
    setFormData((prev) => ({
        ...prev,
        skylight: {
            ...prev.skylight,
            [field]: Number(e.target.value) || 0,
        },
    }));
};

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Design name is required.';

        ['north', 'south', 'east', 'west'].forEach((dir) => {
            if (!formData.dimensions[dir].width) {
                newErrors[`${dir}Width`] = `${dir} width is required.`;
            } else if (formData.dimensions[dir].width <= 0) {
                newErrors[`${dir}Width`] = `${dir} width must be a positive number.`;
            }
        
            if (!formData.dimensions[dir].height) {
                newErrors[`${dir}Height`] = `${dir} height is required.`;
            } else if (formData.dimensions[dir].height <= 0) {
                newErrors[`${dir}Height`] = `${dir} height must be a positive number.`;
            }
        
            if (!formData.wwr[dir] && formData.wwr[dir] !== 0) {
                newErrors[`${dir}WWR`] = `${dir} WWR is required.`;
            } else if (formData.wwr[dir] < 0 || formData.wwr[dir] > 1) {
                newErrors[`${dir}WWR`] = `${dir} WWR must be between 0 and 1.`;
            }
        });
        

        if (!formData.shgc) newErrors.shgc = 'SHGC is required.';
        if (formData.shgc < 0 || formData.shgc > 1) newErrors.shgc = 'SHGC must be between 0 and 1.';

        
        if (formData.skylight.width <= 0) newErrors.skylightWidth = 'Skylight width must be positive.';
        if (formData.skylight.height <= 0) newErrors.skylightHeight = 'Skylight height must be positive.';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error('Please fix the errors before submitting.');
            return;
        }
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
                                error={!!errors.name}
                                helperText={errors.name}
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
                                    error={!!errors[`${dir}Width`]}
                                    helperText={errors[`${dir}Width`]}
                                />
                                <TextField
                                    label="Height"
                                    variant="outlined"
                                    value={formData.dimensions[dir].height}
                                    onChange={(e) => handleChange(e, 'dimensions', dir, 'height')}
                                    type="number"
                                    required
                                    error={!!errors[`${dir}Height`]}
                                    helperText={errors[`${dir}Height`]}
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
                                    error={!!errors[`${dir}WWR`]}
                                    helperText={errors[`${dir}WWR`]}
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
                                error={!!errors.shgc}
                                helperText={errors.shgc}
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
