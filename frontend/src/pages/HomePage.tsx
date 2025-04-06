import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  Container,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { portfolioApi, categoriesApi, profileApi } from '../services/api';

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

interface Profile {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: profile } = useQuery<ApiResponse<Profile>>({
    queryKey: ['profile'],
    queryFn: () => profileApi.get(),
  });

  const { data: portfolioItems } = useQuery<ApiResponse<PortfolioItem[]>>({
    queryKey: ['portfolioItems'],
    queryFn: () => portfolioApi.getItems(),
  });

  const { data: categories } = useQuery<ApiResponse<Category[]>>({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
  };

  const filteredItems = portfolioItems?.data?.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      item.categories.some((cat) => cat.id.toString() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            color="text.primary"
            gutterBottom
          >
            {profile?.data?.name}
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            {profile?.data?.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {profile?.data?.bio}
          </Typography>
        </Container>
      </Box>

      {/* Portfolio Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                fullWidth
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories?.data?.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {filteredItems?.map((item) => (
            <Box sx={{ flex: '1 1 300px' }} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardActionArea onClick={() => navigate(`/portfolio/${item.id}`)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.imageUrl}
                    alt={item.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {item.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {item.categories.map((category) => (
                        <Chip
                          key={category.id}
                          label={category.name}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage; 