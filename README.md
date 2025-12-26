# Own This Year

A comprehensive personal productivity and time management application designed to help you take control of your year. Built with modern web technologies and available as both a web app and mobile app.

## 🌟 Features

### 📊 Dashboard
- **Daily Intention Setting**: Set and track your daily focus
- **Time Tracking Overview**: View today's and this week's tracked time
- **Active Goals Progress**: See your ongoing goals at a glance
- **Pomodoro Status**: Quick access to focus sessions
- **Adaptive Theme**: Automatically adjusts colors based on time of day (morning, day, evening, night)

### 🎯 Goals Management
- **Goal Creation**: Create goals with categories (Personal, Projects, Learning, Business)
- **Progress Tracking**: Visual progress bars with percentage completion
- **Deadline Setting**: Optional due dates for goals
- **Goal Categories**: Color-coded categories for easy organization
- **Completed Goals Archive**: View finished goals

### ⏰ Pomodoro Timer
- **Customizable Sessions**: Adjustable work and break durations
- **Visual Timer**: Circular progress indicator
- **Session Types**: Work and break cycles
- **Auto Transitions**: Automatic switching between work and break periods

### 📈 Time Tracking
- **Live Timer**: Start/stop time tracking with descriptions
- **Manual Entry**: Add time entries manually with start/end times
- **Category System**: Organize time by work, learning, personal, health categories
- **Goal Linking**: Connect time entries to specific goals
- **Activity Auto-logging**: Automatic activity logging from time entries

### 📝 Journal
- **Rich Text Entries**: Support for markdown formatting (bold, italic, headers, lists)
- **Search Functionality**: Search through entries by title or content
- **Timestamped Entries**: Automatic date/time stamps
- **Entry Management**: View, edit, and delete entries

### 📁 Projects
- **Project Organization**: Create and manage multiple projects
- **Task Tracking**: Track tasks within projects
- **Project Descriptions**: Add context and details to projects

### 📋 Activity Log
- **Daily Logging**: Log activities with descriptions and tags
- **Tag System**: Categorize activities with custom tags
- **Search & Filter**: Find activities by content or tags
- **Timestamp Tracking**: Automatic timestamping of all activities

### 📅 Monthly Review
- **Mood Tracking**: Daily mood logging with emoji indicators
- **Energy Level Tracking**: Rate daily energy levels (1-5)
- **Monthly Reflections**: Write about what went well and what didn't
- **One-Sentence Reflections**: Capture key learnings
- **Next Month Focus**: Set intentions for the upcoming month
- **Historical Data**: Review past months' data

### 📆 Calendar
- **Schedule View**: Calendar interface for planning and overview

### ⚙️ Settings
- **App Preferences**: Customize your experience

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn or bun

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd own-this-year
   ```

2. **Install dependencies for the web app:**
   ```bash
   cd create-anything/_/apps/web
   npm install
   ```

3. **For mobile app (optional):**
   ```bash
   cd ../mobile
   npm install
   ```

### Running the Application

#### Web App

```bash
cd create-anything/_/apps/web
npm run dev
```

The web app will start on `http://localhost:4000`

#### Mobile App

```bash
cd create-anything/_/apps/mobile
npx expo start
```

This will start the Expo development server. You can then:
- Press `w` to open in web browser
- Press `i` to open iOS simulator (macOS only)
- Press `a` to open Android emulator
- Scan QR code with Expo Go app on your phone

## 🏗️ Architecture

### Tech Stack

#### Web App
- **Framework**: React Router v7
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom themes
- **State Management**: Local Storage (client-side)
- **Icons**: Lucide React
- **Deployment**: Vite-based build

#### Mobile App
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Styling**: Native styles with theme adaptation
- **State Management**: Local Storage (AsyncStorage)
- **Build System**: Expo Application Services (EAS)

### Project Structure

```
create-anything/_/apps/
├── web/                    # Web application
│   ├── src/
│   │   ├── app/           # React Router pages
│   │   │   ├── page.jsx          # Dashboard
│   │   │   ├── goals/page.jsx    # Goals management
│   │   │   ├── pomodoro/page.jsx # Pomodoro timer
│   │   │   ├── time/page.jsx     # Time tracking
│   │   │   ├── journal/page.jsx  # Journal entries
│   │   │   ├── projects/page.jsx # Projects
│   │   │   ├── activity/page.jsx # Activity log
│   │   │   ├── review/page.jsx   # Monthly reviews
│   │   │   ├── calendar/page.jsx # Calendar view
│   │   │   └── settings/page.jsx # Settings
│   │   └── utils/         # Shared utilities
│   ├── package.json
│   └── vite.config.ts
└── mobile/                 # React Native mobile app
    ├── src/
    │   └── app/           # Expo Router screens
    ├── package.json
    └── app.json
```

## 🎨 Design Philosophy

### Adaptive Themes
The app features intelligent theme adaptation based on time of day:
- **Morning** (5:00-9:30): Warm, energizing colors
- **Day** (9:30-16:30): Clean, professional palette
- **Evening** (16:30-21:00): Soft, calming tones
- **Night** (21:00-5:00): Dark mode with high contrast

### User Experience
- **Minimalist Design**: Clean, distraction-free interface
- **Intuitive Navigation**: Bottom tab navigation on web, native navigation on mobile
- **Progressive Enhancement**: Works offline with local storage
- **Responsive**: Adapts to different screen sizes and orientations

## 📱 Platform Support

### Web App
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive Web App (PWA) features
- Responsive design for desktop and mobile

### Mobile App
- iOS 11+
- Android API 21+
- Cross-platform compatibility

## 🔧 Development

### Available Scripts

#### Web App
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run typecheck    # TypeScript checking
```

#### Mobile App
```bash
npx expo start       # Start Expo development server
npx expo build       # Build for production
```

### Key Technologies

#### Web App Dependencies
- React Router v7 for routing
- Tailwind CSS for styling
- Lucide React for icons
- Date-fns for date manipulation
- Zustand for state management (future enhancement)

#### Mobile App Dependencies
- Expo SDK 54
- React Native 0.81.4
- React Navigation v7
- Expo Router for file-based routing

## 🌟 Key Features Deep Dive

### Time Tracking Integration
Time entries automatically create activity log entries, providing seamless tracking across different parts of your productivity workflow.

### Goal-Task Connection
Time tracking can be linked to specific goals, allowing you to see how much time you're investing in your objectives.

### Monthly Reflection System
The review feature combines quantitative data (mood, energy levels) with qualitative reflection, providing comprehensive monthly insights.

### Markdown Journal
Full markdown support in journal entries allows for rich formatting while maintaining simplicity.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both web and mobile
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern React ecosystem
- Inspired by productivity methodologies and time management best practices
- Designed for personal growth and self-improvement

---

**Own This Year** - Take control of your time, achieve your goals, and build the life you want to live.
