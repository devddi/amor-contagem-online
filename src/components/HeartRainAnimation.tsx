import React, { useEffect, useState } from 'react';

interface Heart {
  id: number;
  left: string;
  animationDuration: string;
}

const HeartRainAnimation: React.FC = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const createHeart = () => {
      const newHeart: Heart = {
        id: Date.now() + Math.random(), // Unique ID
        left: `${Math.random() * 100}vw`, // Random horizontal position
        animationDuration: `${Math.random() * 2 + 3}s`, // Random duration between 3s and 5s
      };
      setHearts(prevHearts => [...prevHearts, newHeart]);
    };

    // Create a new heart every 300ms
    const interval = setInterval(createHeart, 300);

    // Stop creating hearts after 3 seconds
    const stopGeneratingTimeout = setTimeout(() => {
      clearInterval(interval);
      console.log('Stopped generating hearts.');
    }, 3000); // 3000ms = 3 seconds

    // Cleanup function to clear interval and timeout
    return () => {
      clearInterval(interval);
      clearTimeout(stopGeneratingTimeout);
    };
  }, []);

  // Optional: Remove hearts that have fallen off screen (more advanced cleanup)
  useEffect(() => {
    if (hearts.length > 100) { // Keep a reasonable number of hearts
      setHearts(prevHearts => prevHearts.slice(hearts.length - 100));
    }
  }, [hearts.length]);


  return (
    <div className="heart-rain-container fixed inset-0 pointer-events-none z-10">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="heart-icon text-love-500 text-2xl absolute top-[-20px] animate-fall"
          style={{
            left: heart.left,
            animationDuration: heart.animationDuration,
          }}
        >
          💖
        </div>
      ))}
    </div>
  );
};

export default HeartRainAnimation; 