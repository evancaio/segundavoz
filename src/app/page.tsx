import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient min-h-[90vh] flex items-center">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-teal/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-mint/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-8 border border-white/10">
              <span className="w-2 h-2 bg-mint rounded-full animate-pulse" />
              Mais de 5.000 pareceres emitidos
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Uma segunda opinião médica pode{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-teal-light">
                mudar tudo
              </span>
            </h1>

            <p className="text-xl text-white/70 mb-10 max-w-2xl leading-relaxed">
              Envie seus exames e laudos e receba um parecer complementar de médicos
              especialistas verificados — em até 48 horas, com total sigilo.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="btn-primary text-lg !py-4 !px-8 animate-pulse-glow">
                Solicitar Parecer
              </Link>
              <Link href="/login" className="btn-secondary !border-white/30 !text-white hover:!bg-white/10 text-lg !py-4 !px-8">
                Já sou cadastrado
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-8 mt-14 text-white/50 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Sigilo total
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resposta em 48h
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Médicos verificados
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Como funciona
            </h2>
            <p className="text-gray text-lg max-w-2xl mx-auto">
              Em três passos simples, você recebe uma segunda opinião médica qualificada
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Envie seus documentos',
                desc: 'Faça upload dos seus exames, laudos e relatórios médicos de forma segura.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                ),
              },
              {
                step: '02',
                title: 'Especialista analisa',
                desc: 'Um médico da especialidade correspondente revisa todo o material enviado.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                ),
              },
              {
                step: '03',
                title: 'Receba o parecer',
                desc: 'Acesse o parecer completo na plataforma com recomendações detalhadas.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                ),
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="card text-center p-8 h-full">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal/10 to-mint/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.icon}
                    </svg>
                  </div>
                  <span className="text-5xl font-black text-navy/5 absolute top-4 right-6">{item.step}</span>
                  <h3 className="text-xl font-bold text-navy mb-3">{item.title}</h3>
                  <p className="text-gray leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Escolha o que faz sentido para você
            </h2>
            <p className="text-gray text-lg max-w-2xl mx-auto">
              Pareceres acessíveis para todos, com opção prioritária
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <div className="card p-8 relative overflow-hidden">
              <h3 className="text-xl font-bold text-navy mb-2">Fila Voluntária</h3>
              <p className="text-5xl font-bold text-navy mt-4">Grátis</p>
              <p className="text-gray text-sm mt-2 mb-8">Sem prazo definido</p>
              <ul className="space-y-4 mb-8">
                {['Parecer completo', 'Médico verificado', 'Sigilo total', 'Sem prazo definido'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-dark">
                    <svg className="w-5 h-5 text-mint shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-secondary w-full">
                Começar Grátis
              </Link>
            </div>

            {/* Paid */}
            <div className="card p-8 relative overflow-hidden border-2 border-teal">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-teal to-mint text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                RECOMENDADO
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Prioritário</h3>
              <p className="text-5xl font-bold mt-4">
                <span className="text-navy">R$</span>
                <span className="gradient-text">40</span>
              </p>
              <p className="text-gray text-sm mt-2 mb-8">Por caso</p>
              <ul className="space-y-4 mb-8">
                {['Parecer em até 48h', 'Médico especialista', 'Sigilo total', 'Prioridade na fila', 'Notificação por email'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-dark">
                    <svg className="w-5 h-5 text-mint shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-primary w-full">
                Solicitar Parecer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-mint/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Não deixe dúvidas sobre sua saúde
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Uma segunda opinião pode fazer toda a diferença. Comece agora e tenha mais segurança nas suas decisões.
          </p>
          <Link href="/register" className="btn-primary text-lg !py-4 !px-10 animate-pulse-glow">
            Criar Conta Gratuita
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal to-mint flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-white font-bold">SegundaVoz</span>
            </div>
            <p className="text-white/40 text-sm">
              © 2026 SegundaVoz. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
