import type { ShowdownExtension } from 'showdown';

export const YT_REGEX =
    /^\s*\{\{\s*(?:yt|youtube)\s+(?:dimensions=([1-9][0-9]*)x([1-9][0-9]*)\s+)?(?:http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌[\w\?‌=]*)?)\s*\}\}$/gm;

export default [
    {
        type: 'lang',
        filter: (text: string): string =>
            text.replace(YT_REGEX, (_str, width, height, videoId) => {
                return `
<iframe
    width="${width || 560}"
    height="${height || 315}"
    src="https://www.youtube.com/embed/${videoId}"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
></iframe>
`;
            }),
    },
] as ShowdownExtension[];
