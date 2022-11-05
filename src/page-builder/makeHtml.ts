import Showdown from 'showdown';
import altText from '../showdown-extensions/alt-text';
import coloredHashes from '../showdown-extensions/colored-hashes';
import headerAnchors from '../showdown-extensions/header-anchors';
import musicElement from '../showdown-extensions/music-element';
import removeMeta from '../showdown-extensions/remove-meta';
import tooltip from '../showdown-extensions/tooltip';
import youtubePreview from '../showdown-extensions/youtube-preview';

export function makeHtml(markdownContent: string): string {
    const extensions: Showdown.Extension[][] = [
        removeMeta,
        youtubePreview,
        headerAnchors,
        altText,
        coloredHashes,
        musicElement,
        tooltip,
    ];

    return new Showdown.Converter({
        extensions: extensions,
        ghCompatibleHeaderId: true,
        tables: true,
    }).makeHtml(markdownContent);
}
