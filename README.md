# Hyntrix AI - SaaS Authentication System

A complete, production-ready SaaS authentication system with Supabase integration, email verification, password reset, and full user dashboard.

## Features

✅ **Complete Authentication Flow**
- Sign up with email confirmation
- Login with email/password
- Password reset via email
- Email verification callback
- Session persistence
- Auto redirect after login

✅ **Pages & Routes**
- `/` - Landing page
- `/signup` - Sign up page
- `/login` - Sign in page
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form
- `/verify` - Email verification status
- `/auth/callback` - Supabase callback handler
- `/dashboard` - Protected user dashboard
- `/support` - Support center
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy

✅ **Dashboard Features**
- User email display
- Logout button
- Account section
- Coming features cards (AI Chat, Automation, Agents)
- Working hours display (Monday-Saturday 10 AM - 7 PM)
- Support contact information
- Instagram social media integration

✅ **Security**
- Protected routes (redirect to login if not authenticated)
- Secure session management with Supabase
- Password validation
- Email verification
- HTTPS ready

✅ **Design**
- Premium animated UI
- Responsive design (mobile/tablet/desktop)
- Custom cursor
- Particle background effects
- Smooth transitions

## Deployment Instructions

### Step 1: Upload to Vercel

1. Clone or download this repository
2. Push to your GitHub repository
3. Go to [vercel.com](https://vercel.com)
4. Click "New Project" and import your repository
5. Vercel will auto-detect the project

### Step 2: Environment Variables

The app uses hardcoded Supabase credentials (for public usage). If needed, update in `auth-utils.js`:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
const SUPABASE_REDIRECT_URL = 'https://your-domain.com/auth/callback';
const SUPABASE_RESET_REDIRECT = 'https://your-domain.com/reset-password';
```

### Step 3: Configure Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. In **Auth Settings**:
   - Go to **Email Templates**
   - Update confirmation URL to: `https://your-domain.com/auth/callback`
   - Update password reset URL to: `https://your-domain.com/reset-password`

4. In **Auth Providers**:
   - Enable Email authentication
   - Set confirmation required: `ON` or `OFF` based on preference

### Step 4: Update Domain References

Replace `https://hyntrixai.com` with your actual domain in:
- `auth-utils.js` - `SUPABASE_REDIRECT_URL` and `SUPABASE_RESET_REDIRECT`
- All pages (in href links if needed)
- Footer links

## File Structure

```
hyntrix-saas/
├── index.html              # Landing page
├── signup.html             # Signup page
├── login.html              # Login page
├── forgot-password.html    # Password reset request
├── reset-password.html     # Password reset form
├── verify.html             # Email verification status
├── support.html            # Support page
├── terms.html              # Terms of Service
├── privacy.html            # Privacy Policy
├── styles.css              # Shared styles
├── auth-utils.js           # Supabase auth utilities
├── auth/
│   └── callback.html       # Email confirmation callback
└── dashboard/
    └── index.html          # Protected dashboard
```

## How It Works

### Signup Flow
1. User fills signup form with email, password, name
2. System creates account via Supabase
3. If email confirmation enabled:
   - User sees verification page
   - Supabase sends confirmation email
   - User clicks link → `/auth/callback`
   - Session created → Redirect to dashboard
4. If email confirmation disabled:
   - Direct login → Dashboard

### Login Flow
1. User enters email and password
2. System authenticates with Supabase
3. Session token stored in localStorage
4. Auto redirect to `/dashboard`

### Password Reset Flow
1. User requests reset at `/forgot-password`
2. Email sent with reset link containing token
3. User clicks link → `/reset-password?access_token=...`
4. User sets new password
5. Auto redirect to dashboard

### Protected Routes
- `/dashboard` requires authentication
- If not logged in → redirected to `/login`

## Key Functions

### Auth Functions (from `auth-utils.js`)

```javascript
// Signup
await signUp(email, password, fullName)

// Login
await signIn(email, password)

// Logout
await signOut(token)

// Get current session
await getCurrentSession(token)

// Restore session from storage
await restoreSession()

// Request password reset
await requestPasswordReset(email)

// Reset password
await resetPassword(accessToken, newPassword)

// Verify OTP
await verifyOtp(email, token, type)
```

### UI Functions

```javascript
// Show error message
showError(elementId, message)

// Show toast notification
showToast(message, type) // type: 'success' or 'error'

// Set loading state on button
setLoading(buttonId, spinId, isLoading)

// Validate email
isValidEmail(email)

// Protect route
async requireAuth()

// Redirect if logged in
async redirectIfLoggedIn()
```

## Email Configuration

### If Email Confirmation is ON:
- After signup, user gets "Check your email to confirm account"
- Confirmation email contains link to `/auth/callback`
- Link includes `access_token` and `type=signup`
- After confirmation, user can login normally

### If Email Confirmation is OFF:
- After signup, auto login to dashboard
- No confirmation email needed

## Customization

### Change Support Contact
Edit `support.html`, `dashboard/index.html` and search for:
```html
hyntrixaidesk@gmail.com
https://www.instagram.com/hyntrixai
```

### Change Working Hours
Edit `dashboard/index.html` and `support.html`:
```html
<div>Monday - Saturday: 10 AM – 7 PM</div>
<div>Sunday: Closed</div>
```

### Update Brand Colors
Edit `styles.css` CSS variables:
```css
:root {
  --b: #1A8CFF;         /* Primary blue */
  --b2: #00D4FF;        /* Secondary cyan */
  --b3: #0056CC;        /* Dark blue */
  --text: #EEF4FF;      /* Text color */
  /* ... more colors */
}
```

## Troubleshooting

### "Redirect URL mismatch" error
- Check Supabase auth settings
- Ensure callback URLs match your domain
- Update `auth-utils.js` constants

### Email not received
- Check spam/junk folder
- Verify Supabase email settings
- Check email template configuration

### Session lost on refresh
- Ensure browser allows localStorage
- Check for third-party cookie restrictions
- Clear browser cache and try again

### Dashboard shows "loading..."
- Check network tab in DevTools
- Verify Supabase credentials
- Ensure user is logged in

## Security Notes

⚠️ **For Production:**
- Use environment variables (don't hardcode secrets)
- Use Supabase Row Level Security (RLS)
- Enable HTTPS only
- Use secure cookies
- Implement rate limiting
- Add CSRF protection

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (responsive)

## Performance

- ~50KB total (uncompressed)
- Fast load times
- Smooth animations
- Lazy loading enabled
- Mobile optimized

## Analytics Integration

Add to any page (e.g., `index.html` before closing `</body>`):

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## Support

📧 Email: hyntrixaidesk@gmail.com
📸 Instagram: @hyntrixai
🌐 Website: https://hyntrixai.com

## License

© 2025 Hyntrix AI. All rights reserved.
