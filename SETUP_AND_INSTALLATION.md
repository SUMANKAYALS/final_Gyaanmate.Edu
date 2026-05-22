# 🚀 EDULEARN - Setup & Installation Guide

## Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Git (optional)

### Installation Steps

#### 1. Navigate to Project
```bash
cd "d:\Final Project\Udemy-test\Medi-project-main\client"
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Start Development Server
```bash
npm run dev
```

#### 4. Open in Browser
```
http://localhost:5173
```

---

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with hot reload.

### Build for Production
```bash
npm run build
```
Creates an optimized production build.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally.

### Lint Code
```bash
npm run lint
```
Checks code quality with ESLint.

---

## Project Structure

```
client/
├── src/
│   ├── components/          # React components
│   ├── context/             # Context providers
│   ├── pages/               # Page components
│   ├── data/                # Static data (courses.js)
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
│
├── public/                  # Static assets
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
└── index.html               # HTML template
```

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI library |
| react-dom | ^19.0.0 | DOM rendering |
| react-router-dom | ^7.5.0 | Routing |
| react-icons | ^5.5.0 | Icon library |
| tailwindcss | ^4.1.3 | Styling |
| vite | ^6.2.0 | Build tool |

---

## Features Overview

### ✅ Implemented Features
- [x] Course browsing
- [x] Course search
- [x] Course categories
- [x] Course details page
- [x] Enrollment cart
- [x] My courses dashboard
- [x] Course player (lesson viewer)
- [x] Progress tracking
- [x] Lesson completion marking
- [x] User authentication integration
- [x] Responsive design

### 🔜 Ready for Backend Integration
- [ ] API endpoints
- [ ] Database integration
- [ ] Payment processing
- [ ] Certificate generation
- [ ] Analytics

---

## Testing the Platform

### Test User Flow

1. **Homepage**
   - ✅ Navigate to `http://localhost:5173`
   - ✅ See featured courses
   - ✅ See course categories
   - ✅ Scroll down to view all content

2. **Browse Courses**
   - ✅ Click on course category
   - ✅ See filtered courses
   - ✅ Click on a course card
   - ✅ View full course details

3. **Search**
   - ✅ Use search bar
   - ✅ Type "nursing" or "pharmacology"
   - ✅ See suggestions
   - ✅ Click on course

4. **Course Detail**
   - ✅ View course overview
   - ✅ See instructor info
   - ✅ Check rating and reviews count
   - ✅ See lesson list
   - ✅ View skills
   - ✅ Click tabs to explore content

5. **Enrollment** (Requires Login)
   - ✅ Click "Enroll Now"
   - ✅ Get redirected to login
   - ✅ Create account or login
   - ✅ Course added to cart
   - ✅ View cart and complete enrollment
   - ✅ Course appears in "My Learning"

6. **Learning**
   - ✅ Go to "My Learning"
   - ✅ Click "Continue Learning"
   - ✅ View course player
   - ✅ Navigate between lessons
   - ✅ Mark lessons as complete
   - ✅ See progress update

---

## Environment Configuration

### Vite Configuration (vite.config.js)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
})
```

### Tailwind Configuration (tailwind.config.js)
```javascript
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## Common Issues & Solutions

### Issue 1: Port Already in Use
**Error**: "Port 5173 is already in use"
**Solution**:
```bash
# Kill the process using port 5173
# Or use a different port:
npm run dev -- --port 3000
```

### Issue 2: Module Not Found
**Error**: "Cannot find module..."
**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: Hot Reload Not Working
**Error**: Changes not reflecting
**Solution**:
```bash
# Clear cache and restart
npm run dev
# If still issues, restart your terminal
```

### Issue 4: Styling Not Applied
**Error**: Tailwind classes not working
**Solution**:
- Make sure files are saved
- Check tailwind.config.js includes all template paths
- Restart dev server

---

## File Locations Quick Reference

### To Add a Course
📁 `src/data/courses.js`
```javascript
// Add new course to the courses array
{
  id: 7,
  title: "New Course",
  // ... other properties
}
```

