function loadFooter() {
    const footerHTML = `
        <footer class="footer">
            <div class="footer-container">
                <div class="footer-brand">
                    <img src="images/logo.png" alt="Accessibility For All" class="brand-logo">
                </div>
            </div>
        </footer>
    `;
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    }
}

// Load footer when DOM is ready
document.addEven