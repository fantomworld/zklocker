import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    Route,
    BrowserRouter,
    Routes
} from "react-router-dom";
import App from './mainapp';
import './css/index.css';
import Deposit from './deposit';
import Home from './home';
import Withdraw from './withdraw';
import {
    zkSync
} from '@wagmi/chains';
const {
    createClient,
    WagmiConfig,
} = require("wagmi");

const {
    getDefaultClient
} = require("connectkit");


const client = createClient(
    getDefaultClient({
        appName: "zkey",
        chains: [zkSync],
    })
);

ReactDOM.createRoot(document.getElementById("root")).render( <
    WagmiConfig client = {
        client
    } >

    <
    BrowserRouter >
    <
    Routes >
    <
    Route path = "/withdraw"
    element = { < Withdraw / >
    } > < /Route> <
    Route path = "/deposit"
    element = { < Deposit / >
    } > < /Route> <
    Route path = "/app"
    element = { < App / >
    } > < /Route> <
    Route path = "/"
    element = { < Home / >
    } > < /Route> <
    /Routes> <
    /BrowserRouter> <
    /WagmiConfig>
);