import Showdown from 'showdown';
import altText from './showdown-extensions/alt-text';
import coloredHashes from './showdown-extensions/colored-hashes';
import headerAnchors from './showdown-extensions/header-anchors';
import removeMeta from './showdown-extensions/remove-meta';
import youtubePreview from './showdown-extensions/youtube-preview';

export function makeHtml(markdownContent: string): string {
    return new Showdown.Converter({
        extensions: [removeMeta, youtubePreview, headerAnchors, altText, coloredHashes],
    }).makeHtml(markdownContent);
}
