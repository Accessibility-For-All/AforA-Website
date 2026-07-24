// Contact Form Loader - Reusable contact form component
// This creates a standardized contact form that works with Formspree.io

function loadContactForm(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID "${containerId}" not found`);
    return;
  }

  // Default options
  const defaults = {
    title: "Contact Us",
    subtitle: "Ready to make your digital presence accessible and compliant? Get in touch with us today.",
    buttonText: "Send message",
    formAction: "https://formspree.io/f/xblyajlg"
  };

  const config = { ...defaults, ...options };

  // Determine background class based on page context
  // Check if the page has a gradient background by looking at the main element
  const mainElement = document.querySelector('main');
  const hasGradientBg = mainElement && mainElement.classList.contains('bg-gradient-to-br');
  
  // Use white background only for pages without gradient backgrounds (like index.html)
  const sectionBgClass = hasGradientBg || containerId === 'pricing-contact-form-container' ? '' : 'bg-white';
  
  // Create the contact form HTML
  const contactFormHTML = `
    <section id="contact" class="py-20 ${sectionBgClass}">
      <div class="container mx-auto px-4 max-w-2xl">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-extrabold mb-4" style="color: #228AFF;">${config.title}</h2>
          <p class="text-gray-600 text-lg">${config.subtitle}</p>
        </div>
        <div class="relative">
          <div class="absolute -inset-4 bg-gradient-to-r from-blue-200 to-teal-200 rounded-3xl opacity-10 blur-2xl"></div>
          <form action="${config.formAction}" method="POST" class="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 flex flex-col gap-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label class="flex flex-col gap-3 font-semibold text-gray-700">
                Name:
                <input type="text" name="name" required class="rounded-xl px-6 py-4 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 text-lg" placeholder="Your full name">
              </label>
              <label class="flex flex-col gap-3 font-semibold text-gray-700">
                Email:
                <input type="email" name="email" required class="rounded-xl px-6 py-4 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 text-lg" placeholder="you@email.com">
              </label>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label class="flex flex-col gap-3 font-semibold text-gray-700">
                Company:
                <input type="text" name="company" class="rounded-xl px-6 py-4 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 text-lg" placeholder="Your company name">
              </label>
              <label class="flex flex-col gap-3 font-semibold text-gray-700">
                Website URL:
                <input type="url" name="website" class="rounded-xl px-6 py-4 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 text-lg" placeholder="https://yourwebsite.com">
              </label>
            </div>
            <label class="flex flex-col gap-3 font-semibold text-gray-700">
              Accessibility For All Tools You're Interested In:
              <input type="text" name="tools_interested" class="rounded-xl px-6 py-4 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 text-lg" placeholder="e.g., DocMersion, WCAG Checker, Accessibility Monitor, VPAT/ACR...">
            </label>
            <label class="flex flex-col gap-3 font-semibold text-gray-700">
              Other Comments or Questions:
              <textarea name="message" rows="6" class="rounded-xl px-6 py-4 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 text-lg resize-none" placeholder="Tell us about your accessibility and compliance goals and how we can help..."></textarea>
            </label>
            <button type="submit" style="background: #228AFF;" class="group relative w-full py-4 rounded-full text-white font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <span class="relative z-10">${config.buttonText}</span>
              <div class="absolute inset-0 bg-[#0b6ad4] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>
        </div>
      </div>
    </section>
  `;

  // Insert the HTML into the container
  container.innerHTML = contactFormHTML;
}

// Auto-load contact form if a container with id "contact-form-container" exists
document.addEventListener('DOMContentLoaded', function() {
  // Check for standard contact form container
  if (document.getElementById('contact-form-container')) {
    loadContactForm('contact-form-container');
  }
  
  // Check for pricing page contact form container
  if (document.getElementById('pricing-contact-form-container')) {
    loadContactForm('pricing-contact-form-container', {
      title: "Get your custom quote",
      subtitle: "Tell us which tools you're interested in and a bit about your organization — we'll build a tailored quote for the suite.",
      buttonText: "Get my custom quote"
    });
  }
});
