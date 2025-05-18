import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { PixPaymentModal } from "./PixPaymentModal"
import { createCoupleSite, checkSiteStatus } from "@/services/CoupleService"
import { useNavigate } from "react-router-dom"

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string) => void
  formData: any
  onResetForm: () => void
}

export function EmailModal({ isOpen, onClose, onSubmit, formData, onResetForm }: EmailModalProps) {
  const [email, setEmail] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showPixModal, setShowPixModal] = React.useState(false)
  const [pixData, setPixData] = React.useState<{ pix_url: string; pix_base64: string } | null>(null)
  const [siteId, setSiteId] = React.useState<number | null>(null)
  const [showSuccessModal, setShowSuccessModal] = React.useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Função para verificar o status do site
  const checkPaymentStatus = React.useCallback(async () => {
    if (!siteId) return;

    try {
      const isPaid = await checkSiteStatus(siteId);
      if (isPaid) {
        setShowPixModal(false);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  }, [siteId]);

  // Efeito para verificar o status periodicamente
  React.useEffect(() => {
    if (!showPixModal || !siteId) return;

    const interval = setInterval(checkPaymentStatus, 5000); // Verifica a cada 5 segundos
    return () => clearInterval(interval);
  }, [showPixModal, siteId, checkPaymentStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Primeiro, criar o site
      const result = await createCoupleSite(formData)
      
      if (!result) {
        throw new Error('Erro ao criar o site')
      }

      // Salva o site_id para verificação posterior
      setSiteId(result.id)

      // Depois, chamar o webhook com o site_id gerado
      const response = await fetch('https://n8n.ddinsights.tech/webhook/timeinlove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          valor: 29.90,
          site_id: result.id
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar dados')
      }

      const data = await response.json()
      
      // Armazena os dados do PIX e mostra o modal
      setPixData({
        pix_url: data.pix_url,
        pix_base64: data.pix_base64
      })
      setShowPixModal(true)
      
      // Fecha o modal de email
      onClose()
    } catch (error) {
      console.error('Erro ao processar:', error)
      toast({
        title: "Erro ao processar",
        description: "Não foi possível processar sua solicitação. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setEmail("");
    setPixData(null);
    setSiteId(null);
    onResetForm();
    navigate('/', { replace: true });
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Criar Nosso Site</DialogTitle>
            <DialogDescription>
              Digite seu email que deseja receber o link de acesso do seu site
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              className="w-full bg-love-gradient"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processando..." : "Começar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {pixData && (
        <PixPaymentModal
          isOpen={showPixModal}
          onClose={() => setShowPixModal(false)}
          pixUrl={pixData.pix_url}
          pixBase64={pixData.pix_base64}
        />
      )}

      <Dialog open={showSuccessModal} onOpenChange={handleCloseSuccessModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-green-600">Pagamento Confirmado!</DialogTitle>
            <DialogDescription>
              Seu site foi criado com sucesso! Em instantes você receberá um email com o link de acesso e o QR code do seu site.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleCloseSuccessModal}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 