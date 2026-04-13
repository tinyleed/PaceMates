# PaceMates - Couples Habit Tracker PWA

A beautiful, collaborative habit tracking app for couples with Strava integration, built with React, Tailwind CSS, and PWA technology.

## ✨ Features

### Core Habits (4 Daily Tracking)
- 🍎 **Diet** - Manual toggle
- 🧘 **Meditation** - Manual toggle  
- 😴 **Sleep** - Manual toggle
- ⚡ **Exercise** - Auto-filled from Strava (no manual input!)

### Advanced Features
- **Strava Integration**: Auto-check exercise when activities detected, display distance & activity type
- **Automatic Token Refresh**: Seamless OAuth with zero manual intervention
- **Team Goal Bar**: Real-time shared progress (Mads + Clara combined completion)
- **Heatmap Calendar**: Monthly view with intensity scaling based on Strava distance
- **Nudge System**: Send motivational notifications to your partner
- **Streak Protection**: 1x/week "Life Happens" toggle to skip without breaking streaks
- **Multi-User Profiles**: Separate data & themes for each user (Mads: blue/slate, Clara: rose/teal)
- **PWA Ready**: Install as standalone app on any device

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/tinyleed/PaceMates.git
cd PaceMates
npm install
```

2. Create `.env` file
```bash
cp .env.example .env
```

3. Add your Strava credentials
```
REACT_APP_STRAVA_CLIENT_ID=224374
REACT_APP_STRAVA_CLIENT_SECRET=0e930f4a5e450d85d616578eb99d753cceca1db4
REACT_APP_REDIRECT_URI=http://localhost:3000
```

4. Start development server
```bash
npm start
```

Visit http://localhost:3000 in your browser.

## 🔐 Strava Integration

### Setup
1. Visit https://www.strava.com/settings/api
2. Create an application to get Client ID & Secret
3. Set Authorization Callback Domain to `localhost:3000`
4. Add credentials to `.env`

### How It Works
- **OAuth Flow**: Click "Connect Strava" to authorize the app
- **Automatic Token Refresh**: Tokens refresh automatically before expiration
- **CORS Proxy**: Uses https://corsproxy.io/ to bypass browser restrictions
- **Auto-Check Exercise**: Activities are detected daily and auto-check the habit
- **Activity Display**: Shows 👟 (run), 🚴 (ride), 🥾 (hike) with distance in km

## 📱 PWA Installation

### On Mobile
1. Open app in mobile browser
2. Tap menu (⋮) → "Install app" or "Add to Home Screen"
3. App launches fullscreen like native app

### On Desktop  
1. Open app in Chrome/Edge
2. Click install icon in address bar
3. App launches in standalone window

## 📊 Data Structure

```json
{
  "profiles": {
    "Mads": {
      "theme": "blue",
      "strava": {
        "accessToken": "...",
        "refreshToken": "...",
        "expiresAt": 1234567890
      },
      "history": {
        "2026-04-13": {
          "diet": true,
          "meditation": false,
          "sleep": true,
          "exercise": {
            "checked": true,
            "distance": 10.5,
            "type": "run",
            "activityId": "..."
          }
        }
      },
      "streaks": {
        "current": 5,
        "longest": 12
      },
      "lifeHappensUsed": ["2026-04-06"]
    },
    "Clara": {
      "theme": "rose",
      "strava": { ... },
      "history": { ... },
      "streaks": { ... },
      "lifeHappensUsed": [ ... ]
    }
  },
  "shared": {
    "nudges": [
      {
        "from": "Mads",
        "to": "Clara",
        "timestamp": "2026-04-13T10:30:00Z",
        "read": false
      }
    ]
  }
}
```

## 🎨 Visual Design

- **Clean & Minimal**: High whitespace, rounded corners (rounded-2xl), soft shadows
- **Themed Colors**: 
  - Mads: Blue/Slate palette
  - Clara: Rose/Teal palette
- **Animations**: Smooth spring animations using Framer Motion
- **Responsive**: Works on mobile, tablet, desktop

## 🚢 Deployment

### GitHub Pages (Free & Easy)

1. Update `package.json` homepage:
```json
"homepage": "https://tinyleed.github.io/PaceMates"
```

2. Install gh-pages
```bash
npm install --save-dev gh-pages
```

3. Add deploy scripts to `package.json`:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

4. Deploy
```bash
npm run deploy
```

Visit https://tinyleed.github.io/PaceMates after deployment!

### Other Options
- **Vercel** (recommended for best performance)
- **Netlify** (simple drag & drop)
- **Firebase Hosting** (Google-backed)

## 📁 Project Structure

```
PaceMates/
├── public/
│   ├── index.html
│   ├── manifest.json (PWA config)
│   └── service-worker.js (offline caching)
├── src/
│   ├── components/
│   │   ├── ProfileSelector.jsx
│   │   ├── ProfileView.jsx
│   │   ├── HabitCard.jsx
│   │   ├── Calendar.jsx
│   │   └── TeamGoalBar.jsx
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   └── strava.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## 🔧 Technologies

- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **date-fns** - Date manipulation
- **Strava API** - Activity tracking

## 📝 License

MIT License - feel free to use this for personal or commercial projects!

## 💬 Support

For issues or feature requests, please open a GitHub issue or contact us.

---

Built with ❤️ for couples who hustle together 🚀