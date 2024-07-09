import React, { useEffect, useState } from 'react';
import Hls from 'hls.js';

export default function DurationTrack({ id, className = "" }) {
    const [duration, setDuration] = useState(0);
    const [url, setUrl] = useState(`http://172.24.80.146/music/${id}/${id}.m3u8`)

    useEffect(() => {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                const totalDuration = data.levels.reduce((acc, level) => {
                    return acc + level.details.totalduration;
                }, 0);
                setDuration(totalDuration);
            });
        }
    }, []);

    const formatTime = (seconds) => {
        const rounded = Math.round(seconds);
        const minutes = Math.floor(rounded / 60);
        const remainingSeconds = rounded % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };


    return (
        <h3 className={className}>{formatTime(duration)}</h3>
    );
}