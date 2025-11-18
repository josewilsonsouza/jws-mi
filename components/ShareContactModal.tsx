'use client'

import { useState } from 'react'
import { Contact } from '@/lib/supabase'
import QRCode from 'qrcode.react'
import { Copy, Download, X, MessageCircle } from 'lucide-react'

interface ShareContactModalProps {
  contact: Contact
  onClose: () => void
}

export default function ShareContactModal({
  contact,
  onClose,
}: ShareContactModalProps) {
  const [copied, setCopied] = useState(false)

  // Create vCard (standard contact format)
  const createVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
TEL:${contact.phone}
${contact.email ? `EMAIL:${contact.email}` : ''}
END:VCARD`
    return vcard
  }

  // Share URL (você pode colocar um link para um servidor que gera vCard)
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/share-contact/${contact.id}`

  // WhatsApp share message
  const whatsappMessage = `Conheça ${contact.name}: ${contact.phone}`
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`

  const handleCopyContact = () => {
    const text = `${contact.name}\n${contact.phone}${contact.email ? `\n${contact.email}` : ''}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadQR = () => {
    const qrElement = document.getElementById('qr-code-canvas')
    if (qrElement) {
      const link = document.createElement('a')
      link.href = (qrElement as any).toDataURL('image/png')
      link.download = `contato-${contact.name.toLowerCase().replace(/\s+/g, '-')}.png`
      link.click()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Compartilhar Contato</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
          <QRCode
            id="qr-code-canvas"
            value={shareUrl}
            size={200}
            level="H"
            includeMargin={true}
            fgColor="#000000"
            bgColor="#ffffff"
          />
        </div>

        {/* Contact Info */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="font-semibold text-gray-900 text-center">{contact.name}</p>
          <p className="text-sm text-gray-600 text-center">{contact.phone}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Copy Contact */}
          <button
            onClick={handleCopyContact}
            className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2"
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copiado!' : 'Copiar Contato'}
          </button>

          {/* Download QR */}
          <button
            onClick={handleDownloadQR}
            className="w-full px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Baixar QR Code
          </button>

          {/* Share via WhatsApp */}
          <a
            href={whatsappLink}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Compartilhar via WhatsApp
          </a>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
