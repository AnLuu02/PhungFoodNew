// 'use client';
// import { Box, Divider, NavLink, Text, ThemeIcon, rem } from '@mantine/core';
// import {
//   IconBuildingStore,
//   IconClipboardList,
//   IconDashboard,
//   IconPhoto,
//   IconSettings,
//   IconShoppingCart,
//   IconUsers
// } from '@tabler/icons-react';
// import { AdminView } from '../layout';

// interface AdminNavbarProps {
//   activeView: AdminView;
//   setActiveView: (view: AdminView) => void;
// }

// export default function AdminNavbar({ activeView, setActiveView }: AdminNavbarProps) {
//   const navItems = [
//     {
//       label: 'Dashboard',
//       icon: <IconDashboard style={{ width: rem(20), height: rem(20) }} stroke={1.5} />,
//       value: 'dashboard' as AdminView
//     },
//     {
//       label: 'Restaurant Management',
//       icon: <IconBuildingStore style={{ width: rem(20), height: rem(20) }} stroke={1.5} />,
//       value: 'restaurants' as AdminView
//     },
//     {
//       label: 'Banner Management',
//       icon: <IconPhoto style={{ width: rem(20), height: rem(20) }} stroke={1.5} />,
//       value: 'banners' as AdminView
//     },
//     {
//       label: 'Menu Management',
//       icon: <IconClipboardList style={{ width: rem(20), height: rem(20) }} stroke={1.5} />,
//       value: 'menu' as AdminView
//     },
//     {
//       label: 'Order Management',
//       icon: <IconShoppingCart style={{ width: rem(20), height: rem(20) }} stroke={1.5} />,
//       value: 'orders' as AdminView
//     },
//     {
//       label: 'Staff Management',
//       icon: <IconUsers style={{ width: rem(20), height: rem(20) }} stroke={1.5} />,
//       value: 'staff' as AdminView
//     },
//     {
//       label: 'Settings',
//       icon: <IconSettings style={{ width: rem(20), height: rem(20) }} stroke={1.5} />,
//       value: 'settings' as AdminView
//     }
//   ];

//   return (
//     <Box>
//       <Box mb='md'>
//         <Text size='xs' fw={500} c='dimmed' mb={5}>
//           MAIN NAVIGATION
//         </Text>
//         <Divider />
//       </Box>

//       {navItems.map(item => (
//         <NavLink
//           key={item.value}
//           active={activeView === item.value}
//           label={item.label}
//           leftSection={
//             <ThemeIcon variant={activeView === item.value ? 'filled' : 'light'} size='md' radius='sm'>
//               {item.icon}
//             </ThemeIcon>
//           }
//           onClick={() => setActiveView(item.value)}
//           mb={5}
//         />
//       ))}
//     </Box>
//   );
// }
