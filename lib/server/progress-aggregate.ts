export function buildProgressAggregate(userId: string, progress: any) {
  return { user_id: userId, ...progress }
}
