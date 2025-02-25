import {
  cdnKeys,
  cdnRepositories,
  type CdnValidKeys,
  type GetCdnFileSuccessSchema,
} from '#app/apis/cdn.api';
import {
  skipToken,
  useQuery,
  type UndefinedInitialDataOptions,
} from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import React from 'react';
import { toast } from 'sonner';
import type { Except } from 'type-fest';

type Opt = {
  key: CdnValidKeys;
  url?: string | undefined;
  filename?: string;
};

/**
 * Eagerly download (GET) file based on input url.
 *
 * Includes error handling in effect for convenience.
 */
export function useCdnFileQuery(
  opt: Opt,
  queryOptions?: Except<
    UndefinedInitialDataOptions<unknown, HTTPError, GetCdnFileSuccessSchema>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryKey = cdnKeys[opt.key](opt.url);
  const queryFn = opt.url
    ? () => cdnRepositories.getCdnFile({ url: opt.url as string })
    : skipToken;

  const query = useQuery({
    queryKey,
    queryFn,
    enabled: !!opt.url,
    ...(queryOptions && queryOptions),
  });

  // create file object from blob
  const file = query.data?.blob
    ? new File([query.data.blob], opt.filename ?? 'unknown-filename', {
        type: query.data.blob.type,
        lastModified: Date.now(),
      })
    : null;

  React.useEffect(() => {
    if (query.error) {
      toast.error(query.error.message);
    }
  }, [query.error]);

  return { ...query, file };
}
