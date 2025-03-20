'use client';

import type React from 'react';

import {
  Accordion,
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  FileInput,
  Grid,
  Group,
  Image,
  Menu,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  TextInput,
  Textarea,
  Title,
  rem
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconCategory,
  IconDotsVertical,
  IconPencil,
  IconPlus,
  IconSalad,
  IconTrash,
  IconUpload
} from '@tabler/icons-react';
import { useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  allergens: string[];
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
}

const initialCategories: MenuCategory[] = [
  {
    id: '1',
    name: 'Appetizers',
    description: 'Start your meal with these delicious options',
    order: 1,
    isActive: true
  },
  { id: '2', name: 'Main Courses', description: 'Our signature dishes', order: 2, isActive: true },
  { id: '3', name: 'Desserts', description: 'Sweet treats to finish your meal', order: 3, isActive: true },
  { id: '4', name: 'Beverages', description: 'Refreshing drinks', order: 4, isActive: true }
];

const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Garlic Bread',
    description: 'Freshly baked bread with garlic butter',
    price: 5.99,
    category: 'Appetizers',
    image: '/placeholder.svg?height=150&width=150',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    isPopular: true,
    allergens: ['Gluten', 'Dairy']
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan',
    price: 8.99,
    category: 'Appetizers',
    image: '/placeholder.svg?height=150&width=150',
    isAvailable: true,
    isVegetarian: false,
    isSpicy: false,
    isPopular: false,
    allergens: ['Gluten', 'Dairy', 'Eggs']
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    category: 'Main Courses',
    image: '/placeholder.svg?height=150&width=150',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    isPopular: true,
    allergens: ['Gluten', 'Dairy']
  },
  {
    id: '4',
    name: 'Spaghetti Bolognese',
    description: 'Spaghetti with rich meat sauce',
    price: 14.5,
    category: 'Main Courses',
    image: '/placeholder.svg?height=150&width=150',
    isAvailable: true,
    isVegetarian: false,
    isSpicy: false,
    isPopular: true,
    allergens: ['Gluten', 'Dairy']
  },
  {
    id: '5',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    price: 6.99,
    category: 'Desserts',
    image: '/placeholder.svg?height=150&width=150',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    isPopular: true,
    allergens: ['Gluten', 'Dairy', 'Eggs']
  },
  {
    id: '6',
    name: 'Espresso',
    description: 'Strong Italian coffee',
    price: 3.5,
    category: 'Beverages',
    image: '/placeholder.svg?height=150&width=150',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    isPopular: false,
    allergens: []
  }
];

