import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Puzzle, Zap, Shield, Download, Code2, Layers } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-900">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Puzzle className="h-8 w-8 text-brand-500" />
          Extensio<span className="text-brand-500">.ai</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="btn-secondary">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary">
            Get started
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold tracking-tight sm:text-6xl"
        >
          Build Chrome Extensions
          <br />
          <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">
            Without Writing Code
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-400"
        >
          Extensio.ai is your no-code browser extension factory. Configure templates visually,
          preview source with Monaco, validate Manifest V3, and download production-ready ZIPs —
          no AI APIs required.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link to="/register" className="btn-primary px-8 py-3 text-base">
            Start Building Free
          </Link>
          <a href="#features" className="btn-secondary px-8 py-3 text-base">
            See Features
          </a>
        </motion.div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Layers, title: 'Template Engine', desc: 'Pre-built templates with placeholder-driven code generation.' },
            { icon: Code2, title: 'Live Preview', desc: 'Monaco Editor preview of manifest, JS, HTML, and CSS.' },
            { icon: Shield, title: 'Security Scan', desc: 'Blocks miners, eval, and data theft patterns before ZIP.' },
            { icon: Zap, title: 'Manifest V3', desc: 'Auto-generated permissions, content scripts, and icons.' },
            { icon: Download, title: 'One-Click ZIP', desc: 'Validated archives ready to load in chrome://extensions.' },
            { icon: Puzzle, title: 'Version Control', desc: 'Save, clone, restore, and compare extension versions.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card"
            >
              <Icon className="mb-3 h-8 w-8 text-brand-500" />
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Extensio.ai — Template-based extension generation
      </footer>
    </div>
  );
}
