import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LandingPage: React.FC = () => {
    const [roomId, setRoomIdInput] = useState('');
    const navigate = useNavigate();

    const createRoom = async () => {
        try {
            const response = await axios.post('http://localhost:8000/rooms');
            navigate(`/room/${response.data.id}`);
        } catch (error) {
            console.error("Failed to create room", error);
            alert("Failed to create room. Is backend running?");
        }
    };

    const joinRoom = () => {
        if (roomId.trim()) {
            navigate(`/room/${roomId}`);
        }
    };

    return (
        <div className="container">
            <h1>Pair Code</h1>
            <div className="card">
                <button onClick={createRoom} style={{ backgroundColor: '#646cff', color: 'white' }}>
                    Create New Room
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '1rem 0' }}>
                    <hr style={{ flex: 1, borderColor: '#334155' }} />
                    <span style={{ color: '#94a3b8' }}>OR</span>
                    <hr style={{ flex: 1, borderColor: '#334155' }} />
                </div>
                <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomIdInput(e.target.value)}
                />
                <button onClick={joinRoom}>Join Room</button>
            </div>
        </div>
    );
};

export default LandingPage;
