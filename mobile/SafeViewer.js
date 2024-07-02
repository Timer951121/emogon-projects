import React, {useState, useEffect} from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import App from "./App";

const SafeViewer = () => {
    return (
        <SafeAreaProvider>
            <App />
        </SafeAreaProvider>
    )
}

export default SafeViewer;