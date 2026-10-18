import Script from "next/script";

/** Keep analytics out of the critical rendering work while retaining page views. */
export function DeferredAnalytics({ id }: { id: string }) {
  if (!/^G-[A-Z0-9]+$/.test(id)) return null;
  return <>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="lazyOnload" />
    <Script id="mietaaf-analytics" strategy="lazyOnload">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config',${JSON.stringify(id)});`}</Script>
  </>;
}
