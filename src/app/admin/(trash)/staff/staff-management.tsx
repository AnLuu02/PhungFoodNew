'use client';

import type React from 'react';

import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Menu,
  Modal,
  PasswordInput,
  rem,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconDotsVertical,
  IconLock,
  IconMail,
  IconPencil,
  IconPhone,
  IconPlus,
  IconShield,
  IconTrash,
  IconUser
} from '@tabler/icons-react';
import { useState } from 'react';

type StaffRole = 'admin' | 'manager' | 'chef' | 'waiter' | 'cashier' | 'delivery';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  isActive: boolean;
  joinDate: Date;
  lastActive: Date;
}

const initialStaff: StaffMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@restaurant.com',
    phone: '(212) 555-1234',
    role: 'admin',
    isActive: true,
    joinDate: new Date(2022, 0, 15),
    lastActive: new Date(2023, 2, 15)
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@restaurant.com',
    phone: '(212) 555-5678',
    role: 'manager',
    isActive: true,
    joinDate: new Date(2022, 3, 10),
    lastActive: new Date(2023, 2, 14)
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@restaurant.com',
    phone: '(212) 555-9012',
    role: 'chef',
    isActive: true,
    joinDate: new Date(2022, 5, 5),
    lastActive: new Date(2023, 2, 15)
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@restaurant.com',
    phone: '(212) 555-3456',
    role: 'waiter',
    isActive: true,
    joinDate: new Date(2022, 7, 20),
    lastActive: new Date(2023, 2, 15)
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert@restaurant.com',
    phone: '(212) 555-7890',
    role: 'cashier',
    isActive: false,
    joinDate: new Date(2022, 9, 12),
    lastActive: new Date(2023, 1, 28)
  },
  {
    id: '6',
    name: 'Jessica Brown',
    email: 'jessica@restaurant.com',
    phone: '(212) 555-2345',
    role: 'delivery',
    isActive: true,
    joinDate: new Date(2022, 11, 5),
    lastActive: new Date(2023, 2, 14)
  }
];

