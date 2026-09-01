import React, { useEffect, useState } from 'react';

// Проверяем, запущено ли приложение в Electron
const isElectron = () => {
    return window.electronAPI && window.electronAPI.isElectron === true;
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
        const urlParams = new URLSearchParams(window.location.search);
        setIsWidgetMode(urlParams.get('widget') === widgetId);

        // Если в Electron, устанавливаем заголовок окна
        if (isElectron() && window.electronAPI) {
            document.title = title;
        }
    }, [widgetId, title]);

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

    return children;
}

// Функция для открытия виджета
export function openWidget(widgetId, options = {}) {
    if (isElectron() && window.electronAPI) {
        window.electronAPI.openWidget(widgetId, options);
        return;
    }

    // Если не в Electron - открываем в новом окне браузера
    const width = options.width || 400;
    const height = options.height || 500;
    window.open(
        `/widget/${widgetId}`,
        '_blank',
        `width=${width},height=${height},menubar=no,toolbar=no,location=no,status=no`
    );
}

// Функция для закрытия виджета
export function closeWidget(widgetId) {
    if (isElectron() && window.electronAPI) {
        window.electronAPI.closeWidget(widgetId);
    }
}

// Функция для сворачивания в трей
export function minimizeToTray() {
    if (isElectron() && window.electronAPI) {
        window.electronAPI.minimizeToTray();
    }
}