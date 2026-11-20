
import { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowLeft, Battery, ChevronRight, Cpu, Gamepad2,
  Gauge, Monitor, Plus, Settings, ShieldCheck, Smartphone,
  Trash2, Zap
} from 'lucide-react'

declare global {
  interface Window {
    Android?: {
      getAndroidVersion: () => string
      getSupportedRefreshRates: () => string
      getCurrentRefreshRate: () => string
      setRefreshRate: (hz: number) => boolean
      openDisplaySettings: () => void
      openAnimationSettings: () => void
      getGraphicsDriverOptions: () => string
      setGraphicsDriver: (driver: string) => boolean
    }
  }
}

type Tab = 'inicio' | 'hz' | 'animacoes' | 'jogos' | 'compatibilidade'
const native = () => window.Android

export default function App() {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [tab, setTab] = useState<Tab>('inicio')
  const [mode, setMode] = useState<'app' | 'browser'>('app')
  const [notice, setNotice] = useState('')
  const [rates, setRates] = useState<number[]>([])
  const [selectedRate, setSelectedRate] = useState('')
  const [currentRate, setCurrentRate] = useState('—')
  const [androidVersion, setAndroidVersion] = useState('Não conectado')
  const [games, setGames] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('otimizacao-games') || '[]')
    } catch {
      return []
    }
  })
  const [newGame, setNewGame] = useState('')

  const connected = Boolean(native())

  useEffect(() => {
    if (!native()) return
    try {
      setAndroidVersion(native()!.getAndroidVersion())
      const parsed = JSON.parse(native()!.getSupportedRefreshRates()) as number[]
      setRates(parsed)
      setCurrentRate(native()!.getCurrentRefreshRate())
    } catch {
      setNotice('Não foi possível consultar todos os dados do Android.')
    }
  }, [unlocked])

  useEffect(() => {
    try {
      localStorage.setItem('otimizacao-games', JSON.stringify(games))
    } catch {
      setNotice('Não foi possível salvar a lista de jogos.')
    }
  }, [games])

  const tabs = useMemo(() => [
    ['inicio', 'Início', Activity],
    ['hz', 'Taxa Hz', Gauge],
    ['animacoes', 'Animações', Zap],
    ['jogos', 'Jogos', Gamepad2],
    ['compatibilidade', 'Sistema', ShieldCheck]
  ] as const, [])

  function applyRate() {
    if (!native()) {
      setNotice('Abra a versão Android instalada para usar esta função.')
      return
    }

    const value = Number(selectedRate)

    if (!value || !native()!.setRefreshRate(value)) {
      setNotice('O Android não aceitou a solicitação. Verifique as configurações do aparelho.')
      return
    }

    setNotice(`Solicitação de ${value} Hz enviada para este aplicativo.`)
    setCurrentRate(String(value))
  }

  function addGame() {
    const name = newGame.trim()

    if (!name) {
      setNotice('Digite o nome de um jogo.')
      return
    }

    if (games.some(game => game.toLowerCase() === name.toLowerCase())) {
      setNotice('Esse jogo já está na sua lista.')
      return
    }

    setGames(old => [...old, name])
    setNewGame('')
    setNotice(`${name} adicionado à sua biblioteca.`)
  }

  if (!unlocked) {
    return (
      <main className="login-wrap">
        <div className="login-card">
          <div className="logo-mark"><Zap size={30} /></div>
          <p className="eyebrow">BLACK & RED EDITION</p>
          <h1>OTIMIZAÇÃO <span>0.2</span></h1>
          <p className="muted">Digite a senha para continuar</p>

          <form onSubmit={e => {
            e.preventDefault()
            password === 'wwz'
              ? setUnlocked(true)
              : setNotice('Senha incorreta.')
          }}>
            <input
              aria-label="Senha"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Senha de acesso"
            />
            <button className="primary full">
              ENTRAR <ChevronRight size={17} />
            </button>
          </form>

          {notice && <p className="notice">{notice}</p>}
          <small>Protótipo • acesso local</small>
        </div>
      </main>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="mini-mark"><Zap size={18} /></div>
          <div>
            <b>OTIMIZAÇÃO <em>0.2</em></b>
            <small>BLACK & RED EDITION</small>
          </div>
        </div>
        <span className={`connection ${connected ? 'on' : ''}`}>
          <i /> {connected ? 'ANDROID' : 'NAVEGADOR'}
        </span>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">PAINEL DE CONTROLE</p>
          <h2>Seu dispositivo.<br /><span>Suas configurações.</span></h2>
          <p className="muted">Ajustes disponíveis e informações do sistema.</p>
        </div>
        <div className="hero-icon"><Smartphone size={34} /></div>
      </section>

      <div className="mode-row">
        <span>Modo de operação</span>
        <div className="segmented">
          <button className={mode === 'app' ? 'active' : ''} onClick={() => setMode('app')}>App</button>
          <button className={mode === 'browser' ? 'active' : ''} onClick={() => setMode('browser')}>Navegador</button>
        </div>
      </div>

      {!connected && mode === 'app' && (
        <div className="notice banner">
          A ponte Kotlin ainda não está conectada. Os controles nativos ficam indisponíveis no navegador.
        </div>
      )}

      {notice && (
        <div className="notice banner" onClick={() => setNotice('')}>
          {notice} <span>×</span>
        </div>
      )}

      <main className="content">
        {tab === 'inicio' && <>
          <div className="section-head">
            <div>
              <p className="eyebrow">VISÃO GERAL</p>
              <h3>Status do aparelho</h3>
            </div>
            <span className="live-dot">● AO VIVO*</span>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <Monitor /><small>Taxa atual informada</small>
              <strong>{currentRate}{currentRate !== '—' ? ' Hz' : ''}</strong>
            </div>
            <div className="stat-card">
              <Smartphone /><small>Versão Android</small>
              <strong>{androidVersion}</strong>
            </div>
            <div className="stat-card">
              <Cpu /><small>CPU</small><strong>Não disponível</strong>
            </div>
            <div className="stat-card">
              <Battery /><small>Bateria</small><strong>Não disponível</strong>
            </div>
          </div>

          <div className="section-head">
            <div><p className="eyebrow">FERRAMENTAS</p><h3>Configurações</h3></div>
          </div>

          <div className="menu-grid">
            {tabs.slice(1).map(([id, label, Icon]) => (
              <button className="menu-card" key={id} onClick={() => setTab(id)}>
                <Icon /><b>{label}</b><ChevronRight size={17} />
              </button>
            ))}
          </div>

          <p className="footnote">
            * Leituras dependem do que o Android disponibiliza. Dados não disponíveis não são simulados.
          </p>
        </>}

        {tab === 'hz' && <section className="panel">
          <button className="back" onClick={() => setTab('inicio')}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <p className="eyebrow">TELA</p>
          <h3>Taxa de atualização</h3>
          <p className="muted">
            Escolha uma taxa reportada pelo aparelho. A solicitação pode ser limitada pelo sistema.
          </p>
          <label>Taxas reportadas pelo Android</label>
          <select value={selectedRate} onChange={e => setSelectedRate(e.target.value)}>
            <option value="">Selecione uma taxa</option>
            {rates.map(r => <option key={r} value={r}>{r} Hz</option>)}
          </select>
          {rates.length === 0 && (
            <p className="muted">Nenhuma taxa foi consultada. Abra o APK Android para verificar.</p>
          )}
          <button className="primary full" onClick={applyRate}>APLICAR SOLICITAÇÃO</button>
          <button className="secondary full" onClick={() => native()?.openDisplaySettings()}>
            ABRIR CONFIGURAÇÕES DE TELA
          </button>
        </section>}

        {tab === 'animacoes' && <section className="panel">
          <button className="back" onClick={() => setTab('inicio')}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <p className="eyebrow">DESENVOLVEDOR</p>
          <h3>Escalas de animação</h3>
          <p className="muted">
            Aplicativos comuns não podem alterar diretamente as escalas globais protegidas do Android.
          </p>
          <div className="info-row"><Settings /><span>Escala de animação da janela</span><b>Manual</b></div>
          <div className="info-row"><Settings /><span>Escala de transição</span><b>Manual</b></div>
          <div className="info-row"><Settings /><span>Duração do animador</span><b>Manual</b></div>
          <button className="primary full" onClick={() => native()?.openAnimationSettings()}>
            ABRIR OPÇÕES DO DESENVOLVEDOR
          </button>
        </section>}

        {tab === 'jogos' && <section className="panel">
          <button className="back" onClick={() => setTab('inicio')}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <p className="eyebrow">BIBLIOTECA</p>
          <h3>Meus jogos</h3>
          <p className="muted">
            Adicione nomes de jogos à sua lista. Esta lista não modifica jogos instalados.
          </p>
          <div className="add-row">
            <input
              value={newGame}
              onChange={e => setNewGame(e.target.value)}
              placeholder="Nome do jogo"
              onKeyDown={e => e.key === 'Enter' && addGame()}
            />
            <button className="primary" onClick={addGame}><Plus /></button>
          </div>
          {games.length === 0 ? (
            <div className="empty">
              <Gamepad2 size={30} />
              <b>Nenhum jogo adicionado</b>
              <small>Adicione seu primeiro jogo acima.</small>
            </div>
          ) : games.map((g, i) => (
            <div className="game-row" key={`${g}-${i}`}>
              <Gamepad2 /><b>{g}</b>
              <button
                aria-label={`Remover ${g}`}
                onClick={() => setGames(old => old.filter((_, idx) => idx !== i))}
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </section>}

        {tab === 'compatibilidade' && <section className="panel">
          <button className="back" onClick={() => setTab('inicio')}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <p className="eyebrow">DIAGNÓSTICO</p>
          <h3>Compatibilidade</h3>
          <div className="info-row">
            <Smartphone /><span>Conexão Kotlin</span><b>{connected ? 'Conectada' : 'Ausente'}</b>
          </div>
          <div className="info-row">
            <Monitor /><span>Versão Android</span><b>{androidVersion}</b>
          </div>
          <div className="info-row">
            <Gauge /><span>Taxas consultadas</span><b>{rates.length}</b>
          </div>
          <div className="info-row">
            <Settings /><span>Driver gráfico</span><b>Gerenciado pelo sistema</b>
          </div>
          <p className="muted small">
            O driver gráfico não pode ser trocado por um app comum. Use opções oficiais do fabricante ou Android.
          </p>
        </section>}
      </main>

      <nav className="bottom-nav">
        {tabs.map(([id, label, Icon]) => (
          <button
            key={id}
            className={tab === id ? 'selected' : ''}
            onClick={() => setTab(id)}
          >
            <Icon size={19} /><small>{label}</small>
          </button>
        ))}
      </nav>

      <footer>OTIMIZAÇÃO 0.2 • CONTROLES REAIS SOMENTE QUANDO SUPORTADOS</footer>
    </div>
  )
    }
