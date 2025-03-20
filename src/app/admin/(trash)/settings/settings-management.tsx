'use client';

import {
  Accordion,
  Badge,
  Button,
  ColorInput,
  Divider,
  FileInput,
  Grid,
  Group,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  Stack,
  Switch,
  Tabs,
  Text,
  TextInput,
  Textarea,
  Title,
  rem
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import {
  IconBell,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBuildingStore,
  IconClock,
  IconCreditCard,
  IconCurrencyDollar,
  IconMail,
  IconMapPin,
  IconPalette,
  IconPhone,
  IconSpacingVertical,
  IconUpload,
  IconWorld
} from '@tabler/icons-react';
import { useState } from 'react';

interface GeneralSettings {
  restaurantName: string;
  tagline: string;
  description: string;
  logo: string | null;
  email: string;
  phone: string;
  address: string;
  website: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  businessHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
}

interface PaymentSettings {
  acceptedPaymentMethods: string[];
  currency: string;
  taxRate: number;
  serviceCharge: number;
  enableTipping: boolean;
  minimumOrderAmount: number;
  deliveryFee: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  orderConfirmation: boolean;
  orderStatusUpdate: boolean;
  specialOffers: boolean;
  newMenuItems: boolean;
}

interface AppearanceSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  enableDarkMode: boolean;
  showPopularItems: boolean;
  showRecommendations: boolean;
}

