// navbarloader.js - Reusable navbar component for Accessibility For All
function loadFavicons() {
    // Add all favicon links to the document head
    const head = document.head;
    
    // Standard favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = 'favicon/favicon.ico';
    head.appendChild(favicon);
    
    // PNG favicons for different sizes
    const favicon16 = document.createElement('link');
    favicon16.rel = 'icon';
    favicon16.type = 'image/png';
    favicon16.sizes = '16x16';
    favicon16.href = 'favicon/favicon-16x16.png';
    head.appendChild(favicon16);
    
    const favicon32 = document.createElement('link');
    favicon32.rel = 'icon';
    favicon32.type = 'image/png';
    favicon32.sizes = '32x32';
    favicon32.href = 'favicon/favicon-32x32.png';
    head.appendChild(favicon32);
    
    // Apple touch icon for iOS devices
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.sizes = '180x180';
    appleTouchIcon.href = 'favicon/apple-touch-icon.png';
    head.appendChild(appleTouchIcon);
    
    // Android Chrome icons
    const androidIcon192 = document.createElement('link');
    androidIcon192.rel = 'icon';
    androidIcon192.type = 'image/png';
    androidIcon192.sizes = '192x192';
    androidIcon192.href = 'favicon/android-chrome-192x192.png';
    head.appendChild(androidIcon192);
    
    const androidIcon512 = document.createElement('link');
    androidIcon512.rel = 'icon';
    androidIcon512.type = 'image/png';
    androidIcon512.sizes = '512x512';
    androidIcon512.href = 'favicon/android-chrome-512x512.png';
    head.appendChild(androidIcon512);
    
    // Web app manifest
    const manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = 'favicon/site.webmanifest';
    head.appendChild(manifest);
}

function loadNavbar() {
    const navbarHTML = `
        <nav class="navbar">
            <div class="navbar-container">
                <div class="navbar-brand">
                    <h2>Accessibility For All</h2>
                </div>
                <div class="navbar-menu">
                    <div class="navbar-actions">
                        <a href="#contact" class="btn btn-primary">CONTACT US</a>
                    </div>
                </div>
            </div>
        </nav>
    `;
    
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        navbarContainer.innerHTML = navbarHTML;
    }
}


// Load navbar and favicons when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadFavicons();
    loadNavbar();
});
