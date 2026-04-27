import { Grid, GridCol, Group, Skeleton, Stack } from '@mantine/core';

export const ModalUpsertSkeleton = () => {
  return (
    <Grid>
      <GridCol span={9}>
        <Grid gutter='md'>
          <GridCol span={12}>
            <Skeleton height={50} />
          </GridCol>

          <GridCol span={4}>
            <Stack gap={4}>
              <Skeleton height={15} width='30%' radius='xl' />
              <Skeleton height={36} />
            </Stack>
          </GridCol>
          <GridCol span={4}>
            <Stack gap={4}>
              <Skeleton height={15} width='30%' radius='xl' />
              <Skeleton height={36} />
            </Stack>
          </GridCol>
          <GridCol span={4}>
            <Stack gap={4}>
              <Skeleton height={15} width='30%' radius='xl' />
              <Skeleton height={36} />
            </Stack>
          </GridCol>

          <GridCol span={4}>
            <Stack gap={4}>
              <Skeleton height={15} width='30%' radius='xl' />
              <Skeleton height={36} />
            </Stack>
          </GridCol>
          <GridCol span={4}>
            <Stack gap={4}>
              <Skeleton height={15} width='30%' radius='xl' />
              <Skeleton height={36} />
            </Stack>
          </GridCol>
          <GridCol span={4}>
            <Stack gap={4}>
              <Skeleton height={15} width='30%' radius='xl' />
              <Skeleton height={36} />
            </Stack>
          </GridCol>

          <GridCol span={12}>
            <Grid>
              <GridCol span={4}>
                <Skeleton height={36} />
              </GridCol>
              <GridCol span={4}>
                <Skeleton height={36} />
              </GridCol>
              <GridCol span={4}>
                <Skeleton height={36} />
              </GridCol>
            </Grid>
          </GridCol>

          <GridCol span={4}>
            <Stack gap={4}>
              <Skeleton height={15} width='40%' radius='xl' />
              <Skeleton height={36} />
            </Stack>
          </GridCol>
          <GridCol span={4}>
            <Stack gap={4}>
              <Skeleton height={15} width='40%' radius='xl' />
              <Skeleton height={36} />
            </Stack>
          </GridCol>
          <GridCol span={4}>
            <Stack gap={4}>
              <Skeleton height={15} width='40%' radius='xl' />
              <Skeleton height={36} />
            </Stack>
          </GridCol>

          <GridCol span={4}>
            <Group align='center' gap='sm'>
              <Skeleton height={24} width={44} radius='xl' />
              <Skeleton height={15} width='40%' radius='xl' />
            </Group>
          </GridCol>

          <GridCol span={12}>
            <Skeleton height={42} mt='md' />
          </GridCol>
        </Grid>
      </GridCol>
      <GridCol span={3}>
        <Skeleton height={200} width='100%' />
      </GridCol>
    </Grid>
  );
};
