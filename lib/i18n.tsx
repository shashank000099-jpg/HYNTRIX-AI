
'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { supabaseClient } from './supabase/client'

export type Language = 'en' | 'hi' | 'hinglish'

export const LANGUAGES: Record<Language, string> = {
  en: 'English',
  hi: 'हिन्दी',
  hinglish: 'Hinglish'
}

type TranslationKeys = Record<string, string>

const en: TranslationKeys = {
  'nav.dashboard': 'Dashboard', 'nav.startup': 'Startup', 'nav.founder': 'Founder',
  'nav.opportunity': 'Opportunity', 'nav.social': 'Social', 'nav.simulators': 'Simulators',
  'nav.boardroom': 'Board Room', 'nav.founderHub': 'Founder Hub', 'nav.history': 'History',
  'nav.savedReports': 'Saved Reports', 'nav.profile': 'Profile', 'nav.settings': 'Settings',
  'nav.signOut': 'Sign Out',
  'auth.login': 'Login', 'auth.signup': 'Sign Up', 'auth.logout': 'Logout',
  'auth.email': 'Email', 'auth.password': 'Password', 'auth.confirmPassword': 'Confirm Password',
  'auth.name': 'Name', 'auth.forgotPassword': 'Forgot Password?',
  'auth.noAccount': "Don't have an account?", 'auth.hasAccount': 'Already have an account?',
  'auth.signInWithGoogle': 'Sign in with Google', 'auth.orContinueWith': 'Or continue with',
  'auth.loginButton': 'Login', 'auth.signupButton': 'Sign Up',
  'auth.loggingIn': 'Logging in...', 'auth.creatingAccount': 'Creating account...',
  'auth.loginSuccess': 'Login successful!', 'auth.signupSuccess': 'Account created! Check your email.',
  'auth.verificationEmailSent': 'Verification email sent!', 'auth.checkYourEmail': 'Check your email for verification link.',
  'auth.emailVerified': 'Email verified!', 'auth.redirectingToLogin': 'Redirecting to login...',
  'auth.expiredLink': 'Link expired.', 'auth.invalidLink': 'Invalid link.', 'auth.alreadyVerified': 'Already verified.',
  'onboarding.welcome': 'Welcome!', 'onboarding.subtitle': "Let's set up your profile",
  'onboarding.step1': 'Tell us about yourself', 'onboarding.step2': "What's your main goal?",
  'onboarding.yourName': 'Your Name', 'onboarding.namePlaceholder': 'John Doe',
  'onboarding.age': 'Age (optional)', 'onboarding.agePlaceholder': '25',
  'onboarding.budget': 'Budget (optional)', 'onboarding.selectBudget': 'Select budget',
  'onboarding.goal': 'Goal', 'onboarding.skills': 'Skills (optional)',
  'onboarding.continue': 'Continue →', 'onboarding.back': '← Back',
  'onboarding.getStarted': 'Get Started →', 'onboarding.creatingProfile': 'Creating profile...',
  'onboarding.updateAnytime': 'Update anytime in Settings', 'onboarding.verifyingSession': 'Verifying session...',
  'goal.startBusiness': 'Start a Business', 'goal.growInstagram': 'Grow Instagram',
  'goal.startYoutube': 'Start YouTube', 'goal.makeMoney': 'Make Money Online',
  'goal.findIdeas': 'Find Business Ideas', 'goal.improveSkills': 'Improve Skills',
  'dashboard.title': 'Dashboard', 'dashboard.welcomeBack': 'Welcome back',
  'dashboard.quickActions': 'Quick Actions', 'dashboard.recentActivity': 'Recent Activity',
  'dashboard.yourCredits': 'Your Credits', 'dashboard.level': 'Level', 'dashboard.xp': 'XP',
  'common.loading': 'Loading...', 'common.error': 'Error', 'common.retry': 'Try Again',
  'common.save': 'Save', 'common.cancel': 'Cancel', 'common.delete': 'Delete',
  'common.edit': 'Edit', 'common.submit': 'Submit', 'common.back': 'Back',
  'common.next': 'Next', 'common.previous': 'Previous', 'common.openTool': 'Open Tool',
  'common.launchSimulator': 'Launch Simulator', 'common.noData': 'No data', 'common.home': 'Home',
  'settings.title': 'Settings', 'settings.language': 'Language', 'settings.theme': 'Theme',
  'settings.notifications': 'Notifications', 'settings.emailUpdates': 'Email Updates',
  'settings.darkMode': 'Dark Mode', 'settings.lightMode': 'Light Mode',
  'settings.save': 'Save Settings', 'settings.saved': 'Settings saved!',
  'settings.languageDesc': 'Choose your language', 'settings.themeDesc': 'Select theme',
  'settings.notificationsDesc': 'Enable/disable notifications', 'settings.emailDesc': 'Email updates about features',
  'settings.profile': 'Profile', 'settings.account': 'Account',
  'feature.startupIntelligence': 'Startup Intelligence', 'feature.startupDesc': 'Analyze your startup idea',
  'feature.founderIntelligence': 'Founder Intelligence', 'feature.founderDesc': 'Assess your founder profile',
  'feature.socialIntelligence': 'Social Intelligence', 'feature.socialDesc': 'Analyze social media',
  'feature.opportunityHub': 'Opportunity Hub', 'feature.opportunityDesc': 'Find opportunities',
  'feature.simulators': 'Simulators', 'feature.simulatorsDesc': 'Practice conversations',
  'feature.boardRoom': 'Board Room', 'feature.boardRoomDesc': 'AI advisor advice',
  'error.loginFailed': 'Login failed.', 'error.signupFailed': 'Signup failed.',
  'error.profileFailed': 'Profile save failed.', 'error.networkError': 'Network error.',
  'error.unauthorized': 'Not logged in.', 'error.notFound': 'Page not found',
}

