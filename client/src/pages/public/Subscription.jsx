import { useNavigate } from 'react-router-dom';
import { ArrowRight, CreditCard, Sparkles } from '../../lib/icons';

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

  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" /> Demo Subscription UI
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Subscription plans for every learner
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg">
            Explore a demo subscription experience with multi-tier pricing, benefits, and a polished purchase flow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-7 shadow-2xl transition ${
                plan.highlighted
                  ? 'border-indigo-500/40 bg-slate-900/80 shadow-indigo-500/10'
                  : 'border-slate-700/60 bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">{plan.name}</p>
                  <p className="mt-3 text-4xl font-bold text-white">
                    {plan.price}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">{plan.period}</p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-3 text-indigo-400">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>

              <p className="text-slate-400 mb-8">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 items-start text-slate-300">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-300 text-sm">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                  plan.highlighted
                    ? 'bg-indigo-500 text-white hover:bg-indigo-400'
                    : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
                }`}
              >
                Choose plan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-slate-700/60 bg-slate-900/70 p-8 text-slate-300">
          <h2 className="text-2xl font-semibold text-white mb-3">Demo subscription notes</h2>
          <p className="leading-7">
            This page is a demo subscription UI to show how recurring plans and premium offers could look in LearnHub.
            Subscription checkout is currently routed through the existing course checkout flow for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
