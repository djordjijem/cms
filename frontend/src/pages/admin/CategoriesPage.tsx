import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../../services/api';

interface ApiResponse<T> {
  data: T;
}

interface Category {
  id: number;
  name: string;
  description: string;
  displayOrder: number;
}

const CategoriesPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    displayOrder: 0,
  });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  const { data: categories } = useQuery<ApiResponse<Category[]>>({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleClose();
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'An error occurred');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => categoriesApi.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleClose();
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'An error occurred');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleOpen = (category?: Category) => {
    if (category) {
      setEditCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        displayOrder: category.displayOrder,
      });
    } else {
      setEditCategory(null);
      setFormData({
        name: '',
        description: '',
        displayOrder: 0,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCategory(null);
    setFormData({
      name: '',
      description: '',
      displayOrder: 0,
    });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editCategory) {
      updateMutation.mutate({ ...formData, id: editCategory.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Categories</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Display Order</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories?.data?.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell align="right">{category.displayOrder}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpen(category)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(category.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editCategory ? 'Edit Category' : 'Add Category'}
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
            <TextField
              margin="dense"
              label="Display Order"
              type="number"
              fullWidth
              value={formData.displayOrder}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  displayOrder: parseInt(e.target.value),
                })
              }
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editCategory ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default CategoriesPage; 