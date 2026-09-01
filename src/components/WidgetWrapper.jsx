import React, { useEffect, useState } from 'react';

// Проверяем, запущено ли приложение в Electron
const isElectron = () => {
    return window && window.process && window.process.type === 'renderer';
};

export default function WidgetWrapper({
    children,
    widgetId,
    title = 'RushE Widget',
    width = 320,
    height = 480,
    resizable = false,
    transparent = false,
    alwaysOnTop = true
}) {
    const [isWidgetMode, setIsWidgetMode] = useState(false);

    useEffect(() => {
        // Проверяем, открыт ли компонент как виджет
        const urlParams = new URLSearchParams(window.location.search);
        setIsWidgetMode(urlParams.get('widget') === widgetId);
    }, [widgetId]);

    // Если это виджет - рендерим без рамок и с нужными стилями
    if (isWidgetMode) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: transparent ? 'transparent' : '#0d0d12',
                overflow: 'hidden',
                margin: 0,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {children}
            </div>
        );
    }

    // В обычном режиме - просто рендерим
    return children;
}

// Функция для открытия виджета в Electron
export function openWidget(widgetId, options = {}) {
    if (!isElectron()) {
        // Если не в Electron - открываем в новом окне браузера
        window.open(`/widget/${widgetId}`, '_blank', 'width=400,height=500');
        return;
    }

    // Если в Electron - отправляем команду в main процесс
    if (window.electronAPI && window.electronAPI.openWidget) {
        window.electronAPI.openWidget(widgetId, options);
    } else {
        console.warn('Electron API не найден');
    }
}

// Функция для закрытия виджета
export function closeWidget(widgetId) {
    if (window.electronAPI && window.electronAPI.closeWidget) {
        window.electronAPI.closeWidget(widgetId);
    }
}