import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Camera, User } from 'lucide-react';
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
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);

    const fileInputRef = useRef(null);
    const completeOnboarding = useStore(state => state.completeOnboarding);
    const navigate = useNavigate();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatar(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleFinish = () => {
        if (selectedGenres.length >= 3) {
            completeOnboarding(name || 'Пользователь', avatar, selectedGenres);
            navigate('/');
        }
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        padding: '20px',
        backgroundColor: '#0d0d12',
        color: '#fff',
        textAlign: 'center'
    };

    return (
        <div style={containerStyle}>
            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px' }}
                    >
                        <img src="/rushe_logo_colored.png" alt="RushE" style={{ width: '60px', marginBottom: '30px' }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>Создать профиль</h1>
                        <p style={{ color: '#888', marginBottom: '30px' }}>Давайте настроим ваш аккаунт</p>

                        <div onClick={() => fileInputRef.current.click()} style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            backgroundColor: '#1a1a24',
                            border: '2px dashed #333',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            marginBottom: '30px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            {avatar ? <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Camera size={32} color="#888" />}
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                        </div>

                        <div style={{ width: '100%', position: 'relative', marginBottom: '30px' }}>
                            <User size={20} color="#888" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Ваше имя"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    backgroundColor: '#1a1a24',
                                    border: '1px solid #2a2a35',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    padding: '0 20px 0 45px',
                                    fontSize: '16px',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            disabled={!name.trim()}
                            style={{
                                width: '100%',
                                height: '50px',
                                backgroundColor: name.trim() ? '#9B51E0' : '#333',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '25px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: name.trim() ? 'pointer' : 'not-allowed',
                                transition: '0.3s'
                            }}
                        >
                            Далее
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '800px' }}
                    >
                        <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>Любимые жанры</h1>
                        <p style={{ color: '#888', marginBottom: '40px' }}>Выберите минимум 3 варианта</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '15px', width: '100%', marginBottom: '40px' }}>
                            {GENRES.map((genre) => {
                                const isSelected = selectedGenres.includes(genre.id);
                                return (
                                    <motion.div
                                        key={genre.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedGenres(prev => isSelected ? prev.filter(g => g !== genre.id) : [...prev, genre.id])}
                                        style={{
                                            height: '90px',
                                            borderRadius: '16px',
                                            background: `linear-gradient(135deg, ${genre.color}88, ${genre.color})`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            border: isSelected ? '2px solid #fff' : '2px solid transparent'
                                        }}
                                    >
                                        {!isSelected && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />}
                                        <span style={{ position: 'relative', fontWeight: 'bold', fontSize: '16px', zIndex: 2 }}>{genre.name}</span>
                                        {isSelected && <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#fff', borderRadius: '50%', padding: '2px', zIndex: 2 }}><Check size={12} color={genre.color} /></div>}
                                    </motion.div>
                                );
                            })}
                        </div>

                        <button
                            onClick={handleFinish}
                            disabled={selectedGenres.length < 3}
                            style={{
                                padding: '15px 40px',
                                backgroundColor: selectedGenres.length >= 3 ? '#9B51E0' : '#333',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '30px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: selectedGenres.length >= 3 ? 'pointer' : 'not-allowed',
                                transition: '0.3s'
                            }}
                        >
                            {selectedGenres.length >= 3 ? 'Начать слушать' : `Выберите еще ${Math.max(0, 3 - selectedGenres.length)}`}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}