export type Language = 'en' | 'al'

export interface Translation {
  // Navigation
  'nav.home': string
  'nav.chat': string
  'nav.pricing': string
  'nav.signin': string
  'nav.signup': string
  'nav.try_free': string

  // Hero
  'hero.title': string
  'hero.subtitle': string
  'hero.cta_primary': string
  'hero.cta_secondary': string

  // Features
  'features.title': string
  'features.subtitle': string
  'features.official_sources': string
  'features.official_sources_desc': string
  'features.instant_answers': string
  'features.instant_answers_desc': string
  'features.fully_cited': string
  'features.fully_cited_desc': string

  // Chat
  'chat.title': string
  'chat.subtitle': string
  'chat.placeholder': string
  'chat.send': string
  'chat.thinking': string
  'chat.sources': string
  'chat.confidence': string
  'chat.error': string
  'chat.db_not_init': string
  'chat.backend_error': string
  'chat.welcome': string
  'chat.welcome_desc': string

  // Common
  'common.loading': string
  'common.error': string
  'common.success': string
  'common.dismiss': string
  'common.learn_more': string
  'common.get_started': string
}

const translations: Record<Language, Translation> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.chat': 'Chat',
    'nav.pricing': 'Pricing',
    'nav.signin': 'Sign In',
    'nav.signup': 'Sign Up',
    'nav.try_free': 'Try Free',

    // Hero
    'hero.title': 'Legal Intelligence Powered by AI',
    'hero.subtitle': 'Get instant, accurate answers about Kosovo laws. Our AI system retrieves official law documents and provides cited answers in seconds.',
    'hero.cta_primary': 'Start Asking Free',
    'hero.cta_secondary': 'View Demo',

    // Features
    'features.title': 'Why Avokati AI',
    'features.subtitle': 'The smarter way to understand Kosovo law',
    'features.official_sources': 'Official Sources',
    'features.official_sources_desc': 'Powered by 50+ official Kosovo laws and regulations',
    'features.instant_answers': 'Instant Answers',
    'features.instant_answers_desc': 'Get accurate legal information in seconds',
    'features.fully_cited': 'Fully Cited',
    'features.fully_cited_desc': 'Every answer links to official law sources',

    // Chat
    'chat.title': 'Avokati AI',
    'chat.subtitle': 'Your AI Legal Assistant',
    'chat.placeholder': 'Ask a question about Kosovo law...',
    'chat.send': 'Send',
    'chat.thinking': 'Thinking...',
    'chat.sources': 'Sources',
    'chat.confidence': 'Confidence',
    'chat.error': 'An error occurred. Please try again.',
    'chat.db_not_init': 'Database not initialized. Please contact support.',
    'chat.backend_error': 'Cannot connect to backend. Please try again later.',
    'chat.welcome': 'Welcome to Avokati AI',
    'chat.welcome_desc': 'Ask questions about Kosovo laws and get AI-powered answers with citations.',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.dismiss': 'Dismiss',
    'common.learn_more': 'Learn More',
    'common.get_started': 'Get Started',
  },
  al: {
    // Navigation
    'nav.home': 'Ballina',
    'nav.chat': 'Chat',
    'nav.pricing': 'Çmimet',
    'nav.signin': 'Hyr',
    'nav.signup': 'Regjistrohu',
    'nav.try_free': 'Provo Falas',

    // Hero
    'hero.title': 'Inteligjenca Juridike me Fuqinë të AI',
    'hero.subtitle': 'Merrni përgjigje të menjëhershme dhe të sakta rreth ligjeve të Kosovës. Sistemi ynë AI rimartë dokumente ligjesh zyrtare dhe jep përgjigje të citimet në sekonda.',
    'hero.cta_primary': 'Filloni Falas',
    'hero.cta_secondary': 'Shikoni Demo',

    // Features
    'features.title': 'Pse Avokati AI',
    'features.subtitle': 'Mënyra më e zgjuar për të kuptuar ligjin e Kosovës',
    'features.official_sources': 'Burime Zyrtare',
    'features.official_sources_desc': 'Ndërtuar mbi 50+ ligje dhe rregullore zyrtare të Kosovës',
    'features.instant_answers': 'Përgjigje Menjëherë',
    'features.instant_answers_desc': 'Merrni informacion juridik të saktë në sekonda',
    'features.fully_cited': 'Plotësisht Cituar',
    'features.fully_cited_desc': 'Çdo përgjigje lidhet me burimet zyrtare të ligjit',

    // Chat
    'chat.title': 'Avokati AI',
    'chat.subtitle': 'Asistenti Juaj Juridik AI',
    'chat.placeholder': 'Bëni një pyetje rreth ligjit të Kosovës...',
    'chat.send': 'Dërgo',
    'chat.thinking': 'Duke menduar...',
    'chat.sources': 'Burimet',
    'chat.confidence': 'Besueshmëria',
    'chat.error': 'Ndodhi një gabim. Ju lutemi provoni përsëri.',
    'chat.db_not_init': 'Baza e të dhënave nuk është inicializuar. Ju lutemi kontaktoni mbështetjen.',
    'chat.backend_error': 'Nuk mund të lidhet me backend. Ju lutemi provoni më vonë.',
    'chat.welcome': 'Mirë se vini në Avokati AI',
    'chat.welcome_desc': 'Bëni pyetje rreth ligjeve të Kosovës dhe merrni përgjigje të bazuara në AI me citim.',

    // Common
    'common.loading': 'Duke ngarkuar...',
    'common.error': 'Gabim',
    'common.success': 'Sukses',
    'common.dismiss': 'Nxirr',
    'common.learn_more': 'Mëso Më Shumë',
    'common.get_started': 'Filloni',
  },
}

export function useTranslation(language: Language) {
  return (key: keyof Translation): string => {
    return translations[language][key] || key
  }
}

export function getTranslation(language: Language, key: keyof Translation): string {
  return translations[language][key] || key
}
