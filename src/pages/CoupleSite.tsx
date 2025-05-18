import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LoveCouple, getCoupleBySiteId, getPhotosByRoupleId, LovePhoto } from '@/services/CoupleService';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem
} from '@/components/ui/carousel';
import { useToast } from '@/hooks/use-toast';
import HeartRainAnimation from '@/components/HeartRainAnimation';

const CoupleSite: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [couple, setCouple] = useState<LoveCouple | null>(null);
  const [photos, setPhotos] = useState<LovePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHeartAnimation, setShowHeartAnimation] = useState(true);
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
  
  // Hide heart animation after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHeartAnimation(false);
    }, 5000); // 5000ms = 5 seconds

    return () => clearTimeout(timer); // Cleanup timeout
  }, []); // Run only once on mount

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
        <div className="text-love-600 text-4xl animate-pulse-heart">💖</div>
      </div>
    );
  }

  if (!couple) {
    return (
      <div className="flex items-center justify-center min-h-screen dark">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Página não encontrada</h1>
          <p className="mt-2">O casal que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pt-4 pb-8 dark text-foreground">
      {showHeartAnimation && <HeartRainAnimation />}
      <div className="container mx-auto px-4">
        {/* Icons simulating window buttons */}
        <div className="flex space-x-1 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        
        <div className="w-full max-w-sm mx-auto">
          <div className="flex-1">

            <div className="text-center">
              <h1 className="font-dancing text-2xl font-bold mb-4">
                {couple.couple_names}
              </h1>
            </div>

            {photos.length > 0 ? (
              <div className="h-96 bg-gray-200 rounded-lg mb-4 overflow-hidden">
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
              </div>
            ) : (
              <div className="h-96 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 11.5a2 2 0 114 0 2 2 0 01-4 0zm7.5 2.5l-2.086-2.086a2 2 0 00-2.828 0L7 16" />
                </svg>
              </div>
            )}
            
            <div className="text-center">
              <div className="text-center mb-4">
                <p className="font-bold mb-2">
                  Juntos há
                </p>
                <p className="font-medium">
                  {countdown.years > 0 && `${countdown.years} ${countdown.years === 1 ? 'ano' : 'anos'}, `}
                  {countdown.months > 0 && `${countdown.months} ${countdown.months === 1 ? 'mês' : 'meses'}, `}
                  {countdown.days > 0 && `${countdown.days} ${countdown.days === 1 ? 'dia' : 'dias'}`}
                </p>
                <p>
                  {countdown.hours} horas, {countdown.minutes} minutos e {countdown.seconds} segundos
                </p>
              </div>
              
              {couple.message && (
                <div className="w-16 h-px bg-gray-300 mx-auto my-6"></div>
              )}

              {couple.message && (
                <p className="text-lg">
                  {couple.message}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
      </div>
    </div>
  );
};

export default CoupleSite;
