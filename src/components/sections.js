document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#navigation a');
    const sections = document.querySelectorAll('main section[id]');

    // Hide all main sections initially
    sections.forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('visible');
    });

    // Show About me by default
    const defaultSection = document.getElementById('about-me');
    if (defaultSection) {
        defaultSection.classList.remove('hidden');
        defaultSection.classList.add('visible');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.remove('hidden');
                    section.classList.add('visible');
                } else {
                    section.classList.remove('visible');
                    section.classList.add('hidden');
                }
            });
        });
    });
});
