'use client';

import { Box, Paper, Text } from '@mantine/core';
export const DiffChange = ({ expanded, log }: any) => {
  return (
    expanded &&
    log.metadata && (
      <Paper className='mt-3 border bg-gray-50 p-3 dark:bg-dark-card'>
        <Text ff='monospace' size='xs'>
          {log.metadata.changes && (
            <Box className='mb-3'>
              <strong className='mb-1 block'>Trường thay đổi:</strong>
              <Box className='flex flex-wrap gap-1'>
                {log.metadata.changes.map((field: any) => (
                  <span key={field} className='rounded-md bg-blue-100 px-2 py-0.5 font-bold text-blue-700'>
                    {field}
                  </span>
                ))}
              </Box>
            </Box>
          )}

          {log.metadata.before && (
            <details className='mt-2' open>
              <summary className='cursor-pointer font-semibold transition-colors hover:text-blue-600'>
                Chi tiết thay đổi (JSON)
              </summary>
              <Box className='mt-2 grid grid-cols-2 gap-2'>
                <Box>
                  <p className='mb-1 text-[14px] font-bold uppercase text-gray-500'>Trước</p>
                  <pre className='max-h-60 overflow-auto rounded border bg-white p-2 text-xs leading-5'>
                    {Object.entries(log.metadata.before).map(([key, value]) => (
                      <Box key={key} className={log.metadata.changes?.includes(key) ? '-mx-2 bg-red-50 px-2' : ''}>
                        <span className='text-gray-400'>{key}:</span> {JSON.stringify(value)}
                      </Box>
                    ))}
                  </pre>
                </Box>

                <Box>
                  <p className='mb-1 text-[14px] font-bold uppercase text-gray-500'>Sau</p>
                  <pre className='max-h-60 overflow-auto rounded border bg-white p-2 text-xs leading-5'>
                    {Object.entries(log.metadata.after || {}).map(([key, value]) => (
                      <Box
                        key={key}
                        className={log.metadata.changes?.includes(key) ? '-mx-2 bg-green-100 px-2 font-semibold' : ''}
                      >
                        <span className='text-gray-400'>{key}:</span> {JSON.stringify(value)}
                      </Box>
                    ))}
                  </pre>
                </Box>
              </Box>
            </details>
          )}
        </Text>
      </Paper>
    )
  );
};
