import type { RouterOutputs } from '~/server/types/trpc.types';

export type GetFeedActivity = RouterOutputs['Activity']['feed'];
export type GetTimelineActivity = RouterOutputs['Activity']['timeline'];
export type GetStatsActivity = RouterOutputs['Activity']['stats'];
