import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#020403]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">calendar_month</span>
            <span className="text-xl font-bold tracking-tight">Agenndar</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a className="hover:text-primary transition-colors" href="#funcionalidades">Funcionalidades</a>
            <a className="hover:text-primary transition-colors" href="#planos">Planos</a>
            <a className="hover:text-primary transition-colors" href="#sobre">Sobre</a>
          </div>
          <Link 
            href="/login"
            className="bg-primary hover:bg-primary/90 text-black font-bold py-2 px-5 rounded-full text-sm transition-all shadow-[0_0_15px_rgba(19,236,91,0.4)]"
          >
            Entrar
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden bg-[#020403]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-8 z-10 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Agenndar | A solução definitiva de agendamento
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              A solução definitiva de <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">
                agendamento para seu negócio
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Somos a ferramenta mais robusta do mercado para <strong className="text-white">barbearias, salões de beleza, manicures, estúdios de tatuagem, clínicas de estética</strong> e diversos outros setores. Atendemos empresas em todo o Brasil com tecnologia de ponta.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(19,236,91,0.3)] flex items-center justify-center gap-2"
              >
                Teste Grátis por 7 Dias
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">play_circle</span>
                Ver Demo
              </button>
            </div>
            
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                7 dias grátis
              </div>
            </div>

            {/* Mockup Mobile - Abaixo dos badges no mobile */}
            <div className="lg:hidden relative mx-auto z-10 perspective-1000 mt-8">
              <div className="relative w-[280px] h-[580px] bg-black rounded-[40px] border-[8px] border-gray-800 shadow-2xl overflow-hidden mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-50"></div>
                <div className="w-full h-full bg-[#0B120E] text-white flex flex-col relative overflow-hidden">
                  <header className="pt-10 pb-4 px-5 bg-[#0B120E]/90 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full border-2 border-primary p-0.5">
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/40 to-primary/60"></div>
                        </div>
                        <div>
                          <p className="text-[10px] text-primary font-medium leading-none mb-0.5">Olá, Marcos</p>
                          <h2 className="text-white text-lg font-bold leading-none">Dashboard</h2>
                        </div>
                      </div>
                      <button className="size-9 rounded-full bg-[#14221A] border border-[#213428] flex items-center justify-center text-white hover:bg-[#213428]">
                        <span className="material-symbols-outlined text-[18px]">notifications</span>
                      </button>
                    </div>
                  </header>
                  
                  <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                    <section className="px-5 py-4">
                      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                        <div className="flex-shrink-0 w-32 bg-[#14221A] border border-[#213428] rounded-xl p-3 flex flex-col gap-3">
                          <div className="flex items-center gap-2 text-gray-400">
                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                            <span className="text-xs font-medium">Agend.</span>
                          </div>
                          <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-white leading-none">12</span>
                            <span className="text-[10px] text-primary font-bold mb-0.5">+15%</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 w-32 bg-[#14221A] border border-[#213428] rounded-xl p-3 flex flex-col gap-3">
                          <div className="flex items-center gap-2 text-gray-400">
                            <span className="material-symbols-outlined text-[18px]">cancel</span>
                            <span className="text-xs font-medium">Canc.</span>
                          </div>
                          <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-white leading-none">2</span>
                            <span className="text-[10px] text-red-500 font-bold mb-0.5">-5%</span>
                          </div>
                        </div>
                      </div>
                    </section>
                    
                    <main className="px-5 space-y-4">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-white text-base font-bold">Próximos</h3>
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                          Hoje
                        </span>
                      </div>
                      
                      <div className="bg-[#14221A] border border-[#213428] rounded-xl overflow-hidden shadow-lg">
                        <div className="p-3 flex gap-3">
                          <div className="size-14 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 shrink-0"></div>
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-white text-sm">João Silva</h4>
                              <span className="text-primary font-bold text-xs">14:00</span>
                            </div>
                            <p className="text-gray-400 text-xs mt-0.5">Corte + Barba</p>
                          </div>
                        </div>
                      </div>
                    </main>
                  </div>
                  
                  <nav className="absolute bottom-0 w-full bg-[#0B120E]/95 backdrop-blur-md border-t border-[#213428] pb-6 pt-3 px-6 flex justify-between z-40">
                    <div className="flex flex-col items-center gap-1">
                      <span className="material-symbols-outlined text-[22px] text-primary">grid_view</span>
                      <span className="text-[9px] font-bold text-primary">Início</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="material-symbols-outlined text-[22px] text-gray-500">calendar_month</span>
                      <span className="text-[9px] font-medium text-gray-500">Agenda</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="material-symbols-outlined text-[22px] text-gray-500">person</span>
                      <span className="text-[9px] font-medium text-gray-500">Conta</span>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mockup Desktop */}
          <div className="hidden lg:block relative mx-auto lg:mr-0 z-10 perspective-1000 order-1 lg:order-2">
            <div className="relative w-[320px] h-[660px] bg-black rounded-[40px] border-[8px] border-gray-800 shadow-2xl overflow-hidden mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-50"></div>
              <div className="w-full h-full bg-[#0B120E] text-white flex flex-col relative overflow-hidden">
                <header className="pt-10 pb-4 px-5 bg-[#0B120E]/90 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full border-2 border-primary p-0.5">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/40 to-primary/60"></div>
                      </div>
                      <div>
                        <p className="text-[10px] text-primary font-medium leading-none mb-0.5">Olá, Marcos</p>
                        <h2 className="text-white text-lg font-bold leading-none">Dashboard</h2>
                      </div>
                    </div>
                    <button className="size-9 rounded-full bg-[#14221A] border border-[#213428] flex items-center justify-center text-white hover:bg-[#213428]">
                      <span className="material-symbols-outlined text-[18px]">notifications</span>
                    </button>
                  </div>
                </header>
                
                <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                  <section className="px-5 py-4">
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                      <div className="flex-shrink-0 w-32 bg-[#14221A] border border-[#213428] rounded-xl p-3 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                          <span className="text-xs font-medium">Agend.</span>
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold text-white leading-none">12</span>
                          <span className="text-[10px] text-primary font-bold mb-0.5">+15%</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-32 bg-[#14221A] border border-[#213428] rounded-xl p-3 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="material-symbols-outlined text-[18px]">cancel</span>
                          <span className="text-xs font-medium">Canc.</span>
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold text-white leading-none">2</span>
                          <span className="text-[10px] text-red-500 font-bold mb-0.5">-5%</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-32 bg-[#14221A] border border-[#213428] rounded-xl p-3 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="material-symbols-outlined text-[18px]">person_off</span>
                          <span className="text-xs font-medium">Faltas</span>
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold text-white leading-none">1</span>
                          <span className="text-[10px] text-gray-500 font-bold mb-0.5">--</span>
                        </div>
                      </div>
                    </div>
                  </section>
                  
                  <main className="px-5 space-y-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-white text-base font-bold">Próximos</h3>
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                        Hoje, 24 Mai
                      </span>
                    </div>
                    
                    <div className="bg-[#14221A] border border-[#213428] rounded-xl overflow-hidden shadow-lg">
                      <div className="p-3 flex gap-3">
                        <div className="size-14 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 shrink-0"></div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-white text-sm">João Silva</h4>
                            <span className="text-primary font-bold text-xs">14:00</span>
                          </div>
                          <p className="text-gray-400 text-xs mt-0.5">Corte + Barba</p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <div className="size-4 rounded-full bg-gray-700 flex items-center justify-center text-[10px] text-white">L</div>
                            <span className="text-[10px] text-gray-500">Lucas</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-px bg-[#213428] border-t border-[#213428]">
                        <button className="bg-[#14221A] hover:bg-white/5 text-xs font-semibold text-gray-300 py-3 transition-colors">
                          Faltou
                        </button>
                        <button className="bg-primary/20 hover:bg-primary/30 text-xs font-bold text-primary py-3 transition-colors">
                          Compareceu
                        </button>
                      </div>
                    </div>
                  </main>
                </div>
                
                <nav className="absolute bottom-0 w-full bg-[#0B120E]/95 backdrop-blur-md border-t border-[#213428] pb-6 pt-3 px-6 flex justify-between z-40">
                  <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <span className="material-symbols-outlined text-[22px] text-primary">grid_view</span>
                    <span className="text-[9px] font-bold text-primary">Início</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <span className="material-symbols-outlined text-[22px] text-gray-500 group-hover:text-white transition-colors">calendar_month</span>
                    <span className="text-[9px] font-medium text-gray-500 group-hover:text-white transition-colors">Agenda</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <span className="material-symbols-outlined text-[22px] text-gray-500 group-hover:text-white transition-colors">content_cut</span>
                    <span className="text-[9px] font-medium text-gray-500 group-hover:text-white transition-colors">Serviços</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <span className="material-symbols-outlined text-[22px] text-gray-500 group-hover:text-white transition-colors">groups</span>
                    <span className="text-[9px] font-medium text-gray-500 group-hover:text-white transition-colors">Equipe</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <span className="material-symbols-outlined text-[22px] text-gray-500 group-hover:text-white transition-colors">person</span>
                    <span className="text-[9px] font-medium text-gray-500 group-hover:text-white transition-colors">Conta</span>
                  </div>
                </nav>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50"></div>
              </div>
            </div>
            
            {/* Cards flutuantes */}
            <div className="absolute top-20 -right-10 bg-[#14221A] p-4 rounded-xl border border-primary/30 shadow-xl z-20 animate-bounce hidden xl:block" style={{ animationDuration: '3s' }}>
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary">payments</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Receita Hoje</p>
                  <p className="text-sm font-bold text-white">R$ 850,00</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-40 -left-10 bg-[#14221A] p-4 rounded-xl border border-primary/30 shadow-xl z-20 animate-bounce hidden xl:block" style={{ animationDuration: '4s' }}>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-blue-500">star</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Avaliação</p>
                  <p className="text-sm font-bold text-white">4.9/5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="py-20 bg-[#080c0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Tudo que você precisa</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Uma suíte completa de ferramentas para modernizar sua gestão e fidelizar seus clientes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0f1c15] p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">calendar_month</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Agenda Inteligente</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Evite conflitos de horário e reduza faltas com lembretes automáticos via notificações para seus clientes.
              </p>
            </div>
            
            <div className="bg-[#0f1c15] p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">attach_money</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Controle Financeiro</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Acompanhe entradas, saídas e comissões em tempo real. Saiba exatamente quanto seu negócio está lucrando.
              </p>
            </div>
            
            <div className="bg-[#0f1c15] p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">groups</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Gestão de Equipe</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Gerencie escalas, permissões e desempenho individual de cada profissional da sua equipe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prova Social */}
      <section className="py-20 bg-[#020403] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24.255</div>
              <div className="text-gray-400">Prestadores ativos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">R$ 2.5M+</div>
              <div className="text-gray-400">Faturado por empreendedores hoje</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4.9★</div>
              <div className="text-gray-400">Avaliação média</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-400">Taxa de satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-[#020403] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Como Funciona</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Em 3 passos simples, você começa a gerenciar seu negócio de forma profissional
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="size-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Teste grátis por 7 dias</h3>
              <p className="text-gray-400 text-sm">
                Faça login com Google e configure seu negócio em minutos. Teste todas as funcionalidades sem cartão de crédito.
              </p>
            </div>
            
            <div className="text-center">
              <div className="size-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Configurar serviços e horários</h3>
              <p className="text-gray-400 text-sm">
                Adicione seus serviços, defina horários de trabalho e comece a receber agendamentos.
              </p>
            </div>
            
            <div className="text-center">
              <div className="size-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Compartilhar e receber agendamentos</h3>
              <p className="text-gray-400 text-sm">
                Compartilhe seu link ou QR Code e comece a receber agendamentos dos seus clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-[#080c0a] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Perguntas Frequentes</h2>
            <p className="text-gray-400">
              Tire suas dúvidas sobre o Agenndar
            </p>
          </div>
          
          <div className="space-y-4">
            <details className="bg-[#0f1c15] p-6 rounded-xl border border-white/5 group">
              <summary className="font-bold text-white cursor-pointer flex items-center justify-between">
                Preciso saber programar?
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="text-gray-400 mt-4">
                Não! O Agenndar foi desenvolvido para ser extremamente simples. Você não precisa de conhecimento técnico algum. Tudo é intuitivo e guiado.
              </p>
            </details>
            
            <details className="bg-[#0f1c15] p-6 rounded-xl border border-white/5 group">
              <summary className="font-bold text-white cursor-pointer flex items-center justify-between">
                Como funciona o pagamento?
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="text-gray-400 mt-4">
                Aceitamos cartão de crédito e PIX. Todos os pagamentos geram NFE (Nota Fiscal Eletrônica) automaticamente. O teste de 7 dias é totalmente gratuito e não requer cartão de crédito.
              </p>
            </details>
            
            <details className="bg-[#0f1c15] p-6 rounded-xl border border-white/5 group">
              <summary className="font-bold text-white cursor-pointer flex items-center justify-between">
                Posso personalizar minha página?
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="text-gray-400 mt-4">
                Sim! Você pode personalizar o nome do seu negócio, telefone e em breve poderá adicionar logo e cores personalizadas. Cada prestador tem sua própria URL única.
              </p>
            </details>
            
            <details className="bg-[#0f1c15] p-6 rounded-xl border border-white/5 group">
              <summary className="font-bold text-white cursor-pointer flex items-center justify-between">
                Funciona no celular?
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="text-gray-400 mt-4">
                Perfeitamente! O Agenndar é mobile-first, ou seja, foi pensado primeiro para celular. Funciona perfeitamente em qualquer dispositivo e pode ser instalado como app (PWA).
              </p>
            </details>
            
            <details className="bg-[#0f1c15] p-6 rounded-xl border border-white/5 group">
              <summary className="font-bold text-white cursor-pointer flex items-center justify-between">
                Quais são os planos disponíveis?
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="text-gray-400 mt-4">
                Oferecemos um teste gratuito de 7 dias sem necessidade de cartão. Após o teste, você pode escolher entre nossos planos Pro personalizados, com preços que variam conforme o perfil do seu negócio.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-[#020403] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Junte-se a milhares de profissionais que já estão usando o Agenndar
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(19,236,91,0.3)]"
          >
            Teste Grátis por 7 Dias
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">check_circle</span>
              7 dias grátis
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">check_circle</span>
              Suporte em português
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">check_circle</span>
              Configuração rápida
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#020403] border-t border-white/10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">calendar_month</span>
                <span className="text-xl font-bold text-white">Agenndar</span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm mb-6">
                Transformando a maneira como prestadores de serviços gerenciam seus negócios. Simples, rápido e eficiente.
              </p>
              <div className="flex gap-4">
                <a className="text-gray-500 hover:text-white transition-colors" href="#">Instagram</a>
                <a className="text-gray-500 hover:text-white transition-colors" href="#">LinkedIn</a>
                <a className="text-gray-500 hover:text-white transition-colors" href="#">Twitter</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Produto</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a className="hover:text-primary transition-colors" href="#funcionalidades">Funcionalidades</a></li>
                <li><a className="hover:text-primary transition-colors" href="#planos">Preços</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Atualizações</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Empresa</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a className="hover:text-primary transition-colors" href="#sobre">Sobre nós</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Carreiras</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
            <p>© 2024 Agenndar SaaS. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a className="hover:text-gray-400" href="#">Termos de Uso</a>
              <a className="hover:text-gray-400" href="#">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
