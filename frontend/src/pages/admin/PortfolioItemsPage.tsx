import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi, categoriesApi } from '../../services/api';

interface ApiResponse<T> {
  data: T;
}

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  displayOrder: number;
  categories: Category[];
}

interface Category {
  id: number;
  name: string;
}

const PortfolioItemsPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    displayOrder: 0,
    categoryIds: [] as number[],
  });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  const { data: portfolioItems } = useQuery<ApiResponse<PortfolioItem[]>>({
    queryKey: ['portfolioItems'],
    queryFn: () => portfolioApi.getItems(),
  });

  const { data: categories } = useQuery<ApiResponse<Category[]>>({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => portfolioApi.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
      handleClose();
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'An error occurred');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => portfolioApi.updateItem(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
      handleClose();
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'An error occurred');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => portfolioApi.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
    },
  });

  const handleOpen = (item?: PortfolioItem) => {
    if (item) {
      setEditItem(item);
      setFormData({
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        projectUrl: item.projectUrl || '',
        displayOrder: item.displayOrder,
        categoryIds: item.categories.map((cat) => cat.id),
      });
    } else {
      setEditItem(null);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        projectUrl: '',
        displayOrder: 0,
        categoryIds: [],
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      projectUrl: '',
      displayOrder: 0,
      categoryIds: [],
    });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      updateMutation.mutate({ ...formData, id: editItem.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Portfolio Items</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Item
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {portfolioItems?.data?.map((item) => (
          <Card
            key={item.id}
            sx={{
              width: '100%',
              maxWidth: 345,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={item.imageUrl}
              alt={item.title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="div">
                {item.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
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
              <Box sx={{ mt: 1 }}>
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
            <CardActions>
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleOpen(item)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(item.id)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
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
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
            <TextField
              margin="dense"
              label="Image URL"
              fullWidth
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              required
            />
            <TextField
              margin="dense"
              label="Project URL"
              fullWidth
              value={formData.projectUrl}
              onChange={(e) =>
                setFormData({ ...formData, projectUrl: e.target.value })
              }
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
            <FormControl fullWidth margin="dense">
              <InputLabel>Categories</InputLabel>
              <Select
                multiple
                value={formData.categoryIds}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryIds: e.target.value as number[],
                  })
                }
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          categories?.data.find((cat) => cat.id === value)
                            ?.name
                        }
                      />
                    ))}
                  </Box>
                )}
              >
                {categories?.data.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editItem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PortfolioItemsPage; 