
import React, { useState, useEffect } from 'react';
import { Image } from 'lucide-react';
import { FormData } from './CreateSiteForm';

interface PhoneMockupProps {
  formData: FormData;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ formData }) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Calculate time difference
    const calculateTimeDifference = () => {
      const startDate = formData.relationshipStartDate && formData.relationshipStartTime 
        ? new Date(`${formData.relationshipStartDate}T${formData.relationshipStartTime}:00`)
        : new Date();
      
      const now = new Date();
      const difference = now.getTime() - startDate.getTime();
      
      // Check if the date is valid (in the past)
      if (difference < 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      // Calculate time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds };
    };

    // Update countdown every second
    const timer = setInterval(() => {
      setCountdown(calculateTimeDifference());
    }, 1000);

    // Initial calculation
    setCountdown(calculateTimeDifference());

    return () => clearInterval(timer);
  }, [formData.relationshipStartDate, formData.relationshipStartTime]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-gray-900 rounded-t-lg p-2 flex items-center justify-between">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-gray-400 text-xs">
          {formData.coupleNames ? `loveyou.com/${formData.coupleNames.toLowerCase().replace(/\s/g, '-').replace(/[^\w-]/g, '')}` : 'loveyou.com/'}
        </div>
      </div>
      
      <div className="border-t-0 border-x-8 border-b-8 border-gray-900 bg-white p-4 rounded-b-lg h-[450px] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          {formData.photos.length > 0 ? (
            <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
              <img 
                src={URL.createObjectURL(formData.photos[0])} 
                alt="Foto do casal" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <Image className="h-8 w-8 text-gray-400" />
            </div>
          )}
          
          <div className="text-center">
            <h1 className="font-dancing text-2xl font-bold mb-2 text-love-600">
              {formData.coupleNames || "André & Carol"}
            </h1>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-love-50 p-2 rounded-lg">
                <div className="text-xl font-bold text-love-600">{countdown.days}</div>
                <div className="text-xs text-gray-500">dias</div>
              </div>
              <div className="bg-love-50 p-2 rounded-lg">
                <div className="text-xl font-bold text-love-600">{countdown.hours}</div>
                <div className="text-xs text-gray-500">horas</div>
              </div>
              <div className="bg-love-50 p-2 rounded-lg">
                <div className="text-xl font-bold text-love-600">{countdown.minutes}</div>
                <div className="text-xs text-gray-500">min</div>
              </div>
              <div className="bg-love-50 p-2 rounded-lg">
                <div className="text-xl font-bold text-love-600">{countdown.seconds}</div>
                <div className="text-xs text-gray-500">seg</div>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm italic">
              {formData.message || "Cada momento ao seu lado é um presente. Te amo mais a cada segundo que passa! 💕"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
