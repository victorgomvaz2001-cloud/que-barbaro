import { fetchSEO } from '@/lib/seo'

interface Props {
  route: string
  fallback?: { title?: string; description?: string }
}

export default async function SEOHead({ route, fallback }: Props) {
  const seo = await fetchSEO(route)

  const title = seo?.title ?? fallback?.title
  const description = seo?.description ?? fallback?.description

  return (
    <>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {seo?.canonical && <link rel="canonical" href={seo.canonical} />}
      {seo?.alternates?.languages &&
        Object.entries(seo.alternates.languages).map(([lang, href]) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={href} />
        ))}
      {seo?.robots && (
        <meta
          name="robots"
          content={[
            seo.robots.index !== false ? 'index' : 'noindex',
            seo.robots.follow !== false ? 'follow' : 'nofollow',
          ].join(', ')}
        />
      )}
      {seo?.og && (
        <>
          <meta property="og:title" content={seo.og.title ?? title ?? ''} />
          <meta property="og:description" content={seo.og.description ?? description ?? ''} />
          {seo.og.image && <meta property="og:image" content={seo.og.image} />}
          {seo.og.url && <meta property="og:url" content={seo.og.url} />}
          <meta property="og:type" content={seo.og.type ?? 'website'} />
        </>
      )}
      {seo?.twitterCard && (
        <>
          <meta name="twitter:card" content={seo.twitterCard.card ?? 'summary_large_image'} />
          <meta name="twitter:title" content={seo.twitterCard.title ?? title ?? ''} />
          <meta name="twitter:description" content={seo.twitterCard.description ?? description ?? ''} />
          {seo.twitterCard.image && <meta name="twitter:image" content={seo.twitterCard.image} />}
        </>
      )}
    </>
  )
}
