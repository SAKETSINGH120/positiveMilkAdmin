// components/TawkToChat.js
import { useEffect } from 'react';

const TawkToChat = () => {
    useEffect(() => {
        var script = document.createElement("script");
        script.src = "https://embed.tawk.to/68944ff6655b4e1928d1d573/1j21lgndf";
        script.async = true;
        script.charset = "UTF-8";
        script.setAttribute("crossorigin", "*");
        document.body.appendChild(script);

        return () => {
            // Cleanup when unmounting
            document.body.removeChild(script);
        };
    }, []);

    return null;
};

export default TawkToChat;
