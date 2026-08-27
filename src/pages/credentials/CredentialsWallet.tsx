import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Share2,
  Lock,
  Sparkles,
  QrCode,
  ArrowUpRight,
  Copy,
  Check,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { Link } from 'react-router-dom'
import type { DigitalCredential } from '../../types'

interface CredentialsWalletProps {
  associateId?: string
}

export function CredentialsWallet({ associateId = 'as-ananya' }: CredentialsWalletProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const credsQuery = useQuery({
    queryKey: ['associateCredentials', associateId],
    queryFn: () => api.associateCredentials(associateId),
  })

  const credentials = credsQuery.data || []

  const handleCopyLink = (credId: string) => {
    const fullUrl = `${window.location.origin}/verify/${credId}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedId(credId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getTierColor = (tier: string) => {
    switch (tier?.toUpperCase()) {
      case 'ARCHITECT':
        return 'from-purple-900 via-indigo-950 to-slate-950 border-purple-500/40 text-purple-300'
      case 'SPECIALIST':
        return 'from-blue-900 via-indigo-950 to-slate-950 border-blue-500/40 text-blue-300'
      default:
        return 'from-emerald-900 via-teal-950 to-slate-950 border-emerald-500/40 text-emerald-300'
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Verifiable Digital Credentials
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Requirement 21</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Digital Credential Wallet &amp; Skill Badges
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cryptographically signed digital certificates with immutable SHA-256 verification hashes and public proof trails.
          </p>
        </div>
      </div>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {credentials.map((cred) => (
          <motion.div
            key={cred.id}
            whileHover={{ y: -4 }}
            className={`p-6 rounded-3xl bg-gradient-to-br ${getTierColor(
              cred.badge_tier
            )} border-2 shadow-2xl space-y-5 text-white flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-white/10 text-amber-300 border border-white/15">
                  {cred.badge_tier} Level
                </span>
                <span className="text-[10px] font-mono text-slate-400">Issued: {cred.issue_date}</span>
              </div>

              <div className="mt-4 flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-white/10 text-amber-300 border border-white/20 shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight leading-snug">{cred.title}</h3>
                  <div className="text-xs text-slate-300 font-mono mt-0.5">{cred.credential_code}</div>
                </div>
              </div>

              {/* Verified Skills */}
              <div className="mt-4 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Verified Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {cred.skills_verified.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-[10px] rounded-md bg-white/5 border border-white/10 text-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
              <button
                onClick={() => handleCopyLink(cred.id)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold transition flex items-center gap-1.5"
              >
                {copiedId === cred.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Proof</span>
                  </>
                )}
              </button>

              <Link
                to={cred.public_verification_url}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/40"
              >
                <span>Verify Credential</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
