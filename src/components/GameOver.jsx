import React, { useEffect, useState } from 'react'
import { Link } from 'next/link'
import cup from "@/assets/Elements/PNG/cup.png";
import Image from 'next/image';
import Modal from './Modal';
import axios from 'axios';

const GameOver = ({ score = 0, bestScore = 0, onClick, leaderBoardBtn }) => {
    const [showLB, setShowLB] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    useEffect(() => {
        axios.get('/api/leaderboard')
            .then(res => setLeaderboard(res.data))
            .catch(err => console.log(err));
    }, [])

    return (
        <>
            <Modal show={showLB} onClose={() => setShowLB(false)} title='Leaderboard'>
                <div className='leaderboard-container'>
                    <div className='leaderboard'>
                        <div className='leaderboard-header'>
                            <p className='leaderboard-title'>Rank</p>
                            <p className='leaderboard-title'>Name</p>
                            <p className='leaderboard-title'>Score</p>
                        </div>
                        <div className='leaderboard-body'>
                            {leaderboard.map((data, index) => (
                                <div key={index} className='leaderboard-row'>
                                    <p className='leaderboard-data'>{index + 1}</p>
                                    <p className='leaderboard-data'>{data.name}</p>
                                    <p className='leaderboard-data'>{data.score}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
            <div className='game-over-container'>
                <div className='game-over-modal'>
                    <h1 className='game-over-title'>Game Over</h1>
                    <div className='game-over-flex'>
                        <p className='game-over-bestScore'>Best Score: {bestScore}</p>
                        <p className='game-over-score'>Score: {score}</p>
                        <button
                            onClick={onClick}
                            className='game-over-button'
                        >Play Again</button>
                    </div>
                </div>
                <button
                    onClick={() => setShowLB(true)}
                    className='leaderboard-button'
                >
                    <Image src={cup} width={70} height={70} alt="leaderboard" className='leaderboard-icon' />
                </button>
            </div>
        </>
    )
}

export default GameOver