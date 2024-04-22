import React, { useState, useEffect, useRef } from 'react';
import RenderMap from './RenderMap';
import { Player, usePlayerContent } from '@/context/PlayerContent';
import grass from '@/assets/Elements/PNG/grass.jpg';
import GameOver from './GameOver';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Game = () => {
  const columnsRef = useRef(null) as any;
  const gameContainerRef = useRef(null) as any;
  const playerRef = useRef(null) as any;
  const { score, setScore, isDead, setIsDead, isCollide, setBestScore, pos, bestScore, player, setPlayer, skin, setSkin, setContainerWidth, setContainerHeight, canChangeState }: any = usePlayerContent();
  const [scrollUp, setScrollUp] = useState(false);
  const [highestPoint, setHighestPoint] = useState(player.y);
  const [biome, setBiome] = useState([<RenderMap key={""} />]) as any;
  const [containerSize, setContainerSize] = useState<{ width: number, height: number }>();
  const [roudedWidth, setRoundedWidth] = useState(0);
  const crossy_road_containerRef = useRef(null);
  const navigate = useRouter()

  // Game over
  const handleGameOver = () => {
    const windowWidth = window.innerWidth;
    // Reset player position to center of the screen
    setPlayer({
      x: windowWidth / 2,
      y: 150,
    });

    setTimeout(() => {
      playerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }, 50);

    setScore(null);

    setIsDead(false);

    setHighestPoint(0);

    window.location.reload();

    setBiome([0]);
  };

  // Scroll to bottom of page
  useEffect(() => {
    const main_game_container = crossy_road_containerRef.current as any
    //get width and height of the viewport and

    if (main_game_container) {
      setContainerSize({
        width: main_game_container.offsetWidth,
        height: main_game_container.offsetHeight
      })

      setContainerHeight(main_game_container.offsetHeight)
      setContainerWidth(main_game_container.offsetWidth)
    }

    setTimeout(() => {
      playerRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center',
      });
    }, 50);
  }, []);

  //set gameContainerRef width to roundedWidth
  useEffect(() => {
    if (containerSize?.width) {
      // round containerSize.width to the nearest 50
      const roundedWidth = Math.round(containerSize.width / 50) * 50;
      //set gameContainerRef width to roundedWidth
      gameContainerRef.current.style.width = `${roundedWidth}px`;
      columnsRef.current.style.width = `${roundedWidth}px`;
      setTimeout(() => {
        setRoundedWidth(roundedWidth);
      }, 50);
      //if returns ex: 550, return false, if returns ex: 500, return true
      const roudedWidthIsEven = roundedWidth % 100 === 0;
      setPlayer({
        x: roundedWidth / 2 - (roudedWidthIsEven ? 0 : 25),
        y: 150,
        top: false,
        bottom: true,
        left: false,
        right: false,
      });
    }
  }, [containerSize?.width]);

  // Scroll to top of page when player is in screenTop
  useEffect(() => {
    const screenTop = document.querySelector('.screenTop')?.getBoundingClientRect() as DOMRect;
    const player = document.querySelector('.player')?.getBoundingClientRect() as DOMRect;

    if (
      player.left >= screenTop.left &&
      player.right <= screenTop.right &&
      player.top >= screenTop.top &&
      player.bottom <= screenTop.bottom
    ) {
      setScrollUp(true);
    } else {
      setScrollUp(false);
    }
  }, [player, scrollUp]);


  // Control player movement
  useEffect(() => {
    // When click W A S D, move player, every 50px is a step
    const handleKeyDown = (e: any) => {
      const gameContainer = gameContainerRef.current.getBoundingClientRect();
      const playerRect = playerRef.current.getBoundingClientRect();
      const playerHeight = playerRef.current.offsetHeight;

      if (canChangeState) {
        if (!isDead) {
          if (e.keyCode === 87 || e.key === 'ArrowUp') {
            setPlayer((prev: Player) => ({
              ...prev,
              y: prev.y + 50,
              top: false,
              bottom: true,
              left: false,
              right: false,
            }));

            if (!isDead) {
              setHighestPoint((prev: number) => {
                if (prev < player.y) {
                  return player.y;
                }
                return prev;
              });
            }
          }

          if (e.keyCode === 83 || e.key === 'ArrowDown') {
            if (playerRect.bottom >= gameContainer.bottom - playerHeight) {
              return;
            }
            setPlayer((prev: Player) => ({
              ...prev,
              y: prev.y - 50,
              top: true,
              bottom: false,
              left: false,
              right: false,
            }));
          }

          if (e.keyCode === 65 || e.key === 'ArrowLeft') {
            if (playerRect.left <= gameContainer.left) {
              return;
            }
            setPlayer((prev: Player) => ({
              ...prev,
              x: prev.x + 50,
              top: false,
              bottom: false,
              left: true,
              right: false,
            }));
          }

          if (e.keyCode === 68 || e.key === 'ArrowRight') {
            if (playerRect.right >= gameContainer.right) {
              return;
            }
            setPlayer((prev: Player) => ({
              ...prev,
              x: prev.x - 50,
              top: false,
              bottom: false,
              left: false,
              right: true,
            }));
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameContainerRef, isDead, player.x, player.y, playerRef, scrollUp, setPlayer, canChangeState]);

  //player position
  useEffect(() => {
    const player = document.querySelector('.player-container');
    const ReactVirtualized__Grid = document.querySelector('.ReactVirtualized__Grid__innerScrollContainer');
    //move player-container div into ReactVirtualized__Grid div
    setTimeout(() => {
      if (player && ReactVirtualized__Grid) {
        ReactVirtualized__Grid.appendChild(player);
      }
    }, 1000);

  }, [biome]);

  //check if player touches cacti
  useEffect(() => {
    const player = document.querySelector('.player');
    const cacti = document.querySelectorAll('.carcti-isgenerated');

    cacti.forEach((item) => {
      if (isCollide(player, item)) {
        canChangeState && setIsDead(true);
      }
    });
  }, [canChangeState, isCollide, player, score, setIsDead]);

  //get currect user score
  useEffect(() => {
    const fetchUserScore = async () => {
      try {
        const data = localStorage.getItem('data') as any;
        //find user score 
        const response = await axios.get(`/api/user?name=${JSON.parse(data).name}`);
        setBestScore(response.data.score);
      } catch (error) {
        console.error('Error fetching prizeChances:', error);
      }
    }

    fetchUserScore();
  }, [])

  //save score to leaderboard
  useEffect(() => {
    const saveScore = async () => {
      //update user score in local storage
      try {
        const data = localStorage.getItem('data') as any;
        const response = await axios.post('/api/update-score', {
          userData: {
            id: JSON.parse(data).id,
            name: JSON.parse(data).name,
            score: score,
          }
        });
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching prizeChances:', error);
      }
    };

    if (isDead) {
      saveScore();
    }
  }, [isDead])

  //update score
  useEffect(() => {
    setScore(score + 1)
  }, [highestPoint]);

  // Check if player goes outside the gameContainerRef
  useEffect(() => {
    const checkPlayerPosition = () => {
      const playerRect = playerRef.current.getBoundingClientRect();
      const gameContainerRect = gameContainerRef.current.getBoundingClientRect();

      if (
        playerRect.left < gameContainerRect.left ||
        playerRect.right > gameContainerRect.right ||
        playerRect.top < gameContainerRect.top ||
        playerRect.bottom > gameContainerRect.bottom
      ) {
        setIsDead(true);
      }
    };

    // Add an interval to periodically check player position
    const interval = setInterval(checkPlayerPosition, 100);

    return () => {
      clearInterval(interval);
    };
  }, [setIsDead]);

  return (
    <>
      {isDead && <GameOver onClick={handleGameOver} score={score} bestScore={bestScore} />}
      <div className='crossy_road_container' ref={crossy_road_containerRef}
        style={{
          backgroundImage: `url(${grass.src})`,
        }}
      >
        <p className='score'>{score}</p>
        <div className='screenHeightItems'
        >
          <div className='screenTop' />
          <div className='screenBottom' />
        </div>
        <div className='player-container'
          style={{
            left: player.x,
            top: player.y,
          }}
        >
          <div
            ref={playerRef}
            className='player'
            id='player'
          >
            <Image
              style={{
                transform: `rotate(180deg) scaleX(${player.left ? -1 : 1})`,
              }}
              className='player-racoon' src={skin} alt='player' />
          </div>
        </div>
        <div className='game-container' ref={gameContainerRef}>
          {!canChangeState && (
            <div className='loading_game'>
              <p className='loading_text'>
                Loading...
              </p>
            </div>
          )}
          <div className='columns-flex' ref={columnsRef}>
            <RenderMap />
          </div>
        </div>
      </div>
    </>
  )
}

export default Game