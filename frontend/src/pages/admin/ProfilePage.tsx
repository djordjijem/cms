import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Avatar,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../../services/api';

interface ApiResponse<T> {
  data: T;
}

interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  twitterUrl: string;
}

const ProfilePage: React.FC = () => {
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: '',
    title: '',
    bio: '',
    avatarUrl: '',
    email: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    twitterUrl: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const queryClient = useQueryClient();

  const { data: profile } = useQuery<ApiResponse<Profile>>({
    queryKey: ['profile'],
    queryFn: () => profileApi.get(),
  });

  useEffect(() => {
    if (profile?.data) {
      setFormData(profile.data);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Profile>) => profileApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'An error occurred');
      setTimeout(() => setError(''), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (field: keyof Profile) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Profile Settings
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Profile updated successfully
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                label="Name"
                fullWidth
                value={formData.name}
                onChange={handleChange('name')}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                label="Title"
                fullWidth
                value={formData.title}
                onChange={handleChange('title')}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 100%' }}>
              <TextField
                label="Bio"
                fullWidth
                multiline
                rows={4}
                value={formData.bio}
                onChange={handleChange('bio')}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                label="Avatar URL"
                fullWidth
                value={formData.avatarUrl}
                onChange={handleChange('avatarUrl')}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={handleChange('phone')}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                label="Location"
                fullWidth
                value={formData.location}
                onChange={handleChange('location')}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                label="LinkedIn URL"
                fullWidth
                value={formData.linkedinUrl}
                onChange={handleChange('linkedinUrl')}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                label="GitHub URL"
                fullWidth
                value={formData.githubUrl}
                onChange={handleChange('githubUrl')}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                label="Twitter URL"
                fullWidth
                value={formData.twitterUrl}
                onChange={handleChange('twitterUrl')}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained">
              Save Changes
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ProfilePage; 