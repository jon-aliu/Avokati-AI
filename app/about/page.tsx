import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Avokati AI',
  description: 'Learn more about Avokati AI and how we\'re transforming legal services with artificial intelligence.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
            About Avokati AI
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <p className="text-xl text-gray-600 leading-relaxed">
                Empowering legal professionals and individuals with cutting-edge AI technology
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Founded in 2024, Avokati AI was born from the vision to democratize legal services.
                  We recognized that legal assistance was often inaccessible due to high costs,
                  complex jargon, and limited availability.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By combining advanced artificial intelligence with legal expertise, we&apos;ve created
                  a platform that makes legal guidance available to everyone, everywhere, at any time.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Technology</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Our AI is trained on extensive legal databases, case law, and statutes from
                  multiple jurisdictions. We use state-of-the-art natural language processing
                  to understand complex legal questions and provide accurate, context-aware responses.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Every response is validated by our legal review system to ensure accuracy
                  and reliability before being delivered to users.
                </p>
              </div>
            </div>

            <div className="border-t pt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Why Choose Avokati AI?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Lightning Fast</h3>
                  <p className="text-gray-600 text-sm">
                    Get instant answers to legal questions instead of waiting days or weeks.
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Cost Effective</h3>
                  <p className="text-gray-600 text-sm">
                    Affordable legal assistance without the high costs of traditional legal services.
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Always Available</h3>
                  <p className="text-gray-600 text-sm">
                    24/7 access to legal assistance whenever you need it, from anywhere in the world.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Our Impact</h2>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <p className="text-gray-600 text-sm">Legal questions answered</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                <p className="text-gray-600 text-sm">Documents analyzed</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                <p className="text-gray-600 text-sm">Countries served</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">99%</div>
                <p className="text-gray-600 text-sm">User satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}