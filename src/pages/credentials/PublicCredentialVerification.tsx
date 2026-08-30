import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Lock,
  Download,
  Share2,
  Printer,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { DigitalCredential } from '../../types'
import { Card } from '../../components/ui'

export function PublicCredentialVerification() {
  const { credentialId } = useParams<{ credentialId: string }>()
  const [copiedHash, setCopiedHash] = useState(false)

  // Query verification endpoint
  const query = useQuery({
    queryKey: ['publicCredential', credentialId],
    queryFn: () => api.verifyCredential(credentialId || 'cred-ananya-l300-2025'),
  })

  const credential = query.data

  const handleCopyHash = () => {
    if (!credential) return
    navigator.clipboard.writeText(credential.verification_hash_sha256)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  if (query.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-500 text-xs">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#007df0] border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Verifying cryptographic SHA-256 integrity signature...</p>
        </div>
      </div>
    )
  }

  if (query.isError || !credential) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 text-xs">
        <Card className="text-center space-y-3 max-w-sm p-6">
          <Lock className="w-8 h-8 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Credential Not Found</h2>
          <p className="text-slate-500">The requested credential hash is invalid or revoked.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Verification Status Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
                Cryptographically Verified Credential
              </div>
              <p className="text-xs text-slate-600">
                Issued by {credential.issuing_authority} • Status: <strong className="text-emerald-700 font-bold">Active &amp; Valid</strong>
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200 flex items-center gap-1.5 transition shadow-2xs"
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
          className="p-8 sm:p-12 rounded-3xl bg-white border-2 border-slate-200 shadow-xl relative overflow-hidden space-y-8"
        >
          {/* Certificate Header Stamp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#007df0]">
                  ASCEND TALENT ENGINEERING ACCELERATOR
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Certificate of Competence
                </h1>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[10px] font-mono text-slate-400">Credential ID</div>
              <div className="text-xs font-mono font-bold text-[#007df0]">{credential.credential_code}</div>
            </div>
          </div>

          {/* Recipient & Title */}
          <div className="text-center space-y-3 py-4">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">This is to certify that</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {credential.associate_name}
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
              has successfully fulfilled all rigorous assessment gates, code execution benchmarks, and Architect Board defenses to be certified as
            </p>
            <div className="inline-block px-6 py-2 rounded-2xl bg-sky-50 border border-sky-200 text-[#007df0] text-lg font-bold tracking-tight">
              {credential.title}
            </div>
          </div>

          {/* Verified Skills & Evidence Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Skills */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Verified Competency Skills
              </h3>
              <ul className="space-y-2">
                {credential.skills_verified.map((sk, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007df0] shrink-0" />
                    <span>{sk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Evidence Summary */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Evidence Audit Trail
              </h3>
              <div className="space-y-2 text-xs">
                {Object.entries(credential.evidence_summary).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">{k}:</span>
                    <span className="text-slate-800 font-semibold text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cryptographic SHA-256 Verification Stamp */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  SHA-256 Verification Hash
                </span>
                <button
                  onClick={handleCopyHash}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 transition"
                  title="Copy verification hash"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="font-mono text-[10px] text-[#007df0] truncate max-w-md">
                {credential.verification_hash_sha256}
              </div>
            </div>

            <div className="text-left sm:text-right font-mono text-[11px] text-slate-500">
              <div>Issued: <strong className="text-slate-800">{credential.issue_date}</strong></div>
              <div>Valid Through: <strong className="text-slate-800">{credential.expiry_date}</strong></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