export default function StaffManagement() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const handleAddStaff = () => {
    setEditingStaff(null);
    setIsEditing(false);
    open();
  };

  const handleEditStaff = (staffMember: StaffMember) => {
    setEditingStaff(staffMember);
    setIsEditing(true);
    open();
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter(member => member.id !== id));
    notifications.show({
      title: 'Staff Member Removed',
      message: 'The staff member has been successfully removed',
      color: 'red'
    });
  };

  const handleToggleActive = (id: string) => {
    setStaff(
      staff.map(member =>
        member.id === id ? { ...member, isActive: !member.isActive, lastActive: new Date() } : member
      )
    );

    const member = staff.find(m => m.id === id);
    if (member) {
      notifications.show({
        title: `Staff Member ${member.isActive ? 'Deactivated' : 'Activated'}`,
        message: `${member.name} has been ${member.isActive ? 'deactivated' : 'activated'}`,
        color: member.isActive ? 'orange' : 'green'
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const newStaff: StaffMember = {
      id: isEditing && editingStaff ? editingStaff.id : Date.now().toString(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      role: formData.get('role') as StaffRole,
      isActive: formData.get('isActive') === 'on',
      joinDate: isEditing && editingStaff ? editingStaff.joinDate : new Date(),
      lastActive: new Date()
    };

    if (isEditing) {
      setStaff(staff.map(member => (member.id === newStaff.id ? newStaff : member)));
      notifications.show({
        title: 'Staff Member Updated',
        message: 'The staff member has been successfully updated',
        color: 'blue'
      });
    } else {
      setStaff([...staff, newStaff]);
      notifications.show({
        title: 'Staff Member Added',
        message: 'The staff member has been successfully added',
        color: 'green'
      });
    }

    close();
  };

  const getRoleBadgeColor = (role: StaffRole) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'manager':
        return 'blue';
      case 'chef':
        return 'orange';
      case 'waiter':
        return 'teal';
      case 'cashier':
        return 'violet';
      case 'delivery':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <Group justify='space-between' mb='lg'>
        <Title order={2}>Staff Management</Title>
        <Group>
          <Button variant='outline' onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}>
            {viewMode === 'grid' ? 'Table View' : 'Grid View'}
          </Button>
          <Button leftSection={<IconPlus size={16} />} onClick={handleAddStaff}>
            Add Staff
          </Button>
        </Group>
      </Group>

      {viewMode === 'grid' ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='lg'>
          {staff.map(member => (
            <Card key={member.id} withBorder shadow='sm' padding='lg' radius='md'>
              <Group>
                <Avatar size='lg' color={getRoleBadgeColor(member.role)} radius='xl'>
                  {getInitials(member.name)}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Group justify='space-between'>
                    <Text fw={500} size='lg'>
                      {member.name}
                    </Text>
                    <Menu position='bottom-end' withinPortal>
                      <Menu.Target>
                        <ActionIcon variant='subtle'>
                          <IconDotsVertical size='1rem' />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconPencil style={{ width: rem(14), height: rem(14) }} />}
                          onClick={() => handleEditStaff(member)}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconShield style={{ width: rem(14), height: rem(14) }} />}
                          onClick={() => handleToggleActive(member.id)}
                        >
                          {member.isActive ? 'Deactivate' : 'Activate'}
                        </Menu.Item>
                        <Menu.Item
                          color='red'
                          leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                          onClick={() => handleDeleteStaff(member.id)}
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                  <Badge color={getRoleBadgeColor(member.role)}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </Badge>
                  <Badge ml='xs' color={member.isActive ? 'green' : 'red'}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </Group>

              <Group gap='xs' mt='md'>
                <IconMail size='1rem' stroke={1.5} />
                <Text size='sm' c='dimmed'>
                  {member.email}
                </Text>
              </Group>

              <Group gap='xs' mt='xs'>
                <IconPhone size='1rem' stroke={1.5} />
                <Text size='sm' c='dimmed'>
                  {member.phone}
                </Text>
              </Group>

              <Text size='xs' c='dimmed' mt='md'>
                Joined: {member.joinDate.toLocaleDateString()}
              </Text>
              <Text size='xs' c='dimmed'>
                Last Active: {member.lastActive.toLocaleDateString()}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Join Date</Table.Th>
              <Table.Th>Last Active</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {staff.map(member => (
              <Table.Tr key={member.id}>
                <Table.Td>
                  <Group gap='sm'>
                    <Avatar size='sm' color={getRoleBadgeColor(member.role)} radius='xl'>
                      {getInitials(member.name)}
                    </Avatar>
                    <Text>{member.name}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>{member.email}</Table.Td>
                <Table.Td>{member.phone}</Table.Td>
                <Table.Td>
                  <Badge color={getRoleBadgeColor(member.role)}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={member.isActive ? 'green' : 'red'}>{member.isActive ? 'Active' : 'Inactive'}</Badge>
                </Table.Td>
                <Table.Td>{member.joinDate.toLocaleDateString()}</Table.Td>
                <Table.Td>{member.lastActive.toLocaleDateString()}</Table.Td>
                <Table.Td>
                  <Group gap='xs'>
                    <ActionIcon variant='subtle' color='blue' onClick={() => handleEditStaff(member)}>
                      <IconPencil size='1rem' stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon
                      variant='subtle'
                      color={member.isActive ? 'orange' : 'green'}
                      onClick={() => handleToggleActive(member.id)}
                    >
                      <IconShield size='1rem' stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon variant='subtle' color='red' onClick={() => handleDeleteStaff(member.id)}>
                      <IconTrash size='1rem' stroke={1.5} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Modal opened={opened} onClose={close} title={isEditing ? 'Edit Staff Member' : 'Add New Staff Member'} size='lg'>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label='Full Name'
              name='name'
              placeholder='Enter full name'
              required
              leftSection={<IconUser size={16} />}
              defaultValue={editingStaff?.name || ''}
            />

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label='Email'
                  name='email'
                  type='email'
                  placeholder='Enter email address'
                  required
                  leftSection={<IconMail size={16} />}
                  defaultValue={editingStaff?.email || ''}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label='Phone Number'
                  name='phone'
                  placeholder='Enter phone number'
                  required
                  leftSection={<IconPhone size={16} />}
                  defaultValue={editingStaff?.phone || ''}
                />
              </Grid.Col>
            </Grid>

            <Select
              label='Role'
              name='role'
              placeholder='Select staff role'
              data={[
                { value: 'admin', label: 'Admin' },
                { value: 'manager', label: 'Manager' },
                { value: 'chef', label: 'Chef' },
                { value: 'waiter', label: 'Waiter' },
                { value: 'cashier', label: 'Cashier' },
                { value: 'delivery', label: 'Delivery' }
              ]}
              defaultValue={editingStaff?.role || ''}
              required
            />

            {!isEditing && (
              <PasswordInput
                label='Password'
                name='password'
                placeholder='Enter password'
                required={!isEditing}
                leftSection={<IconLock size={16} />}
              />
            )}

            <Switch label='Active Status' name='isActive' defaultChecked={editingStaff?.isActive ?? true} />

            <Group justify='flex-end' mt='md'>
              <Button variant='outline' onClick={close}>
                Cancel
              </Button>
              <Button type='submit'>{isEditing ? 'Update' : 'Add'} Staff Member</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
