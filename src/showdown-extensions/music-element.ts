import type { ShowdownExtension } from 'showdown';
import { compile } from 'handlebars';

const template = compile(`
<div class="music-element {{ type }}" id={{ id }}>
    <div class="flex grow flex-d-row">
        {{#if cover}}
        <img src="{{ cover }}" alt="Album cover" />
        {{/if}}
        <div class="info">
            <span class="title">{{ title }}</span>
            {{#if artist}}
            <span class="artist-name">{{ artist }}</span>
            {{/if}}
        </div>
        {{#if mediaLinks}}
        <div class="links">
            {{#if youtube}}
            <a href="{{ youtube }}" class="youtube"><i class="mdi mdi-youtube"></i></a>
            {{/if}}
            {{#if spotify}}
            <a href="{{ spotify }}" class="spotify"><i class="mdi mdi-spotify"></i></a>
            {{/if}}
        </div>
        {{/if}}
    </div>
</div>
`);

export default [
    {
        type: 'lang',
        filter: (text: string): string =>
            text.replace(/\{\{\s*(artist|album|track)\s+(.*?)\s*\}\}/gms, (_str, type, content): string => {
                const tags: Dictionary<string> = {};

                content = content.split(/\n/g);
                for (const line of content) {
                    const [, k, v] = line.match(/^\s*(\w+)\s*=\s*(.*?)\s*$/) || [];

                    if (k && v) {
                        tags[k.toLowerCase()] = v;
                    }
                }

                return template({
                    type: type,
                    title: tags.title?.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
                    artist: tags.artist?.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
                    cover: tags.cover && encodeURI(tags.cover),
                    youtube: tags.youtube && encodeURI(tags.youtube),
                    spotify: tags.spotify && encodeURI(tags.spotify),
                    mediaLinks: !!tags.youtube || !!tags.spotify,
                    id: ((tags.artist ? tags.artist + '-' : '') + tags.title).toLowerCase().replace(/[^a-z0-9\-]/g, ''),
                });
            }),
    },
] as ShowdownExtension[];
