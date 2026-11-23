import type { RouterOutputs } from '~/server/types/trpc.types';

export type Search = RouterOutputs['Search']['search'];

export type SearchGlobal = RouterOutputs['Search']['searchGlobal'];
