import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '../../services/api';

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const ContactMessagesPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => contactsApi.getAll(),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => contactsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Contact Messages
      </Typography>
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts?.data?.map((contact: Contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.subject}</TableCell>
                  <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{contact.isRead ? 'Read' : 'Unread'}</TableCell>
                  <TableCell>
                    {!contact.isRead && (
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => handleMarkAsRead(contact.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ContactMessagesPage; 