import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Avokati AI',
  description: 'Stay updated with the latest legal technology insights, AI developments, and legal industry news from Avokati AI.',
}

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'The Future of Legal AI: How Technology is Transforming Law Practice',
      excerpt: 'Explore how artificial intelligence is revolutionizing the legal industry, from document analysis to predictive case outcomes.',
      date: 'October 15, 2024',
      readTime: '5 min read',
      category: 'Legal Technology'
    },
    {
      id: 2,
      title: 'Understanding Your Rights: A Guide to Consumer Protection Laws',
      excerpt: 'Learn about key consumer protection laws that affect your daily life and how AI can help you navigate them.',
      date: 'October 10, 2024',
      readTime: '7 min read',
      category: 'Legal Education'
    },
    {
      id: 3,
      title: 'Privacy in the Digital Age: GDPR and Data Protection',
      excerpt: 'A comprehensive guide to understanding GDPR compliance and how to protect your personal data online.',
      date: 'October 5, 2024',
      readTime: '6 min read',
      category: 'Privacy & Data'
    },
    {
      id: 4,
      title: 'Contract Review Made Easy: How AI is Changing Document Analysis',
      excerpt: 'Discover how artificial intelligence is streamlining contract review processes for businesses and individuals.',
      date: 'September 28, 2024',
      readTime: '4 min read',
      category: 'Business Law'
    },
    {
      id: 5,
      title: 'The Rise of Legal Tech Startups: Innovation in the Legal Industry',
      excerpt: 'An overview of emerging legal technology companies and their impact on traditional legal services.',
      date: 'September 20, 2024',
      readTime: '8 min read',
      category: 'Industry Trends'
    },
    {
      id: 6,
      title: 'Remote Work Legal Considerations: What Employers Need to Know',
      excerpt: 'Essential legal considerations for companies implementing remote work policies in the post-pandemic era.',
      date: 'September 15, 2024',
      readTime: '6 min read',
      category: 'Employment Law'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Avokati AI Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Insights, updates, and expert analysis on legal technology, AI innovation, and the future of law
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                      Read More →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Stay Updated
              </h2>
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter for the latest legal tech insights and updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-4 gap-6 text-center">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-blue-600 mb-1">50+</div>
              <p className="text-gray-600 text-sm">Articles Published</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600 mb-1">10K+</div>
              <p className="text-gray-600 text-sm">Monthly Readers</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-purple-600 mb-1">25+</div>
              <p className="text-gray-600 text-sm">Expert Contributors</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-orange-600 mb-1">95%</div>
              <p className="text-gray-600 text-sm">Reader Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}