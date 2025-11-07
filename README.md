# Netflix Mobile (Expo) — Ready to Upload

A small Netflix-style app built with **React Native + Expo** that also runs on **Web**. Use it in Expo Go on your phone, or host the web build on **GitHub Pages**.

## 1) Setup (local & mobile)
1. Install Node.js 18+
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add your **TMDB API key**:
   - Open `src/api/tmdb.js`
   - Replace `YOUR_TMDB_API_KEY` or set an env var before starting:
     ```bash
     EXPO_PUBLIC_TMDB_KEY=YOUR_KEY npx expo start
     ```
4. Run on mobile (Expo Go):
   ```bash
   npm start
   ```
   Scan QR with Expo Go (Android/iOS).

5. Run on web:
   ```bash
   npm run web
   ```

## 2) Push to GitHub
```bash
git init
git add .
git commit -m "Netflix mobile (Expo) starter"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 3) Deploy Website to GitHub Pages
Build static web files:
```bash
npm run build:web
```
This creates `dist/`. Push to `gh-pages` using the provided workflow.

### Using GitHub Actions (recommended)
1. Create a repo and push (see above).
2. Ensure this file exists: `.github/workflows/deploy.yml` (already included).
3. In GitHub → Settings → Pages → set source to **GitHub Actions**.
4. Commit & push; the workflow builds and publishes to **gh-pages**.
5. Your site will be at `https://<username>.github.io/<repo>/`.

If your site is under a subpath (GitHub Pages), Expo export handles static paths. If you see broken images/paths, enable Pages and re-run the workflow; or serve locally to test:
```bash
npm run preview:web
```

## 4) Features
- Home: Trending / Popular / Top Rated lists
- Search: instant movie search
- Details: poster, overview, rating, release date, **Play Trailer** (opens YouTube)

## 5) Customize
- Colors, typography → edit inline styles in `App.js`
- Add Favorites (Firebase): create a context and save to Firestore
- Real playback: host MP4/HLS and use `expo-av` (mobile), or keep YouTube links

## 6) Troubleshooting
- **401 Unauthorized**: TMDB key missing/invalid.
- **Blank web screen**: try `npm run web` and check console for errors.
- **Reanimated warning**: Ensure `react-native-reanimated/plugin` is in `babel.config.js`.

---

Enjoy! ✨
