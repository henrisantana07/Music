import './index.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <header class="px-4 py-4 md:px-6 border-b border-[var(--border)] bg-[var(--bg)] shadow-sm sticky top-0 z-50">
    <nav class="flex items-center justify-between max-w-7xl mx-auto">
      <a href="#" class="text-xl font-bold text-[var(--accent)] hover:text-[var(--accent-border)] transition-colors">Music</a>
      <div class="hidden md:flex gap-8">
        <a href="#" class="text-[var(--text)] hover:text-[var(--accent)] hover:font-semibold transition-all duration-200 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--accent)] after:transition-all hover:after:w-full">Início</a>
        <a href="#" class="text-[var(--text)] hover:text-[var(--accent)] hover:font-semibold transition-all duration-200 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--accent)] after:transition-all hover:after:w-full">Biblioteca</a>
        <a href="#" class="text-[var(--text)] hover:text-[var(--accent)] hover:font-semibold transition-all duration-200 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--accent)] after:transition-all hover:after:w-full">Playlists</a>
      </div>
    </nav>
  </header>

  <main class="flex-1">
    <section class="relative py-20 md:py-32 px-4 md:px-6 bg-gradient-to-br from-[var(--bg)] via-[var(--bg)] to-[var(--accent-bg)]">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-5xl md:text-7xl font-extrabold text-[var(--text-h)] mb-8 tracking-tight">
          Sua música,<br>em qualquer lugar
        </h1>
        <p class="text-xl md:text-2xl text-[var(--text)] max-w-2xl mx-auto leading-relaxed">
          Descubra, organize e curta suas músicas favoritas.
        </p>
        <div class="mt-12 flex justify-center gap-4">
          <a href="#" class="px-8 py-3 bg-[var(--accent)] text-white rounded-lg font-medium hover:bg-[var(--accent-border)] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">Explorar</a>
          <a href="#" class="px-8 py-3 border border-[var(--border)] text-[var(--text)] rounded-lg font-medium hover:bg-[var(--social-bg)] transition-all">Saiba mais</a>
        </div>
      </div>
    </section>

    <section class="py-20 px-4 md:px-6 bg-[var(--bg)] relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-30"></div>
      <div class="max-w-7xl mx-auto relative">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-[var(--text-h)] mb-4">Comece sua jornada musical</h2>
          <p class="text-lg text-[var(--text)] max-w-2xl mx-auto">Descubra um mundo de possibilidades musicais conosco</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="group p-8 rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--bg)] to-[var(--social-bg)] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-[var(--accent)]/50">
            <div class="w-16 h-16 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-bg)] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-[var(--text-h)] mb-4 group-hover:text-[var(--accent)] transition-colors">Biblioteca</h3>
            <p class="text-[var(--text)] leading-relaxed mb-6">Gerencie suas músicas e álbuns com ferramentas poderosas de organização.</p>
            <a href="#" class="inline-flex items-center text-[var(--accent)] font-semibold hover:text-[var(--accent-border)] transition-colors">
              Começar agora
              <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
          <div class="group p-8 rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--bg)] to-[var(--social-bg)] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-[var(--accent)]/50">
            <div class="w-16 h-16 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-bg)] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v12L9 19zm0 0a2 2 0 002 2h2a2 2 0 002-2m0 0l-6-3v13l6-3z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-[var(--text-h)] mb-4 group-hover:text-[var(--accent)] transition-colors">Playlists</h3>
            <p class="text-[var(--text)] leading-relaxed mb-6">Crie playlists personalizadas e compartilhe com amigos e a comunidade.</p>
            <a href="#" class="inline-flex items-center text-[var(--accent)] font-semibold hover:text-[var(--accent-border)] transition-colors">
              Criar playlist
              <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
          <div class="group p-8 rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--bg)] to-[var(--social-bg)] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-[var(--accent)]/50">
            <div class="w-16 h-16 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-bg)] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10l3 3m0 0l3-3m-3 3V8m0 13a9 9 0 100-18 9 9 0 000 18z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-[var(--text-h)] mb-4 group-hover:text-[var(--accent)] transition-colors">Descobertas</h3>
            <p class="text-[var(--text)] leading-relaxed mb-6">Encontre novas músicas e artistas para expandir seus horizontes musicais.</p>
            <a href="#" class="inline-flex items-center text-[var(--accent)] font-semibold hover:text-[var(--accent-border)] transition-colors">
              Explorar
              <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="py-12 px-4 md:px-6 border-t border-[var(--border)] bg-[var(--bg)]">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <div class="mb-6 md:mb-0">
          <a href="#" class="text-2xl font-bold text-[var(--accent)]">Music</a>
          <p class="text-[var(--text)] mt-2">Sua música, em qualquer lugar</p>
        </div>
        <div class="flex flex-wrap gap-6">
          <div>
            <h4 class="font-semibold text-[var(--text-h)] mb-3">Navegação</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-[var(--text)] hover:text-[var(--accent)] transition-colors">Início</a></li>
              <li><a href="#" class="text-[var(--text)] hover:text-[var(--accent)] transition-colors">Biblioteca</a></li>
              <li><a href="#" class="text-[var(--text)] hover:text-[var(--accent)] transition-colors">Playlists</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="pt-8 border-t border-[var(--border)] text-center">
        <p class="text-[var(--text)]">© 2026 Music. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
`