const hi: TranslationKeys = {
  'nav.dashboard': 'डैशबोर्ड', 'nav.startup': 'स्टार्टअप', 'nav.founder': 'फाउंडर',
  'nav.opportunity': 'अवसर', 'nav.social': 'सोशल', 'nav.simulators': 'सिमुलेटर',
  'nav.boardroom': 'बोर्ड रूम', 'nav.founderHub': 'फाउंडर हब', 'nav.history': 'इतिहास',
  'nav.savedReports': 'सेव रिपोर्ट', 'nav.profile': 'प्रोफ़ाइल', 'nav.settings': 'सेटिंग्स',
  'nav.signOut': 'साइन आउट',
  'auth.login': 'लॉगिन', 'auth.signup': 'साइन अप', 'auth.logout': 'लॉगआउट',
  'auth.email': 'ईमेल', 'auth.password': 'पासवर्ड', 'auth.confirmPassword': 'पासवर्ड पुष्टि',
  'auth.name': 'नाम', 'auth.forgotPassword': 'पासवर्ड भूल गए?',
  'auth.noAccount': 'खाता नहीं?', 'auth.hasAccount': 'पहले से खाता?',
  'auth.signInWithGoogle': 'Google से साइन इन', 'auth.orContinueWith': 'या जारी रखें',
  'auth.loginButton': 'लॉगिन', 'auth.signupButton': 'साइन अप',
  'auth.loggingIn': 'लॉगिन हो रहा है...', 'auth.creatingAccount': 'खाता बन रहा है...',
  'auth.loginSuccess': 'लॉगिन सफल!', 'auth.signupSuccess': 'खाता बना! ईमेल जांचें।',
  'auth.verificationEmailSent': 'सत्यापन ईमेल भेजा!', 'auth.checkYourEmail': 'ईमेल में लिंक देखें।',
  'auth.emailVerified': 'ईमेल सत्यापित!', 'auth.redirectingToLogin': 'लॉगिन पर जा रहे हैं...',
  'auth.expiredLink': 'लिंक समाप्त।', 'auth.invalidLink': 'गलत लिंक।', 'auth.alreadyVerified': 'पहले से सत्यापित।',
  'onboarding.welcome': 'स्वागत है!', 'onboarding.subtitle': 'प्रोफ़ाइल सेट करते हैं',
  'onboarding.step1': 'अपने बारे में बताएं', 'onboarding.step2': 'मुख्य लक्ष्य?',
  'onboarding.yourName': 'नाम', 'onboarding.namePlaceholder': 'नाम लिखें',
  'onboarding.age': 'उम्र', 'onboarding.agePlaceholder': '25',
  'onboarding.budget': 'बजट', 'onboarding.selectBudget': 'बजट चुनें',
  'onboarding.goal': 'लक्ष्य', 'onboarding.skills': 'कौशल',
  'onboarding.continue': 'जारी रखें →', 'onboarding.back': '← वापस',
  'onboarding.getStarted': 'शुरू करें →', 'onboarding.creatingProfile': 'प्रोफ़ाइल बन रही है...',
  'onboarding.updateAnytime': 'सेटिंग्स में अपडेट करें', 'onboarding.verifyingSession': 'सत्र सत्यापित...',
  'goal.startBusiness': 'व्यवसाय शुरू', 'goal.growInstagram': 'Instagram बढ़ाएं',
  'goal.startYoutube': 'YouTube शुरू', 'goal.makeMoney': 'ऑनलाइन पैसे',
  'goal.findIdeas': 'विचार खोजें', 'goal.improveSkills': 'कौशल सुधारें',
  'dashboard.title': 'डैशबोर्ड', 'dashboard.welcomeBack': 'वापस स्वागत',
  'dashboard.quickActions': 'त्वरित कार्य', 'dashboard.recentActivity': 'हालिया',
  'dashboard.yourCredits': 'क्रेडिट', 'dashboard.level': 'स्तर', 'dashboard.xp': 'XP',
  'common.loading': 'लोड हो रहा है...', 'common.error': 'त्रुटि', 'common.retry': 'पुनः प्रयास',
  'common.save': 'सहेजें', 'common.cancel': 'रद्द', 'common.delete': 'हटाएं',
  'common.edit': 'संपादित', 'common.submit': 'जमा', 'common.back': 'वापस',
  'common.next': 'अगला', 'common.previous': 'पिछला', 'common.openTool': 'टूल खोलें',
  'common.launchSimulator': 'सिमुलेटर', 'common.noData': 'कोई डेटा', 'common.home': 'होम',
  'settings.title': 'सेटिंग्स', 'settings.language': 'भाषा', 'settings.theme': 'थीम',
  'settings.notifications': 'सूचनाएं', 'settings.emailUpdates': 'ईमेल अपडेट',
  'settings.darkMode': 'डार्क मोड', 'settings.lightMode': 'लाइट मोड',
  'settings.save': 'सहेजें', 'settings.saved': 'सेव हो गई!',
  'settings.languageDesc': 'भाषा चुनें', 'settings.themeDesc': 'थीम चुनें',
  'settings.notificationsDesc': 'सूचनाएं चालू/बंद', 'settings.emailDesc': 'ईमेल अपडेट',
  'settings.profile': 'प्रोफ़ाइल', 'settings.account': 'खाता',
  'feature.startupIntelligence': 'स्टार्टअप इंटेलिजेंस', 'feature.startupDesc': 'स्टार्टअप विश्लेषण',
  'feature.founderIntelligence': 'फाउंडर इंटेलिजेंस', 'feature.founderDesc': 'फाउंडर प्रोफ़ाइल',
  'feature.socialIntelligence': 'सोशल इंटेलिजेंस', 'feature.socialDesc': 'सोशल मीडिया विश्लेषण',
  'feature.opportunityHub': 'अवसर हब', 'feature.opportunityDesc': 'अवसर खोजें',
  'feature.simulators': 'सिमुलेटर', 'feature.simulatorsDesc': 'बातचीत अभ्यास',
  'feature.boardRoom': 'बोर्ड रूम', 'feature.boardRoomDesc': 'AI सलाह',
  'error.loginFailed': 'लॉगिन विफल।', 'error.signupFailed': 'साइनअप विफल।',
  'error.profileFailed': 'प्रोफ़ाइल सेव विफल।', 'error.networkError': 'नेटवर्क त्रुटि।',
  'error.unauthorized': 'लॉग इन नहीं।', 'error.notFound': 'पृष्ठ नहीं मिला',
}

