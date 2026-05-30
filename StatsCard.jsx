import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon: Icon, accent = 'brand' }) {
  const accents = {
    brand: 'from-brand-600/20 to-brand-900/10 text-brand-400',
    emerald: 'from-emerald-600/20 to-emerald-900/10 text-emerald-400',
    amber: 'from-amber-600/20 to-amber-900/10 text-amber-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card bg-gradient-to-br ${accents[accent]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-1 text-3xl font-bold text-white">{value}</p>
        </div>
        {Icon && <Icon className="h-8 w-8 opacity-60" />}
      </div>
    </motion.div>
  );
}
