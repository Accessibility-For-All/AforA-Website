function loadFooter() {
    const footerHTML = `
        <footer class="footer">
            <div class="footer-container">
                <div class="footer-brand">
                    <h2>Accessibility For All</h2>
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
document.addEventListener('DOMContentLoaded', loadFooter);
