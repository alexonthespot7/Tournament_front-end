import { useEffect, useState } from "react";

import ContextWrapper from "./ContextWrapper";

function ContextProvider(props) {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // Function to update window size state
    const updateWindowSize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };

    useEffect(() => {
        // Event listener for window resize
        window.addEventListener('resize', updateWindowSize);

        // Clean up the event listener when component unmounts
        return () => {
            window.removeEventListener('resize', updateWindowSize);
        };
    }, []); // Empty dependency array ensures this effect runs only once

    return (
        <ContextWrapper.Provider
            value={{
                windowSize
            }}
        >
            {props.children}
        </ContextWrapper.Provider>
    );
};

export default ContextProvider;