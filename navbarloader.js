// Navbar Loader - Loads consistent navbar across all pages

// Load Google Analytics / Google Ads tag
function loadGoogleTag() {
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=AW-957201829';
  document.head.appendChild(gtagScript);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'AW-957201829');
}

function loadNavbar() {
  const navbarHTML = `
    <!-- Navbar -->
    <nav class="fixed w-full z-30 bg-white/90 backdrop-blur shadow-sm border-b border-gray-100">
      <div class="container mx-auto flex items-center justify-between px-4 py-3">
        <a href="index.html" class="flex items-center text-xl xl:text-2xl font-bold whitespace-nowrap">
          <img src="logo.png" alt="" class="h-9 w-9 mr-3 flex-shrink-0 object-contain">
          <span class="text-black">Accessibility</span><span style="color: #228AFF;">&nbsp;For&nbsp;All</span>
        </a>
        <div class="hidden lg:flex space-x-5 xl:space-x-7 items-center">
          <!-- Products Dropdown -->
          <div class="relative" id="products-desktop">
            <button id="products-desktop-btn" class="hover:text-brand transition flex items-center focus:outline-none whitespace-nowrap">
              <span>Solutions</span>
              <svg class="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div id="products-desktop-dropdown" class="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 pointer-events-none transition-all duration-300 z-50 overflow-hidden p-2">
              <a href="docmersion.html" class="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 group">
                <span class="mt-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white" style="background: #228AFF;"><i class="bi bi-files"></i></span>
                <span><span class="block font-semibold text-gray-900 group-hover:text-blue-600">Documents</span><span class="block text-xs text-gray-500">DocMersion toolkit + Native for flagship documents</span></span>
              </a>
              <a href="wcag-checker.html" class="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 transition-all duration-200 group">
                <span class="mt-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white" style="background: linear-gradient(135deg,#10b981,#14b8a6);"><i class="bi bi-globe2"></i></span>
                <span><span class="block font-semibold text-gray-900 group-hover:text-emerald-600">Websites</span><span class="block text-xs text-gray-500">Free WCAG Check + continuous Monitor</span></span>
              </a>
              <a href="vpat-acr.html" class="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-slate-50 transition-all duration-200 group">
                <span class="mt-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white" style="background: #0a2239;"><i class="bi bi-journal-check"></i></span>
                <span><span class="block font-semibold text-gray-900 group-hover:text-blue-700">ACR</span><span class="block text-xs text-gray-500">ACR Studio — automated scans, certified human review</span></span>
              </a>
            </div>
          </div>
          <!-- Industries Dropdown -->
          <div class="relative" id="solutions-desktop">
            <button id="solutions-desktop-btn" class="hover:text-brand transition flex items-center focus:outline-none whitespace-nowrap">
              <span>Industries</span>
              <svg class="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div id="solutions-desktop-dropdown" class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 pointer-events-none transition-all duration-300 z-50 text-right overflow-hidden">
              <a href="non-profit.html" class="block px-6 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 text-gray-700 hover:text-blue-600 font-medium">Nonprofits</a>
              <a href="government.html" class="block px-6 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 text-gray-700 hover:text-blue-600 font-medium">Government</a>
              <a href="associations.html" class="block px-6 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 text-gray-700 hover:text-blue-600 font-medium">Associations</a>
              <a href="education.html" class="block px-6 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 text-gray-700 hover:text-blue-600 font-medium">Education</a>
            </div>
          </div>
          <a href="pricing.html" class="hover:text-brand transition whitespace-nowrap">Pricing</a>
          <a href="compliance.html" class="hover:text-brand transition whitespace-nowrap">Compliance</a>
          <a href="wcag-checker.html" class="group relative ml-2 px-4 xl:px-5 py-2 rounded-full font-semibold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 whitespace-nowrap" style="background: #228AFF;">
            <span class="relative z-10">Free WCAG scan</span>
            <div class="absolute inset-0 bg-[#0b6ad4] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
        </div>
        <button class="lg:hidden text-3xl" id="mobile-menu-btn"><i class="bi bi-list"></i></button>
      </div>
      <!-- Mobile nav -->
      <div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-gray-100 px-4 pb-4">
        <div class="relative" id="products-mobile">
          <button class="block py-2 w-full text-left hover:text-brand focus:outline-none flex justify-between items-center" id="mobile-products-btn">
            <span>Solutions</span>
            <svg class="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div id="mobile-products-menu" class="hidden pl-3 border-l-2 border-blue-100 ml-1">
            <a href="docmersion.html" class="block px-2 py-2 hover:text-blue-600">Documents</a>
            <a href="wcag-checker.html" class="block px-2 py-2 hover:text-blue-600">Websites</a>
            <a href="vpat-acr.html" class="block px-2 py-2 hover:text-blue-600">ACR</a>
          </div>
        </div>
        <div class="relative" id="solutions-mobile">
          <button class="block py-2 w-full text-left hover:text-brand focus:outline-none flex justify-between items-center" id="mobile-solutions-btn">
            <span>Industries</span>
            <svg class="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div id="mobile-solutions-menu" class="hidden pl-3 border-l-2 border-blue-100 ml-1">
            <a href="non-profit.html" class="block px-2 py-2 hover:text-blue-600">Nonprofits</a>
            <a href="government.html" class="block px-2 py-2 hover:text-blue-600">Government</a>
            <a href="associations.html" class="block px-2 py-2 hover:text-blue-600">Associations</a>
            <a href="education.html" class="block px-2 py-2 hover:text-blue-600">Education</a>
          </div>
        </div>
        <a href="pricing.html" class="block py-2 hover:text-brand">Pricing</a>
        <a href="compliance.html" class="block py-2 hover:text-brand">Compliance</a>
        <a href="wcag-checker.html" class="group relative block py-2 mt-2 px-5 rounded-full font-semibold text-white text-center shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105" style="background: #228AFF;">
          <span class="relative z-10">Free WCAG scan</span>
          <div class="absolute inset-0 bg-[#0b6ad4] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </a>
      </div>
    </nav>`;

  document.body.insertAdjacentHTML('afterbegin', navbarHTML);
  initializeNavbar();
}