export default function SettingsManagement() {
  const [activeTab, setActiveTab] = useState<string | null>('general');

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    restaurantName: 'Bella Italia',
    tagline: 'Authentic Italian Cuisine',
    description:
      'Bella Italia offers authentic Italian cuisine in a cozy atmosphere. Our chefs use only the freshest ingredients to create traditional dishes with a modern twist.',
    logo: null,
    email: 'info@bellaitalia.com',
    phone: '(212) 555-1234',
    address: '123 Main St, New York, NY 10001',
    website: 'www.bellaitalia.com',
    socialMedia: {
      facebook: 'facebook.com/bellaitalia',
      instagram: 'instagram.com/bellaitalia',
      twitter: 'twitter.com/bellaitalia'
    },
    businessHours: {
      monday: { open: '11:00', close: '22:00', closed: false },
      tuesday: { open: '11:00', close: '22:00', closed: false },
      wednesday: { open: '11:00', close: '22:00', closed: false },
      thursday: { open: '11:00', close: '23:00', closed: false },
      friday: { open: '11:00', close: '23:00', closed: false },
      saturday: { open: '12:00', close: '23:00', closed: false },
      sunday: { open: '12:00', close: '21:00', closed: false }
    }
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    acceptedPaymentMethods: ['credit_card', 'cash', 'online_payment'],
    currency: 'USD',
    taxRate: 8.5,
    serviceCharge: 0,
    enableTipping: true,
    minimumOrderAmount: 10,
    deliveryFee: 5
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    orderConfirmation: true,
    orderStatusUpdate: true,
    specialOffers: false,
    newMenuItems: false
  });

  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    primaryColor: '#1c7ed6',
    secondaryColor: '#f03e3e',
    accentColor: '#fcc419',
    fontFamily: 'Inter',
    enableDarkMode: false,
    showPopularItems: true,
    showRecommendations: true
  });

  const handleSaveGeneralSettings = () => {
    notifications.show({
      title: 'Settings Saved',
      message: 'General settings have been successfully updated',
      color: 'green'
    });
  };

  const handleSavePaymentSettings = () => {
    notifications.show({
      title: 'Settings Saved',
      message: 'Payment settings have been successfully updated',
      color: 'green'
    });
  };

  const handleSaveNotificationSettings = () => {
    notifications.show({
      title: 'Settings Saved',
      message: 'Notification settings have been successfully updated',
      color: 'green'
    });
  };

  const handleSaveAppearanceSettings = () => {
    notifications.show({
      title: 'Settings Saved',
      message: 'Appearance settings have been successfully updated',
      color: 'green'
    });
  };

  return (
    <>
      <Group justify='space-between' mb='lg'>
        <Title order={2}>Settings</Title>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb='xl'>
          <Tabs.Tab value='general' leftSection={<IconBuildingStore size={16} />}>
            General
          </Tabs.Tab>
          <Tabs.Tab value='payment' leftSection={<IconCreditCard size={16} />}>
            Payment
          </Tabs.Tab>
          <Tabs.Tab value='notifications' leftSection={<IconBell size={16} />}>
            Notifications
          </Tabs.Tab>
          <Tabs.Tab value='appearance' leftSection={<IconPalette size={16} />}>
            Appearance
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='general'>
          <Paper withBorder p='md' radius='md'>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSaveGeneralSettings();
              }}
            >
              <Stack>
                <Title order={3}>Restaurant Information</Title>

                <TextInput
                  label='Restaurant Name'
                  placeholder='Enter restaurant name'
                  value={generalSettings.restaurantName}
                  onChange={e => setGeneralSettings({ ...generalSettings, restaurantName: e.target.value })}
                  required
                />

                <TextInput
                  label='Tagline'
                  placeholder='Enter restaurant tagline'
                  value={generalSettings.tagline}
                  onChange={e => setGeneralSettings({ ...generalSettings, tagline: e.target.value })}
                />

                <Textarea
                  label='Description'
                  placeholder='Enter restaurant description'
                  minRows={3}
                  value={generalSettings.description}
                  onChange={e => setGeneralSettings({ ...generalSettings, description: e.target.value })}
                />

                <FileInput
                  label='Restaurant Logo'
                  placeholder='Upload logo'
                  accept='image/png,image/jpeg,image/svg+xml'
                  leftSection={<IconUpload size={rem(14)} />}
                />

                <Divider label='Contact Information' labelPosition='center' />

                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label='Email'
                      placeholder='Enter email address'
                      leftSection={<IconMail size={16} />}
                      value={generalSettings.email}
                      onChange={e => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label='Phone'
                      placeholder='Enter phone number'
                      leftSection={<IconPhone size={16} />}
                      value={generalSettings.phone}
                      onChange={e => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                      required
                    />
                  </Grid.Col>
                </Grid>

                <TextInput
                  label='Address'
                  placeholder='Enter full address'
                  leftSection={<IconMapPin size={16} />}
                  value={generalSettings.address}
                  onChange={e => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                  required
                />

                <TextInput
                  label='Website'
                  placeholder='Enter website URL'
                  leftSection={<IconWorld size={16} />}
                  value={generalSettings.website}
                  onChange={e => setGeneralSettings({ ...generalSettings, website: e.target.value })}
                />

                <Divider label='Social Media' labelPosition='center' />

                <Grid>
                  <Grid.Col span={4}>
                    <TextInput
                      label='Facebook'
                      placeholder='Facebook page URL'
                      leftSection={<IconBrandFacebook size={16} />}
                      value={generalSettings.socialMedia.facebook}
                      onChange={e =>
                        setGeneralSettings({
                          ...generalSettings,
                          socialMedia: { ...generalSettings.socialMedia, facebook: e.target.value }
                        })
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label='Instagram'
                      placeholder='Instagram handle'
                      leftSection={<IconBrandInstagram size={16} />}
                      value={generalSettings.socialMedia.instagram}
                      onChange={e =>
                        setGeneralSettings({
                          ...generalSettings,
                          socialMedia: { ...generalSettings.socialMedia, instagram: e.target.value }
                        })
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label='Twitter'
                      placeholder='Twitter handle'
                      leftSection={<IconBrandTwitter size={16} />}
                      value={generalSettings.socialMedia.twitter}
                      onChange={e =>
                        setGeneralSettings({
                          ...generalSettings,
                          socialMedia: { ...generalSettings.socialMedia, twitter: e.target.value }
                        })
                      }
                    />
                  </Grid.Col>
                </Grid>

                <Divider label='Business Hours' labelPosition='center' />

                <Accordion>
                  {(
                    Object.keys(generalSettings.businessHours) as Array<keyof typeof generalSettings.businessHours>
                  ).map(day => (
                    <Accordion.Item key={day} value={day}>
                      <Accordion.Control>
                        <Group>
                          <Text tt='capitalize'>{day}</Text>
                          {generalSettings.businessHours[day].closed ? (
                            <Badge color='red'>Closed</Badge>
                          ) : (
                            <Text size='sm' c='dimmed'>
                              {generalSettings.businessHours[day].open} - {generalSettings.businessHours[day].close}
                            </Text>
                          )}
                        </Group>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Group align='flex-end'>
                          <Switch
                            label='Closed'
                            checked={generalSettings.businessHours[day].closed}
                            onChange={e => {
                              const newHours = { ...generalSettings.businessHours };
                              newHours[day].closed = e.currentTarget.checked;
                              setGeneralSettings({ ...generalSettings, businessHours: newHours });
                            }}
                          />

                          {!generalSettings.businessHours[day].closed && (
                            <>
                              <TimeInput
                                label='Opening Time'
                                value={generalSettings.businessHours[day].open}
                                onChange={value => {
                                  const newHours = { ...generalSettings.businessHours };
                                  newHours[day].open = value.target.value;
                                  setGeneralSettings({ ...generalSettings, businessHours: newHours });
                                }}
                                leftSection={<IconClock size={16} />}
                              />

                              <TimeInput
                                label='Closing Time'
                                value={generalSettings.businessHours[day].close}
                                onChange={value => {
                                  const newHours = { ...generalSettings.businessHours };
                                  newHours[day].close = value.target.value;
                                  setGeneralSettings({ ...generalSettings, businessHours: newHours });
                                }}
                                leftSection={<IconClock size={16} />}
                              />
                            </>
                          )}
                        </Group>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>

                <Group justify='flex-end' mt='xl'>
                  <Button type='submit' leftSection={<IconSpacingVertical size={16} />}>
                    Lưu thay đổi
                  </Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value='payment'>
          <Paper withBorder p='md' radius='md'>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSavePaymentSettings();
              }}
            >
              <Stack>
                <Title order={3}>Payment Settings</Title>

                <MultiSelect
                  label='Accepted Payment Methods'
                  placeholder='Select payment methods'
                  data={[
                    { value: 'credit_card', label: 'Credit Card' },
                    { value: 'debit_card', label: 'Debit Card' },
                    { value: 'cash', label: 'Cash' },
                    { value: 'online_payment', label: 'Online Payment' },
                    { value: 'mobile_payment', label: 'Mobile Payment' }
                  ]}
                  value={paymentSettings.acceptedPaymentMethods}
                  onChange={value => setPaymentSettings({ ...paymentSettings, acceptedPaymentMethods: value })}
                />

                <Grid>
                  <Grid.Col span={6}>
                    <Select
                      label='Currency'
                      placeholder='Select currency'
                      data={[
                        { value: 'USD', label: 'USD ($)' },
                        { value: 'EUR', label: 'EUR (€)' },
                        { value: 'GBP', label: 'GBP (£)' },
                        { value: 'JPY', label: 'JPY (¥)' },
                        { value: 'CAD', label: 'CAD ($)' }
                      ]}
                      value={paymentSettings.currency}
                      onChange={value => value && setPaymentSettings({ ...paymentSettings, currency: value })}
                      leftSection={<IconCurrencyDollar size={16} />}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      label='Tax Rate (%)'
                      placeholder='Enter tax rate'
                      min={0}
                      max={100}
                      step={0.1}
                      value={paymentSettings.taxRate}
                      onChange={value => setPaymentSettings({ ...paymentSettings, taxRate: Number(value) || 0 })}
                    />
                  </Grid.Col>
                </Grid>

                <Grid>
                  <Grid.Col span={6}>
                    <NumberInput
                      label='Service Charge (%)'
                      placeholder='Enter service charge'
                      min={0}
                      max={100}
                      step={0.1}
                      value={paymentSettings.serviceCharge}
                      onChange={value => setPaymentSettings({ ...paymentSettings, serviceCharge: Number(value) || 0 })}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Switch
                      label='Enable Tipping'
                      checked={paymentSettings.enableTipping}
                      onChange={e => setPaymentSettings({ ...paymentSettings, enableTipping: e.currentTarget.checked })}
                      mt='lg'
                    />
                  </Grid.Col>
                </Grid>

                <Divider label='Delivery Settings' labelPosition='center' />

                <Grid>
                  <Grid.Col span={6}>
                    <NumberInput
                      label='Minimum Order Amount'
                      placeholder='Enter minimum order amount'
                      min={0}
                      step={0.01}
                      value={paymentSettings.minimumOrderAmount}
                      onChange={value =>
                        setPaymentSettings({ ...paymentSettings, minimumOrderAmount: Number(value) || 0 })
                      }
                      leftSection={<IconCurrencyDollar size={16} />}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      label='Delivery Fee'
                      placeholder='Enter delivery fee'
                      min={0}
                      step={0.01}
                      value={paymentSettings.deliveryFee}
                      onChange={value => setPaymentSettings({ ...paymentSettings, deliveryFee: Number(value) || 0 })}
                      leftSection={<IconCurrencyDollar size={16} />}
                    />
                  </Grid.Col>
                </Grid>

                <Group justify='flex-end' mt='xl'>
                  <Button type='submit' leftSection={<IconSpacingVertical size={16} />}>
                    Lưu thay đổi
                  </Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value='notifications'>
          <Paper withBorder p='md' radius='md'>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSaveNotificationSettings();
              }}
            >
              <Stack>
                <Title order={3}>Notification Settings</Title>

                <Divider label='Notification Channels' labelPosition='center' />

                <Switch
                  label='Email Notifications'
                  description='Receive notifications via email'
                  checked={notificationSettings.emailNotifications}
                  onChange={e =>
                    setNotificationSettings({ ...notificationSettings, emailNotifications: e.currentTarget.checked })
                  }
                />

                <Switch
                  label='SMS Notifications'
                  description='Receive notifications via SMS'
                  checked={notificationSettings.smsNotifications}
                  onChange={e =>
                    setNotificationSettings({ ...notificationSettings, smsNotifications: e.currentTarget.checked })
                  }
                />

                <Switch
                  label='Push Notifications'
                  description='Receive push notifications on mobile devices'
                  checked={notificationSettings.pushNotifications}
                  onChange={e =>
                    setNotificationSettings({ ...notificationSettings, pushNotifications: e.currentTarget.checked })
                  }
                />

                <Divider label='Notification Types' labelPosition='center' />

                <Switch
                  label='Order Confirmation'
                  description='Notify when a new order is placed'
                  checked={notificationSettings.orderConfirmation}
                  onChange={e =>
                    setNotificationSettings({ ...notificationSettings, orderConfirmation: e.currentTarget.checked })
                  }
                />

                <Switch
                  label='Order Status Updates'
                  description='Notify when an order status changes'
                  checked={notificationSettings.orderStatusUpdate}
                  onChange={e =>
                    setNotificationSettings({ ...notificationSettings, orderStatusUpdate: e.currentTarget.checked })
                  }
                />

                <Switch
                  label='Special Offers'
                  description='Notify about special offers and promotions'
                  checked={notificationSettings.specialOffers}
                  onChange={e =>
                    setNotificationSettings({ ...notificationSettings, specialOffers: e.currentTarget.checked })
                  }
                />

                <Switch
                  label='New Menu Items'
                  description='Notify when new menu items are added'
                  checked={notificationSettings.newMenuItems}
                  onChange={e =>
                    setNotificationSettings({ ...notificationSettings, newMenuItems: e.currentTarget.checked })
                  }
                />

                <Group justify='flex-end' mt='xl'>
                  <Button type='submit' leftSection={<IconSpacingVertical size={16} />}>
                    Lưu thay đổi
                  </Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value='appearance'>
          <Paper withBorder p='md' radius='md'>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSaveAppearanceSettings();
              }}
            >
              <Stack>
                <Title order={3}>Appearance Settings</Title>

                <Divider label='Colors' labelPosition='center' />

                <Grid>
                  <Grid.Col span={4}>
                    <ColorInput
                      label='Primary Color'
                      format='hex'
                      swatches={['#1c7ed6', '#37b24d', '#f03e3e', '#7950f2', '#fa5252', '#12b886', '#228be6']}
                      value={appearanceSettings.primaryColor}
                      onChange={value => setAppearanceSettings({ ...appearanceSettings, primaryColor: value })}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <ColorInput
                      label='Secondary Color'
                      format='hex'
                      swatches={['#1c7ed6', '#37b24d', '#f03e3e', '#7950f2', '#fa5252', '#12b886', '#228be6']}
                      value={appearanceSettings.secondaryColor}
                      onChange={value => setAppearanceSettings({ ...appearanceSettings, secondaryColor: value })}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <ColorInput
                      label='Accent Color'
                      format='hex'
                      swatches={['#1c7ed6', '#37b24d', '#f03e3e', '#7950f2', '#fa5252', '#12b886', '#228be6']}
                      value={appearanceSettings.accentColor}
                      onChange={value => setAppearanceSettings({ ...appearanceSettings, accentColor: value })}
                    />
                  </Grid.Col>
                </Grid>

                <Select
                  label='Font Family'
                  placeholder='Select font family'
                  data={[
                    { value: 'Inter', label: 'Inter' },
                    { value: 'Roboto', label: 'Roboto' },
                    { value: 'Open Sans', label: 'Open Sans' },
                    { value: 'Lato', label: 'Lato' },
                    { value: 'Montserrat', label: 'Montserrat' }
                  ]}
                  value={appearanceSettings.fontFamily}
                  onChange={value => value && setAppearanceSettings({ ...appearanceSettings, fontFamily: value })}
                />

                <Divider label='Display Options' labelPosition='center' />

                <Switch
                  label='Enable Dark Mode'
                  description='Allow users to switch to dark mode'
                  checked={appearanceSettings.enableDarkMode}
                  onChange={e =>
                    setAppearanceSettings({ ...appearanceSettings, enableDarkMode: e.currentTarget.checked })
                  }
                />

                <Switch
                  label='Show Popular Items'
                  description='Display popular items section on the menu'
                  checked={appearanceSettings.showPopularItems}
                  onChange={e =>
                    setAppearanceSettings({ ...appearanceSettings, showPopularItems: e.currentTarget.checked })
                  }
                />

                <Switch
                  label='Show Recommendations'
                  description='Display personalized recommendations'
                  checked={appearanceSettings.showRecommendations}
                  onChange={e =>
                    setAppearanceSettings({ ...appearanceSettings, showRecommendations: e.currentTarget.checked })
                  }
                />

                <Group justify='flex-end' mt='xl'>
                  <Button type='submit' leftSection={<IconSpacingVertical size={16} />}>
                    Lưu thay đổi
                  </Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
