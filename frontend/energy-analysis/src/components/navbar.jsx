import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1E3A8A', boxShadow: 4 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Typography
            variant="h4"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              '&:hover': { color: '#93C5FD' },
            }}
          >
            🏠 Energy Analysis
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Button
              component={Link}
              to="/"
              sx={{
                color: 'white',
                fontSize: '1rem',
                textTransform: 'capitalize',
                '&:hover': { color: '#93C5FD' },
              }}
            >
              Create Design
            </Button>

            <Button
              component={Link}
              to="/designs"
              sx={{
                color: 'white',
                fontSize: '1rem',
                textTransform: 'capitalize',
                '&:hover': { color: '#93C5FD' },
              }}
            >
              View Designs
            </Button>

            <Button
              component={Link}
              to="/compare"
              sx={{
                color: 'white',
                fontSize: '1rem',
                textTransform: 'capitalize',
                '&:hover': { color: '#93C5FD' },
              }}
            >
              Compare
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
