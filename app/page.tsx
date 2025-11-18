import Link from 'next/link'
import { MessageCircle, Tag, Search, Crown, Check } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <h1 className="font-semibold text-lg text-gray-900">Contact Manager</h1>
          </div>
          <Link
            href="/auth"
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            Entrar
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Organize seus contatos do WhatsApp com inteligência
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Adicione contexto, tags e notas aos seus contatos. Nunca mais esqueça
              onde conheceu alguém ou do que precisam conversar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition text-lg"
              >
                Começar Grátis
              </Link>
              <button className="px-8 py-3 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition text-lg flex items-center justify-center gap-2">
                <Crown className="h-5 w-5" />
                Ver Planos
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="flex flex-col gap-3 p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Tag className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Organize por Contexto</h3>
                <p className="text-gray-600">
                  Adicione tags como "UFRJ", "Projeto X", "Cliente" para categorizar
                  seus contatos por contexto, empresa ou projeto.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col gap-3 p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Search className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Busca Inteligente</h3>
                <p className="text-gray-600">
                  Encontre rapidamente qualquer pessoa buscando por nome, tag ou
                  notas de interação.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col gap-3 p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Integração WhatsApp</h3>
                <p className="text-gray-600">
                  Abra conversas diretamente no WhatsApp com um clique. Simples e rápido.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Planos Simples e Transparentes
              </h3>
              <p className="text-gray-600">
                Comece grátis, faça upgrade quando precisar
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Free Plan */}
              <div className="flex flex-col gap-4 p-6 rounded-lg border border-gray-200 bg-white hover:shadow-lg transition">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Gratuito</h4>
                  <div className="text-3xl font-bold text-gray-900 mb-4">$0</div>
                </div>
                <ul className="flex flex-col gap-3 flex-1">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    Até 50 contatos enriquecidos
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    Tags básicas
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    Busca simples
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    Deep linking WhatsApp
                  </li>
                </ul>
                <Link
                  href="/auth"
                  className="w-full px-4 py-2 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition text-center"
                >
                  Começar Grátis
                </Link>
              </div>

              {/* Premium Plan */}
              <div className="flex flex-col gap-4 p-6 rounded-lg border-2 border-green-600 bg-green-50 hover:shadow-lg transition">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-semibold text-gray-900">Premium</h4>
                    <Crown className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-gray-900">$4.99</span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                </div>
                <ul className="flex flex-col gap-3 flex-1">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    Contatos ilimitados
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    Tags customizadas
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    Lembretes de follow-up
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    Notas detalhadas
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    Busca avançada
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    Suporte prioritário
                  </li>
                </ul>
                <Link
                  href="/auth"
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition text-center flex items-center justify-center gap-2"
                >
                  <Crown className="h-4 w-4" />
                  Começar Agora
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Perguntas Frequentes
              </h3>
            </div>

            <div className="space-y-4">
              <details className="group border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-gray-900 select-none">
                  Como começo a usar?
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-4 text-gray-600">
                  Clique em "Começar Grátis", crie sua conta com email e senha, e você terá
                  acesso imediato aos seus primeiros 50 contatos com todas as features básicas.
                </p>
              </details>

              <details className="group border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-gray-900 select-none">
                  Posso testar antes de pagar?
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-4 text-gray-600">
                  Sim! O plano gratuito é completo com todas as features principais.
                  Você só precisa fazer upgrade para o Premium se quiser mais de 50 contatos.
                </p>
              </details>

              <details className="group border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-gray-900 select-none">
                  Meus dados estão seguros?
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-4 text-gray-600">
                  Sim! Seus dados são armazenados com segurança em servidores Supabase
                  com criptografia de ponta a ponta. Somente você tem acesso aos seus contatos.
                </p>
              </details>

              <details className="group border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-gray-900 select-none">
                  Como faço para cancelar minha assinatura?
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-4 text-gray-600">
                  Você pode cancelar sua assinatura a qualquer momento sem compromisso.
                  Seus contatos no plano gratuito permanecerão acessíveis.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-4">
              Pronto para organizar seus contatos?
            </h3>
            <p className="text-lg text-green-50 mb-8">
              Comece grátis, sem cartão de crédito necessário.
            </p>
            <Link
              href="/auth"
              className="inline-block px-8 py-3 bg-white text-green-600 rounded-lg font-bold text-lg hover:bg-green-50 transition"
            >
              Começar Agora
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2024 WhatsApp Contact Manager. Organize seus contatos com inteligência.</p>
          <div className="flex justify-center gap-6 mt-4 text-xs">
            <a href="#" className="hover:text-green-600">Privacidade</a>
            <a href="#" className="hover:text-green-600">Termos</a>
            <a href="#" className="hover:text-green-600">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
