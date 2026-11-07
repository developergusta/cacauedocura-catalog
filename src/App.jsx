import { useEffect, useMemo, useState } from 'react'
import { BRL, CATEGORIES, FLAVORS, FORMATS } from './data.js'

const BOX_SIZE = 4

function flavorById(id) {
  return FLAVORS.find((f) => f.id === id)
}

export default function App() {
  const [mode, setMode] = useState('caixinha')
  const [filter, setFilter] = useState('todos')
  const [box, setBox] = useState([])
  const [cento, setCento] = useState({})
  const [boxesQty, setBoxesQty] = useState(1)
  const [centosQty, setCentosQty] = useState(1)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState('')

  const format = FORMATS[mode]
  const qty = mode === 'caixinha' ? boxesQty : centosQty
  const total = format.price * qty

  const visibleFlavors = useMemo(
    () => (filter === 'todos' ? FLAVORS : FLAVORS.filter((f) => f.category === filter)),
    [filter],
  )

  const boxCounts = useMemo(() => {
    const counts = {}
    box.forEach((id) => {
      counts[id] = (counts[id] || 0) + 1
    })
    return counts
  }, [box])

  const centoTotal = useMemo(
    () => Object.values(cento).reduce((sum, n) => sum + n, 0),
    [cento],
  )

  const boxFull = box.length >= BOX_SIZE
  const orderReady = mode === 'caixinha' ? box.length === BOX_SIZE : centoTotal > 0

  // Revelação suave ao rolar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.12 },
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [filter])

  function showToast(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  function addToBox(flavor) {
    if (box.length >= BOX_SIZE) return
    setBox([...box, flavor.id])
  }

  function removeFromBox(index) {
    setBox(box.filter((_, i) => i !== index))
  }

  function changeCento(flavorId, delta) {
    setCento((prev) => {
      const next = { ...prev }
      const value = (next[flavorId] || 0) + delta
      if (value <= 0) delete next[flavorId]
      else next[flavorId] = value
      return next
    })
  }

  function buildOrderText() {
    const lines = ['Pedido — Cacau e Doçura']
    if (mode === 'caixinha') {
      lines.push(`Formato: Caixinha com 4 brigadeiros (25 g cada, 100 g) — ${BRL(15)} por caixa`)
      lines.push(`Quantidade: ${boxesQty} caixa(s)`)
      lines.push('Sabores da caixinha:')
      Object.entries(boxCounts).forEach(([id, n]) => {
        lines.push(`- ${flavorById(id).name} ×${n}`)
      })
    } else {
      lines.push(`Formato: Cento de festa (15 g cada) — ${BRL(130)} por cento`)
      lines.push(`Quantidade: ${centosQty} cento(s) — ${centoTotal} brigadeiro(s) na lista`)
      lines.push('Sabores do cento:')
      Object.entries(cento).forEach(([id, n]) => {
        lines.push(`- ${flavorById(id).name} ×${n}`)
      })
    }
    lines.push(`Total: ${BRL(total)}`)
    return lines.join('\n')
  }

  async function copyOrder() {
    const text = buildOrderText()
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback para navegadores sem permissão de área de transferência
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
      } catch {
        // Se nem o fallback funcionar, o pedido fica visível no resumo
      }
      document.body.removeChild(textarea)
    }
    setCopied(true)
    showToast('Pedido copiado — é só colar na conversa!')
    window.setTimeout(() => setCopied(false), 2600)
  }

  return (
    <div className="page">
      <header className="nav">
        <div className="wrap nav-in">
          <a className="nav-brand" href="#top">
            Cacau e Doçura
          </a>
          <nav className="nav-links">
            <a href="#formatos">Formatos</a>
            <a href="#sabores">Sabores</a>
            <a href="#montar">Montar pedido</a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="wrap hero-in">
            <div className="reveal visible">
              <p className="kicker">Brigadeiros gourmet</p>
              <h1>
                Pequenos, <em>finos</em> e impossíveis de parar em um só.
              </h1>
              <p className="lede">
                Brigadeiro gourmet feito à mão, com chocolate nobre e sabores
                que vão do clássico ao pistache. Monte sua caixinha ou encomende
                o cento para a festa — são os mesmos 13 sabores nos dois formatos.
              </p>
              <div className="hero-ctas">
                <a className="btn btn-dark" href="#montar">
                  Montar meu pedido
                </a>
                <a className="btn btn-ghost" href="#sabores">
                  Ver os 13 sabores
                </a>
              </div>
              <div className="hero-meta">
                <span className="pill">
                  Caixinha com 4 · <b>R$ 15</b>
                </span>
                <span className="pill">
                  Cento de festa · <b>R$ 130</b>
                </span>
                <span className="pill">
                  <b>13</b> sabores
                </span>
              </div>
            </div>
            <div className="hero-media reveal visible">
              <div className="hero-frame">
                <div className="hero-art" aria-hidden="true">
                  <span className="hero-dot" style={{ background: '#6B3D22' }} />
                  <span className="hero-dot" style={{ background: '#84985A' }} />
                  <span className="hero-dot" style={{ background: '#E79BB0' }} />
                  <span className="hero-dot" style={{ background: '#EBD9AE' }} />
                  <span className="hero-dot" style={{ background: '#2E1A0F' }} />
                  <span className="hero-dot" style={{ background: '#EFAF35' }} />
                </div>
                <p className="hero-art-caption">Feitos à mão, um a um</p>
              </div>
              <div className="float-badge fb1">
                <b>R$ 15</b> caixinha com 4
              </div>
              <div className="float-badge fb2">
                <b>R$ 130</b> cento de festa
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...FLAVORS, ...FLAVORS].map((f, i) => (
              <span key={`${f.id}-${i}`}>
                {f.name} <i>✦</i>
              </span>
            ))}
          </div>
        </div>

        {/* FORMATOS */}
        <section id="formatos">
          <div className="wrap">
            <div className="sec-head reveal">
              <p className="orn">Dois formatos</p>
              <h2>
                Para presentear <em>ou</em> para a festa
              </h2>
              <p>
                Os mesmos sabores, dois jeitos de pedir. Na caixinha, cada
                brigadeiro pesa 25 g; no cento, 15 g — o tamanho de festa.
              </p>
            </div>
            <div className="formats">
              {Object.values(FORMATS).map((f) => (
                <article
                  key={f.id}
                  className={`fcard reveal ${mode === f.id ? 'fcard-active' : ''}`}
                >
                  <div className="fcard-art" aria-hidden="true">
                    {f.id === 'caixinha' ? (
                      <>
                        <span className="mini-dot" style={{ background: '#6B3D22' }} />
                        <span className="mini-dot" style={{ background: '#F0E3C2' }} />
                        <span className="mini-dot" style={{ background: '#84985A' }} />
                        <span className="mini-dot" style={{ background: '#E79BB0' }} />
                      </>
                    ) : (
                      <span className="cento-dots">
                        {FLAVORS.slice(0, 8).map((fl) => (
                          <span
                            key={fl.id}
                            className="mini-dot"
                            style={{ background: fl.color }}
                          />
                        ))}
                        <span className="cento-more">+92</span>
                      </span>
                    )}
                  </div>
                  <div className="fcard-body">
                    <h3>{f.name}</h3>
                    <p className="desc">{f.desc}</p>
                    <div className="spec">
                      <span>{f.weight}</span>
                    </div>
                    <div className="price-row">
                      <span className="price">
                        {BRL(f.price)} <small>{f.unitLabel}</small>
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => {
                        setMode(f.id)
                        document
                          .getElementById('montar')
                          ?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      Montar {f.id === 'caixinha' ? 'minha caixinha' : 'meu cento'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SABORES */}
        <section id="sabores">
          <div className="wrap">
            <div className="sec-head reveal">
              <p className="orn">Os sabores</p>
              <h2>
                Treze sabores, <em>quatro coleções</em>
              </h2>
              <p>
                Escolha por coleção ou veja todos. Toque em um sabor para
                adicioná-lo ao seu pedido.
              </p>
            </div>

            <div className="filters reveal" role="group" aria-label="Filtrar por coleção">
              <button
                type="button"
                className={filter === 'todos' ? 'chip active' : 'chip'}
                onClick={() => setFilter('todos')}
              >
                Todos · 13
              </button>
              {Object.values(CATEGORIES).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={filter === c.id ? 'chip active' : 'chip'}
                  onClick={() => setFilter(c.id)}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {Object.values(CATEGORIES)
              .filter((c) => filter === 'todos' || filter === c.id)
              .map((category) => (
                <div key={category.id} className="collection">
                  <h3 className="collection-title reveal">
                    {category.name}
                    <span> — {category.tagline}</span>
                  </h3>
                  <div className="grid">
                    {visibleFlavors
                      .filter((f) => f.category === category.id)
                      .map((flavor) => (
                        <article key={flavor.id} className="card reveal">
                          <div className="card-top">
                            <span
                              className="brigadeiro"
                              style={{ background: flavor.color }}
                              aria-label={`Brigadeiro ${flavor.name}`}
                            />
                            {flavor.badge ? (
                              <span className="badge">{flavor.badge}</span>
                            ) : null}
                          </div>
                          <h4>{flavor.name}</h4>
                          <p className="card-desc">{flavor.desc}</p>
                          <p className="finish">
                            <span>Finalização</span>
                            {flavor.finish}
                          </p>
                          {mode === 'caixinha' ? (
                            <button
                              type="button"
                              className="btn btn-add"
                              disabled={boxFull}
                              onClick={() => addToBox(flavor)}
                            >
                              {boxCounts[flavor.id]
                                ? `Na caixinha ×${boxCounts[flavor.id]} — adicionar`
                                : 'Adicionar à caixinha'}
                            </button>
                          ) : (
                            <div className="stepper">
                              <button
                                type="button"
                                aria-label={`Remover ${flavor.name} do cento`}
                                onClick={() => changeCento(flavor.id, -1)}
                                disabled={!cento[flavor.id]}
                              >
                                −
                              </button>
                              <span>{cento[flavor.id] || 0} no cento</span>
                              <button
                                type="button"
                                aria-label={`Adicionar ${flavor.name} ao cento`}
                                onClick={() => changeCento(flavor.id, 1)}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </article>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* MONTADOR */}
        <section id="montar">
          <div className="wrap">
            <div className="sec-head reveal">
              <p className="orn">Monte seu pedido</p>
              <h2>
                Sua caixinha, <em>do seu jeito</em>
              </h2>
              <p>
                Alterne entre caixinha e cento, escolha os sabores, ajuste a
                quantidade e copie o pedido pronto para enviar.
              </p>
            </div>

            <div className="builder reveal">
              <div className="mode-toggle" role="group" aria-label="Formato do pedido">
                {Object.values(FORMATS).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={mode === f.id ? 'mode-btn active' : 'mode-btn'}
                    onClick={() => setMode(f.id)}
                  >
                    {f.name} · {BRL(f.price)}
                  </button>
                ))}
              </div>

              {mode === 'caixinha' ? (
                <>
                  <p className="builder-hint">
                    Escolha {BOX_SIZE} sabores — pode repetir. Toque em um slot
                    para remover.
                  </p>
                  <div className="slots">
                    {Array.from({ length: BOX_SIZE }).map((_, i) => {
                      const id = box[i]
                      const flavor = id ? flavorById(id) : null
                      return (
                        <button
                          key={i}
                          type="button"
                          className={flavor ? 'slot filled' : 'slot'}
                          onClick={() => flavor && removeFromBox(i)}
                          aria-label={
                            flavor
                              ? `Remover ${flavor.name} da caixinha`
                              : `Slot ${i + 1} vazio`
                          }
                        >
                          {flavor ? (
                            <>
                              <span
                                className="brigadeiro small"
                                style={{ background: flavor.color }}
                              />
                              <span>{flavor.name}</span>
                            </>
                          ) : (
                            <span className="slot-empty">{i + 1}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                  <p className="builder-status">
                    {box.length === BOX_SIZE
                      ? 'Caixinha completa! 🎉'
                      : `Faltam ${BOX_SIZE - box.length} para completar a caixinha.`}
                  </p>
                </>
              ) : (
                <>
                  <p className="builder-hint">
                    Monte a lista do cento: toque em + nos sabores acima. O total
                    de brigadeiros na lista aparece aqui.
                  </p>
                  {centoTotal === 0 ? (
                    <p className="builder-status">
                      Nenhum sabor adicionado ao cento ainda.
                    </p>
                  ) : (
                    <ul className="summary-list">
                      {Object.entries(cento).map(([id, n]) => {
                        const flavor = flavorById(id)
                        return (
                          <li key={id}>
                            <span
                              className="brigadeiro tiny"
                              style={{ background: flavor.color }}
                            />
                            {flavor.name} <b>×{n}</b>
                            <button
                              type="button"
                              className="link-btn"
                              onClick={() => changeCento(id, -1)}
                            >
                              remover 1
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                  <p className="builder-status">
                    {centoTotal} brigadeiro(s) na lista do cento.
                  </p>
                </>
              )}

              <div className="qty-row">
                <span>
                  Quantidade de{' '}
                  {mode === 'caixinha' ? 'caixa(s)' : 'cento(s)'}
                </span>
                <div className="stepper">
                  <button
                    type="button"
                    aria-label="Diminuir quantidade"
                    disabled={qty <= 1}
                    onClick={() =>
                      mode === 'caixinha'
                        ? setBoxesQty(Math.max(1, boxesQty - 1))
                        : setCentosQty(Math.max(1, centosQty - 1))
                    }
                  >
                    −
                  </button>
                  <span>{qty}</span>
                  <button
                    type="button"
                    aria-label="Aumentar quantidade"
                    onClick={() =>
                      mode === 'caixinha'
                        ? setBoxesQty(boxesQty + 1)
                        : setCentosQty(centosQty + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="total-row">
                <div>
                  <span className="total-label">Total do pedido</span>
                  <span className="total-value">{BRL(total)}</span>
                  <span className="total-detail">
                    {qty} × {BRL(format.price)} · {format.name}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-dark btn-copy"
                  disabled={!orderReady}
                  onClick={copyOrder}
                >
                  {copied ? 'Pedido copiado ✓' : 'Copiar meu pedido'}
                </button>
              </div>
              {!orderReady && (
                <p className="builder-hint">
                  {mode === 'caixinha'
                    ? 'Complete os 4 slots da caixinha para copiar o pedido.'
                    : 'Adicione ao menos 1 brigadeiro ao cento para copiar o pedido.'}
                </p>
              )}
              {orderReady && (
                <pre className="order-preview">{buildOrderText()}</pre>
              )}
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="wrap">
            <p className="footer-brand">Cacau e Doçura</p>
            <p>
              Brigadeiros gourmet feitos à mão. Caixinha com 4 por R$ 15 ·
              Cento de festa por R$ 130.
            </p>
          </div>
        </footer>
      </main>

      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </div>
  )
}
