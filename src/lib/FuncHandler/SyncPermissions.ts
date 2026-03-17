export function syncPermissions(init: any[], dynamic: any[]): any[] {
  const initMap = new Map(init.map(p => [p.id, p]));

  const result: any[] = [];

  for (const d of dynamic) {
    if (!initMap.has(d.id)) {
      result.push({ ...d, granted: true });
    } else {
      initMap.delete(d.id);
    }
  }
  for (const [, p] of initMap) {
    result.push({ ...p, granted: false });
  }

  return result;
}
