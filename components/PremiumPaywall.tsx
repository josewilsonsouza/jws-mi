interface PremiumPaywallProps {
  isOpen: boolean
  onClose: () => void
  contactCount: number
  maxFreeContacts: number
}

export default function PremiumPaywall({
  isOpen,
  onClose,
  contactCount,
  maxFreeContacts,
}: PremiumPaywallProps) {
  if (!isOpen) return null

  const features = [
    { free: '50 contatos', premium: 'Contatos ilimitados' },
    { free: 'Tags básicas', premium: 'Tags com emojis' },
    { free: 'Notas simples', premium: 'Lembretes com notificações' },
    { free: 'Busca básica', premium: 'Busca avançada' },
    { free: '—', premium: 'Exportar contatos (CSV/PDF)' },
    { free: '—', premium: 'Integração com calendário' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-96 overflow-y-auto">
        {/* Close button */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">Upgrade para Premium</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-red-600 mb-1">Limite atingido</p>
            <p className="text-2xl font-bold text-red-700">
              {contactCount} / {maxFreeContacts}
            </p>
            <p className="text-xs text-red-600 mt-2">
              Você atingiu o limite de contatos da versão gratuita
            </p>
          </div>

          {/* Pricing */}
          <div className="text-center border-2 border-green-600 rounded-lg p-4 bg-green-50">
            <p className="text-gray-600 text-sm mb-1">Plano Premium</p>
            <p className="text-4xl font-bold text-green-600 mb-1">
              R$ 19,90
            </p>
            <p className="text-xs text-gray-600">/mês (primeiros 3 meses: R$ 9,90)</p>
          </div>

          {/* Features Comparison */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Comparação de Planos</h3>
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm">
                <div className="flex-1">
                  <p className="text-gray-600">{feature.free}</p>
                </div>
                <div className="flex-1">
                  <p className="text-green-600 font-medium">{feature.premium}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
              Fazer Upgrade Agora
            </button>
            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Talvez Depois
            </button>
          </div>

          {/* Trust indicators */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>✓ Cancelar a qualquer momento</p>
            <p>✓ Sem cartão de crédito necessário para teste</p>
          </div>
        </div>
      </div>
    </div>
  )
}
