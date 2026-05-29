import { useNavigate } from 'react-router-dom';
import { ArrowRight, CreditCard, Sparkles } from '../../lib/icons';
import { useTheme } from '../../context/ThemeContext';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'Free forever',
    description: 'Ideal for learners who want to explore the platform.',
    features: ['Access to 2 demo courses', 'Community support', 'Progress tracking'],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'per month',
    description: 'Best for learners ready to unlock premium content.',
    features: ['Unlimited course access', 'Certificate downloads', 'Premium resources'],
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '$19.99',
    period: 'per month',
    description: 'For power users and teams who want the full experience.',
    features: ['One-on-one mentoring', 'Career path plans', 'Exclusive workshops'],
    highlighted: false,
  },
];

export default function Subscription() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`subscription-page min-h-screen py-16 px-4 sm:px-6 lg:px-8 ${isLight ? 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900' : 'bg-slate-950 text-white'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium mb-3 ${isLight ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-indigo-500/15 text-indigo-300'}`}>
            <Sparkles className="w-4 h-4" /> Demo Subscription UI
          </span>
          <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight mb-4 ${isLight ? 'text-gray-900' : 'text-white'}`}>
            Subscription plans for every learner
          </h1>
          <p className={`max-w-2xl mx-auto text-base sm:text-lg ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
            Explore a demo subscription experience with multi-tier pricing, benefits, and a polished purchase flow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-7 shadow-2xl transition ${
                plan.highlighted
                  ? isLight ? 'border-blue-200 bg-white shadow-blue-100/80' : 'border-indigo-500/40 bg-slate-900/80 shadow-indigo-500/10'
                  : isLight ? 'border-gray-200 bg-white shadow-blue-100/40' : 'border-slate-700/60 bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className={`text-sm font-medium uppercase tracking-[0.24em] ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>{plan.name}</p>
                  <p className={`mt-3 text-4xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    {plan.price}
                  </p>
                  <p className={`text-sm mt-1 ${isLight ? 'text-gray-500' : 'text-slate-500'}`}>{plan.period}</p>
                </div>
                <div className={`rounded-2xl p-3 text-indigo-400 ${isLight ? 'bg-blue-50 border border-blue-100' : 'bg-slate-900'}`}>
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>

              <p className={`mb-8 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className={`flex gap-3 items-start ${isLight ? 'text-gray-700' : 'text-slate-300'}`}>
                    <span className={`mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-sm ${isLight ? 'bg-blue-100 text-blue-700' : 'bg-indigo-500/10 text-indigo-300'}`}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                  plan.highlighted
                    ? isLight ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-200/70' : 'bg-indigo-500 text-white hover:bg-indigo-400'
                    : isLight ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
                }`}
              >
                Choose plan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className={`mt-12 rounded-3xl border p-8 ${isLight ? 'border-blue-100 bg-white text-gray-700 shadow-lg shadow-blue-100/60' : 'border-slate-700/60 bg-slate-900/70 text-slate-300'}`}>
          <h2 className={`text-2xl font-semibold mb-3 ${isLight ? 'text-gray-900' : 'text-white'}`}>Demo subscription notes</h2>
          <p className="leading-7">
            This page is a demo subscription UI to show how recurring plans and premium offers could look in LearnHub.
            Subscription checkout is currently routed through the existing course checkout flow for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
