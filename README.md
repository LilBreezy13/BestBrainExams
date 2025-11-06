# Edu Consortium - Frontend Prototype (Downloadable)

## What is included
- `index.html` — Home page with hero carousel, centered search card, signup form, and sections.
- `styles.css` — Small CSS overrides.
- `app.js` — JavaScript for carousel, search lookup, and signup.
- `firebase-config.js` — Replace placeholders with your Firebase config.
- `assets/` — Contains 4 placeholder hero images (`hero1.jpg`..`hero4.jpg`).

## How to use
1. Unzip the project and open `index.html` in a modern browser.
2. Replace values in `firebase-config.js` with your Firebase project config.
3. In Firestore, create a `regions` collection. Example document `ashaiman`:
```
{
  areas: {
    katamanso: { name: 'Ashaiman', phone: '+233256613433', lat: 5.627, lng: -0.012 }
  },
  default: { name: 'Ashaiman HQ', phone: '+233256613433' }
}
```
4. For testing signups, enable Email/Password provider in Firebase Auth and allow Firestore read/write as needed.

## Notes
- Tailwind is loaded from CDN for prototyping. For production, build Tailwind via its CLI for better performance.
- Replace placeholder images in `assets/` with your real hero images.
- Phone numbers should be in international format for WhatsApp links to work.

