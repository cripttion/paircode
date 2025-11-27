import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setCode } from '../features/editorSlice';
import CodeEditor from '../components/CodeEditor';

const RoomPage: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const code = useSelector((state: RootState) => state.editor.code);
    const dispatch = useDispatch();
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!roomId) return;

        // Connect to WebSocket
        const socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
        ws.current = socket;

        socket.onopen = () => {
            console.log('Connected to room:', roomId);
        };

        socket.onmessage = (event) => {

            dispatch(setCode(event.data));
        };

        socket.onclose = () => {
            console.log('Disconnected');
        };

        return () => {
            socket.close();
        };
    }, [roomId, dispatch]);

    const handleCodeChange = (newCode: string) => {
        dispatch(setCode(newCode));
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(newCode);
        }
    };

    const copyRoomId = () => {
        if (roomId) {
            navigator.clipboard.writeText(roomId);
            alert("Room ID copied!");
        }
    };

    return (
        <div className="container" style={{ maxWidth: '100%', padding: '0' }}>
            <div className="header">
                <div className="room-info">
                    Room ID: <span style={{ color: 'white', fontWeight: 'bold' }}>{roomId}</span>
                </div>
                <button className="copy-btn" onClick={copyRoomId}>Copy ID</button>
            </div>
            <div className="editor-container" style={{ height: 'calc(100vh - 60px)', marginTop: 0, borderRadius: 0, border: 'none' }}>
                <CodeEditor code={code} onChange={handleCodeChange} />
            </div>
        </div>
    );
};

export default RoomPage;
