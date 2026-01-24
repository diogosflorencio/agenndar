'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { QRCodeSVG } from 'qrcode.react'
import BottomNavigation from '@/components/dashboard/BottomNavigation'

export default function ContaPage() {
  const router = useRouter()
  const [businessName, setBusinessName] = useState('Studio Premium')
  const [slug, setSlug] = useState('studiopremium_agendalo')
  const [selectedTheme, setSelectedTheme] = useState('primary')
  const [includePhone, setIncludePhone] = useState(true)
  const [includeAddress, setIncludeAddress] = useState(true)
  const [loading, setLoading] = useState(false)

  const themes = [
    { id: 'primary', color: '#13ec5b', name: 'Verde' },
    { id: 'blue', color: '#3b82f6', name: 'Azul' },
    { id: 'purple', color: '#a855f7', name: 'Roxo' },
    { id: 'orange', color: '#f97316', name: 'Laranja' },
    { id: 'dark', color: '#1e293b', name: 'Escuro' },
  ]

  const handleSave = async () => {
    try {
      setLoading(true)
      if (!supabase) {
        alert('Configuração do Supabase não encontrada. Configure as variáveis de ambiente e tente novamente.')
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { error } = await supabase
          .from('users')
          .update({
            business_name: businessName,
            slug: slug,
            updated_at: new Date().toISOString(),
          })
          .eq('firebase_uid', user.id)

        if (error) throw error
        alert('Alterações salvas com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar alterações. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const qrCodeUrl = `https://agendalo.com/${slug}`

  return (
    <div className="bg-background-dark min-h-screen text-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center p-4 justify-between border-b border-emerald-900/30">
          <button onClick={() => router.back()} className="flex size-10 shrink-0 items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Personalização</h2>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        {/* Profile Section */}
        <section className="flex p-6">
          <div className="flex w-full flex-col gap-6 items-center">
            <div className="flex gap-4 flex-col items-center">
              <div className="relative">
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-primary/20"
                  style={{
                    backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCoJtjVSvoZl1UQz3kRg8PDc84bGqOuiEasjTdwmE1ReO0gMhA-HSvR8hG2w728WZ-6vFHfZ4tjh3ah08VpKeV3Z5WKDC_QEjHWE3B46aYQP6YIWvWPRtt37NOUgvMM8Rzia1PhLSb4heZFNarBiiJvafYXwTjnAtGO4nhaN6tryi-cEyDHVA91C_6YEKJ0UIMQrHJftdQf3Aic1hbBu53OjqdXU2m-FCxLItCBFeqVmGeyu-Bytl_KggEw-0kIrrVzcCfqPouSyQ0)'
                  }}
                />
                <div className="absolute bottom-0 right-0 bg-primary text-background-dark p-2 rounded-full flex items-center justify-center border-4 border-background-dark">
                  <span className="material-symbols-outlined text-sm font-bold">edit</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">{businessName}</p>
                <p className="text-primary text-base font-normal leading-normal text-center">@{slug}</p>
              </div>
            </div>
            <button className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary/10 text-primary border border-primary/20 text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Alterar Foto</span>
            </button>
          </div>
        </section>

        {/* Account Information */}
        <section>
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Informações da Conta</h3>
          <div className="flex flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-sm font-medium leading-normal pb-2 opacity-80">Nome do Estabelecimento</p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#326744] bg-[#193322] focus:border-primary h-14 p-[15px] text-base font-normal leading-normal"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-sm font-medium leading-normal pb-2 opacity-80">Slug da URL (Link público)</p>
              <div className="flex w-full flex-1 items-stretch rounded-lg group">
                <div className="text-[#92c9a4] flex border border-[#326744] bg-[#193322] items-center justify-center px-4 rounded-l-lg border-r-0 text-sm italic">
                  agendalo.com/
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-white focus:outline-0 focus:ring-0 border border-[#326744] bg-[#193322] focus:border-primary h-14 p-[15px] text-base font-normal leading-normal"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                />
              </div>
            </label>
          </div>
        </section>

        {/* QR Code Section */}
        <section className="mt-8 px-4">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-4">Seu QR Code</h3>
          <div className="bg-[#193322] rounded-xl border border-emerald-900/30 p-6 flex flex-col items-center shadow-sm">
            {/* QR Preview */}
            <div className="bg-white p-4 rounded-xl shadow-inner mb-6 border border-slate-100">
              <div className="w-48 h-48 bg-white flex items-center justify-center rounded-lg">
                <QRCodeSVG value={qrCodeUrl} size={192} />
              </div>
            </div>

            {/* Theme Selection */}
            <div className="w-full mb-6">
              <p className="text-sm font-medium mb-3 opacity-80">Escolha o Tema</p>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedTheme === theme.id
                        ? 'border-primary bg-background-dark'
                        : 'border-[#326744] bg-[#193322]'
                    }`}
                    style={{ borderColor: selectedTheme === theme.id ? theme.color : undefined }}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.color }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* PDF Customization */}
            <div className="w-full space-y-4 mb-6">
              <p className="text-sm font-medium opacity-80">Personalizar Impressão (PDF)</p>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePhone}
                  onChange={(e) => setIncludePhone(e.target.checked)}
                  className="w-5 h-5 rounded border-emerald-900/30 text-primary focus:ring-primary bg-background-dark"
                />
                <span className="text-sm">Incluir telefone no rodapé</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAddress}
                  onChange={(e) => setIncludeAddress(e.target.checked)}
                  className="w-5 h-5 rounded border-emerald-900/30 text-primary focus:ring-primary bg-background-dark"
                />
                <span className="text-sm">Incluir endereço físico</span>
              </label>
            </div>

            <button className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="material-symbols-outlined">picture_as_pdf</span>
              <span className="truncate">Gerar PDF para Impressão</span>
            </button>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mt-8 mb-8">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-4">Gestão do Negócio</h3>
          <div className="px-4 space-y-2">
            <Link
              href="/dashboard/equipe"
              className="flex items-center justify-between p-4 bg-[#193322] border border-emerald-900/30 rounded-xl active:opacity-70 transition-opacity"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">group</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Gestão de Colaboradores</p>
                  <p className="text-xs opacity-60">Equipe, permissões e escalas</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </Link>
            <Link
              href="/dashboard/servicos"
              className="flex items-center justify-between p-4 bg-[#193322] border border-emerald-900/30 rounded-xl active:opacity-70 transition-opacity"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">list_alt</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Gestão de Serviços</p>
                  <p className="text-xs opacity-60">Preços, duração e categorias</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Bottom Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-dark/90 backdrop-blur-md border-t border-emerald-900/30 z-50 pb-24">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-primary text-background-dark font-bold h-14 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>

      <BottomNavigation currentRoute="conta" />
    </div>
  )
}

