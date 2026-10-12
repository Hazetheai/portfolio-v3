import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

export function usePageMeta(options: {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  pageName?: MaybeRefOrGetter<string | undefined>
}) {
  const title = toValue(options.title)
  const description = toValue(options.description)
  const pageName = toValue(options.pageName) || ''

  useSeoMeta({
    title,
    description,
    twitterCard: 'summary_large_image',
  })
  useHead({
    titleTemplate: '%s',
  })
  defineOgImage('Site', {
    title,
    description,
    pageName,
  }, {
    alt: title,
  })
}
