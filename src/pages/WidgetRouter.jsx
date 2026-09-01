import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UnifiedPlayer from '../components/UnifiedPlayer';

export default function WidgetRouter() {
    return (
        <Routes>
            <Route path="/widget/miniplayer" element={<UnifiedPlayer isWidget={true} />} />
            <Route path="/widget/fullscreenplayer" element={<UnifiedPlayer isWidget={true} />} />
            <Route path="/widget/:widgetId" element={<UnifiedPlayer isWidget={true} />} />
        </Routes>
    );
}