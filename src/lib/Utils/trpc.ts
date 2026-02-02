import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";

// Trích xuất toàn bộ Output type
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// Trích xuất toàn bộ Input type (nếu cần)
export type RouterInputs = inferRouterInputs<AppRouter>;