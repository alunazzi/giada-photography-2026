document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const boldName = document.querySelector('.bold-name');
    const revealElements = document.querySelectorAll('.reveal');
    const cursor = document.getElementById('cursor');

    // 1. Email Protection (Base64) - hello@example.com
    const encodedEmail = 'aGVsbG9AZXhhbXBsZS5jb20='; 
    const email = atob(encodedEmail);

    document.querySelectorAll('.dynamic-mail').forEach(link => {
        link.href = 'mailto:' + email;
    });

    document.querySelectorAll('.copy-mail').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(email).then(() => {
                const originalColor = btn.style.color;
                btn.style.color = '#ffffff';
                setTimeout(() => btn.style.color = originalColor, 1000);
            });
        });
    });

    // 2. Simple Cursor Follow
    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // 3. Cursor Hover Effects
    const interactives = document.querySelectorAll('a, button, .tile, .viewer-close, .text-tile p, .copy-mail, ion-icon');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });

    // 4. Viewer Logic
    const viewer = document.getElementById('viewer');
    const viewerImg = document.getElementById('viewer-img');
    const viewerCap = document.getElementById('viewer-caption');
    const closeBtn = document.querySelector('.viewer-close');

    document.querySelectorAll('.tile').forEach(tile => {
        tile.addEventListener('click', () => {
            if (tile.classList.contains('text-tile')) return;
            const img = tile.querySelector('img');
            const badge = tile.querySelector('.badge-left');
            if(img) {
                viewerImg.src = img.src;
                viewerCap.innerText = badge ? badge.innerText : "";
                viewer.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeViewer = () => {
        viewer.style.display = 'none';
        document.body.style.overflow = '';
    };

    if(closeBtn) closeBtn.addEventListener('click', closeViewer);
    viewer.addEventListener('click', (e) => { if(e.target === viewer) closeViewer(); });

    // 5. Scroll Logic (Saturation & Opacity)
    const startColor = { r: 206, g: 6, b: 58 }; 
    const endColor = { r: 70, g: 70, b: 70 };  

    const updateScrollEffects = () => {
        const scrollValue = window.scrollY;
        let progress = Math.min(scrollValue / 500, 1);
        
        const r = Math.round(startColor.r + (endColor.r - startColor.r) * progress);
        const g = Math.round(startColor.g + (endColor.g - startColor.g) * progress);
        const b = Math.round(startColor.b + (endColor.b - startColor.b) * progress);
        
        root.style.setProperty('--current-accent', `rgb(${r}, ${g}, ${b})`);
        if(boldName) {
            boldName.style.opacity = Math.max(1 - (scrollValue / 600), 0.2);
        }
    };

    // Trigger on scroll
    window.addEventListener('scroll', updateScrollEffects);
    
    // FIX: Trigger immediately on load to prevent the color jump
    updateScrollEffects();

    // 6. Reveal Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
});
