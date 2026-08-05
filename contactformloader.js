// Contact Form Loader - Reusable contact form component
// Submits to /api/lead (Cloudflare Pages Function), which forwards to the
// GoHighLevel "Website Contact Form" inbound webhook. The GHL webhook URLs live
// in Pages environment variables, never in this file.

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
    formAction: "/api/lead"
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
          <h2 class="text-4xl md:text-5xl font-extrabold mb-4" style="color: #0b6ad4;">${config.title}</h2>
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
            <fieldset class="flex flex-col gap-3">
              <legend class="font-semibold text-gray-700 mb-1">Accessibility For All Tools You're Interested In:</legend>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label class="flex items-center gap-2 text-gray-700 rounded-xl px-4 py-3 border-2 border-gray-200 cursor-pointer">
                  <input type="checkbox" name="tools_interested" value="Websites" class="h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b6ad4]"> Websites
                </label>
                <label class="flex items-center gap-2 text-gray-700 rounded-xl px-4 py-3 border-2 border-gray-200 cursor-pointer">
                  <input type="checkbox" name="tools_interested" value="Documents" class="h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b6ad4]"> Documents
                </label>
                <label class="flex items-center gap-2 text-gray-700 rounded-xl px-4 py-3 border-2 border-gray-200 cursor-pointer">
                  <input type="checkbox" name="tools_interested" value="Reports" class="h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b6ad4]"> Reports
                </label>
                <label class="flex items-center gap-2 text-gray-700 rounded-xl px-4 py-3 border-2 border-gray-200 cursor-pointer">
                  <input type="checkbox" name="tools_interested" value="Response" class="h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b6ad4]"> Response
                </label>
              </div>
            </fieldset>
            <label class="flex flex-col gap-3 font-semibold text-gray-700">
              Other Comments or Questions:
              <textarea name="message" rows="6" class="rounded-xl px-6 py-4 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 text-lg resize-none" placeholder="Tell us about your accessibility and compliance goals and how we can help..."></textarea>
            </label>
            <!-- Honeypot: hidden from people, tempting to bots. The Pages Function
                 drops any submission that fills it, before it can bill a GHL trigger. -->
            <div style="position:absolute;left:-9999px" aria-hidden="true">
              <label>Website URL<input type="text" name="website_url" tabindex="-1" autocomplete="off"></label>
            </div>
            <button type="submit" style="background: #0b6ad4;" class="group relative w-full py-4 rounded-full text-white font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a2239]">
              <span class="relative z-10">${config.buttonText}</span>
              <div class="absolute inset-0 bg-[#09519f] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <p role="alert" data-form-error class="hidden text-center font-semibold" style="color:#b91c1c;">
              Something went wrong sending your message. Please email
              <a href="mailto:info@accessibilityforall.com" class="underline">info@accessibilityforall.com</a> and we'll pick it up right away.
            </p>
          </form>
        </div>
      </div>
    </section>
  `;

  // Insert the HTML into the container
  container.innerHTML = contactFormHTML;

  // Require a business email address. This is a client-side heuristic (blocks
  // known free/personal webmail domains) rather than a verified guarantee —
  // there's no backend on this static site to check further, and Formspree
  // doesn't offer domain verification on our plan.
  var form = container.querySelector('form');
  var emailInput = form && form.querySelector('input[name="email"]');
  if (emailInput) {
    var FREE_EMAIL_DOMAINS = [
      'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.ca', 'ymail.com',
      'hotmail.com', 'hotmail.co.uk', 'outlook.com', 'live.com', 'msn.com',
      'aol.com', 'icloud.com', 'me.com', 'mac.com',
      'protonmail.com', 'proton.me', 'mail.com', 'gmx.com', 'gmx.us',
      'yandex.com', 'yandex.ru', 'aim.com', 'inbox.com', 'qq.com', '163.com', 'naver.com'
    ];
    emailInput.addEventListener('input', function () {
      emailInput.setCustomValidity('');
    });
    form.addEventListener('submit', function (e) {
      var domain = (emailInput.value.split('@')[1] || '').trim().toLowerCase();
      if (FREE_EMAIL_DOMAINS.indexOf(domain) !== -1) {
        emailInput.setCustomValidity('Please use your business email address rather than a personal ' + domain + ' account.');
        emailInput.reportValidity();
        e.preventDefault();
      } else {
        emailInput.setCustomValidity('');
      }
    });
  }

  submitAsJson(form, config.formAction);
}

// Send the form as JSON to /api/lead instead of letting the browser POST it.
// Formspree used to own the success redirect; now this does, and — unlike the
// old path — a failure is actually shown to the visitor rather than swallowed.
function submitAsJson(form, endpoint) {
  if (!form) return;
  var errorEl = form.querySelector('[data-form-error]');
  var button = form.querySelector('button[type="submit"]');
  var buttonLabel = button && button.querySelector('span');
  var originalLabel = buttonLabel && buttonLabel.textContent;

  form.addEventListener('submit', function (e) {
    if (!form.checkValidity()) return; // let the browser show its own messages
    e.preventDefault();
    if (errorEl) errorEl.classList.add('hidden');
    if (button) button.disabled = true;
    if (buttonLabel) buttonLabel.textContent = 'Sending…';

    var data = { form_type: 'contact', page: window.location.href };
    var params = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) {
      data[k] = params.get(k) || '';
    });
    // Checkboxes share a name, so collect them into one comma-joined value.
    new FormData(form).forEach(function (value, key) {
      data[key] = data[key] ? data[key] + ', ' + value : value;
    });

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', { method: 'contact_form' });
      }
      window.location.href = 'thank-you-form-submission.html';
    }).catch(function () {
      if (errorEl) errorEl.classList.remove('hidden');
      if (button) button.disabled = false;
      if (buttonLabel) buttonLabel.textContent = originalLabel;
    });
  });
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
