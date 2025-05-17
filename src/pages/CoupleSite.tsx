
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LoveCouple, getCoupleBySiteId, getPhotosByRoupleId, LovePhoto } from '@/services/CoupleService';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem
} from '@/components/ui/carousel';
import { useToast } from '@/hooks/use-toast';

const CoupleSite: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [couple, setCouple] = useState<LoveCouple | null>(null);
  const [photos, setPhotos] = useState<LovePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const { toast } = useToast();
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch couple data and photos
  useEffect(() => {
    const fetchCoupleData = async () => {
      if (!siteId) return;
      
      try {
        setLoading(true);
        const coupleData = await getCoupleBySiteId(siteId);
        
        if (coupleData) {
          setCouple(coupleData);
          
          // Fetch photos
          const photosData = await getPhotosByRoupleId(coupleData.id);
          if (photosData) {
            setPhotos(photosData);
          }
        } else {
          toast({
            title: "Não encontramos esse casal",
            description: "Verifique o link e tente novamente.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching couple data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoupleData();
  }, [siteId, toast]);
  
  // Effect for carousel auto-rotation
  useEffect(() => {
    if (photos.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % photos.length);
      }, 5000); // Change photo every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [photos.length]);
  
  // Calculate and update countdown
  useEffect(() => {
    if (!couple) return;
    
    // Calculate time difference
    const calculateTimeDifference = () => {
      const startDate = couple.relationship_start_date && couple.relationship_start_time 
        ? new Date(`${couple.relationship_start_date}T${couple.relationship_start_time}:00`)
        : new Date(couple.relationship_start_date);
      
      const now = new Date();
      const difference = now.getTime() - startDate.getTime();
      
      // Check if the date is valid (in the past)
      if (difference < 0) {
        return {
          years: 0,
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      // Calculate time units
      let seconds = Math.floor(difference / 1000);
      let minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      
      let hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
      
      // Approximate calculation for years, months, and days
      let days = Math.floor(hours / 24);
      hours = hours % 24;
      
      let months = Math.floor(days / 30.4375); // Average days in a month
      days = Math.floor(days % 30.4375);
      
      const years = Math.floor(months / 12);
      months = months % 12;
      
      return { years, months, days, hours, minutes, seconds };
    };

    // Update countdown every second
    const timer = setInterval(() => {
      setCountdown(calculateTimeDifference());
    }, 1000);

    // Initial calculation
    setCountdown(calculateTimeDifference());

    return () => clearInterval(timer);
  }, [couple]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-love-600 text-xl">Carregando...</div>
      </div>
    );
  }

  if (!couple) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Página não encontrada</h1>
          <p className="text-gray-600 mt-2">O casal que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-pink-100 py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-love-600 p-4 text-white text-center">
            <h1 className="font-dancing text-3xl">{couple.couple_names}</h1>
          </div>
          
          {/* Photos */}
          <div className="h-64 bg-gray-200">
            {photos.length > 0 ? (
              <Carousel 
                className="w-full h-full"
                opts={{
                  align: "start",
                  loop: true,
                }}
                orientation="horizontal"
                setApi={(api) => {
                  if (api && activeIndex !== api.selectedScrollSnap()) {
                    api.scrollTo(activeIndex);
                  }
                }}
              >
                <CarouselContent className="h-full">
                  {photos.map((photo, i) => (
                    <CarouselItem key={i} className="h-full">
                      <img 
                        src={photo.photo_url} 
                        alt={`Foto do casal ${i + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-4xl">❤️</div>
              </div>
            )}
          </div>
          
          {/* Countdown */}
          <div className="p-6 text-center">
            <h2 className="font-bold text-gray-700 text-xl mb-2">
              Juntos há
            </h2>
            <p className="text-love-600 font-medium text-xl">
              {countdown.years > 0 && `${countdown.years} ${countdown.years === 1 ? 'ano' : 'anos'}, `}
              {countdown.months > 0 && `${countdown.months} ${countdown.months === 1 ? 'mês' : 'meses'}, `}
              {countdown.days > 0 && `${countdown.days} ${countdown.days === 1 ? 'dia' : 'dias'}`}
            </p>
            <p className="text-love-500">
              {countdown.hours} horas, {countdown.minutes} minutos e {countdown.seconds} segundos
            </p>
            
            {/* Message */}
            {couple.message && (
              <div className="mt-8 p-4 bg-pink-50 rounded-lg">
                <p className="text-gray-700 italic">"{couple.message}"</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Feito com ❤️</p>
          <p className="mt-1">
            <a href="/" className="underline hover:text-love-600 transition-colors">
              Crie seu próprio contador de amor
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoupleSite;