export default function MenuManagement() {
  const [activeTab, setActiveTab] = useState<string | null>('items');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [categories, setCategories] = useState<MenuCategory[]>(initialCategories);

  const [itemModalOpened, { open: openItemModal, close: closeItemModal }] = useDisclosure(false);
  const [categoryModalOpened, { open: openCategoryModal, close: closeCategoryModal }] = useDisclosure(false);

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Menu Item handlers
  const handleAddMenuItem = () => {
    setEditingItem(null);
    setIsEditing(false);
    openItemModal();
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsEditing(true);
    openItemModal();
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    notifications.show({
      title: 'Menu Item Deleted',
      message: 'The menu item has been successfully deleted',
      color: 'red'
    });
  };

  const handleSubmitMenuItem = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const allergenString = formData.get('allergens') as string;
    const allergens = allergenString ? allergenString.split(',').map(a => a.trim()) : [];

    const newItem: MenuItem = {
      id: isEditing && editingItem ? editingItem.id : Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number.parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      image: '/placeholder.svg?height=150&width=150', // In a real app, you would upload and get a URL
      isAvailable: formData.get('isAvailable') === 'on',
      isVegetarian: formData.get('isVegetarian') === 'on',
      isSpicy: formData.get('isSpicy') === 'on',
      isPopular: formData.get('isPopular') === 'on',
      allergens
    };

    if (isEditing) {
      setMenuItems(menuItems.map(item => (item.id === newItem.id ? newItem : item)));
      notifications.show({
        title: 'Menu Item Updated',
        message: 'The menu item has been successfully updated',
        color: 'blue'
      });
    } else {
      setMenuItems([...menuItems, newItem]);
      notifications.show({
        title: 'Menu Item Added',
        message: 'The menu item has been successfully added',
        color: 'green'
      });
    }

    closeItemModal();
  };

  // Category handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsEditing(false);
    openCategoryModal();
  };

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    setIsEditing(true);
    openCategoryModal();
  };

  const handleDeleteCategory = (id: string) => {
    // Check if category has menu items
    const hasItems = menuItems.some(item => item.category === categories.find(c => c.id === id)?.name);

    if (hasItems) {
      notifications.show({
        title: 'Cannot Delete Category',
        message: 'This category has menu items. Please remove or reassign them first.',
        color: 'red'
      });
      return;
    }

    setCategories(categories.filter(category => category.id !== id));
    notifications.show({
      title: 'Category Deleted',
      message: 'The category has been successfully deleted',
      color: 'red'
    });
  };

  const handleSubmitCategory = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const newCategory: MenuCategory = {
      id: isEditing && editingCategory ? editingCategory.id : Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      order: Number.parseInt(formData.get('order') as string),
      isActive: formData.get('isActive') === 'on'
    };

    if (isEditing) {
      setCategories(categories.map(category => (category.id === newCategory.id ? newCategory : category)));
      notifications.show({
        title: 'Category Updated',
        message: 'The category has been successfully updated',
        color: 'blue'
      });
    } else {
      setCategories([...categories, newCategory]);
      notifications.show({
        title: 'Category Added',
        message: 'The category has been successfully added',
        color: 'green'
      });
    }

    closeCategoryModal();
  };

  return (
    <>
      <Group justify='space-between' mb='lg'>
        <Title order={2}>Menu Management</Title>
        <Group>
          {activeTab === 'items' && (
            <Button leftSection={<IconPlus size={16} />} onClick={handleAddMenuItem}>
              Add Menu Item
            </Button>
          )}
          {activeTab === 'categories' && (
            <Button leftSection={<IconPlus size={16} />} onClick={handleAddCategory}>
              Add Category
            </Button>
          )}
        </Group>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} mb='xl'>
        <Tabs.List>
          <Tabs.Tab value='items' leftSection={<IconSalad size={16} />}>
            Menu Items
          </Tabs.Tab>
          <Tabs.Tab value='categories' leftSection={<IconCategory size={16} />}>
            Categories
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {activeTab === 'items' && (
        <Accordion multiple defaultValue={categories.map(c => c.name)}>
          {categories.map(category => (
            <Accordion.Item key={category.id} value={category.name}>
              <Accordion.Control>
                <Group>
                  <Text fw={500}>{category.name}</Text>
                  <Badge color={category.isActive ? 'green' : 'red'}>{category.isActive ? 'Active' : 'Inactive'}</Badge>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='md'>
                  {menuItems
                    .filter(item => item.category === category.name)
                    .map(item => (
                      <Card key={item.id} withBorder shadow='sm' padding='md' radius='md'>
                        <Group>
                          <Image
                            src={item.image || '/placeholder.svg'}
                            width={80}
                            height={80}
                            radius='md'
                            alt={item.name}
                          />
                          <Box style={{ flex: 1 }}>
                            <Group justify='space-between' mb={5}>
                              <Text fw={500}>{item.name}</Text>
                              <Menu position='bottom-end' withinPortal>
                                <Menu.Target>
                                  <ActionIcon variant='subtle'>
                                    <IconDotsVertical size='1rem' />
                                  </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                  <Menu.Item
                                    leftSection={<IconPencil style={{ width: rem(14), height: rem(14) }} />}
                                    onClick={() => handleEditMenuItem(item)}
                                  >
                                    Edit
                                  </Menu.Item>
                                  <Menu.Item
                                    color='red'
                                    leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                    onClick={() => handleDeleteMenuItem(item.id)}
                                  >
                                    Delete
                                  </Menu.Item>
                                </Menu.Dropdown>
                              </Menu>
                            </Group>
                            <Text size='sm' c='dimmed' lineClamp={2}>
                              {item.description}
                            </Text>
                            <Group mt={8}>
                              <Text fw={700} c='blue.7'>
                                ${item.price.toFixed(2)}
                              </Text>
                              <Group gap={5}>
                                {!item.isAvailable && (
                                  <Badge color='red' size='sm'>
                                    Out of Stock
                                  </Badge>
                                )}
                                {item.isVegetarian && (
                                  <Badge color='green' size='sm'>
                                    Veg
                                  </Badge>
                                )}
                                {item.isSpicy && (
                                  <Badge color='orange' size='sm'>
                                    Spicy
                                  </Badge>
                                )}
                                {item.isPopular && (
                                  <Badge color='blue' size='sm'>
                                    Popular
                                  </Badge>
                                )}
                              </Group>
                            </Group>
                          </Box>
                        </Group>
                      </Card>
                    ))}
                </SimpleGrid>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      {activeTab === 'categories' && (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Order</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Items Count</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {categories
              .sort((a, b) => a.order - b.order)
              .map(category => {
                const itemCount = menuItems.filter(item => item.category === category.name).length;

                return (
                  <Table.Tr key={category.id}>
                    <Table.Td>{category.order}</Table.Td>
                    <Table.Td>{category.name}</Table.Td>
                    <Table.Td>{category.description}</Table.Td>
                    <Table.Td>
                      <Badge color={category.isActive ? 'green' : 'red'}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{itemCount}</Table.Td>
                    <Table.Td>
                      <Group gap={5}>
                        <ActionIcon color='blue' variant='subtle' onClick={() => handleEditCategory(category)}>
                          <IconPencil size='1rem' />
                        </ActionIcon>
                        <ActionIcon color='red' variant='subtle' onClick={() => handleDeleteCategory(category.id)}>
                          <IconTrash size='1rem' />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
          </Table.Tbody>
        </Table>
      )}

      {/* Menu Item Modal */}
      <Modal
        opened={itemModalOpened}
        onClose={closeItemModal}
        title={isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
        size='lg'
      >
        <form onSubmit={handleSubmitMenuItem}>
          <Stack>
            <TextInput
              label='Item Name'
              name='name'
              placeholder='Enter item name'
              required
              defaultValue={editingItem?.name || ''}
            />

            <Textarea
              label='Description'
              name='description'
              placeholder='Enter item description'
              minRows={2}
              defaultValue={editingItem?.description || ''}
            />

            <Grid>
              <Grid.Col span={6}>
                <NumberInput
                  label='Price'
                  name='price'
                  placeholder='Enter price'
                  min={0}
                  step={0.01}
                  defaultValue={editingItem?.price || 0}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label='Category'
                  name='category'
                  placeholder='Select category'
                  data={categories.map(c => ({ value: c.name, label: c.name }))}
                  defaultValue={editingItem?.category || ''}
                  required
                />
              </Grid.Col>
            </Grid>

            <FileInput
              label='Item Image'
              name='image'
              placeholder='Upload item image'
              accept='image/png,image/jpeg'
              leftSection={<IconUpload size={rem(14)} />}
            />

            <TextInput
              label='Allergens'
              name='allergens'
              placeholder='Enter allergens (comma separated)'
              defaultValue={editingItem?.allergens.join(', ') || ''}
            />

            <Divider label='Item Options' labelPosition='center' />

            <Grid>
              <Grid.Col span={6}>
                <Switch label='Available' name='isAvailable' defaultChecked={editingItem?.isAvailable ?? true} />
              </Grid.Col>
              <Grid.Col span={6}>
                <Switch label='Vegetarian' name='isVegetarian' defaultChecked={editingItem?.isVegetarian ?? false} />
              </Grid.Col>
              <Grid.Col span={6}>
                <Switch label='Spicy' name='isSpicy' defaultChecked={editingItem?.isSpicy ?? false} />
              </Grid.Col>
              <Grid.Col span={6}>
                <Switch label='Popular' name='isPopular' defaultChecked={editingItem?.isPopular ?? false} />
              </Grid.Col>
            </Grid>

            <Group justify='flex-end' mt='md'>
              <Button variant='outline' onClick={closeItemModal}>
                Cancel
              </Button>
              <Button type='submit'>{isEditing ? 'Update' : 'Add'} Menu Item</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal
        opened={categoryModalOpened}
        onClose={closeCategoryModal}
        title={isEditing ? 'Edit Category' : 'Add New Category'}
        size='md'
      >
        <form onSubmit={handleSubmitCategory}>
          <Stack>
            <TextInput
              label='Category Name'
              name='name'
              placeholder='Enter category name'
              required
              defaultValue={editingCategory?.name || ''}
            />

            <Textarea
              label='Description'
              name='description'
              placeholder='Enter category description'
              minRows={2}
              defaultValue={editingCategory?.description || ''}
            />

            <NumberInput
              label='Display Order'
              name='order'
              placeholder='Enter display order'
              min={1}
              defaultValue={editingCategory?.order || categories.length + 1}
              required
            />

            <Switch label='Active' name='isActive' defaultChecked={editingCategory?.isActive ?? true} />

            <Group justify='flex-end' mt='md'>
              <Button variant='outline' onClick={closeCategoryModal}>
                Cancel
              </Button>
              <Button type='submit'>{isEditing ? 'Update' : 'Add'} Category</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
