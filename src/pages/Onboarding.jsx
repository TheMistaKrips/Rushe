import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useStore } from '../store/useStore';

const GENRES = [
    { id: 'pop', name: 'Pop', color: '#FF2A54' },
    { id: 'hiphop', name: 'Hip-Hop', color: '#9B51E0' },
    { id: 'rock', name: 'Rock', color: '#F2994A' },
    { id: 'electronic', name: 'Electronic', color: '#2D9CDB' },
    { id: 'rnb', name: 'R&B', color: '#EB5757' },
    { id: 'jazz', name: 'Jazz', color: '#F2C94C' },
    { id: 'classical', name: 'Classical', color: '#27AE60' },
    { id: 'indie', name: 'Indie', color: '#E02020' },
    { id: 'metal', name: 'Metal', color: '#333333' },
    { id: 'lofi', name: 'Lo-Fi', color: '#BB6BD9' },
];

export default function Onboarding() {
    const [selected, setSelected] = useState([]);
    const completeOnboarding = useStore(state => state.completeOnboarding);
    const navigate = useNavigate();

    const toggleGenre = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(g => g !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const handleFinish = () => {
        if (selected.length >= 3) {
            completeOnboarding(selected);
            navigate('/');
        }
    };

    // --- INLINE СТИЛИ ---
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#0d0d12',
        color: '#fff',
        textAlign: 'center'
    };

    const titleStyle = {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '10px',
        background: 'linear-gradient(90deg, #FF2A54, #9B51E0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    };

    const subtitleStyle = {
        fontSize: '16px',
        color: '#888',
        marginBottom: '40px'
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '15px',
        width: '100%',
        maxWidth: '800px',
        marginBottom: '40px'
    };

    const buttonStyle = {
        padding: '15px 40px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: selected.length >= 3 ? '#9B51E0' : '#333',
        border: 'none',
        borderRadius: '30px',
        cursor: selected.length >= 3 ? 'pointer' : 'not-allowed',
        transition: 'background-color 0.3s',
        boxShadow: selected.length >= 3 ? '0 4px 15px rgba(155, 81, 224, 0.4)' : 'none'
    };

    return (
        <div style={containerStyle}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <img
                    src="/rushe_logo.png"
                    alt="RushE Logo"
                    style={{ width: '80px', marginBottom: '20px', filter: 'invert(1)' }}
                />
                <h1 style={titleStyle}>Добро пожаловать в RushE</h1>
                <p style={subtitleStyle}>Выберите минимум 3 любимых жанра для персонализации</p>
            </motion.div>

            <div style={gridStyle}>
                {GENRES.map((genre, index) => {
                    const isSelected = selected.includes(genre.id);

                    return (
                        <motion.div
                            key={genre.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleGenre(genre.id)}
                            style={{
                                position: 'relative',
                                height: '100px',
                                borderRadius: '16px',
                                background: `linear-gradient(135deg, ${genre.color}88, ${genre.color})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                border: isSelected ? '2px solid #fff' : '2px solid transparent',
                                boxShadow: isSelected ? `0 0 15px ${genre.color}88` : 'none'
                            }}
                        >
                            {/* Затемнение для невыбранных */}
                            {!isSelected && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundColor: 'rgba(0,0,0,0.4)'
                                }} />
                            )}

                            <span style={{
                                position: 'relative',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                zIndex: 2
                            }}>
                                {genre.name}
                            </span>

                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        backgroundColor: '#fff',
                                        borderRadius: '50%',
                                        padding: '4px',
                                        zIndex: 2
                                    }}
                                >
                                    <Check size={14} color={genre.color} />
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={buttonStyle}
                onClick={handleFinish}
                disabled={selected.length < 3}
                whileHover={selected.length >= 3 ? { scale: 1.05 } : {}}
                whileTap={selected.length >= 3 ? { scale: 0.95 } : {}}
            >
                {selected.length >= 3 ? 'Начать слушать' : `Выберите еще ${Math.max(0, 3 - selected.length)}`}
            </motion.button>
        </div>
    );
}