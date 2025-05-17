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

    const calculateTimeDifference = () => {
      const dateStr = couple.relationship_start_date;
      const timeStr = couple.relationship_start_time;
      if (!dateStr || dateStr === 'null' || dateStr === 'undefined') {
        return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      let startDate: Date;
      if (timeStr && timeStr !== 'null' && timeStr !== 'undefined' && timeStr !== '') {
        // Garantir formato HH:mm
        const safeTime = timeStr.length === 5 ? timeStr : '00:00';
        startDate = new Date(`${dateStr}T${safeTime}:00`);
      } else {
        startDate = new Date(dateStr);
      }
      if (isNaN(startDate.getTime())) {
        console.warn('Data inválida recebida:', { dateStr, timeStr });
        return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      const now = new Date();
      let difference = now.getTime() - startDate.getTime();
      if (difference < 0) difference = 0;
      let seconds = Math.floor(difference / 1000);
      let minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      let hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
      let days = Math.floor(hours / 24);
      hours = hours % 24;
      let months = Math.floor(days / 30.4375);
      days = Math.floor(days % 30.4375);
      const years = Math.floor(months / 12);
      months = months % 12;
      return {
        years: isNaN(years) ? 0 : years,
        months: isNaN(months) ? 0 : months,
        days: isNaN(days) ? 0 : days,
        hours: isNaN(hours) ? 0 : hours,
        minutes: isNaN(minutes) ? 0 : minutes,
        seconds: isNaN(seconds) ? 0 : seconds
      };
    };
    const timer = setInterval(() => {
      setCountdown(calculateTimeDifference());
    }, 1000);
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
          <div className="w-full flex items-center justify-center bg-gray-200">
            {photos.length > 0 ? (
              <Carousel 
                className="w-full"
                opts={{ align: "start", loop: true }}
                orientation="horizontal"
                setApi={(api) => {
                  if (api && activeIndex !== api.selectedScrollSnap()) {
                    api.scrollTo(activeIndex);
                  }
                }}
              >
                <CarouselContent className="w-full">
                  {photos.map((photo, i) => (
                    <CarouselItem key={i} className="w-full">
                      <img 
                        src={photo.photo_url} 
                        alt={`Foto do casal ${i + 1}`} 
                        className="w-full object-contain rounded-lg"
                        style={{ maxHeight: 300 }}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="w-full flex items-center justify-center" style={{ height: 180 }}>
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 11.5a2 2 0 114 0 2 2 0 01-4 0zm7.5 2.5l-2.086-2.086a2 2 0 00-2.828 0L7 16" />
                </svg>
              </div>
            )}
          </div>
          {/* Countdown e Mensagem */}
          <div className="p-6 text-center flex flex-col items-center gap-2">
            <h2 className="font-bold text-gray-700 text-xl">Juntos</h2>
            <p className="text-love-600 font-medium text-xl">
              {countdown.years > 0 && `${countdown.years} ${countdown.years === 1 ? 'ano' : 'anos'}`}
              {countdown.years > 0 && (countdown.months > 0 || countdown.days > 0) && ', '}
              {countdown.months > 0 && `${countdown.months} ${countdown.months === 1 ? 'mês' : 'meses'}`}
              {countdown.months > 0 && countdown.days > 0 && ', '}
              {countdown.days > 0 && `${countdown.days} ${countdown.days === 1 ? 'dia' : 'dias'}`}
              {!(countdown.years || countdown.months || countdown.days) && '0 dias'}
            </p>
            <p className="text-love-500">
              {`${countdown.hours} horas, ${countdown.minutes} minutos e ${countdown.seconds} segundos`}
            </p>
            {couple.message && (
              <p className="text-gray-700 text-sm italic mt-4 whitespace-pre-line">
                {couple.message}
              </p>
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
