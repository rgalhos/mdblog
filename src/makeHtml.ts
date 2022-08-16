import Showdown from 'showdown';
import altText from './showdown-extensions/alt-text';
import coloredHashes from './showdown-extensions/colored-hashes';
import headerAnchors from './showdown-extensions/header-anchors';
import musicElement from './showdown-extensions/music-element';
import removeMeta from './showdown-extensions/remove-meta';
import tooltip from './showdown-extensions/tooltip';
import youtubePreview from './showdown-extensions/youtube-preview';

export function makeHtml(markdownContent: string): string {
    return new Showdown.Converter({
        extensions: [removeMeta, youtubePreview, headerAnchors, altText, coloredHashes, musicElement, tooltip],
    }).makeHtml(markdownContent);
}
