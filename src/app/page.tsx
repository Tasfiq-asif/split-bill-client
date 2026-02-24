import Link from "next/link";
import {
  Receipt,
  Users,
  DollarSign,
  Smartphone,
  Shield,
  Clock,
  Plane,
  UtensilsCrossed,
  Home as HomeIcon,
  PartyPopper,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0D0F1A] text-[#F1F5F9]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0D0F1A]/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Receipt className="h-7 w-7 text-indigo-400 mr-2" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                SplitBill
              </h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link
                href="/auth/signin"
                className="text-[#94A3B8] hover:text-white transition-colors text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-28 overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full pointer-events-none blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600 rounded-full pointer-events-none blur-3xl opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center animate-fade-in">
          <h2 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Split Bills
            </span>{" "}
            Made Simple
          </h2>
          <p className="text-xl text-[#94A3B8] mb-10 max-w-3xl mx-auto leading-relaxed">
            Traveling with friends? Going out for dinner? No more awkward money
            conversations. Track shared expenses and settle up with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all cursor-pointer shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:-translate-y-0.5"
            >
              Start Splitting
            </Link>
            <Link
              href="#features"
              className="border border-white/[0.12] text-[#94A3B8] hover:text-white hover:border-white/[0.2] px-8 py-3.5 rounded-xl text-base font-semibold transition-all cursor-pointer hover:-translate-y-0.5"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#141625]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <h3 className="text-3xl font-bold text-center text-white mb-4">
            How It Works
          </h3>
          <p className="text-center text-[#94A3B8] mb-14 max-w-xl mx-auto">
            Get started in minutes with three simple steps.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8 text-center hover:-translate-y-0.5 transition-transform duration-150">
              <div className="relative inline-flex mb-6">
                <div className="bg-indigo-500/20 rounded-2xl p-4">
                  <Users className="h-8 w-8 text-indigo-400" />
                </div>
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  1
                </span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Create a Group</h4>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Start by creating a group for your trip, dinner, or any shared
                activity. Invite friends using a simple invite code.
              </p>
            </div>
            <div className="glass rounded-2xl p-8 text-center hover:-translate-y-0.5 transition-transform duration-150">
              <div className="relative inline-flex mb-6">
                <div className="bg-emerald-500/20 rounded-2xl p-4">
                  <Receipt className="h-8 w-8 text-emerald-400" />
                </div>
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  2
                </span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Track Expenses</h4>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Add expenses as they happen. Whether it&apos;s accommodation, food,
                transport, or activities — we&apos;ll keep track of everything.
              </p>
            </div>
            <div className="glass rounded-2xl p-8 text-center hover:-translate-y-0.5 transition-transform duration-150">
              <div className="relative inline-flex mb-6">
                <div className="bg-violet-500/20 rounded-2xl p-4">
                  <DollarSign className="h-8 w-8 text-violet-400" />
                </div>
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  3
                </span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Settle Up</h4>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                At the end, see who owes whom and how much. No more mental math
                — we calculate the most efficient way to settle up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-[#0D0F1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <h3 className="text-3xl font-bold text-center text-white mb-4">
            Why Choose SplitBill?
          </h3>
          <p className="text-center text-[#94A3B8] mb-14 max-w-xl mx-auto">
            Everything you need to manage shared expenses effortlessly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 hover:-translate-y-0.5 transition-transform duration-150">
              <div className="bg-[rgba(99,102,241,0.2)] rounded-xl p-3 w-fit mb-4">
                <Smartphone className="h-6 w-6 text-indigo-400" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Easy to Use</h4>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Simple, intuitive interface that makes splitting bills
                effortless. No complicated setup or confusing menus.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 hover:-translate-y-0.5 transition-transform duration-150">
              <div className="bg-emerald-500/15 rounded-xl p-3 w-fit mb-4">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Secure &amp; Private</h4>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Your financial data is protected with bank-level security. We
                never store payment information.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 hover:-translate-y-0.5 transition-transform duration-150">
              <div className="bg-violet-500/15 rounded-xl p-3 w-fit mb-4">
                <Clock className="h-6 w-6 text-violet-400" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Real-time Updates</h4>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Everyone in the group sees updates instantly. No more confusion
                about who paid what.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-[#141625]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <h3 className="text-3xl font-bold text-center text-white mb-4">
            Perfect For
          </h3>
          <p className="text-center text-[#94A3B8] mb-14 max-w-xl mx-auto">
            Whatever you&apos;re splitting, SplitBill has you covered.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass rounded-2xl p-6 text-center hover:-translate-y-0.5 transition-transform duration-150">
              <div className="bg-blue-500/15 rounded-xl p-3 w-fit mx-auto mb-4">
                <Plane className="h-6 w-6 text-blue-400" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Travel</h4>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Hotels, flights, meals, and activities — keep track of all
                travel expenses.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center hover:-translate-y-0.5 transition-transform duration-150">
              <div className="bg-orange-500/15 rounded-xl p-3 w-fit mx-auto mb-4">
                <UtensilsCrossed className="h-6 w-6 text-orange-400" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Dining</h4>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Group dinners, takeout orders, and restaurant bills made simple.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center hover:-translate-y-0.5 transition-transform duration-150">
              <div className="bg-purple-500/15 rounded-xl p-3 w-fit mx-auto mb-4">
                <HomeIcon className="h-6 w-6 text-purple-400" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Roommates</h4>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Utilities, groceries, and shared household expenses.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center hover:-translate-y-0.5 transition-transform duration-150">
              <div className="bg-amber-500/15 rounded-xl p-3 w-fit mx-auto mb-4">
                <PartyPopper className="h-6 w-6 text-amber-400" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Events</h4>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Party planning, group gifts, and event expenses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0D0F1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-12 text-center shadow-[0_0_60px_rgba(99,102,241,0.3)]">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Start Splitting?
            </h3>
            <p className="text-lg text-indigo-100 mb-8">
              Join thousands of people who&apos;ve simplified their shared expenses.
            </p>
            <Link
              href="/auth/signup"
              className="bg-white text-indigo-700 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-indigo-50 transition-all cursor-pointer hover:-translate-y-0.5 inline-block"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0F1A] border-t border-white/[0.08] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Receipt className="h-5 w-5 text-indigo-400 mr-2" />
                <h4 className="text-base font-semibold text-white">SplitBill</h4>
              </div>
              <p className="text-[#94A3B8] text-sm">
                Making shared expenses simple and transparent.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-[#94A3B8] text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-[#94A3B8] text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-[#94A3B8] text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.08] mt-8 pt-8 text-center text-[#94A3B8] text-sm">
            <p>&copy; 2025 SplitBill. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
