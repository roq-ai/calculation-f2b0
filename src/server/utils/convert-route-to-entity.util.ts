const mapping: Record<string, string> = {
  'excel-files': 'excel_file',
  schools: 'school',
  scores: 'score',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
