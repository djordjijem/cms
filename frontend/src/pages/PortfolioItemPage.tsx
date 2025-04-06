import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { portfolioApi } from '../services/api';

interface ApiResponse<T> {
  data: T;
}

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  categories: Category[];
}

interface Category {
  id: number;
  name: string;
}

const PortfolioItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: item } = useQuery<ApiResponse<PortfolioItem>>({
    queryKey: ['portfolioItem', id],
    queryFn: () => portfolioApi.getItem(Number(id)),
  });

  if (!item?.data) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 4 }}
        >
          Back to Portfolio
        </Button>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ flex: '1 1 300px' }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Typography variant="h4" gutterBottom>
                {item.data.title}
              </Typography>
              <Box sx={{ mb: 2 }}>
                {item.data.categories.map((category) => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
              <Typography
                variant="body1"
                sx={{ mb: 4, whiteSpace: 'pre-wrap' }}
              >
                {item.data.description}
              </Typography>
              {item.data.projectUrl && (
                <Button
                  variant="contained"
                  href={item.data.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 'auto' }}
                >
                  View Project
                </Button>
              )}
            </Paper>
          </Box>
          <Box sx={{ flex: '1 1 300px' }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Box
                component="img"
                src={item.data.imageUrl}
                alt={item.data.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '500px',
                  objectFit: 'contain',
                }}
              />
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PortfolioItemPage; 