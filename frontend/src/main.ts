import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <header>
    <nav>
      <span class="logo">Music</span>
      <div class="links">
        <a href="#">Início</a>
        <a href="#">Biblioteca</a>
        <a href="#">Playlists</a>
      </div>
    </nav>
  </header>

  <main>
    <section class="hero">
      <h1>Sua música,<br>em qualquer lugar</h1>
      <p>Descubra, organize e curta suas músicas favoritas.</p>
    </section>

    <section class="cards">
      <div class="card">
        <h3>Biblioteca</h3>
        <p>Gerencie suas músicas e álbuns</p>
      </div>
      <div class="card">
        <h3>Playlists</h3>
        <p>Crie playlists personalizadas</p>
      </div>
      <div class="card">
        <h3>Descobertas</h3>
        <p>Encontre novas músicas</p>
      </div>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 Music. Todos os direitos reservados.</p>
  </footer>
`
