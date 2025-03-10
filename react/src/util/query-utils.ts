import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

export type CombinedMutationResult<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown,
> = Omit<
  UseMutationResult<TData, TError, TVariables, TContext>,
  "mutate" | "mutateAsync" | "reset" | "data" | "variables" | "context"
>;

export function combineMutationResults<TData1, TData2, TError1, TError2>(
  resultA: UseMutationResult<TData1, TError1, any, any>,
  resultB: UseMutationResult<TData2, TError2, any, any>,
): CombinedMutationResult<TData1 | TData2, TError1 | TError2> {
  {
    return {
      isPending: resultA.isPending || resultB.isPending,
      isSuccess: resultA.isSuccess && resultB.isSuccess,
      isError: resultA.isError || resultB.isError,
      isIdle: resultA.isIdle && resultB.isIdle,
      isPaused: resultA.isPaused || resultB.isPaused,
      submittedAt: resultA.submittedAt || resultB.submittedAt,
      status:
        resultA.isPending || resultB.isPending
          ? "pending"
          : resultA.isError || resultB.isError
            ? "error"
            : resultA.isSuccess && resultB.isSuccess
              ? "success"
              : "idle",
      error: resultA.error ?? resultB.error,
      failureCount: resultA.failureCount + resultB.failureCount,
      failureReason: resultA.failureReason ?? resultB.failureReason,
    };
  }
}

export type CombinedQueryResult<TData1, TData2, TError1, TError2> = Omit<
  UseQueryResult<TData1 | TData2, TError1 | TError2>,
  "data" | "refetch" | "promise"
>;
export function combineQueryResults<TData1, TData2, TError1, TError2>(
  resultA: UseQueryResult<TData1, TError1>,
  resultB: UseQueryResult<TData2, TError2>,
): CombinedQueryResult<void, void, TError1, TError2> {
  return {
    isPending: resultA.isPending || resultB.isPending,
    isSuccess: resultA.isSuccess && resultB.isSuccess,
    isError: resultA.isError || resultB.isError,
    isLoading: resultA.isLoading || resultB.isLoading,
    isFetched: resultA.isFetched && resultB.isFetched,
    isFetchedAfterMount:
      resultA.isFetchedAfterMount && resultB.isFetchedAfterMount,
    isInitialLoading: resultA.isInitialLoading || resultB.isInitialLoading,
    isPaused: resultA.isPaused || resultB.isPaused,
    isLoadingError: resultA.isLoadingError || resultB.isLoadingError,
    isRefetchError: resultA.isRefetchError || resultB.isRefetchError,
    isPlaceholderData: resultA.isPlaceholderData || resultB.isPlaceholderData,
    isStale: resultA.isStale || resultB.isStale,
    isRefetching: resultA.isRefetching || resultB.isRefetching,
    isFetching: resultA.isFetching || resultB.isFetching,
    status:
      resultA.isPending || resultB.isPending
        ? "pending"
        : resultA.isError || resultB.isError
          ? "error"
          : resultA.isSuccess && resultB.isSuccess
            ? "success"
            : "pending",
    error: resultA.error ?? resultB.error,
    failureCount: resultA.failureCount + resultB.failureCount,
    failureReason: resultA.failureReason ?? resultB.failureReason,
    errorUpdateCount: resultA.errorUpdateCount + resultB.errorUpdateCount,
    fetchStatus:
      resultA.isFetching || resultB.isFetching
        ? "fetching"
        : resultA.isPaused || resultB.isPaused
          ? "paused"
          : "idle",
    dataUpdatedAt: Math.max(resultA.dataUpdatedAt, resultB.dataUpdatedAt),
    errorUpdatedAt: Math.max(resultA.errorUpdatedAt, resultB.errorUpdatedAt),
  };
}
