import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ChatProvider from './context/chatProvider.jsx';

createRoot(document.getElementById('root')).render(
    <ChatProvider>
        <StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </StrictMode>
    </ChatProvider>
);
