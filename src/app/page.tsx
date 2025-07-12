import Link from "next/link";
import {
  Users,
  Receipt,
  DollarSign,
  Smartphone,
  Shield,
  Clock,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">SplitBill</h1>
            </div>
            <nav className="flex space-x-8">
              <Link
                href="/auth/signin"
                className="text-gray-500 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Split Bills Made Simple
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Traveling with friends? Going out for dinner? No more awkward money
            conversations. Track shared expenses and settle up with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Splitting
            </Link>
            <Link
              href="#features"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Create a Group</h4>
              <p className="text-gray-600">
                Start by creating a group for your trip, dinner, or any shared
                activity. Invite friends using a simple invite code.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Receipt className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Track Expenses</h4>
              <p className="text-gray-600">
                Add expenses as they happen. Whether it's accommodation, food,
                transport, or activities - we'll keep track of everything.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Settle Up</h4>
              <p className="text-gray-600">
                At the end, see who owes whom and how much. No more mental math
                - we calculate the most efficient way to settle up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose SplitBill?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Smartphone className="h-12 w-12 text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Easy to Use</h4>
              <p className="text-gray-600">
                Simple, intuitive interface that makes splitting bills
                effortless. No complicated setup or confusing menus.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Shield className="h-12 w-12 text-green-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Secure & Private</h4>
              <p className="text-gray-600">
                Your financial data is protected with bank-level security. We
                never store payment information.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Clock className="h-12 w-12 text-purple-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Real-time Updates</h4>
              <p className="text-gray-600">
                Everyone in the group sees updates instantly. No more confusion
                about who paid what.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Perfect For
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-lg p-6 mb-4">
                <h4 className="text-lg font-semibold text-blue-800">
                  🏖️ Travel
                </h4>
              </div>
              <p className="text-gray-600">
                Hotels, flights, meals, and activities - keep track of all
                travel expenses
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-lg p-6 mb-4">
                <h4 className="text-lg font-semibold text-green-800">
                  🍽️ Dining
                </h4>
              </div>
              <p className="text-gray-600">
                Group dinners, takeout orders, and restaurant bills made simple
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-lg p-6 mb-4">
                <h4 className="text-lg font-semibold text-purple-800">
                  🏠 Roommates
                </h4>
              </div>
              <p className="text-gray-600">
                Utilities, groceries, and shared household expenses
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-lg p-6 mb-4">
                <h4 className="text-lg font-semibold text-yellow-800">
                  🎉 Events
                </h4>
              </div>
              <p className="text-gray-600">
                Party planning, group gifts, and event expenses
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Start Splitting?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of people who've simplified their shared expenses
          </p>
          <Link
            href="/auth/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Receipt className="h-6 w-6 text-blue-400 mr-2" />
                <h4 className="text-lg font-semibold">SplitBill</h4>
              </div>
              <p className="text-gray-400">
                Making shared expenses simple and transparent.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SplitBill. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
