import './style.css'
import './index.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <header class="px-4 py-4 md:px-6 border-b border-[var(--border)] bg-[var(--bg)]">
    <nav class="flex items-center justify-between max-w-7xl mx-auto">
      <span class="text-xl font-bold text-[var(--text-h)]">Music</span>
      <div class="hidden md:flex gap-6">
        <a href="#" class="text-[var(--text)] hover:text-[var(--text-h)] transition-colors">Início</a>
        <a href="#" class="text-[var(--text)] hover:text-[var(--text-h)] transition-colors">Biblioteca</a>
        <a href="#" class="text-[var(--text)] hover:text-[var(--text-h)] transition-colors">Playlists</a>
      </div>
    </nav>
  </header>

  <main class="flex-1">
    <section class="relative py-16 md:py-24 px-4 md:px-6 bg-[var(--bg)]">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-[var(--text-h)] mb-6">
          Sua música,<br>em qualquer lugar
        </h1>
        <p class="text-lg md:text-xl text-[var(--text)] max-w-2xl mx-auto">
          Descubra, organize e curta suas músicas favoritas.
        </p>
      </div>
    </section>

    <section class="py-12 px-4 md:px-6 bg-[var(--bg)]">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 rounded-lg border border-[var(--border)] bg-[var(--bg)] hover:shadow-lg transition-shadow">
            <h3 class="text-xl font-semibold text-[var(--text-h)] mb-3">Biblioteca</h3>
            <p class="text-[var(--text)]">Gerencie suas músicas e álbuns</p>
          </div>
          <div class="p-6 rounded-lg border border-[var(--border)] bg-[var(--bg)] hover:shadow-lg transition-shadow">
            <h3 class="text-xl font-semibold text-[var(--text-h)] mb-3">Playlists</h3>
            <p class="text-[var(--text)]">Crie playlists personalizadas</p>
          </div>
          <div class="p-6 rounded-lg border border-[var(--border)] bg-[var(--bg)] hover:shadow-lg transition-shadow">
            <h3 class="text-xl font-semibold text-[var(--text-h)] mb-3">Descobertas</h3>
            <p class="text-[var(--text)]">Encontre novas músicas</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="py-6 px-4 md:px-6 border-t border-[var(--border)] bg-[var(--bg)]">
    <div class="max-w-7xl mx-auto text-center">
      <p class="text-[var(--text)]">© 2026 Music. Todos os direitos reservados.</p>
    </div>
  </footer>
`
