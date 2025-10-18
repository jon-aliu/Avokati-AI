import Link from 'next/link'
import { 
  HiHeart, 
  HiMail, 
  HiBriefcase, 
  HiShieldCheck,
  HiDocumentText,
} from 'react-icons/hi'
import { Language } from '@/lib/i18n'

interface FooterProps {
  language: Language
}

export function Footer({ language }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: {
      title: language === 'en' ? 'Product' : 'Produkti',
      links: [
        { label: 'Chat', href: '/chat' },
        { label: language === 'en' ? 'Pricing' : 'Çmimet', href: '/pricing' },
        { label: language === 'en' ? 'Documentation' : 'Dokumentacioni', href: '#' },
      ],
    },
    company: {
      title: language === 'en' ? 'Company' : 'Kompania',
      links: [
        { label: language === 'en' ? 'About' : 'Rreth', href: '#' },
        { label: language === 'en' ? 'Blog' : 'Blogu', href: '#' },
        { label: language === 'en' ? 'Contact' : 'Kontakt', href: '#' },
      ],
    },
    legal: {
      title: language === 'en' ? 'Legal' : 'Ligjore',
      links: [
        { label: language === 'en' ? 'Privacy' : 'Privatësia', href: '/legal-disclaimer' },
        { label: language === 'en' ? 'Terms' : 'Termat', href: '/legal-disclaimer' },
        { label: language === 'en' ? 'Disclaimer' : 'Mohim Përgjegjësie', href: '/legal-disclaimer' },
      ],
    },
  }

  return (
    <footer className="border-t border-slate-800/50 glass-sm mt-auto">
      <div className="container-custom py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display text-lg font-bold gradient-text">
                Avokati AI
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              {language === 'en'
                ? 'AI-powered legal assistant for Kosovo law'
                : 'Asistent juridik i bazuar në AI për ligjin e Kosovës'}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
                aria-label="Twitter"
              >
                <HiBriefcase className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
                aria-label="Email"
              >
                <HiMail className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
                aria-label="Documentation"
              >
                <HiDocumentText className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>
            © {currentYear} Avokati AI.{' '}
            {language === 'en' ? 'All rights reserved.' : 'Të gjithë të drejtat e ruajtura.'}
          </p>
          <p className="flex items-center gap-1">
            {language === 'en' ? 'Built with' : 'Ndërtuar me'}{' '}
            <HiHeart className="h-4 w-4 text-red-500" />{' '}
            {language === 'en' ? 'for Kosovo' : 'për Kosovën'}
          </p>
        </div>
      </div>
    </footer>
  )
}
