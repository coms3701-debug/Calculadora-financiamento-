// Service Worker — faz a calculadora funcionar offline
// Quando atualizar o app, mude o número da versão abaixo (ex: v2, v3...)
const CACHE_NOME = 'calc-financiamento-v2';

const ARQUIVOS_PARA_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Instalação: baixa e guarda os arquivos
self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NOME).then((cache) => {
      return cache.addAll(ARQUIVOS_PARA_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação: limpa caches antigos
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((nomes) => {
      return Promise.all(
        nomes
          .filter((nome) => nome !== CACHE_NOME)
          .map((nome) => caches.delete(nome))
      );
    })
  );
  self.clients.claim();
});

// Fetch: serve do cache primeiro, busca na rede como fallback
self.addEventListener('fetch', (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((resposta) => {
      return resposta || fetch(evento.request);
    })
  );
});
