// Footer Loader - Loads consistent footer across all pages
function loadFooter() {
  const footerHTML = `
    <!-- Footer -->
    <footer class="bg-gradient-to-t from-white to-blue-50/40 border-t border-blue-100 py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <!-- Brand Column -->
          <div class="col-span-2 md:col-span-1">
            <a href="index.html" class="flex items-center gap-3 mb-4">
              <img src="logo.png" alt="" class="h-8 w-8 object-contain">
              <div class="text-lg font-bold leading-tight"><span class="text-black">Accessibility</span><span style="color: #228AFF;"> For All</span></div>
            </a>
            <p class="text-sm text-gray-500 mb-4 leading-relaxed">One suite to audit, monitor, remediate, and document — the whole journey to compliance.</p>
            <a href="wcag-checker.html" class="inline-block text-sm text-gray-600 hover:text-blue-600 border border-gray-300 hover:border-blue-400 px-4 py-2 rounded-lg transition-colors duration-200">
              Run a free WCAG scan
            </a>
          </div>

          <!-- Products Column -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-4">Solutions</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="docmersion.html" class="text-gray-600 hover:text-blue-600 transition-colors">Documents</a></li>
              <li><a href="wcag-checker.html" class="text-gray-600 hover:text-blue-600 transition-colors">Websites</a></li>
              <li><a href="vpat-acr.html" class="text-gray-600 hover:text-blue-600 transition-colors">ACR</a></li>
            </ul>
          </div>

          <!-- Industries Column -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-4">Industries</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="government.html" class="text-gray-600 hover:text-blue-600 transition-colors">Government</a></li>
              <li><a href="education.html" class="text-gray-600 hover:text-blue-600 transition-colors">Education</a></li>
              <li><a href="non-profit.html" class="text-gray-600 hover:text-blue-600 transition-colors">Non-Profit</a></li>
              <li><a href="associations.html" class="text-gray-600 hover:text-blue-600 transition-colors">Associations</a></li>
            </ul>
          </div>

          <!-- Company Column -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-4">Company</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="pricing.html" class="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a></li>
              <li><a href="compliance.html" class="text-gray-600 hover:text-blue-600 transition-colors">Compliance</a></li>
              <li><a href="demo.html" class="text-gray-600 hover:text-blue-600 transition-colors">Live demo</a></li>
              <li><a href="index.html#contact" class="text-gray-600 hover:text-blue-600 transition-colors">Contact</a></li>
            </ul>
          </div>

          <!-- Legal Column -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="privacy-policy.html" class="text-gray-600 hover:text-blue-600 transition-colors">Privacy policy</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="text-sm text-gray-400">© <span id="year"></span> Sopris Apps, LLC. Accessibility For All is a product suite of Sopris Apps, LLC.</div>
          <div class="flex items-center gap-2 text-xs text-gray-400">
            <i class="bi bi-universal-access"></i>
            <span>WCAG 2.1 AA · Section 508 · ADA Title II</span>
          </div>
        </div>
      </div>
    </footer>`;

  // Insert footer at the end of body
  document.body.insertAdjacentHTML('beforeend', footerHTML);

  // Initialize footer functionality
  initializeFooter();
}

function initializeFooter() {
  // Set current year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Load footer when DOM is ready
document.addEventListener('DOMContentLoaded', loadFooter);
