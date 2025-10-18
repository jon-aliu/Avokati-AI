import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Company | Avokati AI',
  description: 'Learn about Avokati AI, our mission, vision, and the team behind the legal AI platform.',
}

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
            About Avokati AI
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At Avokati AI, we are revolutionizing legal services by combining artificial intelligence
              with human expertise. Our mission is to make legal assistance accessible, affordable,
              and efficient for everyone, regardless of their location or financial situation.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We envision a world where legal guidance is available 24/7, where complex legal
              questions can be answered instantly, and where the power of AI enhances rather than
              replaces human legal professionals.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">AI-Powered Legal Assistance</h3>
                <p className="text-gray-600 text-sm">
                  Our advanced AI analyzes legal documents, provides instant answers to common
                  legal questions, and helps users understand their rights and obligations.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Document Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Upload contracts, agreements, or legal documents and receive detailed analysis
                  with key insights, potential risks, and recommendations.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Legal Research</h3>
                <p className="text-gray-600 text-sm">
                  Access comprehensive legal research tools powered by AI to find relevant
                  case law, statutes, and legal precedents.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Multilingual Support</h3>
                <p className="text-gray-600 text-sm">
                  Get legal assistance in multiple languages, breaking down language barriers
                  in legal services worldwide.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Accuracy</h3>
                <p className="text-gray-600 text-sm">
                  We prioritize accuracy and reliability in all our AI responses and legal analysis.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Privacy</h3>
                <p className="text-gray-600 text-sm">
                  Your legal matters are confidential. We employ bank-level security to protect your data.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Accessibility</h3>
                <p className="text-gray-600 text-sm">
                  Legal services should be accessible to everyone. We're breaking down barriers worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}