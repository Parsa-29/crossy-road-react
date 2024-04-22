import React, { useEffect, useState } from 'react'
import GameCont from './Game';
import PlayerContent from '@/context/PlayerContent';
import "@/styles/page.module.css"
import Modal from './Modal';
import axios from 'axios';

export const CrossyRoad = () => {
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        //if name exists in cookies, set isFirstTime to false
        const name = localStorage.getItem('data');
        if (name) {
            setIsFirstTime(false);
        }

        if (isFirstTime) {
            setShowRegister(true);
        }
    }, [isFirstTime])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const name = e.target.name.value;
            axios.post(window.location.origin + '/api/register',
                { name }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    localStorage.setItem('data', JSON.stringify(res.data));
                    setIsFirstTime(false);
                    setShowRegister(false);
                })
                .catch(err => console.log(err));
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <>
            <div className="StarterContainer" id="home">
                <PlayerContent>
                    <div className='main-game-container'>
                        {isFirstTime && (
                            <Modal show={showRegister} onClose={() => setShowRegister(false)} title='Register'>
                                <div className='register-container'>
                                    <form className='register-form' onSubmit={handleSubmit}>
                                        <input type="text" id="name" name="name" placeholder='Enter your name' />
                                        <button type="submit" className='register-btn'>PLAY</button>
                                    </form>
                                </div>
                            </Modal>
                        )}
                        <GameCont />
                    </div>
                </PlayerContent>
            </div>
        </>
    );
}

export default CrossyRoad;