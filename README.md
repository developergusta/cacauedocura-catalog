# Cacau e Doçura — Brigadeiros Gourmet

Catálogo em React (Vite) dos brigadeiros gourmet da Cacau e Doçura.

- **Caixinha com 4** brigadeiros de 25 g cada (100 g) — **R$ 15,00**
- **Cento de festa** com brigadeiros de 15 g cada — **R$ 130,00**
- Mesmos 13 sabores nos dois formatos, em 4 coleções.
- Montador interativo: monte a caixinha de 4 ou a lista do cento, ajuste a
  quantidade, veja o total e copie o pedido pronto.
- Sem número de WhatsApp no catálogo — o pedido é copiado para colar na
  conversa. Se a dona informar o número, o botão de copiar pode virar um
  link `wa.me` depois.
- O botão final envia o pedido pronto no WhatsApp da Cacau e Doçura (+55 11 91503-1409): abre `wa.me/5511915031409` com a mensagem estruturada (formato, quantidade, sabores e total). O botão "Copiar meu pedido" continua como alternativa.

## Rodar localmente

Pré-requisito: Node.js 18+.

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (geralmente http://localhost:5173).

Outros comandos:

```bash
npm run build    # gera a versão de produção em dist/
npm run preview  # serve a versão de produção localmente
```

## Publicar na Vercel

1. Suba este projeto para um repositório no GitHub (ex.:
   `developergusta/cacauedocura-catalog`).
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e
   importe o repositório.
3. A Vercel detecta o Vite pelo `vercel.json` / `package.json`:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Clique em **Deploy**. A cada push na branch `main`, a Vercel publica
   uma nova versão automaticamente.

Não é preciso configurar variáveis de ambiente nem banco de dados: o
catálogo é 100% estático, o pedido é montado no navegador de quem abre.
