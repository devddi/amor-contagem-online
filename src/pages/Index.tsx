import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CreateSiteForm, { FormData } from '@/components/CreateSiteForm';
import PhoneMockup from '@/components/PhoneMockup';
import { useToast } from '@/hooks/use-toast';
import { createCoupleSite } from '@/services/CoupleService';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { EmailModal } from '@/components/EmailModal';

const initialFormData: FormData = {
  coupleNames: '',
  relationshipStartDate: '',
  relationshipStartTime: '',
  message: '',
  photos: []
};

const coupleImages = [
  "https://casamento.biz/wp-content/uploads/2019/04/fotos-de-casal-tumblr-2.jpeg",
  "https://i.pinimg.com/originals/ef/5d/8c/ef5d8c94c0cf2f1082d3d498e4b0ce59.jpg",
  "https://i.pinimg.com/originals/06/cb/f6/06cbf681eba6bf503d3e819d112b40c9.jpg"
];

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [siteId, setSiteId] = useState("");
  
  useEffect(() => {
    if (!carouselApi) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => {
        const next = (prev + 1) % coupleImages.length;
        carouselApi.scrollTo(next);
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselApi]);

  const handleCreateSite = async () => {
    // Validate form data
    if (!formData.coupleNames) {
      toast({
        title: "Nome do casal obrigatório",
        description: "Por favor, insira o nome do casal para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.relationshipStartDate || !formData.relationshipStartTime) {
      toast({
        title: "Data e hora obrigatórias",
        description: "Por favor, insira a data e hora do início do relacionamento.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.photos.length === 0) {
      toast({
        title: "Foto obrigatória",
        description: "Por favor, adicione pelo menos uma foto do casal.",
        variant: "destructive"
      });
      return;
    }

    setIsEmailModalOpen(true);
  };

  const handleEmailSubmit = async (email: string) => {
    setIsEmailModalOpen(false);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Validate form data
    if (!formData.coupleNames) {
      toast({
        title: "Nome do casal obrigatório",
        description: "Por favor, insira o nome do casal para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.relationshipStartDate || !formData.relationshipStartTime) {
      toast({
        title: "Data e hora obrigatórias",
        description: "Por favor, insira a data e hora do início do relacionamento.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.photos.length === 0) {
      toast({
        title: "Foto obrigatória",
        description: "Por favor, adicione pelo menos uma foto do casal.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create the couple site in Supabase
      const result = await createCoupleSite(formData);
      
      if (result) {
        toast({
          title: "Site criado com sucesso!",
          description: "Seu site de amor está pronto.",
        });
        
        // Redirect to the new couple site
        navigate(`/${result.site_id}`);
      } else {
        toast({
          title: "Erro ao criar site",
          description: "Ocorreu um erro ao criar seu site. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating site:", error);
      toast({
        title: "Erro ao criar site",
        description: "Ocorreu um erro ao criar seu site. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData(initialFormData);
    setIsCreatingForm(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onLogoClick={() => setIsCreatingForm(false)} />
      
      <main className="flex-grow">
        {!isCreatingForm ? (
          <div className="container px-6 py-12 mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="headline-love text-5xl font-bold mb-4 bg-gradient-to-r from-love-500 to-love-700 text-transparent bg-clip-text">
                Conte cada segundo do seu amor ❤️
              </h1>
              <p className="text-xl text-gray-600 mb-12">
                Crie um site personalizado para celebrar o tempo do seu relacionamento 
                com contador em tempo real, fotos e uma mensagem especial.
              </p>
              
              {/* Example */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <div className="order-2 lg:order-1">
                  <h2 className="text-2xl font-bold mb-4">Seu amor merece ser contado</h2>
                  <ul className="text-left space-y-4">
                    <li className="flex items-start">
                      <span className="text-love-500 font-bold mr-2">✓</span>
                      <span>Contador em tempo real com anos, meses, dias, horas, minutos e segundos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-love-500 font-bold mr-2">✓</span>
                      <span>Design romântico e personalizado</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-love-500 font-bold mr-2">✓</span>
                      <span>URL única para compartilhar com quem você ama</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-love-500 font-bold mr-2">✓</span>
                      <span>Pagamento único - sem mensalidades!</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-love-500 font-bold mr-2">✓</span>
                      <span>Até 3 fotos do casal em carrossel</span>
                    </li>
                  </ul>
                  <div className="mt-14 flex justify-center">
                    <div className="text-center">
                      <Button 
                        size="lg" 
                        className="bg-love-600 hover:bg-love-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all animate-pulse-subtle"
                        onClick={() => {
                          setIsCreatingForm(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        Criar meu site
                      </Button>
                      <div className="mt-4 text-sm text-gray-500">
                        <span className="font-bold">R$29,90</span> - pagamento único
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="order-1 lg:order-2">
                  {/* Phone Mockup Frame Start */}
                  <div className="max-w-xs mx-auto">
                    <div className="bg-gray-900 rounded-t-lg p-2 flex items-center justify-between">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="text-gray-400 text-xs">timeinlove.com.br/carlos-e-julia</div>
                    </div>
                    
                    <div className="border-t-0 border-x-8 border-b-8 border-gray-900 bg-gray-900 p-4 rounded-b-lg h-[600px] overflow-hidden flex flex-col">
                      {/* Content inside frame */}
                      {/* Name (Carlos & Júlia example) - Moved above carousel */}
                      <div className="text-center mb-4 mt-4">
                        <h3 className="font-dancing text-2xl font-bold text-gray-300">
                          Carlos & Júlia
                        </h3>
                      </div>

                      {/* Carousel */}
                      <div className="h-80 w-full bg-gray-200 rounded-lg mb-4 overflow-hidden">
                        <Carousel
                          className="w-full h-full"
                          opts={{ align: 'start', loop: true }}
                          orientation="horizontal"
                          setApi={setCarouselApi}
                        >
                          <CarouselContent className="h-full">
                            {coupleImages.map((src, i) => (
                              <CarouselItem key={i} className="h-full">
                                <img
                                  src={src}
                                  alt={`Foto de um casal ${i + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                        </Carousel>
                      </div>
                      
                      {/* Text content (Juntos há, Counter, Message) */}
                      <div className="text-center">

                        {/* Juntos há and Counter */}
                        <div className="text-center mb-4">
                          <p className="font-bold text-gray-300 mb-2">
                            Juntos há
                          </p>
                          <p className="text-gray-300 font-medium">
                            1 ano, 0 meses, 0 dias
                          </p>
                          <p className="text-gray-300">
                            12 horas, 30 minutos e 15 segundos
                          </p>
                        </div>
                        
                        {/* Separator bar */}
                        <div className="w-16 h-px bg-gray-700 mx-auto my-6"></div>

                        {/* Message */}
                        <p className="text-gray-300 text-sm">
                          Um ano de muito amor, carinho e companheirismo. Que venham muitos mais! Te amo infinito ❤️
                        </p>
                      </div>
                      {/* End Content inside frame */}
                    </div>
                  </div>
                  {/* Phone Mockup Frame End */}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container px-6 py-12 mx-auto">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl font-bold mb-8 text-center">
                Quase lá! <span className="text-love-600">❤️</span>
              </h1>
              <p className="text-center mb-12 text-gray-600">
                Preencha os dados para criar seu contador personalizado
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <CreateSiteForm onFormChange={setFormData} />
                </div>
                
                <div className="order-first lg:order-last mb-8 lg:mb-0">
                  <div className="sticky top-6">
                    <h2 className="text-lg font-semibold mb-4">Como vai ficar 👇</h2>
                    <PhoneMockup formData={formData} />
                  </div>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <Button
                  size="lg"
                  className="bg-love-600 hover:bg-love-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all animate-pulse-subtle"
                  onClick={handleCreateSite}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Criando..." : "Criar nosso site"}
                </Button>
                <div className="mt-4 text-sm text-gray-500">
                  R$29,90 - pagamento único
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />

      <EmailModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSubmit={handleEmailSubmit}
        formData={formData}
        onResetForm={handleResetForm}
      />
    </div>
  );
};

export default Index;
