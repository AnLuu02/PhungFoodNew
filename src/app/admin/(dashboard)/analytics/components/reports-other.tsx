'use client';
import { Grid, Stack } from '@mantine/core';
import DeviceBreakdownChart from './DeviceBreakdownChart';
import ReportSnapshotChart from './ReportSnapshot';
import ReturningUserChart from './ReturningUserChart';
import StatsSection from './StatsSection';
import UserChart from './UserChart';

export const ReportsOther = () => {
  return (
    <Stack w='100%' align='stretch' justify='center'>
      <Grid columns={10} w='100%'>
        <Grid.Col h={400} span={{ base: 10, md: 7, lg: 7 }}>
          <ReportSnapshotChart />
        </Grid.Col>
        <Grid.Col h={400} span={{ base: 10, md: 3, lg: 3 }}>
          <UserChart />
        </Grid.Col>

        <Grid.Col h={350} span={{ base: 10, md: 5, lg: 4 }}>
          <StatsSection />
        </Grid.Col>
        <Grid.Col h={350} span={{ base: 10, md: 5, lg: 3 }}>
          <ReturningUserChart />
        </Grid.Col>

        <Grid.Col h={350} span={{ base: 10, md: 5, lg: 3 }}>
          <DeviceBreakdownChart />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
