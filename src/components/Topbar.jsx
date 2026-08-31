import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search as SearchIcon, User, LogOut, Settings, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Topbar({ isMobile }) {
    const { userProfile, searchQuery, setSearchQuery, searchHistory, addToSearchHistory } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        // Подсказки из истории поиска
        if (searchQuery.trim().length > 0) {
            const filtered = searchHistory.filter(item =>
                item.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5));
        } else {
            setSuggestions(searchHistory.slice(0, 5));
        }
    }, [searchQuery, searchHistory]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (location.pathname !== '/search' && value.trim() !== '') {
            navigate('/search');
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            addToSearchHistory(searchQuery.trim());
            navigate('/search');
            setIsFocused(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSuggestions([]);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        addToSearchHistory(suggestion);
        navigate('/search');
        setIsFocused(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('rushe-storage');
        window.location.reload();
    };

    const topbarStyle = {
        height: '72px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? '0 16px' : '0 30px',
        backgroundColor: 'transparent',
        flexShrink: 0,
        gap: '15px'
    };

    const searchContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: isFocused ? '#1a1a24' : '#14141e',
        borderRadius: '16px',
        padding: '0 16px',
        height: '48px',
        flex: isMobile ? '1' : '0 1 450px',
        border: `1px solid ${isFocused ? '#9B51E0' : '#2a2a35'}`,
        transition: 'all 0.3s ease',
        position: 'relative'
    };

    return (
        <header style={topbarStyle}>
            {isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #9B51E0, #4A00E0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px'
                    }}>
                        🎵
                    </div>
                </div>
            )}

            <form onSubmit={handleSearchSubmit} style={{ flex: 1, position: 'relative' }}>
                <div style={searchContainerStyle}>
                    <SearchIcon size={18} color={isFocused ? '#9B51E0' : '#666'} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Поиск музыки..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#fff',
                            padding: '0 10px',
                            outline: 'none',
                            fontSize: '15px',
                            height: '100%'
                        }}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#666',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '50%',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#2a2a35'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {isFocused && (searchQuery || suggestions.length > 0) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                left: 0,
                                right: 0,
                                backgroundColor: '#1c1c1e',
                                borderRadius: '16px',
                                border: '1px solid #2a2a35',
                                padding: '8px',
                                zIndex: 100,
                                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                            }}
                        >
                            {searchQuery.trim() && suggestions.length > 0 && (
                                <div style={{ fontSize: '11px', color: '#666', padding: '4px 12px', marginBottom: '4px' }}>Подсказки</div>
                            )}
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 12px',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#2a2a35'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <SearchIcon size={16} color="#666" />
                                    <span style={{ fontSize: '14px' }}>{suggestion}</span>
                                </div>
                            ))}
                            {searchQuery.trim() && suggestions.length === 0 && (
                                <div style={{ padding: '10px 12px', color: '#666', fontSize: '14px' }}>
                                    Нет подсказок. Нажмите Enter для поиска.
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px', flexShrink: 0 }}>
                {!isMobile && (
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#14141e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: '1px solid #2a2a35',
                        transition: 'all 0.2s'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9B51E0'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2a2a35'}
                    >
                        <Bell size={18} color="#888" />
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {!isMobile && (
                        <span style={{ fontSize: '14px', color: '#888' }}>
                            {userProfile?.name || 'Пользователь'}
                        </span>
                    )}
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #9B51E0, #4A00E0)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: '2px solid #2a2a35',
                            transition: 'all 0.2s'
                        }}
                        onClick={() => setShowDropdown(!showDropdown)}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9B51E0'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2a2a35'}
                    >
                        {userProfile?.avatar ? (
                            <img src={userProfile.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <User size={20} color="#fff" />
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {showDropdown && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            style={{
                                position: 'absolute',
                                top: '70px',
                                right: isMobile ? '16px' : '30px',
                                backgroundColor: '#1c1c1e',
                                borderRadius: '16px',
                                border: '1px solid #2a2a35',
                                padding: '8px',
                                minWidth: '220px',
                                zIndex: 1000,
                                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div style={{ padding: '8px 12px', borderBottom: '1px solid #2a2a35', marginBottom: '6px' }}>
                                <div style={{ fontWeight: 'bold' }}>{userProfile?.name || 'Пользователь'}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>{userProfile?.email || 'user@example.com'}</div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 12px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    color: '#fff',
                                    fontSize: '14px',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#2a2a35'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                onClick={() => { setShowDropdown(false); navigate('/'); }}
                            >
                                <Settings size={18} color="#666" />
                                Настройки
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 12px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    color: '#FF2A54',
                                    fontSize: '14px',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,42,84,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                onClick={handleLogout}
                            >
                                <LogOut size={18} color="#FF2A54" />
                                Выйти
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}