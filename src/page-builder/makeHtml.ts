import Showdown from 'showdown';
import altText from '../showdown-extensions/alt-text';
import coloredHashes from '../showdown-extensions/colored-hashes';
import headerAnchors from '../showdown-extensions/header-anchors';
import musicElement from '../showdown-extensions/music-element';
import removeMeta from '../showdown-extensions/remove-meta';
import tooltip from '../showdown-extensions/tooltip';
import youtubePreview from '../showdown-extensions/youtube-preview';
import lazyLoadImages from '../showdown-extensions/lazy-load-images';
import type { PageOptions } from '../interfaces/IPageOptions';

export function makeHtml(markdownContent: string, pageOptions: PageOptions): string {
    const extensions: Showdown.Extension[][] = [
        removeMeta,
        youtubePreview,
        headerAnchors,
        altText,
        coloredHashes,
        musicElement,
        tooltip,
    ];

    if (pageOptions.lazyLoadImages) {
        extensions.push(lazyLoadImages);
    }

    return new Showdown.Converter({
        extensions: extensions,
        ghCompatibleHeaderId: true,
        tables: true,
    }).makeHtml(markdownContent);
}
