// javascript
document.addEventListener('DOMContentLoaded', () => {
    const PROJECTS_JSON = 'src/projects.json'; // relative path (no leading slash)
    const listEl = document.getElementById('project-list');
    if (!listEl) return;

    console.log('Fetching projects from', PROJECTS_JSON);

    // fetch projects and build cards
    fetch(PROJECTS_JSON)
        .then(res => {
            if (!res.ok) throw new Error('Could not load projects.json: ' + res.status);
            return res.json();
        })
        .then(projects => {
            projects.forEach(project => {
                const card = createCard(project);
                listEl.appendChild(card);
            });
        })
        .catch(err => {
            const errMsg = document.createElement('p');
            errMsg.textContent = 'Unable to load projects.';
            errMsg.style.color = '#f88';
            listEl.appendChild(errMsg);
            console.error(err);
        });

    function normalizePath(path) {
        if (!path) return '';
        return path.replace(/^\/+/, ''); // remove leading slashes
    }

    function createCard(project) {
        const article = document.createElement('article');
        article.className = 'project-card';
        article.tabIndex = 0;
        article.setAttribute('role', 'button');
        article.setAttribute('aria-pressed', 'false');

        // hero image sits at the top of the card
        const img = document.createElement('img');
        img.className = 'card-hero';
        img.src = normalizePath(project.image) || '';
        img.alt = project.name || 'project image';
        img.loading = 'lazy';
        img.onerror = () => { img.style.display = 'none'; };

        const meta = document.createElement('div');
        meta.className = 'meta';

        const title = document.createElement('h3');
        title.textContent = project.name || 'Untitled';

        const short = document.createElement('p');
        short.textContent = project['short-description'] || '';

        meta.appendChild(title);
        meta.appendChild(short);

        article.appendChild(img);
        article.appendChild(meta);

        // open modal on click or Enter/Space
        article.addEventListener('click', () => openModal(project));
        article.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(project);
            }
        });

        return article;
    }

    function openModal(project) {
        if (document.querySelector('.project-modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'project-modal-overlay';
        overlay.tabIndex = -1;

        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', project.name || 'Project details');

        // hero image at top of modal
        const hero = document.createElement('img');
        hero.className = 'modal-hero';
        hero.src = normalizePath(project.image) || '';
        hero.alt = project.name || 'project image';
        hero.loading = 'lazy';
        hero.onerror = () => { hero.style.display = 'none'; };

        // modal body (scrollable vertically if needed)
        const body = document.createElement('div');
        body.className = 'modal-body';

        const header = document.createElement('header');

        const h2 = document.createElement('h2');
        h2.textContent = project.name || 'Untitled';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.type = 'button';
        closeBtn.innerText = 'Close';
        closeBtn.addEventListener('click', closeModal);

        header.appendChild(h2);
        header.appendChild(closeBtn);

        const content = document.createElement('div');
        content.className = 'content';
        const longDesc = document.createElement('p');
        longDesc.textContent = project['long-description'] || '';
        content.appendChild(longDesc);

        const metaRow = document.createElement('div');
        metaRow.className = 'meta-row';

        const link = document.createElement('a');
        link.className = 'project-link';
        link.href = project.link || '#';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Bekijk op GitHub';

        const classification = document.createElement('div');
        classification.className = 'classification';
        classification.textContent = project.classification ? `${project.classification} project` : '';

        metaRow.appendChild(link);
        metaRow.appendChild(classification);

        body.appendChild(header);
        body.appendChild(content);
        body.appendChild(metaRow);

        // assemble modal: hero first, then body
        modal.appendChild(hero);
        modal.appendChild(body);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // disable background scroll
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        // close handlers
        function onOverlayClick(e) {
            if (e.target === overlay) closeModal();
        }
        function onKey(e) {
            if (e.key === 'Escape') closeModal();
        }
        overlay.addEventListener('click', onOverlayClick);
        document.addEventListener('keydown', onKey);

        // focus management
        closeBtn.focus();

        function closeModal() {
            overlay.removeEventListener('click', onOverlayClick);
            document.removeEventListener('keydown', onKey);
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            document.body.style.overflow = prevOverflow || '';
        }
    }
});