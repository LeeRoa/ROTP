import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import {MantineProvider} from '@mantine/core';
import {mantineTheme} from './theme/mantine-theme';
import { Notifications } from "@mantine/notifications";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MantineProvider theme={mantineTheme}>
            <Notifications position="top-right" zIndex={1000} />
            <App/>
        </MantineProvider>
    </React.StrictMode>
);