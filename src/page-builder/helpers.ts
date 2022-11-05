import Handlebars from 'handlebars';

Handlebars.registerHelper('calculateRenderTime', (startTime: number): number => (Date.now() - startTime) / 1000);

Handlebars.registerHelper('dateFallback', (date: Date | number): string => {
    if (Math.log10((date = +date)) < 10) {
        date *= 1000;
    }

    return new Date(date).toLocaleString();
});

Handlebars.registerHelper('jsonStringify', JSON.stringify);

Handlebars.registerHelper('summarizeHash', (hash): string => hash.slice(0, 4) + '...' + hash.slice(-4));
