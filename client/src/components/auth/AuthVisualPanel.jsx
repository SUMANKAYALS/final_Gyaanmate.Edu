import { GraduationCap } from '../../lib/icons';

const stats = [
  { value: '50K+', label: 'Active learners' },
  { value: '1.2K', label: 'Courses live' },
  { value: '98%', label: 'Satisfaction rate' },
  { value: '24/7', label: 'Learning support' },
];

export default function AuthVisualPanel() {
  return (
    <div
      className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden rounded-r-3xl border-l border-white/10 bg-[linear-gradient(145deg,#1e1bff_0%,#2738f4_45%,#06145f_100%)]"
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      <div
        className="auth-visual-card-wave relative z-10 w-full max-w-[320px] rounded-2xl border border-white/25 bg-white/10 p-7 shadow-2xl backdrop-blur-xl"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white">
          <GraduationCap size={34} />
        </div>

        <h2 className="text-center text-xl font-bold leading-tight text-white">
          Seamless learning experience
        </h2>
        <p className="mt-3 text-center text-sm leading-6 text-blue-100">
          Everything you need in one powerful, beautifully customizable platform.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/10 bg-white/10 p-3">
              <p className="text-lg font-bold leading-none text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-blue-100">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 flex justify-center gap-2">
          <span className="h-1.5 w-6 rounded-full bg-white" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}
