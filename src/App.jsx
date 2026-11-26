import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { configurado, supabase } from './lib/supabase'
import AuthPage from './components/AuthPage'
import PendingApproval from './components/PendingApproval'
import Dashboard from './components/Dashboard'

function TelaCentral({ children }) {
  return <div className="tela-central">{children}</div>
}

function App() {
  // session: undefined = ainda carregando | null = deslogado | objeto = logado
  const [session, setSession] = useState(undefined)
  const [perfil, setPerfil] = useState(null)
  const [carregandoPerfil, setCarregandoPerfil] = useState(false)
  // guarda de qual usuário o perfil já foi carregado (evita "piscar" a tela errada)
  const [perfilCarregadoPara, setPerfilCarregadoPara] = useState(null)

  const userId = session?.user?.id
  const aguardandoPerfil = Boolean(userId) && perfilCarregadoPara !== userId

  // Acompanha o login/logout
  useEffect(() => {
    if (!configurado) {
      setSession(null)
      return
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, novaSessao) => setSession(novaSessao))
    return () => subscription.unsubscribe()
  }, [])

  // Busca o perfil (nome, se já foi aprovado, papel)
  const carregarPerfil = useCallback(async () => {
    if (!userId) {
      setPerfil(null)
      setPerfilCarregadoPara(null)
      return
    }
    setCarregandoPerfil(true)
    const { data } = await supabase
      .from('profiles')
      .select('nome, email, aprovado, papel')
      .eq('id', userId)
      .maybeSingle()
    setPerfil(data)
    setPerfilCarregadoPara(userId)
    setCarregandoPerfil(false)
  }, [userId])

  useEffect(() => {
    carregarPerfil()
  }, [carregarPerfil])

  const sair = () => supabase.auth.signOut()

  if (!configurado) {
    return (
      <TelaCentral>
        <div className="caixa-aviso">
          <h2>Configuração pendente</h2>
          <p>
            Defina as variáveis <code>VITE_SUPABASE_URL</code> e{' '}
            <code>VITE_SUPABASE_ANON_KEY</code> (no arquivo <code>.env</code> ou no painel da
            Vercel) e publique novamente.
          </p>
        </div>
      </TelaCentral>
    )
  }

  if (session === undefined || aguardandoPerfil) {
    return (
      <TelaCentral>
        <div className="carregando">Carregando…</div>
      </TelaCentral>
    )
  }

  if (!session) return <AuthPage />

  if (!perfil?.aprovado) {
    return (
      <PendingApproval
        email={perfil?.email || session.user.email}
        carregando={carregandoPerfil}
        onVerificar={carregarPerfil}
        onSair={sair}
      />
    )
  }

  return <Dashboard perfil={perfil} onSair={sair} />
}

export default App
