import ytPreview from '../../showdown-extensions/youtube-preview';

type filterfn_t = (str: string) => string;

it('can parse youtube tags', () => {
    expect(typeof ytPreview[0]).not.toBe('undefined');
    const filter = ytPreview[0].filter as filterfn_t;

    let test = `{{ youtube dimensions=480x240 https://www.youtube.com/watch?v=oUcyEO_fc6Y }}`;
    expect(filter(test)).toBe(`
<iframe
    width="480"
    height="240"
    src="https://www.youtube.com/embed/oUcyEO_fc6Y"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
></iframe>
`);

    test = `{{ yt https://youtu.be/7IhRNtur6Ig }}`;
    expect(filter(test)).toBe(`
<iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/7IhRNtur6Ig"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
></iframe>
`);
});
