import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Clients from "./Clients";

import AddMessage from "./AddMessage";

import AddClient from "./AddClient";

import Analytics from "./Analytics";

import Templates from "./Templates";

import TimeTracking from "./TimeTracking";

import MessageDetail from "./MessageDetail";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Login from './Login';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Clients: Clients,
    
    AddMessage: AddMessage,
    
    AddClient: AddClient,
    
    Analytics: Analytics,
    
    Templates: Templates,
    
    TimeTracking: TimeTracking,
    
    MessageDetail: MessageDetail,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    if (/\/login$/i.test(location.pathname)) {
        return <Routes><Route path="/login" element={<Login />} /><Route path="/Login" element={<Login />} /></Routes>;
    }

    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Clients" element={<Clients />} />
                
                <Route path="/AddMessage" element={<AddMessage />} />
                
                <Route path="/AddClient" element={<AddClient />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/Templates" element={<Templates />} />
                
                <Route path="/TimeTracking" element={<TimeTracking />} />
                
                <Route path="/MessageDetail" element={<MessageDetail />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}