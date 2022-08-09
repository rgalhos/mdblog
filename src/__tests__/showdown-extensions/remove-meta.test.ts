import removeMeta from '../../showdown-extensions/remove-meta';

type filterfn_t = (str: string) => string;

const header = `<!---
{{ meta-property og:title = Markdown Syntax }}
    {{meta-property og:description = A file I use to test markdown syntax}}
{{meta-property}}
{{meta }}
        {{ meta a b}}
{{meta invalid tag=test test test}}
  {{     meta-property     og:image   =   https://file.domain.tld/img/01ab37a1b.png           }}
{{meta description=This is a <meta name="description" /> tag}}
{{ title A silly little title to test this silly little code }}
-->`;

it('can remove meta tags', () => {
    let test = header;

    expect(typeof removeMeta[0]).not.toBe('undefined');
    expect(typeof removeMeta[1]).not.toBe('undefined');

    test = (removeMeta[0].filter as filterfn_t)(test);
    test = (removeMeta[1].filter as filterfn_t)(test);

    expect(test).toBe(
        `<!---


{{meta-property}}
{{meta }}
        {{ meta a b}}
{{meta invalid tag=test test test}}

-->`
    );
});
