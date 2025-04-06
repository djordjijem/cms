import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Work as WorkIcon,
  Category as CategoryIcon,
  Message as MessageIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { portfolioApi, categoriesApi, contactsApi, profileApi } from '../../services/api';

interface ApiResponse<T> {
  data: T;
}

interface PortfolioItem {
  id: number;
  title: string;
}

interface Category {
  id: number;
  name: string;
}

interface Contact {
  id: number;
  isRead: boolean;
}

interface Profile {
  id: number;
  firstName: string;
  lastName: string;
}

const DashboardPage: React.FC = () => {
  const { data: portfolioItems } = useQuery<ApiResponse<PortfolioItem[]>>({
    queryKey: ['portfolioItems'],
    queryFn: () => portfolioApi.getItems(),
  });
  
  const { data: categories } = useQuery<ApiResponse<Category[]>>({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });
  
  const { data: contacts } = useQuery<ApiResponse<Contact[]>>({
    queryKey: ['contacts'],
    queryFn: () => contactsApi.getAll(),
  });
  
  const { data: profile } = useQuery<ApiResponse<Profile>>({
    queryKey: ['profile'],
    queryFn: () => profileApi.get(),
  });

  const unreadMessages = contacts?.data?.filter(
    (contact) => !contact.isRead
  ).length || 0;

  const stats = [
    {
      title: 'Portfolio Items',
      value: portfolioItems?.data?.length || 0,
      icon: <WorkIcon fontSize="large" />,
      color: '#1976d2',
      link: '/admin/portfolio-items',
    },
    {
      title: 'Categories',
      value: categories?.data?.length || 0,
      icon: <CategoryIcon fontSize="large" />,
      color: '#2e7d32',
      link: '/admin/categories',
    },
    {
      title: 'Unread Messages',
      value: unreadMessages,
      icon: <MessageIcon fontSize="large" />,
      color: '#ed6c02',
      link: '/admin/messages',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {stats.map((stat) => (
          <Box
            key={stat.title}
            sx={{
              flex: '1 1 300px',
              maxWidth: '100%',
            }}
          >
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: `${stat.color}15`,
                      borderRadius: '50%',
                      p: 1,
                      mr: 2,
                    }}
                  >
                    {React.cloneElement(stat.icon, {
                      sx: { color: stat.color },
                    })}
                  </Box>
                  <Typography variant="h6" component="div">
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h3" component="div">
                  {stat.value}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  component={Link}
                  to={stat.link}
                  sx={{ color: stat.color }}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            component={Link}
            to="/admin/portfolio-items/new"
            startIcon={<WorkIcon />}
          >
            Add Portfolio Item
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/admin/categories/new"
            startIcon={<CategoryIcon />}
          >
            Add Category
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/admin/profile"
            startIcon={<PersonIcon />}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage; 