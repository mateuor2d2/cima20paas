export function useContent() {
  const { siteId } = useSite()

  async function getPage(path: string) {
    return queryCollection('pages')
      .where('site', '=', siteId.value)
      .where('path', 'LIKE', `%${path}%`)
      .first()
  }

  async function getPosts(limit?: number) {
    const q = queryCollection('posts')
      .where('site', '=', siteId.value)
      .order('date', 'DESC')
    if (limit) q.limit(limit)
    return q.all()
  }

  return { getPage, getPosts }
}
