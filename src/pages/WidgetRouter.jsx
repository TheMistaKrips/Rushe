import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MiniPlayerWidget from '../components/MiniPlayerWidget';
import FullscreenPlayerWidget from '../components/FullscreenPlayerWidget';

export default function WidgetRouter() {
    return (
        <Routes>
            <Route path="/widget/miniplayer" element={<MiniPlayerWidget />} />
            <Route path="/widget/fullscreenplayer" element={<FullscreenPlayerWidget />} />
            <Route path="/widget/:widgetId" element={<MiniPlayerWidget />} />
        </Routes>
    );
}