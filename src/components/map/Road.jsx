import React, { useEffect, useRef, useState, useMemo } from 'react';
import road from '@/assets/Elements/PNG/Road.png';
import roadLines from '@/assets/Elements/PNG/RoadLines.png';
import car1 from '@/assets/Elements/PNG/Car_1.png';
import car2 from '@/assets/Elements/PNG/Car_2.png';
import car3 from '@/assets/Elements/PNG/Car_3.png';
import car4 from '@/assets/Elements/PNG/Car_4.png';
import car5 from '@/assets/Elements/PNG/Car_5.png';
import car6 from '@/assets/Elements/PNG/Car_6.png';
import PlayerContent, { usePlayerContent } from '@/context/PlayerContent';

const Road = ({ quantity }) => {
  const carTypes = [car1, car2, car3, car4, car5, car6];

  const Cars = React.memo(function Cars({ playerElement }) {

    const randomCar = useMemo(() => carTypes[Math.floor(Math.random() * carTypes.length)], []);

    const [cars] = useState([
      <Car key={0} car={randomCar} playerElement={playerElement} className="" />,
      <Car key={0} car={randomCar} playerElement={playerElement} className="" />,
      <Car key={0} car={randomCar} playerElement={playerElement} className="car_8000" />,
    ]);

    return (
      <div className="car_items">
        {cars.map((car, index) => (
          <React.Fragment key={index}>{car}</React.Fragment>
        ))}
      </div>
    );
  });

  const Car = React.memo(function Car({ car, playerElement, className }) {
    const { setIsDead, isCollide, canChangeState } = usePlayerContent();
    const canvasRef = useRef(null);
    const positionRef = useRef(-101);
    const speedRef = useRef(2);
    const [position, setPosition] = useState(-101);
    const [randomSpeed, setRandomSpeed] = useState();
    const [randomDelay, setRandomDelay] = useState();
    const imgRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const drawFrame = () => {
        positionRef.current += speedRef.current;
        drawCar(ctx);
        requestAnimationFrame(drawFrame);
      };
      const animationFrame = requestAnimationFrame(drawFrame);

      return () => cancelAnimationFrame(animationFrame);
    }, []);

    useEffect(() => {
      const car = document.querySelectorAll('.car');
      if (playerElement) {
        car.forEach((car) => {
          if (isCollide(car, playerElement)) {
            canChangeState && setIsDead(true);
          }
        });
      }
    }, [playerElement, isCollide, setIsDead, canChangeState]);

    useEffect(() => {
      const image = new Image();
      image.src = car.src;
      imgRef.current = image;
    }, [car]);

    const drawCar = (ctx) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      const imageWidth = ctx.canvas.width;
      const imageHeight = ctx.canvas.height;
      ctx.drawImage(imgRef.current, 0, 0, imageWidth, imageHeight);
    };

    const speeds = [20, 25, 27, 30]
    const startDelay = [2000, 3000, 4000, 5000]

    useEffect(() => {
      const randomDelayGen = startDelay[Math.floor(Math.random() * startDelay.length)];
      setRandomDelay(randomDelayGen);
    }, []);

    useEffect(() => {
      const randomSpeedGen = speeds[Math.floor(Math.random() * speeds.length)];
      setRandomSpeed(randomSpeedGen);
    }, []);

    useEffect(() => {
      let animationFrameId;
      let lastTime = 0;

      const updatePosition = (timestamp) => {
        if (lastTime !== 0) {
          const timeDelta = timestamp - lastTime;
          const distance = (randomSpeed / 50) * timeDelta;
          setPosition((prevPosition) => {
            let newPosition = prevPosition + distance;
            if (newPosition >= 1920) {
              newPosition = -110;
            }
            return newPosition;
          });
        }
        lastTime = timestamp;
        animationFrameId = requestAnimationFrame(updatePosition);
      };

      const startAnimation = () => {
        animationFrameId = requestAnimationFrame(updatePosition);
      };

      const stopAnimation = () => {
        cancelAnimationFrame(animationFrameId);
      };

      const timeoutId = setTimeout(() => {
        startAnimation();
      }, randomDelay);

      return () => {
        clearTimeout(timeoutId);
        stopAnimation();
      };
    }, [randomDelay, randomSpeed]);


    return (
      <div className={`car ${className}`}
        style={{
          transform: className === "" ? `translateX(${position}px)` : "unset",
        }}
      >
        <canvas ref={canvasRef} width="50" height="30" />
      </div>
    )
  });

  const playerElement = document.querySelector('.player');

  const renderDivs = () => {
    const divs = [];
    for (let i = 0; i < quantity; i++) {
      const isOposite = i % 2 === 0;
      const first = i === 0;
      divs.push(
        <div
          key={i}
          className="column road"
          style={{
            transform: `scaleX(${isOposite ? -1 : 1}) scaleY(${isOposite ? -1 : 1.01})`,
          }}
        >
          <Cars playerElement={playerElement} />
          <img src={road.src} alt="road" className="road-img" />
          <img
            src={roadLines.src}
            alt="road-lines"
            className="road-lines-img"
            style={{
              top: `${isOposite && 93}%`,
              display: `${first && 'none'}`,
            }}
          />
        </div>
      );
    }
    return <div className="biome">{divs}</div>;
  };

  return (
    <>
      {quantity > 1 ? (
        renderDivs()
      ) : (
        <>
          {quantity > 1 ? (
            renderDivs()
          ) : (
            <div className="biome">
              <div className="road-box"></div>
              <img src={road.src} alt="road" className="road-img" />
              <div
                className="column road"
                style={{
                  transform: `scaleX(${quantity % 2 === 0 ? -1 : 1})`,
                }}
              >
                <Cars />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Road;
