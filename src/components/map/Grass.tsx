import React, { useEffect, useMemo, useState } from 'react';
import cacti1 from '@/assets/Elements/PNG/Cacti1.png';
import cacti2 from '@/assets/Elements/PNG/Cacti2.png';
import cacti3 from '@/assets/Elements/PNG/Cacti3.png';
import Image from 'next/image';

interface CactiProps {
  randomCactiImg: string;
  random: boolean;
}

const Cacti = React.memo(function Cacti({ randomCactiImg, random }: CactiProps) {
  if (random) {
    return (
      <div className="carti-img">
        <div
          style={{
            width: '50px',
            height: '50px',
          }}
        ></div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image src={randomCactiImg} alt="cacti" className="cacti-img carcti-isgenerated" />
    </div>
  );
});

const GenerateGrass = () => {
  const [grassWidth, setGrassWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      const grassWidth = document.querySelector('.grass')?.clientWidth || 0; // Use optional chaining to handle null value
      setGrassWidth(grassWidth);
    };

    // Initialize the grass width
    handleResize();

    // Listen for window resize to update the grass width
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const randomCacti = useMemo(() => [
    cacti1,
    cacti2,
    cacti3,
  ], []) as any;

  const cactiPositions = useMemo(() => {
    const positionsArray = Array.from({ length: Math.floor(grassWidth / 50) });
    return positionsArray.map((_, index) => {
      const random = Math.random() < 0.7;
      const randomCactiImg = randomCacti[Math.floor(Math.random() * randomCacti.length)];
      return (
        <div key={index} className="cacti-position">
          <Cacti randomCactiImg={randomCactiImg} random={random} />
        </div>
      );
    });
  }, [grassWidth, randomCacti]);

  return (
    <div className="biome block-shadow">
      <div className='grass-box'></div>
      <div className="column grass">
        <div className="cacti-positions">
          {cactiPositions}
        </div>
      </div>
    </div>
  );
};

export default GenerateGrass;
