import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  QrCode,
  Share2,
  Printer,
  Copy,
  Check,
  Lock,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { useState } from 'react'

export function PublicCredentialVerification() {
  const { credentialId = 'cred-asc-ananya-001' } = useParams<{ credentialId: string }>()
  const [copiedHash, setCopiedHash] = useState(false)

  const credQuery = useQuery({
    queryKey: ['credential', credentialId],
    queryFn: () => api.verifyCredential(credentialId),
  })

  const credential = credQuery.data

  const handleCopyHash = () => {
    if (!credential) return
    navigator.clipboard.writeText(credential.verification_hash_sha256)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  const getTierColor = (tier: string) => {
    switch (tier?.toUpperCase()) {
      case 'ARCHITECT':
        return 'from-amber-600 via-purple-700 to-indigo-900 border-amber-400/40 text-amber-300'
      case 'SPECIALIST':
        return 'from-blue-600 via-indigo-700 to-slate-900 border-blue-400/40 text-blue-300'
      default:
        return 'from-emerald-600 via-teal-700 to-slate-900 border-emerald-400/40 text-emerald-300'
    }
  }

  if (credQuery.isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white text-xs">
        <div className="text-center space-y-3">
          <ShieldCheck className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <p>Verifying cryptographic credential on ASCEND verification registry...</p>
        </div>
      </div>
    )
  }

  if (!credential) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white text-xs">
        <div className="text-center space-y-3 max-w-sm">
          <Lock className="w-8 h-8 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold">Credential Not Found</h2>
          <p className="text-slate-400">The requested credential hash is invalid or revoked.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-200">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Verification Status Banner */}
        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-emerald-300 tracking-wider">
                Cryptographically Verified Credential
              </div>
              <p className="text-xs text-slate-300">
                Issued by {credential.issuing_authority} • Status: <strong className="text-white">Active &amp; Valid</strong>
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Certificate Presentation Document */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 via-[#0a1628] to-slate-950 border-2 border-amber-500/30 shadow-2xl relative overflow-hidden space-y-8"
        >
          {/* Certificate Header Stamp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
                  ASCEND TALENT ENGINEERING ACCELERATOR
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Certificate of Competence
                </h1>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[10px] font-mono text-slate-400">Credential ID</div>
              <div className="text-xs font-mono font-bold text-indigo-300">{credential.credential_code}</div>
            </div>
          </div>

          {/* Recipient & Title */}
          <div className="text-center space-y-3 py-4">
            <p className="text-xs uppercase tracking-widest text-slate-400">This is to certify that</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {credential.associate_name}
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              has successfully fulfilled all rigorous assessment gates, code execution benchmarks, and Architect Board defenses to be certified as
            </p>
            <div className="inline-block px-6 py-2 rounded-2xl bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-purple-500/20 border border-purple-500/40 text-purple-200 text-lg font-black tracking-tight">
              {credential.title}
            </div>
          </div>

          {/* Verified Skills & Evidence Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Skills */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Verified Competency Skills
              </h3>
              <ul className="space-y-2">
                {credential.skills_verified.map((sk, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                    <span>{sk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Evidence Summary */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Evidence Audit Trail
              </h3>
              <div className="space-y-2 text-xs">
                {Object.entries(credential.evidence_summary).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-400">{k}:</span>
                    <span className="text-slate-200 font-semibold text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cryptographic SHA-256 Verification Stamp (Requirement 21) */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  SHA-256 Verification Hash
                </span>
                <button
                  onClick={handleCopyHash}
                  className="p-1 rounded text-slate-400 hover:text-white transition"
                  title="Copy verification hash"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="font-mono text-[10px] text-indigo-400 truncate max-w-md">
                {credential.verification_hash_sha256}
              </div>
            </div>

            <div className="text-left sm:text-right font-mono text-[11px] text-slate-400">
              <div>Issued: <strong className="text-slate-200">{credential.issue_date}</strong></div>
              <div>Valid Through: <strong className="text-slate-200">{credential.expiry_date}</strong></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
