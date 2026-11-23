'use client';
import { Grid, Stack } from '@mantine/core';
import DeviceBreakdownChart from '~/app/admin/(dashboard)/analytics/components/device-breakdown-chart';
import ReportSnapshotChart from '~/app/admin/(dashboard)/analytics/components/report-snapshot';
import ReturningUserChart from '~/app/admin/(dashboard)/analytics/components/returning-user-chart';
import StatsSection from '~/app/admin/(dashboard)/analytics/components/stats-section';
import UserChart from '~/app/admin/(dashboard)/analytics/components/user-chart';

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