function initializeNavbar() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.onclick = () => menu.classList.toggle('hidden');
  }

  // Visibility is set inline so it works even if styles.css fails to load.
  function setDropdown(dropdown, open) {
    dropdown.classList.toggle('dropdown-open', open);
    dropdown.style.opacity = open ? '1' : '0';
    dropdown.style.pointerEvents = open ? 'auto' : 'none';
    dropdown.style.transform = open ? 'translateY(0)' : 'translateY(-4px)';
  }
  function wireDesktopDropdown(wrapperId, btnId, dropdownId) {
    const wrapper = document.getElementById(wrapperId);
    const button = document.getElementById(btnId);
    const dropdown = document.getElementById(dropdownId);
    if (!wrapper || !button || !dropdown) return;
    setDropdown(dropdown, false);
    button.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const willOpen = !dropdown.classList.contains('dropdown-open');
      document.querySelectorAll('.dropdown-open').forEach(function (d) {
        if (d !== dropdown) setDropdown(d, false);
      });
      setDropdown(dropdown, willOpen);
    });
    document.addEventListener('click', function (e) {
      if (!wrapper.contains(e.target)) {
        setDropdown(dropdown, false);
      }
    });
  }

  wireDesktopDropdown('products-desktop', 'products-desktop-btn', 'products-desktop-dropdown');
  wireDesktopDropdown('solutions-desktop', 'solutions-desktop-btn', 'solutions-desktop-dropdown');

  function wireMobileDropdown(btnId, menuId) {
    const button = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    if (!button || !menu) return;
    button.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.classList.toggle('hidden');
    });
  }

  wireMobileDropdown('mobile-products-btn', 'mobile-products-menu');
  wireMobileDropdown('mobile-solutions-btn', 'mobile-solutions-menu');
}

document.addEventListener('DOMContentLoaded', function() {
  loadGoogleTag();
  loadNavbar();
});
