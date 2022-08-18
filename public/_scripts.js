window.addEventListener('load', () => {
    ///#region Dynamic scroll observer
    const obs = document.getElementById('scroll-observer');
    const headerBar = document.getElementById('header-bar');
    const articleHeight = document.getElementById('!main').offsetHeight;
    const windowHeight = window.innerHeight;
    let prevScroll = window.scrollY;

    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (articleHeight - windowHeight);
        obs.style.width = scrollPercent * 100 + '%';

        const currScroll = window.scrollY;
        headerBar.style.top = prevScroll > currScroll ? '0px' : '-51px';
        prevScroll = currScroll;
    });
    ///#endregion Dynamic scroll observer

    Array.prototype.forEach.call(document.getElementsByClassName('colored-hash'), (el) => {
        const hash = el.getAttribute('data-hash'); // || (window.fileInfo && window.fileInfo.md5sum);

        if (!hash) return;

        const s = Math.log2(hash.length) & 1 ? 4 : 5;

        const start = hash.slice(0, s);
        const end = hash.slice(-s);
        const mid = hash.slice(s, -s).match(/.{3}/g);

        el.innerHTML =
            start + mid.map((hex) => `<span class="hash" style="background: #${hex}">${hex}</span>`).join('') + end;
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-time]'), (el) => {
        let time = Number(el.getAttribute('data-time'));

        if (isNaN(time)) return;
        else if (Math.log10(time) < 10) time *= 1000;

        el.innerText = new Date(time).toLocaleString();
    });

    window.copyToClipboard = function (text) {
        if (typeof navigator.clipboard !== 'undefined' && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(text);
            return true;
        }

        /** @todo Browser might not support navigator.clipboard API **/
        return false;
    };

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
        const pre = el.parentElement.parentElement;

        if (copyToClipboard(pre.lastChild.innerText)) {
            el.innerHTML = '<i class="mdi mdi-check" style="color: green;"></i>';
        }
    };

    // Add 'Copy to clipboard' to [hash] blocks
    Array.prototype.forEach.call(document.querySelectorAll('article code.colored-hash'), (el) => {
        const btn = document.createElement('button');
        btn.setAttribute('title', 'Copy to clipboard');
        btn.setAttribute('aria-label', 'Copy to clipboard');
        btn.setAttribute('class', 'copy-hash-btn');
        btn.onclick = () => {
            if (copyToClipboard(el.getAttribute('data-hash'))) {
                btn.innerHTML = '<i class="mdi mdi-check" style="color: green;"></i>';
            }
        };
        btn.innerHTML = '<i class="mdi mdi-content-copy"></i>';

        // why the hell does 'insertBefore' exist but 'insertAfter' doesn't?
        el.parentNode.insertBefore(btn, el.nextSibling);
    });
});