const hinglish: TranslationKeys = {
  'nav.dashboard': 'Dashboard', 'nav.startup': 'Startup', 'nav.founder': 'Founder',
  'nav.opportunity': 'Opportunity', 'nav.social': 'Social', 'nav.simulators': 'Simulators',
  'nav.boardroom': 'Board Room', 'nav.founderHub': 'Founder Hub', 'nav.history': 'History',
  'nav.savedReports': 'Saved Reports', 'nav.profile': 'Profile', 'nav.settings': 'Settings',
  'nav.signOut': 'Logout karo',
  'auth.login': 'Login', 'auth.signup': 'Signup', 'auth.logout': 'Logout',
  'auth.email': 'Email', 'auth.password': 'Password', 'auth.confirmPassword': 'Password confirm karo',
  'auth.name': 'Naam', 'auth.forgotPassword': 'Password bhool gaye?',
  'auth.noAccount': 'Account nahi hai?', 'auth.hasAccount': 'Pehle se account hai?',
  'auth.signInWithGoogle': 'Google se login karo', 'auth.orContinueWith': 'Ya iske saath continue karo',
  'auth.loginButton': 'Login karo', 'auth.signupButton': 'Signup karo',
  'auth.loggingIn': 'Login ho raha hai...', 'auth.creatingAccount': 'Account ban raha hai...',
  'auth.loginSuccess': 'Login ho gaya!', 'auth.signupSuccess': 'Account ban gaya! Email check karo.',
  'auth.verificationEmailSent': 'Verification email bhej diya!', 'auth.checkYourEmail': 'Email mein link dekho.',
  'auth.emailVerified': 'Email verify ho gaya!', 'auth.redirectingToLogin': 'Login pe ja rahe hain...',
  'auth.expiredLink': 'Link expire ho chuka hai.', 'auth.invalidLink': 'Galat link hai.', 'auth.alreadyVerified': 'Pehle se verify hai.',
  'onboarding.welcome': 'Swagat hai!', 'onboarding.subtitle': 'Chalo profile set karte hain',
  'onboarding.step1': 'Apne baare mein batao', 'onboarding.step2': 'Tumhara goal kya hai?',
  'onboarding.yourName': 'Naam', 'onboarding.namePlaceholder': 'Naam likho',
  'onboarding.age': 'Umar (optional)', 'onboarding.agePlaceholder': '25',
  'onboarding.budget': 'Budget (optional)', 'onboarding.selectBudget': 'Budget chuno',
  'onboarding.goal': 'Goal', 'onboarding.skills': 'Skills (optional)',
  'onboarding.continue': 'Aage badho →', 'onboarding.back': '← Peeche',
  'onboarding.getStarted': 'Shuru karo →', 'onboarding.creatingProfile': 'Profile ban rahi hai...',
  'onboarding.updateAnytime': 'Settings mein kabhi bhi update karo', 'onboarding.verifyingSession': 'Session verify ho raha hai...',
  'goal.startBusiness': 'Business shuru karo', 'goal.growInstagram': 'Instagram badhao',
  'goal.startYoutube': 'YouTube shuru karo', 'goal.makeMoney': 'Online paisa kamao',
  'goal.findIdeas': 'Ideas dhundho', 'goal.improveSkills': 'Skills improve karo',
  'dashboard.title': 'Dashboard', 'dashboard.welcomeBack': 'Wapas swagat hai',
  'dashboard.quickActions': 'Quick Actions', 'dashboard.recentActivity': 'Recent Activity',
  'dashboard.yourCredits': 'Credits', 'dashboard.level': 'Level', 'dashboard.xp': 'XP',
  'common.loading': 'Load ho raha hai...', 'common.error': 'Error', 'common.retry': 'Phir try karo',
  'common.save': 'Save karo', 'common.cancel': 'Cancel', 'common.delete': 'Delete',
  'common.edit': 'Edit', 'common.submit': 'Submit', 'common.back': 'Peeche',
  'common.next': 'Aage', 'common.previous': 'Peeche', 'common.openTool': 'Tool kholo',
  'common.launchSimulator': 'Simulator chalu karo', 'common.noData': 'Koi data nahi', 'common.home': 'Home',
  'settings.title': 'Settings', 'settings.language': 'Bhasha', 'settings.theme': 'Theme',
  'settings.notifications': 'Notifications', 'settings.emailUpdates': 'Email Updates',
  'settings.darkMode': 'Dark Mode', 'settings.lightMode': 'Light Mode',
  'settings.save': 'Save karo', 'settings.saved': 'Save ho gaya!',
  'settings.languageDesc': 'Language chuno', 'settings.themeDesc': 'Theme chuno',
  'settings.notificationsDesc': 'Notifications on/off karo', 'settings.emailDesc': 'Email updates lo',
  'settings.profile': 'Profile', 'settings.account': 'Account',
  'feature.startupIntelligence': 'Startup Intelligence', 'feature.startupDesc': 'Startup idea analyze karo',
  'feature.founderIntelligence': 'Founder Intelligence', 'feature.founderDesc': 'Founder profile check karo',
  'feature.socialIntelligence': 'Social Intelligence', 'feature.socialDesc': 'Social media analyze karo',
  'feature.opportunityHub': 'Opportunity Hub', 'feature.opportunityDesc': 'Opportunities dhundho',
  'feature.simulators': 'Simulators', 'feature.simulatorsDesc': 'Conversations practice karo',
  'feature.boardRoom': 'Board Room', 'feature.boardRoomDesc': 'AI advisors se advice lo',
  'error.loginFailed': 'Login nahi hua.', 'error.signupFailed': 'Signup nahi hua.',
  'error.profileFailed': 'Profile save nahi hui.', 'error.networkError': 'Network problem hai.',
  'error.unauthorized': 'Login nahi ho.', 'error.notFound': 'Page nahi mila',
}

