// <!-- Firebase SDKs --> 
  // Import Firebase modules
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

  // Your web app's Firebase configuration (replace with your real config)
const firebaseConfig = {
  apiKey: "AIzaSyBgS5s6SHMj4RqZwq5MxM0crT2t-XT2vbs",
  authDomain: "scanparceltoday.firebaseapp.com",
  projectId: "scanparceltoday",
  storageBucket: "scanparceltoday.firebasestorage.app",
  messagingSenderId: "537794506429",
  appId: "1:537794506429:web:17b8d24e4ec5f770a9d1d4"
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Function to load reps from Firestore
  async function loadReps() {
    const repsRef = collection(db, "reps");
    const snapshot = await getDocs(repsRef);

    // Group reps by region (like your previous JSON structure)
    const grouped = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      const region = data.region?.toLowerCase();
      if (!grouped[region]) grouped[region] = [];
      grouped[region].push(data);
    });

    return grouped;
  }

  // === Your existing search logic ===
  document.getElementById('searchBtn').addEventListener('click', async () => {
    const loc = document.getElementById('location').value.trim().toLowerCase();
    const region = document.getElementById('region').value.trim().toLowerCase();
    const result = document.getElementById('result');

    if (!loc || !region) {
      result.textContent = "Please enter your area and select region.";
      return;
    }

    result.innerHTML = "Searching…";

    const contacts = await loadReps();
    const reps = contacts[region];

    if (!reps || reps.length === 0) {
      result.textContent = "No reps found in this region yet.";
      return;
    }

    const found = reps.find(rep => loc.includes(rep.area.toLowerCase()));
    if (found) {
      result.innerHTML = `
        <strong>${found.name}</strong> — ${region.toUpperCase()}<br>
        📞 <a href="tel:${found.phone}" class="text-blue-600">${found.phone}</a> |
        💬 <a href="https://wa.me/${found.phone.replace(/^0/,'233')}" target="_blank" class="text-green-600">WhatsApp</a>
        <p class="text-xs text-gray-500 mt-1">${found.notes || ''}</p>
      `;
    } else {
      result.textContent = "No direct match found for this area.";
    }
  });

