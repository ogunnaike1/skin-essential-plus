interface JsonLdProps {
  /** A schema.org object. Serialised into a <script type="application/ld+json">. */
  schema: object;
}

/**
 * Renders structured data for search engines. Invisible to visitors.
 *
 * `<` is escaped because a stray "</script>" inside any field would otherwise
 * close the tag early and inject markup into the page.
 */
export function JsonLd({ schema }: JsonLdProps): React.ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\u003c"),
      }}
    />
  );
}
