'use client';

import type React from 'react';

import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  FileInput,
  Grid,
  Group,
  Image,
  Menu,
  Modal,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
  rem
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconClock,
  IconDotsVertical,
  IconMapPin,
  IconPencil,
  IconPhone,
  IconPlus,
  IconTrash,
  IconUpload
} from '@tabler/icons-react';
import { useState } from 'react';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  cuisine: string;
  openingHours: {
    open: string;
    close: string;
  };
  status: 'active' | 'inactive';
  image: string;
}

const initialRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Bella Italia',
    description: 'Authentic Italian cuisine in a cozy atmosphere',
    address: '123 Main St, New York, NY 10001',
    phone: '(212) 555-1234',
    email: 'info@bellaitalia.com',
    cuisine: 'Italian',
    openingHours: {
      open: '11:00',
      close: '22:00'
    },
    status: 'active',
    image: '/placeholder.svg?height=200&width=300'
  },
  {
    id: '2',
    name: 'Sushi Express',
    description: 'Fresh and delicious Japanese sushi',
    address: '456 Broadway, New York, NY 10002',
    phone: '(212) 555-5678',
    email: 'info@sushiexpress.com',
    cuisine: 'Japanese',
    openingHours: {
      open: '12:00',
      close: '23:00'
    },
    status: 'active',
    image: '/placeholder.svg?height=200&width=300'
  },
  {
    id: '3',
    name: 'Taco Fiesta',
    description: 'Authentic Mexican street food',
    address: '789 5th Ave, New York, NY 10003',
    phone: '(212) 555-9012',
    email: 'info@tacofiesta.com',
    cuisine: 'Mexican',
    openingHours: {
      open: '10:00',
      close: '21:00'
    },
    status: 'inactive',
    image: '/placeholder.svg?height=200&width=300'
  }
];

export default function RestaurantManagement() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddRestaurant = () => {
    setEditingRestaurant(null);
    setIsEditing(false);
    open();
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setIsEditing(true);
    open();
  };

  const handleDeleteRestaurant = (id: string) => {
    setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
    notifications.show({
      title: 'Restaurant Deleted',
      message: 'The restaurant has been successfully deleted',
      color: 'red'
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const newRestaurant: Restaurant = {
      id: isEditing && editingRestaurant ? editingRestaurant.id : Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      cuisine: formData.get('cuisine') as string,
      openingHours: {
        open: formData.get('openTime') as string,
        close: formData.get('closeTime') as string
      },
      status: formData.get('status') === 'on' ? 'active' : 'inactive',
      image: '/placeholder.svg?height=200&width=300' // In a real app, you would upload and get a URL
    };

    if (isEditing) {
      setRestaurants(restaurants.map(restaurant => (restaurant.id === newRestaurant.id ? newRestaurant : restaurant)));
      notifications.show({
        title: 'Restaurant Updated',
        message: 'The restaurant has been successfully updated',
        color: 'blue'
      });
    } else {
      setRestaurants([...restaurants, newRestaurant]);
      notifications.show({
        title: 'Restaurant Added',
        message: 'The restaurant has been successfully added',
        color: 'green'
      });
    }

    close();
  };

  return (
    <>
      <Group justify='space-between' mb='lg'>
        <Title order={2}>Restaurant Management</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleAddRestaurant}>
          Add Restaurant
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='lg'>
        {restaurants.map(restaurant => (
          <Card key={restaurant.id} withBorder shadow='sm' padding='lg' radius='md'>
            <Card.Section>
              <Image src={restaurant.image || '/placeholder.svg'} height={160} alt={restaurant.name} />
            </Card.Section>

            <Group justify='space-between' mt='md' mb='xs'>
              <Text fw={500} size='lg'>
                {restaurant.name}
              </Text>
              <Badge color={restaurant.status === 'active' ? 'green' : 'red'}>
                {restaurant.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
              <Menu position='bottom-end' withinPortal>
                <Menu.Target>
                  <ActionIcon variant='subtle'>
                    <IconDotsVertical size='1rem' />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconPencil style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => handleEditRestaurant(restaurant)}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    color='red'
                    leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => handleDeleteRestaurant(restaurant.id)}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>

            <Text size='sm' c='dimmed' lineClamp={2} mb='md'>
              {restaurant.description}
            </Text>

            <Group gap='xs' mb='xs'>
              <IconMapPin size='1rem' stroke={1.5} />
              <Text size='sm' c='dimmed'>
                {restaurant.address}
              </Text>
            </Group>

            <Group gap='xs' mb='xs'>
              <IconPhone size='1rem' stroke={1.5} />
              <Text size='sm' c='dimmed'>
                {restaurant.phone}
              </Text>
            </Group>

            <Group gap='xs'>
              <IconClock size='1rem' stroke={1.5} />
              <Text size='sm' c='dimmed'>
                {restaurant.openingHours.open} - {restaurant.openingHours.close}
              </Text>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <Modal opened={opened} onClose={close} title={isEditing ? 'Edit Restaurant' : 'Add New Restaurant'} size='lg'>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label='Restaurant Name'
              name='name'
              placeholder='Enter restaurant name'
              required
              defaultValue={editingRestaurant?.name || ''}
            />

            <Textarea
              label='Description'
              name='description'
              placeholder='Enter restaurant description'
              minRows={3}
              defaultValue={editingRestaurant?.description || ''}
            />

            <Grid>
              <Grid.Col span={6}>
                <Select
                  label='Cuisine Type'
                  name='cuisine'
                  placeholder='Select cuisine type'
                  data={[
                    { value: 'Italian', label: 'Italian' },
                    { value: 'Japanese', label: 'Japanese' },
                    { value: 'Mexican', label: 'Mexican' },
                    { value: 'Indian', label: 'Indian' },
                    { value: 'Chinese', label: 'Chinese' },
                    { value: 'American', label: 'American' },
                    { value: 'French', label: 'French' },
                    { value: 'Thai', label: 'Thai' }
                  ]}
                  defaultValue={editingRestaurant?.cuisine || ''}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Switch
                  label='Active Status'
                  name='status'
                  defaultChecked={editingRestaurant?.status === 'active'}
                  mt='lg'
                />
              </Grid.Col>
            </Grid>

            <Divider label='Contact Information' labelPosition='center' />

            <TextInput
              label='Address'
              name='address'
              placeholder='Enter full address'
              defaultValue={editingRestaurant?.address || ''}
              required
            />

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label='Phone Number'
                  name='phone'
                  placeholder='Enter phone number'
                  defaultValue={editingRestaurant?.phone || ''}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label='Email'
                  name='email'
                  type='email'
                  placeholder='Enter email address'
                  defaultValue={editingRestaurant?.email || ''}
                  required
                />
              </Grid.Col>
            </Grid>

            <Divider label='Opening Hours' labelPosition='center' />

            <Grid>
              <Grid.Col span={6}>
                <TimeInput
                  label='Opening Time'
                  name='openTime'
                  defaultValue={editingRestaurant?.openingHours.open || ''}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TimeInput
                  label='Closing Time'
                  name='closeTime'
                  defaultValue={editingRestaurant?.openingHours.close || ''}
                  required
                />
              </Grid.Col>
            </Grid>

            <FileInput
              label='Restaurant Image'
              name='image'
              placeholder='Upload restaurant image'
              accept='image/png,image/jpeg'
              leftSection={<IconUpload size={rem(14)} />}
            />

            <Group justify='flex-end' mt='md'>
              <Button variant='outline' onClick={close}>
                Cancel
              </Button>
              <Button type='submit'>{isEditing ? 'Update' : 'Add'} Restaurant</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
