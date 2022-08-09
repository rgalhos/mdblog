import Showdown from 'showdown';
import removeMeta from './showdown-extensions/remove-meta';
import youtubePreview from './showdown-extensions/youtube-preview';

export function makeHtml(markdownContent: string): string {
    return new Showdown.Converter({ extensions: [removeMeta, youtubePreview] }).makeHtml(markdownContent);
}
