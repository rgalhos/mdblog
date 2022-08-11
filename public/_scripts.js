window.addEventListener('load', () => {
    ///#region Dynamic scroll observer
    const obs = document.getElementById('scroll-observer');
    const articleHeight = document.getElementById('!main').offsetHeight;
    const windowHeight = window.innerHeight;

    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (articleHeight - windowHeight);
        obs.style.width = scrollPercent * 100 + '%';
    });
    ///#endregion Dynamic scroll observer

    Array.prototype.forEach.call(document.getElementsByClassName('colored-hash'), (el) => {
        const hash = el.getAttribute('data-hash'); // || (window.fileInfo && window.fileInfo.md5sum);

        if (!hash) return;

        const start = hash.slice(0, 4);
        const end = hash.slice(-4);
        const mid = hash.slice(4, -4).match(/.{3}/g);

        el.innerHTML =
            start + mid.map((hex) => `<span class="hash" style="background: #${hex}">${hex}</span>`).join('') + end;
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-time]'), (el) => {
        let time = Number(el.getAttribute('data-time'));

        if (isNaN(time)) return;
        else if (Math.log10(time) < 10) time *= 1000;

        el.innerText = new Date(time).toLocaleString();
    });

    // Add 'Copy to clipboard' button to code blocks
    Array.prototype.forEach.call(document.querySelectorAll('pre'), (el) => {
        const div = document.createElement('div');
        div.setAttribute('class', 'copy-button');
        div.innerHTML =
            '<button onclick="copyCodeBlock(this)" title="Copy to clipboard" aria-label="Copy to clipboard">' +
            '<i class="mdi mdi-content-copy"></i>' +
            '</button>';

        el.onmouseleave = () => (div.children[0].innerHTML = '<i class="mdi mdi-content-copy"></i>');
        el.prepend(div);
    });

    window.copyCodeBlock = function (el) {
        if (typeof navigator.clipboard !== 'undefined' && typeof navigator.clipboard.writeText === 'function') {
            const pre = el.parentElement.parentElement;
            navigator.clipboard.writeText(pre.lastChild.innerText);

            el.innerHTML = '<i class="mdi mdi-check" style="color: green;"></i>';
        }
    };
});