### To Update Homepage
📁 `src/App.jsx` (Home route)

### To Modify Styles
📁 `src/index.css` or use Tailwind classes inline

### To Add New Page
📁 `src/pages/YourPage.jsx`
Then add route in `src/App.jsx`

### To Create New Component
📁 `src/components/YourComponent.jsx`

---

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome | ✅ Latest |
| Firefox | ✅ Latest |
| Safari | ✅ Latest |
| Edge | ✅ Latest |
| Mobile Browsers | ✅ iOS Safari, Chrome Mobile |

---

## Performance Optimization

### Already Implemented
- ✅ Code splitting with React.lazy() (ready)
- ✅ Tailwind CSS minification
- ✅ React Fast Refresh (dev)
- ✅ Optimized images
- ✅ Responsive design

### Recommendations
1. **Image Optimization**: Use WebP format
2. **Code Splitting**: Implement React.lazy for pages
3. **Caching**: Add service workers for PWA
4. **CDN**: Use CDN for static assets

---

## Deployment Checklist

- [ ] All env variables configured
- [ ] Build passes without errors (`npm run build`)
- [ ] No console errors in production build
- [ ] Images properly optimized
- [ ] Links and routes verified
- [ ] Mobile responsiveness checked
- [ ] Performance audit passed
- [ ] SEO meta tags added
- [ ] Analytics integrated
- [ ] Error tracking configured

---

## Deployment Options

### 1. Vercel (Recommended for Vite)
```bash
npm install -g vercel
vercel
```

### 2. Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### 3. GitHub Pages
```bash
npm run build
# Deploy dist/ folder
```

### 4. Traditional Server
```bash
npm run build
# Upload dist/ folder to server
```

---

## Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/new-feature
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. Make Changes
```bash
# Edit files in src/
```

### 4. Test Locally
```bash
# Browser auto-refreshes with changes
```

### 5. Build & Test Production
```bash
npm run build
npm run preview
```

### 6. Commit & Push
```bash
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

---

## Useful Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Update dependencies
npm update

# Check outdated packages
npm outdated
```

---

## Next Steps

### 1. Local Testing
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Test all features in browser
- [ ] Check console for errors

### 2. Customization
- [ ] Update course data in `src/data/courses.js`
- [ ] Modify colors in Tailwind config
- [ ] Add your logo
- [ ] Update company information

### 3. Backend Integration
- [ ] Set up API endpoints
- [ ] Replace context data with API calls
- [ ] Implement authentication
- [ ] Add payment processing

### 4. Deployment
- [ ] Choose hosting platform
- [ ] Configure build settings
- [ ] Set up domain
- [ ] Enable HTTPS
- [ ] Set up monitoring

---

## Support & Resources

### Official Documentation
- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)

### Community
- React Discord
- Stack Overflow
- GitHub Discussions

### Troubleshooting
- Check browser console for errors
- Clear browser cache and hard refresh
- Ensure Node.js and npm are up to date
- Try creating a fresh project if stuck

---

## Tips for Success

1. **Start Simple**: Test basic features first
2. **Use Browser DevTools**: For debugging
3. **Check Console**: For error messages
4. **Mobile First**: Design for mobile
5. **Version Control**: Use Git for changes
6. **Documentation**: Keep it updated
7. **Testing**: Test before deploying
8. **Monitoring**: Track errors in production

---

## Quick Command Reference

```bash
# Development
npm run dev              # Start dev server
npm run lint             # Check code quality

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Maintenance
npm install              # Install dependencies
npm update               # Update packages
npm audit                # Check for vulnerabilities
npm prune                # Remove unused packages
```

---

## Contact & Support

For issues or questions:
1. Check documentation files
2. Review browser console
3. Check GitHub issues
4. Refer to React documentation

---

**Version**: 1.0  
**Last Updated**: 2024  
**Platform**: EDULEARN  

🎓 Happy Learning! 🎓

---

*This setup guide ensures you can run EDULEARN locally and prepare for deployment. Follow the steps carefully and don't hesitate to refer back to this guide when needed.*
