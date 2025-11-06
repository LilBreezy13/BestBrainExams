// app.js - main interactions for the prototype
// - Carousel auto-rotates every 4.5s
// - Search form looks up a 'regions' document in Firestore and tries to match an area
// - Signup form creates a Firebase Auth user and saves profile in Firestore
// NOTES:
// 1) Ensure firebase-config.js has your Firebase keys and that Firestore rules allow reads/writes for testing.
// 2) Phone numbers should be stored in international format (e.g. +233256613433).

document.addEventListener('DOMContentLoaded', () => {
  // Carousel logic
  const slides = Array.from(document.querySelectorAll('.slide'));
  let current = 0;
  if (slides.length) {
    slides.forEach((s, i) => s.style.opacity = i === 0 ? '1' : '0');
    setInterval(() => {
      slides[current].style.opacity = '0';
      current = (current + 1) % slides.length;
      slides[current].style.opacity = '1';
    }, 4500);
  }

  // Tab behavior
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      ev.currentTarget.classList.add('active');
    });
  });

  // Search form: lookup region -> area in Firestore
  const searchForm = document.getElementById('searchForm');
  const contactResult = document.getElementById('contactResult');

  searchForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    contactResult.classList.add('hidden');
    contactResult.innerHTML = '';

    const region = document.getElementById('regionSelect').value;
    const area = document.getElementById('areaInput').value.trim().toLowerCase();
    const level = document.getElementById('levelSelect').value;

    if (!region || !area) {
      contactResult.classList.remove('hidden');
      contactResult.innerHTML = '<div class="text-sm text-red-600">Please choose a region and enter an area.</div>';
      return;
    }

    try {
      const docRef = db.collection('regions').doc(region);
      const doc = await docRef.get();
      if (!doc.exists) {
        contactResult.classList.remove('hidden');
        contactResult.innerHTML = '<div class="text-sm">No marketer data found for that region.</div>';
        return;
      }

      const data = doc.data() || {};
      const areas = data.areas || {};
      // Try exact match or includes
      const sanitized = area.replace(/\s+/g, '');
      let foundKey = Object.keys(areas).find(k => k.toLowerCase() === area || k.toLowerCase().replace(/\s+/g,'') === sanitized || k.toLowerCase().includes(area));

      if (!foundKey) {
        // fallback to default contact in that region
        const defaultContact = data.default || null;
        if (defaultContact) {
          renderContact(defaultContact, area);
        } else {
          contactResult.classList.remove('hidden');
          contactResult.innerHTML = '<div class="text-sm">No local marketer found for that area. Try a nearby town or contact head office.</div>';
        }
        return;
      }

      const contact = areas[foundKey];
      renderContact(contact, foundKey);
    } catch (err) {
      console.error(err);
      contactResult.classList.remove('hidden');
      contactResult.innerHTML = '<div class="text-sm text-red-600">Lookup failed. Check console for details.</div>';
    }
  });

  // Signup form
  const signupForm = document.getElementById('signupForm');
  const signupMsg = document.getElementById('signupMsg');

  signupForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    signupMsg.textContent = '';
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !phone || !password) {
      signupMsg.textContent = 'Please provide name, email, phone and password.';
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCred = await auth.createUserWithEmailAndPassword(email, password);
      const uid = userCred.user.uid;
      // Save profile in Firestore
      await db.collection('users').doc(uid).set({
        name, email, phone,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      signupMsg.textContent = 'Account created. Your ID: ' + uid;
    } catch (err) {
      console.error(err);
      signupMsg.textContent = 'Signup error: ' + (err.message || err);
    }
  });

  function renderContact(contact, areaName) {
    contactResult.classList.remove('hidden');
    const phone = contact.phone || 'N/A';
    const name = contact.name || 'Local Marketer';
    const lat = contact.lat;
    const lng = contact.lng;
    const phoneDigits = phone.replace(/[^0-9+]/g, '');
    const wa = phoneDigits ? `https://wa.me/${phoneDigits.replace(/^\+/, '')}` : '#';
    const tel = phone ? `tel:${phoneDigits}` : '#';

    contactResult.innerHTML = `
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div class="text-sm text-gray-500">Area</div>
          <div class="font-semibold">${areaName}</div>
          <div class="text-sm text-gray-600">Marketer: ${name}</div>
          <div class="text-sm text-gray-600">Phone: ${phone}</div>
        </div>
        <div class="flex gap-2">
          <a class="px-4 py-2 rounded bg-green-600 text-white" href="${wa}" target="_blank" rel="noreferrer">WhatsApp</a>
          <a class="px-4 py-2 rounded bg-blue-600 text-white" href="${tel}">Call</a>
          ${lat && lng ? `<a class="px-4 py-2 rounded bg-gray-100 border text-sm" href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}" target="_blank" rel="noreferrer">Map</a>` : ''}
        </div>
      </div>
    `;
  }

});
