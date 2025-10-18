'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  HiSparkles, 
  HiBookOpen, 
  HiSearch, 
  HiCheckCircle,
  HiShieldCheck,
  HiLightningBolt,
  HiGlobe,
  HiArrowRight,
  HiStar,
} from 'react-icons/hi'
import { HiUsers } from 'react-icons/hi2'
import { Language } from '@/lib/i18n'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('al')

  const content = {
    en: {
      hero_title: 'Legal Intelligence',
      hero_title_highlight: 'Powered by AI',
      hero_subtitle: 'Get instant, accurate answers about Kosovo laws. Our AI system retrieves official law documents and provides cited answers in seconds.',
      hero_cta_primary: 'Start Asking Free',
      hero_cta_secondary: 'View Demo',
      
      features_title: 'Why Avokati AI',
      features_subtitle: 'The smarter way to understand Kosovo law',
      
      stats_laws: '10,000+',
      stats_laws_label: 'Legal Articles',
      stats_uptime: '< 2s',
      stats_uptime_label: 'Response Time',
      stats_free: '24/7',
      stats_free_label: 'Always Available',
    },
    al: {
      hero_title: 'Inteligjenca Juridike',
      hero_title_highlight: 'me Fuqinë të AI',
      hero_subtitle: 'Merrni përgjigje të menjëhershme dhe të sakta rreth ligjeve të Kosovës. Sistemi ynë AI rimartë dokumente ligjesh zyrtare dhe jep përgjigje të citimet në sekonda.',
      hero_cta_primary: 'Filloni Falas',
      hero_cta_secondary: 'Shikoni Demo',
      
      features_title: 'Pse Avokati AI',
      features_subtitle: 'Mënyra më e zgjuar për të kuptuar ligjin e Kosovës',
      
      stats_laws: '10,000+',
      stats_laws_label: 'Nene Ligjore',
      stats_uptime: '< 2s',
      stats_uptime_label: 'Kohë Përgjigjeje',
      stats_free: '24/7',
      stats_free_label: 'Gjithmonë i Disponueshëm',
    },
  }

  const current = content[language]

  const features = [
    {
      icon: <HiBookOpen className="w-6 h-6" />,
      title: language === 'en' ? 'Official Sources' : 'Burime Zyrtare',
      description: language === 'en' ? 'Powered by 50+ official Kosovo laws and regulations' : 'Ndërtuar mbi 50+ ligje dhe rregullore zyrtare të Kosovës',
      badge: 'Database',
    },
    {
      icon: <HiSearch className="w-6 h-6" />,
      title: language === 'en' ? 'Instant Answers' : 'Përgjigje Menjëherë',
      description: language === 'en' ? 'Get accurate legal information in seconds' : 'Merrni informacion juridik të saktë në sekonda',
      badge: 'AI',
    },
    {
      icon: <HiCheckCircle className="w-6 h-6" />,
      title: language === 'en' ? 'Fully Cited' : 'Plotësisht Cituar',
      description: language === 'en' ? 'Every answer links to official law sources' : 'Çdo përgjigje lidhet me burimet zyrtare të ligjit',
      badge: 'Verified',
    },
    {
      icon: <HiShieldCheck className="w-6 h-6" />,
      title: language === 'en' ? 'Always Accurate' : 'Gjithmonë i Saktë',
      description: language === 'en' ? 'AI grounded in verified legal documents' : 'AI i bazuar në dokumentet juridike të verifikuara',
      badge: 'Accurate',
    },
    {
      icon: <HiLightningBolt className="w-6 h-6" />,
      title: language === 'en' ? 'Lightning Fast' : 'Jashtëzakonisht i Shpejtë',
      description: language === 'en' ? '99.9% uptime with sub-second response times' : 'Garantim 99.9% kohëzgjatjeje pune me përgjigje të shpejtë',
      badge: 'Fast',
    },
    {
      icon: <HiGlobe className="w-6 h-6" />,
      title: language === 'en' ? 'Bilingual' : 'Dygjuhësh',
      description: language === 'en' ? 'Seamless Albanian & English support' : 'Mbështetje e padiskutueshme në Shqip & Anglisht',
      badge: 'Bilingual',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar language={language} onLanguageChange={setLanguage} />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <Badge variant="primary" className="text-sm px-4 py-2">
                <HiSparkles className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Powered by RAG AI' : 'Fuqizuar nga RAG AI'}
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6"
            >
              {current.hero_title}
              <br />
              <span className="gradient-text">{current.hero_title_highlight}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto"
            >
              {current.hero_subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/chat">
                <Button size="lg" icon={<HiSparkles />} className="w-full sm:w-auto">
                  {current.hero_cta_primary}
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" icon={<HiArrowRight />} className="w-full sm:w-auto">
                  {current.hero_cta_secondary}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          >
            {[
              { 
                number: current.stats_laws, 
                label: current.stats_laws_label,
                icon: <HiBookOpen className="h-8 w-8" />,
                color: 'from-cyan-500 to-blue-500',
                bgGlow: 'bg-cyan-500/10',
                borderGlow: 'border-cyan-500/30'
              },
              { 
                number: current.stats_uptime, 
                label: current.stats_uptime_label,
                icon: <HiCheckCircle className="h-8 w-8" />,
                color: 'from-emerald-500 to-green-500',
                bgGlow: 'bg-emerald-500/10',
                borderGlow: 'border-emerald-500/30'
              },
              { 
                number: current.stats_free, 
                label: current.stats_free_label,
                icon: <HiSparkles className="h-8 w-8" />,
                color: 'from-purple-500 to-pink-500',
                bgGlow: 'bg-purple-500/10',
                borderGlow: 'border-purple-500/30'
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 rounded-2xl`} />
                
                {/* Card */}
                <div className={`relative glass-heavy border ${stat.borderGlow} rounded-2xl p-8 transition-all duration-300 group-hover:border-opacity-60`}>
                  {/* Icon with Gradient Background */}
                  <div className="mb-6 relative inline-block">
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} blur-lg opacity-50 group-hover:opacity-75 transition-opacity rounded-xl`} />
                    <div className={`relative ${stat.bgGlow} p-4 rounded-xl bg-gradient-to-r ${stat.color} bg-clip-text`}>
                      <div className={`text-transparent bg-gradient-to-r ${stat.color} bg-clip-text`}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>

                  {/* Number with Counter Animation */}
                  <div className="mb-3">
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + 0.2, type: "spring", stiffness: 200 }}
                      className={`text-5xl md:text-6xl font-display font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    >
                      {stat.number}
                    </motion.div>
                  </div>

                  {/* Label */}
                  <p className="text-base font-medium text-slate-300 group-hover:text-white transition-colors">
                    {stat.label}
                  </p>

                  {/* Decorative Line */}
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.4, duration: 0.6 }}
                    className={`h-1 bg-gradient-to-r ${stat.color} rounded-full mt-6 opacity-30 group-hover:opacity-60 transition-opacity`}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Accent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 glass-sm rounded-full px-6 py-3 border border-slate-700/30">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-sm text-slate-300">
                {language === 'en' ? 'All systems operational' : 'Të gjitha sistemet operative'}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container-custom">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{current.features_title}</span>
            </h2>
            <p className="text-lg text-slate-400">{current.features_subtitle}</p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="premium" hover>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400">
                        {feature.icon}
                      </div>
                      <Badge variant="primary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-400">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 section-gradient">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Card variant="premium" className="text-center border-cyan-500/20">
              <CardContent className="py-12">
                <HiSparkles className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {language === 'en' ? 'Start Your Free Legal Research' : 'Filloni Kërkimin Tuaj Juridik Falas'}
                </h2>
                <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                  {language === 'en' 
                    ? 'No credit card required. No signup needed. Just ask.' 
                    : 'Nuk kërkohet kartë krediti. Nuk kërkohet regjistrim. Thjesht pyesni.'}
                </p>
                <Link href="/chat">
                  <Button size="xl" icon={<HiSparkles />}>
                    {language === 'en' ? 'Start Free Today' : 'Filloni Falas Sot'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">
                {language === 'en' ? 'How It Works' : 'Si Funksionon'}
              </span>
            </h2>
            <p className="text-lg text-slate-400">
              {language === 'en' 
                ? 'Get answers in three simple steps' 
                : 'Merrni përgjigje në tre hapa të thjeshtë'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                icon: <HiSearch className="w-8 h-8" />,
                title: language === 'en' ? 'Ask Your Question' : 'Bëni Pyetjen',
                description: language === 'en' 
                  ? 'Type your legal question in plain Albanian or English' 
                  : 'Shkruani pyetjen tuaj juridike në shqip ose anglisht',
              },
              {
                step: '2',
                icon: <HiLightningBolt className="w-8 h-8" />,
                title: language === 'en' ? 'AI Searches Laws' : 'AI Kërkon Ligjet',
                description: language === 'en' 
                  ? 'Our AI instantly searches through 50+ Kosovo laws' 
                  : 'AI ynë kërkon menjëherë në 50+ ligje të Kosovës',
              },
              {
                step: '3',
                icon: <HiCheckCircle className="w-8 h-8" />,
                title: language === 'en' ? 'Get Cited Answer' : 'Merrni Përgjigje të Cituar',
                description: language === 'en' 
                  ? 'Receive accurate answers with official law citations' 
                  : 'Merrni përgjigje të sakta me citime të ligjeve zyrtare',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <Card variant="premium" hover>
                  <CardContent className="pt-6 pb-6 text-center">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {item.step}
                    </div>
                    <div className="mt-4 mb-4 flex justify-center text-cyan-400">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 section-gradient">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">
                {language === 'en' ? 'What Our Users Say' : 'Çfarë Thonë Përdoruesit'}
              </span>
            </h2>
            <p className="text-lg text-slate-400">
              {language === 'en' 
                ? 'Trusted by legal professionals across Kosovo' 
                : 'Besuar nga profesionistë juridikë në të gjithë Kosovën'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: language === 'en' 
                  ? 'Avokati AI has revolutionized how I research Kosovo law. What used to take hours now takes seconds.' 
                  : 'Avokati AI ka revolucionarizuar mënyrën se si kërkoj ligjin e Kosovës. Ajo që dikur merrte orë tani merr sekonda.',
                author: 'Sara Kelmendi',
                role: language === 'en' ? 'Legal Consultant' : 'Konsultore Juridike',
                rating: 5,
              },
              {
                quote: language === 'en' 
                  ? 'The accuracy and speed of Avokati AI is incredible. Every answer comes with official citations.' 
                  : 'Saktësia dhe shpejtësia e Avokati AI është e jashtëzakonshme. Çdo përgjigje vjen me citime zyrtare.',
                author: 'Dr. Besnik Krasniqi',
                role: language === 'en' ? 'Law Professor' : 'Profesor i Drejtësisë',
                rating: 5,
              },
              {
                quote: language === 'en' 
                  ? 'As a business owner, I can now quickly check legal requirements without expensive consultations.' 
                  : 'Si pronar biznesi, tani mund të kontrolloj shpejt kërkesat juridike pa konsultime të shtrenjta.',
                author: 'Arben Dervishi',
                role: language === 'en' ? 'Business Owner' : 'Pronar Biznesi',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="premium" hover>
                  <CardContent className="p-6">
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <HiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-300 italic mb-4 leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div className="pt-4 border-t border-slate-700/50">
                      <p className="font-semibold text-white">{testimonial.author}</p>
                      <p className="text-sm text-slate-400">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">
                {language === 'en' ? 'Frequently Asked Questions' : 'Pyetjet e Shpeshta'}
              </span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: language === 'en' ? 'Is Avokati AI really free?' : 'A është Avokati AI vërtetë falas?',
                a: language === 'en' 
                  ? 'Yes! You can ask 3 questions for free. After that, you can create a free account to continue using our service.' 
                  : 'Po! Mund të bëni 3 pyetje falas. Pas kësaj, mund të krijoni një llogari falas për të vazhduar përdorimin e shërbimit tonë.',
              },
              {
                q: language === 'en' ? 'How accurate are the answers?' : 'Sa të sakta janë përgjigjet?',
                a: language === 'en' 
                  ? 'Our AI is trained on official Kosovo laws and provides answers with direct citations. However, we recommend consulting a lawyer for complex legal matters.' 
                  : 'AI ynë është trajnuar në ligjet zyrtare të Kosovës dhe jep përgjigje me citime të drejtpërdrejta. Megjithatë, rekomandojmë konsultim me një avokat për çështje komplekse juridike.',
              },
              {
                q: language === 'en' ? 'Can I save my chat history?' : 'A mund të ruaj historikun e bisedës?',
                a: language === 'en' 
                  ? 'Yes! Create a free account to save all your chats, share them, and access them from any device.' 
                  : 'Po! Krijoni një llogari falas për të ruajtur të gjitha bisedat tuaja, për t\'i ndarë dhe për t\'u qasur në to nga çdo pajisje.',
              },
              {
                q: language === 'en' ? 'Which laws are included?' : 'Cilat ligje janë të përfshira?',
                a: language === 'en' 
                  ? 'We cover 50+ official Kosovo laws including labor law, business law, environmental law, digital rights, and more.' 
                  : 'Ne mbulojmë 50+ ligje zyrtare të Kosovës duke përfshirë ligjin e punës, ligjin e biznesit, ligjin mjedisor, të drejtat digjitale dhe më shumë.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="hover:border-cyan-500/30 transition-all">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                    <p className="text-slate-400">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 section-gradient">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Card variant="premium" className="text-center border-cyan-500/20">
              <CardContent className="py-12">
                <HiSparkles className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {language === 'en' ? 'Ready to Get Started?' : 'Gati për të Filluar?'}
                </h2>
                <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                  {language === 'en' 
                    ? 'Join thousands of users who trust Avokati AI for their legal questions.' 
                    : 'Bashkohuni me mijëra përdorues që i besojnë Avokati AI për pyetjet e tyre juridike.'}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/chat">
                    <Button size="xl" icon={<HiSparkles />}>
                      {language === 'en' ? 'Try 3 Questions Free' : 'Provoni 3 Pyetje Falas'}
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="xl" variant="outline">
                      {language === 'en' ? 'Create Account' : 'Krijoni Llogari'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer language={language} />
    </div>
  )
}
