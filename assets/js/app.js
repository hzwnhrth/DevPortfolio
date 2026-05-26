document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initContactForm();
    initSkillBars();
    initScrollSpy();
});

// ── Project Filter ──
function initFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            cards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.style.display = match ? '' : 'none';
            });
        });
    });
}

// ── Contact Form ──
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        status.className = 'form-status';
        status.style.display = 'none';

        const data = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            message: form.message.value.trim(),
        };

        try {
            const res = await fetch('api/contact.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (result.success) {
                status.className = 'form-status success';
                status.textContent = result.message;
                form.reset();
            } else {
                status.className = 'form-status error';
                status.textContent = result.errors ? result.errors.join(' ') : result.error;
            }
        } catch {
            status.className = 'form-status error';
            status.textContent = 'Failed to send. Please try again.';
        }

        status.style.display = 'block';
    });
}

// ── Animate skill bars on scroll ──
function initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.skill-fill').forEach(bar => {
                    bar.style.width = bar.dataset.level + '%';
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const section = document.getElementById('skills');
    if (section) observer.observe(section);
}

// ── Scroll spy for nav ──
function initScrollSpy() {
    const links = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 120) current = s.id;
        });
        links.forEach(link => {
            link.style.color = link.getAttribute('href') === '#' + current
                ? 'var(--text)' : '';
        });
    });
}
