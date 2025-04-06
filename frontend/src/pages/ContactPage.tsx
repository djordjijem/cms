import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { contactsApi } from '../services/api';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data: ContactForm) => contactsApi.create(data),
    onSuccess: () => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
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
    createMutation.mutate(formData);
  };

  const handleChange = (field: keyof ContactForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <Box>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Contact Me
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          paragraph
          align="center"
          sx={{ mb: 4 }}
        >
          Have a question or want to work together? Feel free to reach out!
        </Typography>

        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Message sent successfully! I'll get back to you soon.
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
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange('email')}
                  required
                />
              </Box>
              <Box sx={{ flex: '1 1 100%' }}>
                <TextField
                  label="Subject"
                  fullWidth
                  value={formData.subject}
                  onChange={handleChange('subject')}
                  required
                />
              </Box>
              <Box sx={{ flex: '1 1 100%' }}>
                <TextField
                  label="Message"
                  fullWidth
                  multiline
                  rows={6}
                  value={formData.message}
                  onChange={handleChange('message')}
                  required
                />
              </Box>
              <Box sx={{ flex: '1 1 100%' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Sending...' : 'Send Message'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ContactPage; 