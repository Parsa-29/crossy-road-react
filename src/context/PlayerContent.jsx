import React, { createContext, useContext, useEffect, useState } from 'react';
import playerFront from '../assets/Elements/PNG/player_front.png';
import playerFrontWather from '../assets/Elements/PNG/player_front_wather.png';
import playerBack from '../assets/Elements/PNG/player_back.png';
import playerBackWather from '../assets/Elements/PNG/player_back_wather.png';
import playerSide from '../assets/Elements/PNG/player_side.png';
import playerSideWather from '../assets/Elements/PNG/player_side_wather.png';


const PlayerContext = createContext();

export const usePlayerContent = () => useContext(PlayerContext);

export const PlayerContent = ({ children }) => {
    const [score, setScore] = useState(0);
    const [isDead, setIsDead] = useState(false);
    const [bestScore, setBestScore] = useState(0);
    const [player, setPlayer] = useState({
        x: 0,
        y: 0,
        top: true,
        bottom: false,
        left: false,
        right: false,
    });
    const [skin, setSkin] = useState(playerFront);
    const [pos, setPos] = useState(0);
    const [containerWidth, setContainerWidth] = useState();
    const [containerHeight, setContainerHeight] = useState();
    const [canChangeState, setCanChangeState] = useState(false);

    useEffect(() => {
        // This effect runs after the component has mounted
        const timer = setTimeout(() => {
            setCanChangeState(true);
        }, 3000);

        return () => {
            // This cleanup function runs when the component is unmounted
            clearTimeout(timer);
        };
    }, []); // The empty dependency array ensures the effect runs only once, on mount

    useEffect(() => {
        const interval = setInterval(() => {
            setPos((pos) => pos + 1);
        }, 1);

        return () => clearInterval(interval);
    }, []);

    function isCollide(a, b) {
        var aRect = a && a.getBoundingClientRect();
        var bRect = b && b.getBoundingClientRect();
        return !(
            ((aRect.top + aRect.height) < (bRect.top)) ||
            (aRect.top > (bRect.top + bRect.height)) ||
            ((aRect.left + aRect.width) < bRect.left) ||
            (aRect.left > (bRect.left + bRect.width))
        );
    }

    useEffect(() => {
        const playerElement = document.querySelector('.player');
        const waters = document.querySelectorAll('.river-box');
        const grass = document.querySelectorAll('.grass-box');
        const road = document.querySelectorAll('.road-box');

        waters.forEach((water) => {
            if (isCollide(water, playerElement)) {
                setSkin(
                    player.bottom ? playerFrontWather :
                        player.top ? playerBackWather :
                            playerSideWather
                );
            }
        });

        grass.forEach((grass) => {
            if (isCollide(grass, playerElement)) {
                setSkin(
                    player.bottom ? playerFront :
                        player.top ? playerBack :
                            playerSide
                );
            }
        });

        road.forEach((road) => {
            if (isCollide(road, playerElement)) {
                setSkin(
                    player.bottom ? playerFront :
                        player.top ? playerBack :
                            playerSide
                );
            }
        })
    }, [pos]);

    return (
        <PlayerContext.Provider value={{
            score,
            setScore,
            isDead,
            setIsDead,
            isCollide,
            bestScore,
            setBestScore,
            player,
            setPlayer,
            skin,
            setSkin,
            pos,
            setPos,
            containerWidth,
            setContainerWidth,
            containerHeight,
            setContainerHeight,
            canChangeState,
            setCanChangeState,
        }}>
            {children}
        </PlayerContext.Provider>
    );
}

export default PlayerContent;