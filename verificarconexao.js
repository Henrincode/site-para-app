const aviso = document.getElementById('aviso-conexao');
const avisoOnline = document.getElementById('aviso-online');

function verificarConexao() {
  if (!navigator.onLine) {
    aviso.style.display = 'block';
    avisoOnline.style.display = 'none';
  } else {
    aviso.style.display = 'none';
    avisoOnline.style.display = 'block';
    setTimeout(() => avisoOnline.style.display = 'none', 3000);
  }
}

// window.addEventListener('load', verificarConexao);
window.addEventListener('online', verificarConexao);
window.addEventListener('offline', verificarConexao);