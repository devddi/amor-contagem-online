import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Copy } from "lucide-react"

interface PixPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  pixUrl: string
  pixBase64: string
}

export function PixPaymentModal({ isOpen, onClose, pixUrl, pixBase64 }: PixPaymentModalProps) {
  const { toast } = useToast()

  const handleCopyPixUrl = async () => {
    try {
      await navigator.clipboard.writeText(pixUrl)
      toast({
        title: "Link copiado!",
        description: "O link do PIX foi copiado para sua área de transferência.",
      })
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link do PIX. Tente novamente.",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Pagamento via PIX</DialogTitle>
          <DialogDescription>
            Escaneie o QR Code ou copie o código PIX para realizar o pagamento
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* QR Code */}
          <div className="flex justify-center">
            <img 
              src={`data:image/png;base64,${pixBase64}`} 
              alt="QR Code PIX" 
              className="w-64 h-64"
            />
          </div>

          {/* PIX URL */}
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Ou copie o código PIX:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-gray-100 rounded text-sm break-all">
                {pixUrl}
              </code>
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopyPixUrl}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            Após o pagamento, seu site será liberado automaticamente
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 