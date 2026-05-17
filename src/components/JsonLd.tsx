/**
 * Inline JSON-LD <script> tag for Schema.org structured data.
 * Safe in both server and client components.
 *
 * Usage:
 *   <JsonLd data={faqJsonLd(faqs)} />
 *   <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Schema.org JSON does not contain user input; safe to inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
