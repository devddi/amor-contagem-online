import React, { useState, useEffect } from 'react';
import { Image } from 'lucide-react';
import { FormData } from './CreateSiteForm';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from '@/components/ui/carousel';

interface PhoneMockupProps {
  formData: FormData;
  photoUrls?: string[]; // Added support for photo URLs
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ formData, photoUrls }) => {
  const [countdown, setCountdown] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [activeIndex, setActiveIndex] = useState(0);
  
  // Effect for carousel auto-rotation
  useEffect(() => {
    const photosLength = photoUrls ? photoUrls.length : formData.photos.length;
    
    if (photosLength > 1) {
      const interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % photosLength);
      }, 5000); // Change photo every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [formData.photos.length, photoUrls]);

  useEffect(() => {
    // Calculate time difference
    const calculateTimeDifference = () => {
      // console.log('calculateTimeDifference called');
      // console.log('formData.relationshipStartDate:', formData.relationshipStartDate);
      // console.log('formData.relationshipStartTime:', formData.relationshipStartTime);

      const dateStr = formData.relationshipStartDate;
      const timeStr = formData.relationshipStartTime;

      // Ensure both date and time are present
      if (!dateStr || !timeStr) {
         return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      // Construct the date string in ISO 8601 format (YYYY-MM-DDTHH:mm:ss)
      // Ensure time has seconds part (append :00 if not present)
      const fullTimeStr = timeStr.includes(':') && timeStr.split(':').length === 2 ? `${timeStr}:00` : timeStr;
      const startDate = new Date(`${dateStr}T${fullTimeStr}`);

      // console.log('Calculated startDate:', startDate);

      const now = new Date();
      let difference = now.getTime() - startDate.getTime();
      
      // console.log('Current time (now):', now);
      // console.log('Time difference (ms):', difference);

      // Check if the date is valid (in the past)
      if (isNaN(startDate.getTime()) || difference < 0) {
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
  }, [formData.relationshipStartDate, formData.relationshipStartTime]);

  const hasPhotos = photoUrls ? photoUrls.length > 0 : formData.photos.length > 0;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-gray-900 rounded-t-lg p-2 flex items-center justify-between">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-gray-400 text-xs">
          {formData.coupleNames ? `timeinlove.com.br/${formData.coupleNames.toLowerCase().replace(/\s/g, '-').replace(/[^\w-]/g, '')}` : 'timeinlove.com.br/'}
        </div>
      </div>
      
      <div className="border-t-0 border-x-8 border-b-8 border-gray-900 p-4 rounded-b-lg h-[800px] overflow-hidden flex flex-col dark bg-background text-foreground">
        <div className="flex-1">

          {/* Name (Carlos & Júlia or formData.coupleNames) - Moved above carousel */}
          <div className="text-center">
            <h3 className="font-dancing text-2xl font-bold mb-4">
              {formData.coupleNames || "Carlos & Júlia"}
            </h3>
          </div>

          {hasPhotos ? (
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
                  {photoUrls ? (
                    // Render photos from URLs
                    photoUrls.map((url, i) => (
                      <CarouselItem key={i} className="h-full">
                        <img 
                          src={url} 
                          alt={`Foto do casal ${i + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </CarouselItem>
                    ))
                  ) : (
                    // Render photos from files
                    formData.photos.map((photo, i) => (
                      <CarouselItem key={i} className="h-full">
                        <img 
                          src={URL.createObjectURL(photo)} 
                          alt={`Foto do casal ${i + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </CarouselItem>
                    ))
                  )}
                </CarouselContent>
              </Carousel>
            </div>
          ) : (
            <div className="h-96 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <Image className="h-8 w-8 text-gray-400" />
            </div>
          )}
          
          <div className="text-center">

            {/* Juntos há and Counter */}
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
            
            {/* Separator bar */}
            {formData.message && (
              <div className="w-16 h-px bg-gray-300 mx-auto my-6"></div>
            )}

            {/* Message */}
            {formData.message && (
              <p className="">
                {formData.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