const translations: Record<Language, TranslationKeys> = { en, hi, hinglish }

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  loading: boolean
}

const I18nContext = createContext<I18nContextType>({
  language: 'hinglish',
  setLanguage: () => {},
  t: (key: string) => key,
  loading: false,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('hinglish')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLanguage() {
      if (!supabaseClient) { setLoading(false); return }
      try {
        const { data: { user } } = await supabaseClient.auth.getUser()
        if (user) {
          const { data } = await supabaseClient
            .from('settings')
            .select('language')
            .eq('user_id', user.id)
            .maybeSingle()
          if (data?.language && ['en', 'hi', 'hinglish'].includes(data.language)) {
            setLanguageState(data.language as Language)
          }
        }
      } catch (err) { console.error('Error loading language:', err) }
      setLoading(false)
    }
    loadLanguage()
  }, [])

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang)
    if (supabaseClient) {
      try {
        const { data: { user } } = await supabaseClient.auth.getUser()
        if (user) {
          await supabaseClient
            .from('settings')
            .upsert({ user_id: user.id, language: lang, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
        }
      } catch (err) { console.error('Error saving language:', err) }
    }
  }, [])

  const t = useCallback((key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key
  }, [language])

  return React.createElement(
    I18nContext.Provider,
    { value: { language, setLanguage, t, loading } },
    children
  )
}

export function useI18n() {
  return useContext(I18nContext)
}