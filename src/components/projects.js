document.addEventListener('DOMContentLoaded', () => {
    const PROJECTS_JSON = '/src/projects.json';
    const listEl = document.getElementById('project-list');
    if (!listEl) return;

    // fetch projects and build cards
    fetch(PROJECTS_JSON)
        .then(res => {
            if (!res.ok) throw new Error('Could not load projects.json');
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

    function createCard(project) {
        const article = document.createElement('article');
        article.className = 'project-card';
        article.tabIndex = 0;
        article.setAttribute('role', 'button');
        article.setAttribute('aria-pressed', 'false');

        const img = document.createElement('img');
        img.src = project.image || '';
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
        link.textContent = 'View on GitHub';

        const classification = document.createElement('div');
        classification.className = 'classification';
        classification.textContent = project.classification ? `Classification: ${project.classification}` : '';

        metaRow.appendChild(link);
        metaRow.appendChild(classification);

        modal.appendChild(header);
        modal.appendChild(content);
        modal.appendChild(metaRow);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        function onOverlayClick(e) {
            if (e.target === overlay) closeModal();
        }
        function onKey(e) {
            if (e.key === 'Escape') closeModal();
        }
        overlay.addEventListener('click', onOverlayClick);
        document.addEventListener('keydown', onKey);

        closeBtn.focus();

        function closeModal() {
            overlay.removeEventListener('click', onOverlayClick);
            document.removeEventListener('keydown', onKey);
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            document.body.style.overflow = prevOverflow || '';
        }
    }
});