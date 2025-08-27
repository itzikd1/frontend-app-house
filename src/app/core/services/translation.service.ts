import { Injectable, effect, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

export type Language = 'en' | 'he';

export interface TranslationKey {
  [key: string]: {
    en: string;
    he: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = signal<Language>('en');
  currentLanguage$ = this.currentLanguage.asReadonly();

  private translations: TranslationKey = {
    // Navigation
    DASHBOARD: {
      en: 'Dashboard',
      he: 'לוח בקרה'
    },
    TASKS: {
      en: 'Tasks',
      he: 'משימות'
    },
    FAMILY: {
      en: 'Family',
      he: 'משפחה'
    },
    VEHICLES: {
      en: 'Vehicles',
      he: 'רכבים'
    },
    RECIPES: {
      en: 'Recipes',
      he: 'מתכונים'
    },
    PROFILE: {
      en: 'Profile',
      he: 'פרופיל'
    },
    SETTINGS: {
      en: 'Settings',
      he: 'הגדרות'
    },
    LANGUAGE: {
      en: 'Language',
      he: 'שפה'
    },
    ENGLISH: {
      en: 'English',
      he: 'אנגלית'
    },
    HEBREW: {
      en: 'Hebrew',
      he: 'עברית'
    },
    HOUSE_MANAGER: {
      en: 'House Manager',
      he: 'מנהל משק בית'
    },
    
    // Common
    SAVE: {
      en: 'Save',
      he: 'שמור'
    },
    CANCEL: {
      en: 'Cancel',
      he: 'ביטול'
    },
    EDIT: {
      en: 'Edit',
      he: 'ערוך'
    },
    DELETE: {
      en: 'Delete',
      he: 'מחק'
    },
    ADD: {
      en: 'Add',
      he: 'הוסף'
    },
    
    // Accessibility
    SELECT_LANGUAGE: {
      en: 'Select language',
      he: 'בחירת שפה'
    },
    CURRENT_LANGUAGE: {
      en: 'Current language',
      he: 'שפה נוכחית'
    },
    SET_LANGUAGE_TO_ENGLISH: {
      en: 'Set language to English',
      he: 'החלף שפה לאנגלית'
    },
    SET_LANGUAGE_TO_HEBREW: {
      en: 'Set language to Hebrew',
      he: 'החלף שפה לעברית'
    },
    LIGHT_THEME: {
      en: 'Light theme',
      he: 'ערכת נושא בהירה'
    },
    DARK_THEME: {
      en: 'Dark theme',
      he: 'ערכת נושא כהה'
    },
    SWITCH_TO: {
      en: 'Switch to',
      he: 'החלף ל'
    },
    PROFILE_MENU: {
      en: 'Profile menu',
      he: 'תפריט פרופיל'
    },
    OPEN_PROFILE_MENU: {
      en: 'Open profile menu',
      he: 'פתח תפריט פרופיל'
    },
    TOGGLE_NAVIGATION: {
      en: 'Toggle navigation menu',
      he: 'הצג/הסתר תפריט ניווט'
    },
    OPEN_MENU: {
      en: 'Open menu',
      he: 'פתח תפריט'
    },
    CLOSE_MENU: {
      en: 'Close menu',
      he: 'סגור תפריט'
    },
    SKIP_TO_MAIN_CONTENT: {
      en: 'Skip to main content',
      he: 'דלג לתוכן הראשי'
    },
    
    // Auth
    LOGIN: {
      en: 'Login',
      he: 'התחברות'
    },
    LOGOUT: {
      en: 'Logout',
      he: 'התנתקות'
    },
    EMAIL: {
      en: 'Email',
      he: 'אימייל'
    },
    PASSWORD: {
      en: 'Password',
      he: 'סיסמה'
    },
    
    // Dashboard
    WELCOME: {
      en: 'Welcome back',
      he: 'ברוך שובך'
    },
    RECENT_ACTIVITY: {
      en: 'Recent Activity',
      he: 'פעילות אחרונה'
    },
    UPCOMING_TASKS: {
      en: 'Upcoming Tasks',
      he: 'משימות קרובות'
    },
    
    // Tasks
    DUE_DATE: {
      en: 'Due Date',
      he: 'תאריך יעד'
    },
    PRIORITY: {
      en: 'Priority',
      he: 'עדיפות'
    },
    STATUS: {
      en: 'Status',
      he: 'סטטוס'
    },
    
    // Family
    FAMILY_MEMBERS: {
      en: 'Family Members',
      he: 'בני משפחה'
    },
    ADD_FAMILY_MEMBER: {
      en: 'Add Family Member',
      he: 'הוסף בן משפחה'
    },
    
    // Vehicles
    VEHICLE: {
      en: 'Vehicle',
      he: 'רכב'
    },
    MAKE: {
      en: 'Make',
      he: 'יצרן'
    },
    MODEL: {
      en: 'Model',
      he: 'דגם'
    },
    YEAR: {
      en: 'Year',
      he: 'שנה'
    },
    LICENSE_PLATE: {
      en: 'License Plate',
      he: 'מספר רישוי'
    },
    
    // Recipes
    INGREDIENTS: {
      en: 'Ingredients',
      he: 'מרכיבים'
    },
    INSTRUCTIONS: {
      en: 'Instructions',
      he: 'הוראות הכנה'
    },
    PREP_TIME: {
      en: 'Prep Time',
      he: 'זמן הכנה'
    },
    COOK_TIME: {
      en: 'Cook Time',
      he: 'זמן בישול'
    },
    SERVINGS: {
      en: 'Servings',
      he: 'מנות'
    },
    
    // Profile
    FIRST_NAME: {
      en: 'First Name',
      he: 'שם פרטי'
    },
    LAST_NAME: {
      en: 'Last Name',
      he: 'שם משפחה'
    },
    PHONE: {
      en: 'Phone',
      he: 'טלפון'
    },
    ADDRESS: {
      en: 'Address',
      he: 'כתובת'
    },
    
    // Settings
    THEME: {
      en: 'Theme',
      he: 'ערכת נושא'
    },
    NOTIFICATIONS: {
      en: 'Notifications',
      he: 'התראות'
    },
    PRIVACY: {
      en: 'Privacy',
      he: 'פרטיות'
    },
    ACCOUNT: {
      en: 'Account',
      he: 'חשבון'
    },
    
    // Common Statuses
    ACTIVE: {
      en: 'Active',
      he: 'פעיל'
    },
    INACTIVE: {
      en: 'Inactive',
      he: 'לא פעיל'
    },
    COMPLETED: {
      en: 'Completed',
      he: 'הושלם'
    },
    PENDING: {
      en: 'Pending',
      he: 'ממתין'
    },
    
    // Priorities
    LOW: {
      en: 'Low',
      he: 'נמוכה'
    },
    MEDIUM: {
      en: 'Medium',
      he: 'בינונית'
    },
    HIGH: {
      en: 'High',
      he: 'גבוהה'
    },
    URGENT: {
      en: 'Urgent',
      he: 'דחוף'
    },
    
    // Confirmation
    ARE_YOU_SURE: {
      en: 'Are you sure?',
      he: 'האם אתה בטוח?'
    },
    THIS_ACTION_CANNOT_BE_UNDONE: {
      en: 'This action cannot be undone.',
      he: 'לא ניתן לבטל פעולה זו.'
    },
    
    // Errors
    REQUIRED_FIELD: {
      en: 'This field is required',
      he: 'שדה חובה'
    },
    INVALID_EMAIL: {
      en: 'Please enter a valid email address',
      he: 'נא להזין כתובת אימייל תקינה'
    },
    PASSWORD_TOO_SHORT: {
      en: 'Password must be at least 6 characters',
      he: 'הסיסמה חייבת להכיל לפחות 6 תווים'
    }
  };

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    
    // Save to localStorage for persistence
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('userLanguage', lang);
    }
  }

  getTranslation(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[this.currentLanguage()] || key;
  }
  
  // Alias for getTranslation for use in templates
  translate(key: string): string {
    return this.getTranslation(key);
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage();
  }
  
  // For compatibility with ngx-translate
  get(key: string | string[], interpolateParams?: any): string | any {
    if (Array.isArray(key)) {
      return key.map(k => this.getTranslation(k));
    }
    return this.getTranslation(key);
  }
  
  // For compatibility with ngx-translate
  instant(key: string | string[], interpolateParams?: any): string | any {
    return this.get(key, interpolateParams);
  }
  
  // For compatibility with ngx-translate
  get onLangChange(): Observable<{ lang: Language; translations: any }> {
    return new Observable(subscriber => {
      // Emit initial value
      subscriber.next({ 
        lang: this.currentLanguage(), 
        translations: this.translations 
      });
      
      // Create an effect to watch for language changes
      const effectRef = effect(() => {
        const lang = this.currentLanguage();
        subscriber.next({ lang, translations: this.translations });
      });
      
      // Cleanup function
      return () => effectRef.destroy();
    });
  }
  
  // For compatibility with ngx-translate
  use(lang: string): Observable<any> {
    if (lang === 'en' || lang === 'he') {
      this.setLanguage(lang);
    }
    return of({});
  }
}
