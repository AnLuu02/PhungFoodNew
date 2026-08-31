import { SelectedPermissions } from '~/app/admin/role/components/types';

type Result = SelectedPermissions & { granted: boolean };

export function syncPermissions(initMap: Map<string, SelectedPermissions>, dynamic: SelectedPermissions[]): Result[] {
  if (!dynamic.length) {
    return [...initMap.values()].map(i => ({ ...i, granted: false }));
  }

  let result: Result[] = [];

  for (const d of dynamic) {
    if (!initMap.has(d.id)) {
      result.push({ ...d, type: 'added' as const, granted: true });
    } else {
      const init = initMap.get(d.id);
      if (init?.type !== d.type) {
        result.push({ ...d, granted: false });
      }
    }
  }

  return result;
}
