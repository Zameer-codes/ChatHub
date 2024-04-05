// SignalRContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { JoinHubUrl } from '../constants/Urls';

const SignalRContext = createContext(null);

export const SignalRProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const connectionRef = useRef(null);

    useEffect(() => {
        if (isLoggedIn) {
            connectionRef.current = new signalR.HubConnectionBuilder()
                .withUrl(JoinHubUrl)
                .configureLogging(signalR.LogLevel.Information)
                .build();

            connectionRef.current.start().then(() => {
                console.log('SignalR Connected');
            }).catch((err) => {
                console.error('SignalR Connection Error: ', err);
            });
        } else {
            if (connectionRef.current) {
                connectionRef.current.stop();
            }
        }

        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop();
            }
        };
    }, [isLoggedIn]);

    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = () => {
        setIsLoggedIn(false);
    };

    return (
        <SignalRContext.Provider value={{connection: connectionRef.current, login, logout }}>
            {children}
        </SignalRContext.Provider>
    );
};

export const useSignalR = () => {
    return useContext(SignalRContext).connection;
};
