/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import PlayerContent, { usePlayerContent } from '@/context/PlayerContent';
import river from '@/assets/Elements/PNG/River.png';
import river2 from '@/assets/Elements/PNG/River2.png';
import river3 from '@/assets/Elements/PNG/River3.png';
import log from '@/assets/Elements/PNG/Log.png';

const Water = ({ quantity }) => {

    const RiverImage = () => {
        const [riverSrc, setRiverSrc] = useState([river.src, river2.src, river3.src]);

        //every 0.5s change the river image
        useEffect(() => {
            const interval = setInterval(() => {
                setRiverSrc((prev) => {
                    const newSrc = [...prev];
                    newSrc.push(newSrc.shift());
                    return newSrc;
                });
            }, 500);
            return () => clearInterval(interval);
        }, []);
        return (
            <>
                <img src={riverSrc[0]} alt="river" className="river" style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    objectFit: 'cover',

                }} />
            </>
        )
    }
    const Logs = React.memo(function Logs() {

        const Log = React.memo(function Log({ id, className }) {
            const { isCollide, setIsDead, pos, canChangeState } = usePlayerContent();
            const canvasRef = useRef(null);
            const positionRef = useRef(-101);
            const speedRef = useRef(2);
            const [position, setPosition] = useState(-101);
            const imgRef = useRef(null);
            const [randomSpeed, setRandomSpeed] = useState();
            const [randomDelay, setRandomDelay] = useState();

            useEffect(() => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');

                const drawFrame = () => {
                    positionRef.current += speedRef.current;
                    drawLog(ctx);
                    requestAnimationFrame(drawFrame);
                };

                const animationFrame = requestAnimationFrame(drawFrame);

                return () => cancelAnimationFrame(animationFrame);
            }, []);

            useEffect(() => {
                const playerElement = document.querySelector('.player');
                const log = document.querySelectorAll('.log');
                if (playerElement) {
                    log.forEach((log) => {
                        if (isCollide(playerElement, log)) {
                            canChangeState && setIsDead(true);
                        }
                    });
                }
            }, [isCollide, setIsDead, positionRef, canChangeState, position]);

            useEffect(() => {
                const image = new Image();
                image.src = log.src;
                imgRef.current = image;
            }, []);

            const drawLog = (ctx) => {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                const image = imgRef.current;
                const imageWidth = image.width;
                const imageHeight = image.height;
                const canvasWidth = ctx.canvas.width;
                const canvasHeight = ctx.canvas.height;

                // Calculate the scale to fit the image inside the canvas while maintaining the aspect ratio
                const scaleX = canvasWidth / imageWidth;
                const scaleY = canvasHeight / imageHeight;
                const scale = Math.min(scaleX, scaleY);

                // Calculate the centered position to draw the scaled image
                const scaledWidth = imageWidth * scale;
                const scaledHeight = imageHeight * scale;
                const imageX = (canvasWidth - scaledWidth) / 2;
                const imageY = (canvasHeight - scaledHeight) / 2;

                ctx.drawImage(image, imageX, imageY, scaledWidth, scaledHeight);
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
                <div className={`log ${className}`}
                    style={{
                        transform: className === "" ? `translateX(${position}px)` : "unset",
                    }}
                >
                    <canvas ref={canvasRef} id={id} />
                </div>
            );
        });

        const [logs] = useState([
            <Log key={0} id={0} className="" />,
            <Log key={4} id={4} className="log_8000" />,
        ]);

        return (
            <div className="log_items">
                {logs.map((log, index) => (
                    <React.Fragment key={index}>{log}</React.Fragment>
                ))}
            </div>
        );
    });

    const renderDivs = () => {
        const divs = [];
        for (let i = 0; i < quantity; i++) {
            const isOposite = i % 2 === 0;
            divs.push(<div key={i} className="column water"
                style={{
                    transform: `scaleX(${isOposite ? -1 : 1})`,
                }}
            >
                <Logs />
            </div>);
        }
        return (
            <div className="biome waterBiome">
                <div className='river-box'></div>
                <RiverImage />
                {divs}
            </div>
        );
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
                            <div className='river-box'></div>
                            <RiverImage />
                            <div className="column water"
                                style={{
                                    transform: `scaleX(${quantity % 2 === 0 ? -1 : 1})`,
                                }}
                            >
                                <Logs />
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Water;
