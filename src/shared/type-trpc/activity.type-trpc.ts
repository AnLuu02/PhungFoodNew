import { RouterOutputs } from '~/trpc/react';

export type GetFeedActivity = RouterOutputs['Activity']['feed'];
export type GetTimelineActivity = RouterOutputs['Activity']['timeline'];
export type GetStatsActivity = RouterOutputs['Activity']['stats'];
