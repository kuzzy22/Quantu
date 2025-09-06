 import React, { useState, useEffect, useRef } from 'react';

// --- MOCK DATA ---
// In a real application, this data would come from a database and smart contracts.
const initialProjects = [
  {
    id: 1,
    name: 'Lekki Pearl Residence',
    developerId: 'dev1',
    description: 'A collection of 5-bedroom duplexes in the heart of Lekki Phase 1, offering premium amenities and high ROI.',
    fundingGoal: 500000,
    amountRaised: 450000,
    apy: 12.5,
    status: 'Funding', // Funding, Funded, Paying APY, Completed, Suspended, Pending
    investors: {
      'investor1': 25000,
      'investor2': 10000,
    },
    apyFundsDeposited: 0,
    apyClaimedBy: {},
    image: 'https://placehold.co/800x600/0D1117/FFFFFF?text=Lekki+Pearl',
    images: [
        'https://placehold.co/800x600/0D1117/FFFFFF?text=Lekki+Pearl',
        'https://placehold.co/800x600/1E293B/FFFFFF?text=Living+Room',
        'https://placehold.co/800x600/374151/FFFFFF?text=Bedroom',
        'https://placehold.co/800x600/4B5563/FFFFFF?text=Kitchen',
    ],
    tokenSupply: 500000,
    ticker: 'LPR',
    term: 24
  },
  {
    id: 2,
    name: 'Eko Atlantic Tower',
    developerId: 'dev1',
    description: 'Luxury apartments in the prestigious Eko Atlantic City, with breathtaking ocean views and state-of-the-art facilities.',
    fundingGoal: 1200000,
    amountRaised: 1200000,
    apy: 15,
    status: 'Funded',
    investors: {
      'investor1': 50000,
    },
    apyFundsDeposited: 0,
    apyClaimedBy: {},
    image: 'https://placehold.co/800x600/0D1117/FFFFFF?text=Eko+Tower',
    images: [
        'https://placehold.co/800x600/0D1117/FFFFFF?text=Eko+Tower',
        'https://placehold.co/800x600/1E293B/FFFFFF?text=Ocean+View',
        'https://placehold.co/800x600/374151/FFFFFF?text=Penthouse',
        'https://placehold.co/800x600/4B5563/FFFFFF?text=Lobby',
    ],
    tokenSupply: 1000000,
    ticker: 'EAT',
    term: 36
  },
  {
    id: 3,
    name: 'Abuja Smart Estate',
    developerId: 'dev2',
    description: 'An eco-friendly estate in Abuja featuring smart homes powered by renewable energy.',
    fundingGoal: 750000,
    amountRaised: 250000,
    apy: 14,
    status: 'Funding',
    investors: {
       'investor2': 20000,
    },
    apyFundsDeposited: 0,
    apyClaimedBy: {},
    image: 'https://placehold.co/800x600/0D1117/FFFFFF?text=Abuja+Estate',
    images: [
        'https://placehold.co/800x600/0D1117/FFFFFF?text=Abuja+Estate',
        'https://placehold.co/800x600/1E293B/FFFFFF?text=Solar+Panels',
        'https://placehold.co/800x600/374151/FFFFFF?text=Smart+Home+Interior',
    ],
    tokenSupply: 750000,
    ticker: 'ASE',
    term: 30
  },
   {
    id: 4,
    name: 'Ikoyi Gardens',
    developerId: 'dev1',
    description: 'Exclusive residential complex with lush gardens and premium facilities in Ikoyi.',
    fundingGoal: 900000,
    amountRaised: 900000,
    apy: 13,
    status: 'Paying APY',
    investors: {
      'investor1': 75000,
      'investor2': 25000,
    },
    apyFundsDeposited: 9750, // 13% of 900k is 117k/yr. 117k/12 is 9750/month
    apyClaimedBy: {},
    image: 'https://placehold.co/800x600/0D1117/FFFFFF?text=Ikoyi+Gardens',
    images: [
        'https://placehold.co/800x600/0D1117/FFFFFF?text=Ikoyi+Gardens',
        'https://placehold.co/800x600/1E293B/FFFFFF?text=Poolside',
        'https://placehold.co/800x600/374151/FFFFFF?text=Garden+View',
    ],
    tokenSupply: 450000,
    ticker: 'IKG',
    term: 24
  },
   {
    id: 5,
    name: 'Port Harcourt Tech Hub',
    developerId: 'dev2',
    description: 'A modern commercial complex designed for tech companies and startups.',
    fundingGoal: 650000,
    amountRaised: 0,
    apy: 16,
    status: 'Pending',
    investors: {},
    apyFundsDeposited: 0,
    apyClaimedBy: {},
    image: 'https://placehold.co/800x600/0D1117/FFFFFF?text=PH+Tech+Hub',
    images: [
        'https://placehold.co/800x600/0D1117/FFFFFF?text=PH+Tech+Hub',
        'https://placehold.co/800x600/1E293B/FFFFFF?text=Office+Space',
        'https://placehold.co/800x600/374151/FFFFFF?text=Exterior+View',
    ],
    tokenSupply: 650000,
    ticker: 'PHT',
    term: 48
  }
];

const users = {
  admin: { id: 'admin', role: 'Admin', name: 'Admin User', dateJoined: '2023-01-01', status: 'Active', twoFactorEnabled: false },
  dev1: { id: 'dev1', role: 'Developer', name: 'Metro Builders', kycVerified: true, onboarded: true, companyProfile: 'Metro Builders is a leading developer in Lagos...', twoFactorEnabled: false, treasuryWallet: '0x1234AbcDefa1234AbcDefa1234AbcDefa1234AbcDef', dateJoined: '2023-02-15', status: 'Active' },
  dev2: { id: 'dev2', role: 'Developer', name: 'Future Homes Ltd.', kycVerified: false, onboarded: false, companyProfile: '', twoFactorEnabled: false, treasuryWallet: '', dateJoined: '2023-03-10', status: 'Active' },
  investor1: { id: 'investor1', role: 'Investor', name: 'Ada Okoro', kycVerified: true, twoFactorEnabled: false, dateJoined: '2023-04-20', status: 'Active' },
  investor2: { id: 'investor2', role: 'Investor', name: 'Bayo Adekunle', kycVerified: false, twoFactorEnabled: true, dateJoined: '2023-05-01', status: 'Active' },
};

const initialNotifications = [
      { id: 1, userId: 'investor1', text: 'Your KYC has been approved!', read: false, time: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      { id: 2, userId: 'investor1', text: 'You successfully claimed APY from Ikoyi Gardens.', read: false, time: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      { id: 3, userId: 'dev1', text: 'Your project "Eko Atlantic Tower" has been fully funded!', read: false, time: new Date(Date.now() - 5 * 60 * 60 * 1000) },
      { id: 4, userId: 'dev1', text: 'A new investor has backed Lekki Pearl Residence.', read: true, time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { id: 5, userId: 'admin', text: 'New KYC submission from Bayo Adekunle.', read: false, time: new Date(Date.now() - 15 * 60 * 1000) },
];

// --- SVG ICONS ---
const ProjectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const PortfolioIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944L12 22l9-1.056v-9.468c0-1.03-.42-2.003-1.172-2.712z" /></svg>;
const CurrencyDollarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 16v-1m0-1v.01M4 4h16v16H4V4z" /></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.938 6.128a9.001 9.001 0 111-1.256M12 21a9.003 9.003 0 008.878-7.372M3.122 13.628A9.003 9.003 0 0012 21.001" /></svg>;
const MarketplaceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2l-7 7-7-7m14 11V10a1 1 0 00-1-1h-3" /></svg>;
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const HelpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SubmitProjectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const AnalyticsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>;
const TwitterIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>;
const FacebookIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>;
const LinkedInIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zm-11 19H3V9h5v10zm-2.5-11.26c-1.24 0-2.25-1.009-2.25-2.25s1.01-2.25 2.25-2.25 2.25 1.009 2.25 2.25-1.01 2.25-2.25 2.25zm13.5 11.26H15V13.25c0-1.38-.028-3.15-1.921-3.15-1.921 0-2.215 1.5-2.215 3.05V19H7V9h4.76v2.16h.067c.65-1.23 2.24-2.52 4.69-2.52 5.02 0 5.95 3.3 5.95 7.58V19z"></path></svg>;
const PaperclipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 1.803" /></svg>;
const ShieldExclamationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944L12 22l9-1.056v-9.468c0-1.03-.42-2.003-1.172-2.712z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01" /></svg>;
const BellSVG = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


// --- UTILITY FUNCTIONS ---
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatRelativeTime = (date) => {
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

// --- CUSTOM HOOK FOR SCRIPT LOADING ---
const useScript = (src) => {
    const [status, setStatus] = useState(src ? "loading" : "idle");

    useEffect(() => {
        if (!src) {
            setStatus("idle");
            return;
        }

        let script = document.querySelector(`script[src="${src}"]`);

        if (!script) {
            script = document.createElement("script");
            script.src = src;
            script.async = true;
            script.setAttribute("data-status", "loading");
            document.body.appendChild(script);

            const setAttributeFromEvent = (event) => {
                script.setAttribute(
                    "data-status",
                    event.type === "load" ? "ready" : "error"
                );
            };

            script.addEventListener("load", setAttributeFromEvent);
            script.addEventListener("error", setAttributeFromEvent);
        } else {
            setStatus(script.getAttribute("data-status"));
        }

        const setStateFromEvent = (event) => {
            setStatus(event.type === "load" ? "ready" : "error");
        };

        script.addEventListener("load", setStateFromEvent);
        script.addEventListener("error", setStateFromEvent);

        return () => {
            if (script) {
                script.removeEventListener("load", setStateFromEvent);
                script.removeEventListener("error", setStateFromEvent);
            }
        };
    }, [src]);

    return status;
};


// --- HELPER COMPONENTS ---

const Modal = ({ children, onClose, title, maxWidth = 'max-w-5xl' }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-40 p-4">
    <div className={`bg-gray-800 rounded-lg shadow-2xl p-6 sm:p-8 w-full ${maxWidth} border border-gray-700`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition">
          <CloseIcon />
        </button>
      </div>
      <div>{children}</div>
    </div>
  </div>
);

const StatCard = ({ title, value, subtext }) => (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 transition hover:border-blue-500/50 hover:bg-gray-800">
        <h4 className="text-gray-400 text-base font-medium">{title}</h4>
        <p className="text-4xl font-bold text-white mt-1">{value}</p>
        {subtext && <p className="text-sm text-gray-500 mt-1">{subtext}</p>}
    </div>
);

const KycPanel = ({ user, setUser }) => {
    const [status, setStatus] = useState(user.kycVerified ? 'Verified' : 'Not Started');
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleKycSubmit = () => {
        setIsSubmitting(true);
        setStatus('Pending');
        // Simulate API call
        setTimeout(() => {
            setStatus('Verified');
            setUser({...user, kycVerified: true});
            setIsSubmitting(false);
        }, 2000);
    };

    return (
        <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
            <h3 className="text-lg font-semibold mb-1 text-white">KYC Verification</h3>
            <div className="text-gray-300">
                <p className="mb-1 text-sm">To comply with regulations, we need to verify your identity.</p>
                <div className="flex items-center space-x-4 p-2 rounded-lg bg-gray-700/50 mb-2">
                    <div className={`p-1.5 rounded-full ${status === 'Verified' ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                       {status === 'Verified' ? <CheckCircleIcon /> : <XCircleIcon />}
                    </div>
                    <div>
                        <p className="font-medium text-white text-sm">Verification Status</p>
                        <p className={`font-bold text-sm ${status === 'Verified' ? 'text-green-400' : 'text-yellow-400'}`}>{status}</p>
                    </div>
                </div>
                 {status !== 'Verified' && (
                    <>
                        <p className="mb-1 text-sm">Please upload a government-issued ID and a proof of address.</p>
                        <div className="space-y-1">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Government ID</label>
                                <input type="file" className="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-300 hover:file:bg-blue-500/20"/>
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Proof of Address</label>
                                <input type="file" className="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-300 hover:file:bg-blue-500/20"/>
                            </div>
                        </div>
                        <button onClick={handleKycSubmit} disabled={isSubmitting} className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-500 flex items-center justify-center text-sm">
                            {isSubmitting ? <><Spinner /> Submitting...</> : 'Submit for Verification'}
                        </button>
                    </>
                 )}
            </div>
        </div>
    );
};


const TwoFactorAuthPanel = ({ user, setUser }) => {

    const handleToggle = () => {
        setUser({...user, twoFactorEnabled: !user.twoFactorEnabled});
    };
    
    return (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-xl font-semibold mb-4 text-white">Two-Factor Authentication (2FA)</h3>
            <div className="flex items-center justify-between">
                <p className="text-gray-300">Enhance your account security.</p>
                <div className="flex items-center">
                    <span className={`mr-3 font-medium ${user.twoFactorEnabled ? 'text-green-400' : 'text-gray-400'}`}>
                        {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <label htmlFor="2fa-toggle" className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input id="2fa-toggle" type="checkbox" className="sr-only" checked={user.twoFactorEnabled || false} onChange={handleToggle} />
                            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${user.twoFactorEnabled ? 'translate-x-full bg-blue-400' : ''}`}></div>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

const DeveloperOnboarding = ({ user, setUser }) => {
    const [treasuryWallet, setTreasuryWallet] = useState('');

    const handleComplete = () => {
        setUser({ ...user, onboarded: true, treasuryWallet });
    };

    return (
        <Modal title="Welcome to QuantuHome, Developer!" onClose={() => {}} maxWidth="max-w-2xl">
            <div className="text-gray-300">
                <p className="mb-4">Let's get your account set up so you can start creating projects.</p>
                <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Step 1: Complete KYC</h4>
                        <p className="text-sm mb-2">We need to verify your company's identity to ensure a secure platform for investors.</p>
                         <KycPanel user={user} setUser={setUser}/>
                    </div>
                     <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Step 2: Set up Treasury Payout Address</h4>
                        <p className="text-sm mb-2">This is the permanent, verified address where project funds (minus platform fees) will be sent. Please ensure this is a highly secure wallet (e.g., a multi-signature or hardware wallet).</p>
                        <input type="text" value={treasuryWallet} onChange={(e) => setTreasuryWallet(e.target.value)} placeholder="Enter your secure payout address (e.g., 0x...)" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                    </div>
                </div>
                 <button 
                    onClick={handleComplete}
                    disabled={!user.kycVerified || !treasuryWallet}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed">
                    { !user.kycVerified ? 'Please complete KYC first' : !treasuryWallet ? 'Please enter a treasury address' : 'Complete Onboarding' }
                </button>
            </div>
        </Modal>
    );
};

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-6 flex justify-between items-center"
            >
                <h3 className="text-lg font-semibold text-white">{question}</h3>
                <svg className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-6 pb-6 text-gray-400">
                    {answer}
                </div>
            </div>
        </div>
    );
};


// --- LANDING PAGE COMPONENTS ---

const LandingPage = ({ onEnterApp }) => {

    const handleScroll = (e, targetId) => {
        e.preventDefault();
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans" style={{fontFamily: "'Exo 2', sans-serif"}}>
             <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap');
            `}</style>
            {/* Header */}
            <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 p-4 lg:px-8 flex justify-between items-center sticky top-0 z-40">
                <div className="flex items-center space-x-3">
                    <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    <h1 className="text-2xl font-bold">QuantuHome</h1>
                </div>

                <nav className="hidden lg:flex items-center space-x-8">
                     <a href="#home" onClick={(e) => handleScroll(e, 'home')} className="font-semibold text-gray-300 hover:text-white transition">Home</a>
                     <a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')} className="font-semibold text-gray-300 hover:text-white transition">How it works</a>
                     <a href="#projects" onClick={(e) => handleScroll(e, 'projects')} className="font-semibold text-gray-300 hover:text-white transition">Projects</a>
                     <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="font-semibold text-gray-300 hover:text-white transition">About</a>
                     <a href="#compliance" onClick={(e) => handleScroll(e, 'compliance')} className="font-semibold text-gray-300 hover:text-white transition">Compliance</a>
                </nav>

                <div className="flex items-center space-x-4">
                    <button onClick={onEnterApp} className="font-semibold text-gray-300 hover:text-white transition">Log In</button>
                    <button onClick={onEnterApp} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition">Register</button>
                </div>
            </header>

            {/* Hero Section */}
            <section id="home" className="text-center py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-gray-800/50 [mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_70%)]"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight tracking-tight">The Future of Real Estate Investing is Here.</h2>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8">
                        Invest in fractional, tokenized real estate in Nigeria. Build your property portfolio with USD stablecoins and hedge against inflation.
                    </p>
                    <button onClick={onEnterApp} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition shadow-lg shadow-blue-500/20">
                        Explore Projects
                    </button>
                </div>
            </section>
            
            {/* How it Works Section */}
            <section id="how-it-works" className="py-28 px-4 bg-gray-900/70">
                <div className="container mx-auto max-w-7xl">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-20">A Simple, Transparent Process</h2>
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h3 className="text-4xl font-bold text-white mb-8">For Investors</h3>
                            <div className="space-y-8">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 font-bold text-xl border-2 border-blue-500/30">1</div>
                                    <div>
                                        <h4 className="text-2xl font-semibold">Create Account & Fund</h4>
                                        <p className="text-gray-400 mt-2 text-lg">Sign up in minutes, complete our secure KYC process, and fund your wallet with USD stablecoins (USDT/USDC).</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                     <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 font-bold text-xl border-2 border-blue-500/30">2</div>
                                    <div>
                                        <h4 className="text-2xl font-semibold">Browse & Invest</h4>
                                        <p className="text-gray-400 mt-2 text-lg">Explore our curated selection of high-yield real estate projects. Invest in fractions of properties you believe in with just a few clicks.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                     <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 font-bold text-xl border-2 border-blue-500/30">3</div>
                                    <div>
                                        <h4 className="text-2xl font-semibold">Earn & Trade</h4>
                                        <p className="text-gray-400 mt-2 text-lg">Receive your share of APY payments directly to your wallet in USDT. Trade your property tokens on our upcoming secondary market for liquidity.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                         <div>
                            <h3 className="text-4xl font-bold text-white mb-8">For Developers</h3>
                            <div className="space-y-8">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-400 font-bold text-xl border-2 border-green-500/30">1</div>
                                    <div>
                                        <h4 className="text-2xl font-semibold">Submit Project</h4>
                                        <p className="text-gray-400 mt-2 text-lg">Provide your project details through our streamlined portal. Our team conducts a rigorous due diligence process to ensure quality and viability.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                     <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-400 font-bold text-xl border-2 border-green-500/30">2</div>
                                    <div>
                                        <h4 className="text-2xl font-semibold">Raise Funds</h4>
                                        <p className="text-gray-400 mt-2 text-lg">Once approved, your project is tokenized and listed on our platform. Access a global pool of investors to raise capital in stable, inflation-resistant currency.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                     <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-400 font-bold text-xl border-2 border-green-500/30">3</div>
                                    <div>
                                        <h4 className="text-2xl font-semibold">Build & Manage</h4>
                                        <p className="text-gray-400 mt-2 text-lg">Withdraw funds to commence your project. Easily manage and distribute APY payments to your investors through your dedicated developer dashboard.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Featured Projects */}
            <section id="projects" className="py-24 px-4">
                 <div className="container mx-auto max-w-7xl">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">Featured Projects</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
                         {initialProjects.slice(0, 4).map(p => (
                            <div key={p.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700/50 group transition hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10">
                                <img src={p.image} alt={p.name} className="w-full h-64 object-cover" />
                                <div className="p-6 lg:p-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{p.name}</h3>
                                    <p className="text-gray-400 mb-6">{p.description}</p>
                                    <div className="flex justify-between items-center text-white mb-2">
                                        <span>Funding Progress</span>
                                        <span className="font-semibold">{((p.amountRaised / p.fundingGoal) * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-600 rounded-full h-2.5 mb-6">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(p.amountRaised / p.fundingGoal) * 100}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-lg">
                                        <p className="text-gray-300"><span className="font-bold text-green-400 text-xl">{p.apy}%</span> APY</p>
                                         <p className="text-gray-300"><span className="font-bold text-white text-xl">${p.amountRaised.toLocaleString()}</span> Raised</p>
                                    </div>
                                </div>
                            </div>
                         ))}
                     </div>
                 </div>
            </section>

             {/* About Section */}
            <section id="about" className="py-28 px-4 bg-gray-900/70">
                 <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-6">Democratizing Real Estate in Africa</h2>
                    <p className="text-xl text-gray-400 mb-16">
                        Our mission is to make real estate investment accessible, transparent, and liquid for everyone. We empower Nigerians to build wealth through property ownership, while providing vital capital for the real estate sector, contributing to the nation's economic growth.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12 text-center">
                    <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50">
                        <ShieldCheckIcon />
                        <h3 className="text-3xl font-bold mt-4 mb-2">Integrity First</h3>
                        <p className="text-gray-400 text-lg">We operate with complete transparency, leveraging blockchain technology for immutable records and trust.</p>
                    </div>
                    <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50">
                        <CurrencyDollarIcon />
                        <h3 className="text-3xl font-bold mt-4 mb-2">Innovation-Driven</h3>
                        <p className="text-gray-400 text-lg">We are pioneers in PropTech, constantly innovating to create value and a seamless user experience.</p>
                    </div>
                    <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50">
                        <GlobeIcon />
                        <h3 className="text-3xl font-bold mt-4 mb-2">Growth-Focused</h3>
                        <p className="text-gray-400 text-lg">Our goal is to be the leading and most trusted tokenized real estate platform in Africa, creating value for all stakeholders.</p>
                    </div>
                </div>
                 </div>
            </section>

             {/* Compliance Section */}
            <section id="compliance" className="py-28 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-6">Built on Trust and Security</h2>
                     <p className="text-xl text-gray-400 mb-12">
                        We are committed to operating in full compliance with all relevant Nigerian laws and regulations. Your security is our top priority.
                    </p>
                    <div className="bg-gray-800/50 p-10 rounded-xl border border-gray-700/50">
                        <p className="text-gray-300 text-lg leading-relaxed">
                        We work closely with the Securities and Exchange Commission (SEC) Nigeria to ensure that our platform meets all requirements for a crowdfunding portal and that our tokenized offerings are structured as compliant securities. We also strictly adhere to all Anti-Money Laundering (AML) and Know Your Customer (KYC) regulations to ensure a secure and legitimate investment environment.
                        </p>
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="bg-gray-800 text-white border-t border-gray-700">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                <span className="text-xl font-bold">QuantuHome</span>
                            </div>
                            <p className="text-gray-400 mt-4 text-sm">Democratizing real estate investment for everyone.</p>
                        </div>
                        
                        <div>
                            <h3 className="font-bold uppercase tracking-wider mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#projects" onClick={(e) => handleScroll(e, 'projects')} className="text-gray-400 hover:text-white transition-colors">Properties</a></li>
                                <li><a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')} className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mobile App</a></li>
                                <li><a href="#about" onClick={(e) => handleScroll(e, 'about')} className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold uppercase tracking-wider mb-4">Legal</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Risk Disclosure</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold uppercase tracking-wider mb-4">Connect With Us</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter"><TwitterIcon/></a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook"><FacebookIcon/></a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn"><LinkedInIcon/></a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
                        <p>&copy; {new Date().getFullYear()} QuantuHome. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// --- SHARED DASHBOARD COMPONENTS ---
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;

const NavItem = ({ icon, label, tabName, activeTab, setActiveTab, disabled = false }) => (
    <div className="relative group">
        <button
            onClick={() => !disabled && setActiveTab(tabName)}
            disabled={disabled}
            className={`flex items-center space-x-3 w-full text-left p-3 rounded-lg transition ${
                disabled
                ? 'text-gray-500 cursor-not-allowed'
                : activeTab === tabName
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700/50 text-gray-300'
            }`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
            {disabled && <LockIcon />}
        </button>
        {disabled && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-max px-2 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-lg">
                Complete KYC to unlock
            </div>
        )}
    </div>
);

const NotificationPanel = ({ userNotifications, onMarkAsRead }) => {
    return (
        <div className="absolute top-12 right-0 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
            <div className="p-4 border-b border-gray-700">
                <h3 className="font-semibold text-white">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {userNotifications.length > 0 ? userNotifications.map(n => (
                    <div key={n.id} className={`p-4 border-b border-gray-700/50 ${!n.read ? 'bg-blue-500/10' : ''}`}>
                        <p className="text-sm text-gray-300">{n.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(n.time)}</p>
                    </div>
                )) : (
                    <p className="p-4 text-sm text-gray-400">No new notifications.</p>
                )}
            </div>
            {userNotifications.some(n => !n.read) && (
                <div className="p-2 text-center bg-gray-800 rounded-b-lg">
                    <button onClick={onMarkAsRead} className="text-sm text-blue-400 hover:text-blue-300 font-semibold">Mark all as read</button>
                </div>
            )}
        </div>
    )
}

const ImageGalleryModal = ({ images, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = (e) => {
        e.stopPropagation();
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = (e) => {
        e.stopPropagation();
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center z-50 p-4" onClick={onClose}>
            <button onClick={onClose} className="absolute top-4 right-4 text-white text-5xl font-bold z-50">&times;</button>
            <div className="relative w-full max-w-4xl max-h-[70vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <button onClick={goToPrevious} className="absolute left-0 z-30 p-4 text-white bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full m-2 transition">
                    <ChevronLeftIcon />
                </button>
                <img src={images[currentIndex]} alt="Property View" className="max-h-full max-w-full object-contain rounded-lg shadow-2xl" />
                <button onClick={goToNext} className="absolute right-0 z-30 p-4 text-white bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full m-2 transition">
                    <ChevronRightIcon />
                </button>
            </div>
            <div className="w-full max-w-4xl mt-4 flex justify-center items-center space-x-2 p-2 bg-black bg-opacity-20 rounded-lg overflow-x-auto">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex(index);
                        }}
                        className={`h-20 w-auto object-cover rounded-md cursor-pointer border-4 ${currentIndex === index ? 'border-blue-500' : 'border-transparent hover:border-gray-500'}`}
                    />
                ))}
            </div>
        </div>
    );
};


const Marketplace = ({ projects, setProjects, currentUser }) => {
    const [activeTab, setActiveTab] = useState('properties');
    const [investModalOpen, setInvestModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);

    const handleInvestClick = (project) => {
        setSelectedProject(project);
        setInvestModalOpen(true);
    };

    const closeInvestModal = () => {
        setInvestModalOpen(false);
        setSelectedProject(null);
        setInvestmentAmount('');
    };
    
    const handleConfirmInvestment = (e) => {
        e.preventDefault();
        // In a real app, you'd integrate with a wallet and smart contract here
        alert(`Successfully invested ${investmentAmount} USDT in ${selectedProject.name}`);
        closeInvestModal();
    }

    const handleImageClick = (projectImages) => {
        setGalleryImages(projectImages);
        setIsGalleryOpen(true);
    };

    const closeGalleryModal = () => {
        setIsGalleryOpen(false);
        setGalleryImages([]);
    };

    return (
        <div>
            <h2 className="text-4xl font-bold text-white mb-6">Marketplace</h2>
            <div className="mb-6 border-b border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('properties')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'properties' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                        Properties
                    </button>
                    <button onClick={() => setActiveTab('tokens')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'tokens' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                        All Tokens
                    </button>
                    <button onClick={() => setActiveTab('exchange')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'exchange' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                        Currency Exchange
                    </button>
                </nav>
            </div>

            {activeTab === 'properties' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {projects.filter(p => p.status === 'Funding').map(p => (
                        <div key={p.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 flex flex-col justify-between transition hover:border-blue-500/50 hover:bg-gray-800">
                             <div>
                                <img src={p.image} alt={p.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                                <h3 className="text-xl font-bold text-white">{p.name}</h3>
                                <p className="text-sm text-gray-400 my-2 h-10">{p.description}</p>
                                <div className="space-y-3 text-gray-300 mt-4">
                                    <div className="flex justify-between"><span>APY</span> <span className="font-bold text-green-400">{p.apy}%</span></div>
                                    <div className="flex justify-between"><span>Price/Token</span> <span className="font-bold">${(p.fundingGoal / p.tokenSupply).toFixed(2)}</span></div>
                                    <p><strong>Funding:</strong> ${p.amountRaised.toLocaleString()} / ${p.fundingGoal.toLocaleString()}</p>
                                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(p.amountRaised / p.fundingGoal) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleInvestClick(p)} 
                                disabled={currentUser.role === 'Developer' && currentUser.id === p.developerId}
                                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-600 disabled:cursor-not-allowed">
                                {currentUser.role === 'Developer' && currentUser.id === p.developerId ? 'Your Project' : 'Invest'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
             {activeTab === 'tokens' && (
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/60">
                             <tr>
                                <th className="p-5 text-base font-semibold text-gray-300 tracking-wider">Token</th>
                                <th className="p-5 text-base font-semibold text-gray-300 tracking-wider">Price (USD)</th>
                                <th className="p-5 text-base font-semibold text-gray-300 tracking-wider">24h Change</th>
                                <th className="p-5 text-base font-semibold text-gray-300 tracking-wider">Market Cap</th>
                                <th className="p-5"></th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-700/50">
                            {projects.map(p => {
                                const price = p.fundingGoal / p.tokenSupply;
                                const change = (Math.random() * 10 - 5).toFixed(2); // Mock data
                                return (
                                <tr key={p.id} className="hover:bg-gray-700/40 transition">
                                    <td className="p-5 text-lg text-white font-medium">{p.ticker}</td>
                                    <td className="p-5 text-lg text-white">${price.toFixed(2)}</td>
                                    <td className={`p-5 text-lg ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{change}%</td>
                                    <td className="p-5 text-lg text-white">${p.fundingGoal.toLocaleString()}</td>
                                    <td><button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Trade</button></td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
             {activeTab === 'exchange' && (
                <div className="max-w-md mx-auto bg-gray-800/50 p-8 rounded-xl border border-gray-700/50">
                    <h3 className="text-2xl font-bold text-white text-center mb-6">Currency Exchange</h3>
                    <form className="space-y-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-400 mb-1">You Sell</label>
                            <div className="relative">
                                <input type="number" placeholder="0.00" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none pr-24"/>
                                <select className="absolute inset-y-0 right-0 bg-gray-700 border border-gray-700 rounded-r-lg px-4 text-white">
                                    <option>NGN</option>
                                    <option>USDT</option>
                                </select>
                            </div>
                        </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-400 mb-1">You Get</label>
                            <div className="relative">
                                <input type="number" placeholder="0.00" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none pr-24"/>
                                <select className="absolute inset-y-0 right-0 bg-gray-700 border border-gray-700 rounded-r-lg px-4 text-white">
                                    <option>USDT</option>
                                    <option>NGN</option>
                                </select>
                            </div>
                        </div>
                        <p className="text-sm text-center text-gray-400 pt-2">Rate: 1 USDT ≈ 1,450 NGN</p>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition">Exchange</button>
                    </form>
                </div>
            )}
            
            {isGalleryOpen && (
                <ImageGalleryModal
                    images={galleryImages}
                    onClose={closeGalleryModal}
                />
            )}

            {investModalOpen && selectedProject && (
                <Modal title={selectedProject.name} onClose={closeInvestModal}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto pr-2">
                        {/* Left side: Image and details */}
                        <div>
                            <img 
                                src={selectedProject.image} 
                                alt={selectedProject.name} 
                                className="w-full h-64 object-cover rounded-lg mb-4 cursor-pointer transition hover:opacity-90 shadow-lg"
                                onClick={() => handleImageClick(selectedProject.images)}
                             />
                            <h3 className="text-2xl font-bold text-white mb-2">{selectedProject.name}</h3>
                            <p className="text-gray-400">{selectedProject.description}</p>
                        </div>

                        {/* Right side: Metrics and investment form */}
                        <div className="space-y-6">
                            <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600/50">
                                <h4 className="text-xl font-semibold text-white mb-4">Key Metrics</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-300"><span>Target APY</span> <span className="font-bold text-green-400 text-lg">{selectedProject.apy}%</span></div>
                                    <div className="flex justify-between text-gray-300"><span>Lock-up Term</span> <span className="font-bold text-white text-lg">{selectedProject.term} months</span></div>
                                    <div className="flex justify-between text-gray-300"><span>Token Price</span> <span className="font-bold text-white text-lg">${(selectedProject.fundingGoal / selectedProject.tokenSupply).toFixed(2)}</span></div>
                                    <div className="flex justify-between text-gray-300"><span>Funding Goal</span> <span className="font-bold text-white text-lg">${selectedProject.fundingGoal.toLocaleString()}</span></div>
                                </div>
                                 <div className="mt-4">
                                    <div className="flex justify-between text-sm font-medium text-gray-300 mb-1">
                                        <span>Funding Progress</span>
                                        <span className="font-bold text-white">{((selectedProject.amountRaised / selectedProject.fundingGoal) * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(selectedProject.amountRaised / selectedProject.fundingGoal) * 100}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>${selectedProject.amountRaised.toLocaleString()} Raised</span>
                                        <span>${(selectedProject.fundingGoal - selectedProject.amountRaised).toLocaleString()} Left</span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleConfirmInvestment}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="invest-amount" className="block text-sm font-medium text-gray-400 mb-1">Investment Amount (USDT)</label>
                                        <input id="invest-amount" type="number" value={investmentAmount} onChange={(e) => setInvestmentAmount(e.target.value)} placeholder="0.00" required className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div className="text-sm text-gray-400 bg-gray-900/50 p-3 rounded-md">
                                        <p>You will receive approx. <span className="font-semibold text-white">{(investmentAmount / (selectedProject.fundingGoal / selectedProject.tokenSupply) || 0).toFixed(2)} {selectedProject.ticker}</span> tokens.</p>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition mt-6">Confirm Investment</button>
                            </form>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

const TreasuryWalletPanel = ({ user, setUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [address, setAddress] = useState(user.treasuryWallet);

    const handleSave = () => {
        setUser({ ...user, treasuryWallet: address });
        setIsEditing(false);
    };

    return (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-xl font-semibold mb-4 text-white">Treasury Payout Address</h3>
            <p className="text-gray-400 mb-4 text-sm">This is the secure, verified address where funds from your completed projects will be sent. Changing it is a high-security action that normally requires contacting support.</p>
            {isEditing ? (
                <div className="space-y-4">
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                    <div className="flex space-x-2">
                        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">Save</button>
                        <button onClick={() => setIsEditing(false)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-between items-center">
                    <p className="text-white font-mono break-all">{user.treasuryWallet || 'Not Set'}</p>
                    <button onClick={() => setIsEditing(true)} className="ml-4 text-blue-400 hover:text-blue-300 font-semibold text-sm flex-shrink-0">Change</button>
                </div>
            )}
        </div>
    );
};


// --- DASHBOARD COMPONENTS ---

const AnalyticsDashboard = ({ developerProjects }) => {
    const chartJsStatus = useScript('https://cdn.jsdelivr.net/npm/chart.js');
    const dataLabelsPluginStatus = useScript(chartJsStatus === 'ready' ? 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js' : null);
    const [activeAnalyticsTab, setActiveAnalyticsTab] = useState('capitalRaised');
    const chartRefs = useRef({});

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const [startDate, setStartDate] = useState({ year: currentYear, month: 'January' });
    const [endDate, setEndDate] = useState({ year: currentYear, month: months[new Date().getMonth()] });

    const handleDownloadReport = () => {
        alert(`Simulating download of report from ${startDate.month} ${startDate.year} to ${endDate.month} ${endDate.year}.`);
    }

    useEffect(() => {
        if (chartJsStatus !== 'ready' || dataLabelsPluginStatus !== 'ready' || !window.Chart || !window.ChartDataLabels) return;

        window.Chart.register(window.ChartDataLabels);

        Object.values(chartRefs.current).forEach(chart => chart?.destroy());

        const chartOptions = {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                y: { beginAtZero: true, ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
                x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } }
            },
            plugins: { 
                legend: { labels: { color: '#d1d5db' } },
                datalabels: {
                    display: false
                }
            }
        };

        const doughnutChartOptions = {
             maintainAspectRatio: false,
             responsive: true,
             plugins: { 
                legend: { position: 'top', labels: { color: '#d1d5db' } },
                datalabels: {
                     formatter: (value, ctx) => {
                         const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                         const percentage = ((value / sum) * 100).toFixed(1) + "%";
                         return percentage;
                     },
                     color: '#fff',
                     font: {
                         weight: 'bold',
                         size: 12,
                     },
                     display: 'auto',
                     anchor: 'center',
                     align: 'center',
                }
            }
        };
        
        const pieChartOptions = {
             maintainAspectRatio: false,
             responsive: true,
             plugins: { 
                legend: { position: 'top', labels: { color: '#d1d5db' } },
                datalabels: {
                     formatter: (value, ctx) => {
                         const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                         const percentage = ((value / sum) * 100).toFixed(1) + "%";
                         return percentage;
                     },
                     color: '#fff',
                      font: {
                         weight: 'bold',
                         size: 12
                     },
                     anchor: 'end',
                     align: 'start',
                     offset: 8,
                }
            }
        };

        const renderChart = (id, type, data, options) => {
            const ctx = document.getElementById(id)?.getContext('2d');
            if (ctx) {
                chartRefs.current[id] = new window.Chart(ctx, { type, data, options });
            }
        };

        switch (activeAnalyticsTab) {
            case 'capitalRaised':
                renderChart('capitalRaisedChart', 'bar', {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{ label: 'Capital Raised (USD)', data: [15000, 22000, 18000, 35000], backgroundColor: '#3B82F6' }]
                }, chartOptions);
                break;
            case 'portfolioValue':
                renderChart('portfolioValueChart', 'doughnut', {
                    labels: developerProjects.map(p => p.name),
                    datasets: [{
                        label: 'Portfolio by Asset Value',
                        data: developerProjects.map(p => p.fundingGoal),
                        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
                    }]
                }, doughnutChartOptions);
                break;
            case 'marketPerformance':
                 renderChart('marketPerformanceChart', 'line', {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{ label: 'Avg. Token Price (USD)', data: [1.02, 1.05, 1.03, 1.08, 1.12, 1.15], borderColor: '#10B981', tension: 0.1 }]
                }, chartOptions);
                break;
            case 'fundingPerformance':
                 renderChart('fundingPerformanceChart', 'bar', {
                    labels: developerProjects.map(p => p.name),
                    datasets: [
                        { label: 'Amount Raised (USD)', data: developerProjects.map(p => p.amountRaised), backgroundColor: '#3B82F6' },
                        { label: 'Funding Goal (USD)', data: developerProjects.map(p => p.fundingGoal), backgroundColor: '#4B5563' }
                    ]
                }, chartOptions);
                break;
            case 'newInvestors':
                 renderChart('newInvestorsChart', 'bar', {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{ label: 'New Investors', data: [12, 18, 15, 25], backgroundColor: '#F59E0B' }]
                }, chartOptions);
                break;
            case 'investorDemographics':
                 renderChart('investorDemographicsChart', 'pie', {
                    labels: ['Lagos', 'Abuja', 'Diaspora (USA/UK)', 'Other'],
                    datasets: [{
                        label: 'Investor Demographics',
                        data: [45, 25, 20, 10],
                         backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
                    }]
                }, pieChartOptions);
                break;
            case 'investmentDistribution':
                 renderChart('investmentDistributionChart', 'bar', {
                    labels: ['<$1k', '$1k-$5k', '$5k-$10k', '$10k-$25k', '$25k+'],
                    datasets: [{ label: 'Number of Investments', data: [45, 50, 30, 15, 8], backgroundColor: '#EF4444' }]
                }, chartOptions);
                break;
        }

        return () => {
            Object.values(chartRefs.current).forEach(chart => chart?.destroy());
        };
    }, [activeAnalyticsTab, chartJsStatus, dataLabelsPluginStatus, developerProjects]);

    const renderActiveChart = () => {
        const charts = {
            capitalRaised: { id: 'capitalRaisedChart', title: 'Total Capital Raised Weekly' },
            portfolioValue: { id: 'portfolioValueChart', title: 'Portfolio by Asset Value' },
            marketPerformance: { id: 'marketPerformanceChart', title: 'Secondary Market Performance' },
            fundingPerformance: { id: 'fundingPerformanceChart', title: 'Funding Performance' },
            newInvestors: { id: 'newInvestorsChart', title: 'Weekly New Investors' },
            investorDemographics: { id: 'investorDemographicsChart', title: 'Investor Demographics' },
            investmentDistribution: { id: 'investmentDistributionChart', title: 'Investment Size & Distribution' },
        };
        const activeChart = charts[activeAnalyticsTab];

        return (
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 mt-4">
                <h3 className="font-semibold text-white mb-4 text-xl">{activeChart.title}</h3>
                <div className="h-96">
                    <canvas id={activeChart.id}></canvas>
                </div>
            </div>
        );
    };

    const AnalyticsTabButton = ({ tabId, children }) => (
        <button
            onClick={() => setActiveAnalyticsTab(tabId)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${activeAnalyticsTab === tabId ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
        >
            {children}
        </button>
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
                <h2 className="text-4xl font-bold text-white">Analytics Dashboard</h2>
                <div className="flex items-center space-x-2 mt-4 sm:mt-0 bg-gray-800/50 p-2 rounded-lg border border-gray-700/50">
                    <select value={startDate.month} onChange={e => setStartDate({...startDate, month: e.target.value})} className="bg-gray-700 rounded-md p-2 text-sm">
                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={startDate.year} onChange={e => setStartDate({...startDate, year: e.target.value})} className="bg-gray-700 rounded-md p-2 text-sm">
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <span className="text-gray-400 px-2">to</span>
                     <select value={endDate.month} onChange={e => setEndDate({...endDate, month: e.target.value})} className="bg-gray-700 rounded-md p-2 text-sm">
                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={endDate.year} onChange={e => setEndDate({...endDate, year: e.target.value})} className="bg-gray-700 rounded-md p-2 text-sm">
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <button onClick={handleDownloadReport} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition flex items-center text-sm"><DownloadIcon/> Download</button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <AnalyticsTabButton tabId="capitalRaised">Capital Raised</AnalyticsTabButton>
                <AnalyticsTabButton tabId="portfolioValue">Portfolio Value</AnalyticsTabButton>
                <AnalyticsTabButton tabId="marketPerformance">Market Performance</AnalyticsTabButton>
                <AnalyticsTabButton tabId="fundingPerformance">Funding Performance</AnalyticsTabButton>
                <AnalyticsTabButton tabId="newInvestors">New Investors</AnalyticsTabButton>
                <AnalyticsTabButton tabId="investorDemographics">Demographics</AnalyticsTabButton>
                <AnalyticsTabButton tabId="investmentDistribution">Investment Distribution</AnalyticsTabButton>
            </div>

            {renderActiveChart()}
        </div>
    );
};

const AdminDashboard = ({ projects, setProjects }) => {
    const [adminActiveTab, setAdminActiveTab] = useState('dashboard');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '', fundingGoal: '', apy: '', developerId: '' });
    const [allUsers, setAllUsers] = useState(Object.values(users));
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [adminUser, setAdminUser] = useState(users.admin);
    const [copied, setCopied] = useState(false);
    
    const platformTreasuryAddress = '0xPlatformTreasuryAddressGoesHere1234567890'; // Mock address

    const chartJsStatus = useScript('https://cdn.jsdelivr.net/npm/chart.js');
    const chartRefs = useRef({});

    const copyToClipboard = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
    };

    useEffect(() => {
        if (adminActiveTab !== 'dashboard' || chartJsStatus !== 'ready' || !window.Chart) return;

        Object.values(chartRefs.current).forEach(chart => chart?.destroy());

        const renderChart = (id, type, data, options) => {
            const ctx = document.getElementById(id)?.getContext('2d');
            if (ctx) {
                chartRefs.current[id] = new window.Chart(ctx, { type, data, options });
            }
        };

        const chartOptions = {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                y: { beginAtZero: true, ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
                x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } }
            },
            plugins: { legend: { labels: { color: '#d1d5db' } } }
        };
        
        renderChart('fundsRaisedChart', 'line', {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{ label: 'Total Funds Raised (USD)', data: [50000, 75000, 120000, 110000, 180000, 250000], borderColor: '#3B82F6', tension: 0.1, fill: true, backgroundColor: 'rgba(59, 130, 246, 0.1)' }]
        }, chartOptions);

         renderChart('userRegistrationChart', 'bar', {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                { label: 'Investors', data: [10, 12, 15, 25, 30, 45], backgroundColor: '#10B981' },
                { label: 'Developers', data: [1, 0, 2, 1, 3, 2], backgroundColor: '#F59E0B' }
            ]
        }, chartOptions);


    }, [adminActiveTab, chartJsStatus]);

    const resetCreateProjectModal = () => {
        setNewProject({ name: '', description: '', fundingGoal: '', apy: '', developerId: '' });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateProject = (e) => {
        e.preventDefault();
        setProjects(prev => [ ...prev, { id: prev.length + 1, ...newProject, amountRaised: 0, status: 'Funding', investors: {}, fundingGoal: parseFloat(newProject.fundingGoal), apy: parseFloat(newProject.apy) }]);
        setShowCreateModal(false);
        resetCreateProjectModal();
    };
    
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              users[project.developerId]?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    const renderAdminContent = () => {
        switch(adminActiveTab) {
            case 'dashboard':
                const totalFundsRaised = projects.reduce((sum, p) => sum + p.amountRaised, 0);
                const activeInvestors = new Set(projects.flatMap(p => Object.keys(p.investors))).size;
                return (
                    <div>
                         <h2 className="text-4xl font-bold text-white mb-6">Admin Dashboard</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                            <StatCard title="Total Value Locked (TVL)" value={`$${totalFundsRaised.toLocaleString()}`} />
                            <StatCard title="Total Funds Raised" value={`$${totalFundsRaised.toLocaleString()}`} />
                            <StatCard title="Active Investors" value={activeInvestors} />
                            <StatCard title="Active Developers" value={Object.values(users).filter(u=>u.role === 'Developer').length} />
                        </div>
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                <h3 className="font-semibold text-white mb-4">Platform Growth (Funds Raised)</h3>
                                <div className="h-80"><canvas id="fundsRaisedChart"></canvas></div>
                            </div>
                             <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                <h3 className="font-semibold text-white mb-4">User Registration Trends</h3>
                                <div className="h-80"><canvas id="userRegistrationChart"></canvas></div>
                            </div>
                        </div>
                    </div>
                );
            case 'projects':
                const projectStatuses = ['All', ...new Set(projects.map(p => p.status))];
                return (
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                            <h2 className="text-4xl font-bold text-white">Project Management</h2>
                            <div className="flex items-center gap-4">
                                <input 
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <select 
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    {projectStatuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition whitespace-nowrap">
                                    Create Project
                                </button>
                            </div>
                        </div>
                         <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-x-auto">
                             <table className="w-full text-left">
                                <thead className="bg-gray-800/60">
                                    <tr>
                                        <th className="p-4 text-sm font-semibold text-gray-300">Project</th>
                                        <th className="p-4 text-sm font-semibold text-gray-300">Developer</th>
                                        <th className="p-4 text-sm font-semibold text-gray-300">Funding</th>
                                        <th className="p-4 text-sm font-semibold text-gray-300">Status</th>
                                        <th className="p-4 text-sm font-semibold text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {filteredProjects.map(p => (
                                        <tr key={p.id} className="hover:bg-gray-700/40">
                                            <td className="p-4 text-white font-medium">{p.name}</td>
                                            <td className="p-4 text-gray-300">{users[p.developerId]?.name || 'N/A'}</td>
                                            <td className="p-4 text-gray-300">${p.amountRaised.toLocaleString()} / ${p.fundingGoal.toLocaleString()}</td>
                                            <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${ p.status === 'Funding' ? 'bg-yellow-500/20 text-yellow-300' : p.status === 'Funded' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300' }`}>{p.status}</span></td>
                                            <td className="p-4"><button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">Manage</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'users':
                 return (
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-6">User Management</h2>
                         <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-x-auto">
                             <table className="w-full text-left">
                                <thead className="bg-gray-800/60">
                                    <tr>
                                        <th className="p-4 text-sm font-semibold text-gray-300">Name</th>
                                        <th className="p-4 text-sm font-semibold text-gray-300">Role</th>
                                        <th className="p-4 text-sm font-semibold text-gray-300">KYC Status</th>
                                        <th className="p-4 text-sm font-semibold text-gray-300">Date Joined</th>
                                        <th className="p-4 text-sm font-semibold text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {allUsers.filter(u=> u.id !== 'admin').map(u => (
                                        <tr key={u.id} className="hover:bg-gray-700/40">
                                            <td className="p-4 text-white font-medium">{u.name}</td>
                                            <td className="p-4 text-gray-300">{u.role}</td>
                                            <td className="p-4">{u.kycVerified ? <CheckCircleIcon /> : <XCircleIcon />}</td>
                                            <td className="p-4 text-gray-300">{formatDate(u.dateJoined)}</td>
                                            <td className="p-4"><button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">View</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                 );
            case 'compliance':
                const pendingKycs = allUsers.filter(u => !u.kycVerified && u.role !== 'Admin');
                return (
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-6">Compliance: Pending KYC</h2>
                        <div className="space-y-4">
                            {pendingKycs.length > 0 ? pendingKycs.map(u => (
                                <div key={u.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-white">{u.name} ({u.role})</p>
                                        <p className="text-sm text-gray-400">User ID: {u.id}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 text-sm rounded-md transition">Approve</button>
                                        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 text-sm rounded-md transition">Reject</button>
                                    </div>
                                </div>
                            )) : <p className="text-gray-400">No pending KYC submissions.</p>}
                        </div>
                    </div>
                );
            case 'settings':
                 return (
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-6">Platform Settings</h2>
                         <div className="space-y-6 max-w-2xl">
                             <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                <label className="block text-xl font-semibold text-white mb-2">Platform Fee</label>
                                <input type="number" defaultValue="2" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white" />
                                <p className="text-sm text-gray-400 mt-2">The percentage fee charged on successfully funded projects.</p>
                             </div>
                             <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                <h3 className="text-xl font-semibold mb-4 text-white">Platform Treasury Address</h3>
                                <p className="text-gray-400 mb-4 text-sm">This is the central wallet where platform fees are collected.</p>
                                <div className="flex justify-between items-center bg-gray-900 p-3 rounded-lg">
                                    <p className="text-white font-mono break-all text-sm">{platformTreasuryAddress}</p>
                                    <button onClick={() => copyToClipboard(platformTreasuryAddress)} className="ml-4 text-blue-400 hover:text-blue-300 font-semibold text-sm flex-shrink-0">
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                            <TwoFactorAuthPanel user={adminUser} setUser={setAdminUser} />
                        </div>
                    </div>
                 );
        }
    }

    return (
        <div className="flex h-full">
            {showCreateModal && (
                <Modal title="Create New Project" onClose={() => {setShowCreateModal(false); resetCreateProjectModal()}}>
                    <form onSubmit={handleCreateProject} className="space-y-4">
                        <input name="name" value={newProject.name} onChange={handleInputChange} placeholder="Project Name" required className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white" />
                        <textarea name="description" value={newProject.description} onChange={handleInputChange} placeholder="Description" required className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white h-24"></textarea>
                        <input name="fundingGoal" type="number" value={newProject.fundingGoal} onChange={handleInputChange} placeholder="Funding Goal (USD)" required className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white" />
                        <input name="apy" type="number" value={newProject.apy} onChange={handleInputChange} placeholder="APY (%)" required className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white" />
                        <select name="developerId" value={newProject.developerId} onChange={handleInputChange} required className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white">
                            <option value="">Select Developer</option>
                            {Object.values(users).filter(u => u.role === 'Developer').map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                         <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition">Create Project</button>
                    </form>
                </Modal>
            )}
            <aside className="w-64 pr-8 border-r border-gray-700 flex-shrink-0">
                <div className="py-8 lg:py-12">
                    <nav className="space-y-2">
                        <NavItem icon={<DashboardIcon />} label="Dashboard" tabName="dashboard" activeTab={adminActiveTab} setActiveTab={setAdminActiveTab} />
                        <NavItem icon={<ProjectIcon />} label="Projects" tabName="projects" activeTab={adminActiveTab} setActiveTab={setAdminActiveTab} />
                        <NavItem icon={<UsersIcon />} label="Users" tabName="users" activeTab={adminActiveTab} setActiveTab={setAdminActiveTab} />
                        <NavItem icon={<ShieldExclamationIcon />} label="Compliance" tabName="compliance" activeTab={adminActiveTab} setActiveTab={setAdminActiveTab} />
                        <NavItem icon={<SettingsIcon />} label="Settings" tabName="settings" activeTab={adminActiveTab} setActiveTab={setAdminActiveTab} />
                    </nav>
                </div>
            </aside>
            <main className="flex-grow pl-8 overflow-y-auto">
                <div className="py-8 lg:py-12">
                    {renderAdminContent()}
                </div>
            </main>
        </div>
    );
};


// --- INTERACTIVE DEVELOPER DASHBOARD ---
const DeveloperDashboard = ({ projects, setProjects, currentUser, onUserUpdate }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [managingProject, setManagingProject] = useState(null);
    const [apyAmount, setApyAmount] = useState('');
    const [userData, setUserData] = useState(currentUser);
    const [helpSubTab, setHelpSubTab] = useState('faq');
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const [newProjectData, setNewProjectData] = useState({
        name: '',
        location: '',
        description: '',
        valuation: '',
        apy: '',
        term: '',
        tokenSupply: '',
        ticker: ''
    });
    const [impliedPrice, setImpliedPrice] = useState(0);

    const [walletTab, setWalletTab] = useState('crypto');
    const [walletModal, setWalletModal] = useState({ isOpen: false, type: '', currency: '' });
    const [mockNgnBalance, setMockNgnBalance] = useState(15000000);
    const [mockUsdtBalance, setMockUsdtBalance] = useState(5800.75);
    const [connectedWallet, setConnectedWallet] = useState(null);

    const initialDevTransactions = [
        { id: 1, type: 'Project Payout', amount: 1176000, currency: 'USDT', date: '2023-10-20', status: 'Completed', project: 'Eko Atlantic Tower' },
        { id: 2, type: 'APY Deposit', amount: -9750, currency: 'USDT', date: '2023-10-18', status: 'Completed', project: 'Ikoyi Gardens' },
        { id: 3, type: 'Withdrawal', amount: -5000000, currency: 'NGN', date: '2023-10-15', status: 'Completed' },
    ];
    const [transactions, setTransactions] = useState(initialDevTransactions);

    const developerProjects = projects.filter(p => p.developerId === currentUser.id);
    
    const handleConnectWallet = () => {
        setConnectedWallet({
            address: '0x9876FedcBa9876FedcBa9876FedcBa9876FedcBa',
            usdtBalance: 15000.50,
            ngnBalance: 250000
        });
    };

    const handleDisconnectWallet = () => {
        setConnectedWallet(null);
    }
    
    const handleFileSelect = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleAttachClick = () => {
        fileInputRef.current.click();
    };

    const handleProjectInputChange = (e) => {
        const { name, value } = e.target;
        // Handle comma formatting for valuation and token supply
        if (name === 'valuation' || name === 'tokenSupply') {
            const sanitizedValue = value.replace(/,/g, '');
            // Allow empty string or strings that are valid non-negative integers
            if (sanitizedValue === '' || /^\d+$/.test(sanitizedValue)) {
                 setNewProjectData(prev => ({ ...prev, [name]: sanitizedValue }));
            }
        } else {
            setNewProjectData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleWalletAction = (action, currency) => {
        setWalletModal({ isOpen: true, type: action, currency });
    };

    const closeWalletModal = () => {
        setWalletModal({ isOpen: false, type: '', currency: '' });
    };

    useEffect(() => {
        const valuation = parseFloat(newProjectData.valuation);
        const supply = parseFloat(newProjectData.tokenSupply);
        if (valuation > 0 && supply > 0) {
            setImpliedPrice(valuation / supply);
        } else {
            setImpliedPrice(0);
        }
    }, [newProjectData.valuation, newProjectData.tokenSupply]);


    const handleProfileUpdate = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value});
    };

    const handleProfileSave = (e) => {
        e.preventDefault();
        onUserUpdate(userData);
        // Here you would typically show a success message
        alert("Profile saved successfully!");
    };

    const handleWithdraw = () => {
        const developerAmount = managingProject.amountRaised * 0.98;
        
        setProjects(prev => prev.map(p => p.id === managingProject.id ? {...p, status: 'Paying APY'} : p));
        setManagingProject(null);
    };

    const handleDepositApy = (e) => {
        e.preventDefault();
        const amount = parseFloat(apyAmount);
        if (!amount || amount <= 0) return;

        setProjects(prev => prev.map(p => 
            p.id === managingProject.id ? { ...p, apyFundsDeposited: p.apyFundsDeposited + amount, status: 'Paying APY', apyClaimedBy: {} } : p
        ));
        setManagingProject(null);
        setApyAmount('');
    };

    const developerFaqs = [
        { q: "What are the requirements for submitting a project?", a: "To submit a project, you must be a registered and KYC-verified developer. Your project proposal should include a detailed description, financial projections (total valuation, funding goal), expected APY, and legal documentation." },
        { q: "What is the platform fee for developers?", a: "We charge a 2% fee on the total funds successfully raised for your project. This fee is automatically deducted when you withdraw the funds." },
        { q: "How do I withdraw funds once my project is fully funded?", a: "Once your project's funding goal is met, the 'Withdraw Funds' button will become active in your 'My Projects' management panel. The funds (minus the platform fee) will be transferred to your registered treasury wallet." },
        { q: "How do APY payments work?", a: "For funded projects, you are responsible for depositing the total monthly APY payment in USDT into the platform. You can do this from the 'Manage' section of your project. We then calculate and handle the distribution to each individual investor based on their stake." }
    ];

    const cryptoTransactions = transactions.filter(t => t.currency === 'USDT');
    const fiatTransactions = transactions.filter(t => t.currency === 'NGN');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-4xl font-bold text-white">Developer Dashboard</h2>
                             <p className="text-lg text-gray-400">Welcome back! Today is {formatDate(new Date())}.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Column 1 */}
                            <div className="lg:col-span-1 xl:col-span-1 space-y-6">
                                <StatCard title="New Investors (Weekly)" value={12} />
                                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                    <h3 className="font-semibold text-white text-lg mb-4">My Project Pipeline</h3>
                                    <ul className="space-y-4">
                                         {[ { name: "Victoria Island Luxury Hub", status: "In Review" }, { name: "Banana Island Waterfront", status: "Submitted" },].map((p, i) => (
                                            <li key={i}>
                                                <p className="font-semibold text-gray-200">{p.name}</p>
                                                <p className="text-sm text-blue-400">{p.status}</p>
                                            </li>
                                         ))}
                                    </ul>
                                </div>
                            </div>
                            {/* Column 2 */}
                            <div className="lg:col-span-2 xl:col-span-2 space-y-6">
                                 {/* Live funding projects card */}
                                 <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                    <h3 className="font-semibold text-white text-lg mb-4">Live Funding Projects</h3>
                                    <div className="space-y-4">
                                      {developerProjects.filter(p => p.status === 'Funding').map(p => (
                                        <div key={p.id}>
                                           <div className="flex justify-between items-center text-sm mb-1">
                                             <span className="font-semibold text-gray-200">{p.name}</span>
                                             <span className="text-gray-400">{((p.amountRaised / p.fundingGoal) * 100).toFixed(0)}%</span>
                                           </div>
                                           <div className="w-full bg-gray-600 rounded-full h-2.5">
                                               <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(p.amountRaised / p.fundingGoal) * 100}%` }}></div>
                                           </div>
                                        </div>
                                      ))}
                                    </div>
                                 </div>
                                 
                                {/* APY Payment Schedule Card */}
                                 <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                    <h3 className="font-semibold text-white text-lg mb-4">APY Payment Schedule (Next 30 Days)</h3>
                                    <ul className="space-y-3">
                                        {developerProjects.filter(p => p.status === 'Paying APY' || p.status === 'Funded').map((p, i) => (
                                            <li key={i} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-300">{p.name}</span>
                                                <span className="text-gray-400">{new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}</span>
                                                <span className="font-semibold text-green-400">${((p.fundingGoal * (p.apy / 100)) / 12).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                             {/* Column 3 */}
                            <div className="lg:col-span-3 xl:col-span-1 space-y-6">
                                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                    <h3 className="font-semibold text-white text-lg mb-4">Financial Summary</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-gray-300"><span>Total Portfolio Valuation</span><span className="font-bold text-white">${developerProjects.reduce((acc, p) => acc + p.fundingGoal, 0).toLocaleString()}</span></div>
                                        <div className="flex justify-between text-gray-300"><span>Total Funds Raised</span><span className="font-bold text-green-400">${developerProjects.reduce((acc, p) => acc + p.amountRaised, 0).toLocaleString()}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'my-projects':
                return (
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-6">My Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {developerProjects.map(p => (
                                <div key={p.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 flex flex-col justify-between transition hover:border-blue-500/50 hover:bg-gray-800">
                                    <div>
                                       <h3 className="text-xl font-bold text-white">{p.name}</h3>
                                        <p className="text-sm text-gray-400 my-4 h-16">{p.description}</p>
                                        <div className="space-y-3 text-gray-300">
                                            <p><strong>Funding:</strong> ${p.amountRaised.toLocaleString()} / ${p.fundingGoal.toLocaleString()}</p>
                                            <div className="w-full bg-gray-600 rounded-full h-2.5">
                                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(p.amountRaised / p.fundingGoal) * 100}%` }}></div>
                                            </div>
                                            <p><strong>Status:</strong> <span className="font-semibold text-blue-300">{p.status}</span></p>
                                        </div>
                                    </div>
                                    <button onClick={() => setManagingProject(p)} className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition">
                                        Manage
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'submit-project':
                return (
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-4">Submit New Project</h2>
                        <p className="text-gray-400 mb-6 max-w-3xl">Fill out the form below to submit your project for review by the QuantuHome team. Upon approval, it will be listed for funding.</p>
                        <form className="space-y-8 bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 max-w-3xl">
                           
                            <div className="space-y-4">
                                <h3 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">Project Information</h3>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Project Name</label>
                                    <input id="name" name="name" value={newProjectData.name} onChange={handleProjectInputChange} placeholder="e.g., Lekki Pearl Residence" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                                    <input id="location" name="location" value={newProjectData.location} onChange={handleProjectInputChange} placeholder="e.g., Lekki, Lagos" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                <div>
                                     <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Project Description</label>
                                    <textarea id="description" name="description" value={newProjectData.description} onChange={handleProjectInputChange} placeholder="A detailed description of the property..." className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none h-32"></textarea>
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Photo of the Property</label>
                                    <p className="text-xs text-gray-500 mb-2">This will be the main display image in the marketplace.</p>
                                    <input type="file" className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-300 hover:file:bg-blue-500/20"/>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">Financials & Tokenomics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="valuation" className="block text-sm font-medium text-gray-400 mb-1">Total Property Valuation (USD)</label>
                                        <input id="valuation" name="valuation" type="text" placeholder="e.g., 500,000" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" onChange={handleProjectInputChange} value={newProjectData.valuation ? Number(newProjectData.valuation).toLocaleString('en-US') : ''} />
                                    </div>
                                    <div>
                                        <label htmlFor="apy" className="block text-sm font-medium text-gray-400 mb-1">Project Annual APY (%)</label>
                                        <input id="apy" name="apy" type="number" placeholder="e.g., 12.5" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" onChange={handleProjectInputChange} value={newProjectData.apy} />
                                    </div>
                                    <div>
                                        <label htmlFor="term" className="block text-sm font-medium text-gray-400 mb-1">Investment Term (Months)</label>
                                        <input id="term" name="term" type="number" placeholder="e.g., 24" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" onChange={handleProjectInputChange} value={newProjectData.term} />
                                    </div>
                                    <div>
                                        <label htmlFor="tokenSupply" className="block text-sm font-medium text-gray-400 mb-1">Total Token Supply</label>
                                        <input id="tokenSupply" name="tokenSupply" type="text" placeholder="e.g., 500,000" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" onChange={handleProjectInputChange} value={newProjectData.tokenSupply ? Number(newProjectData.tokenSupply).toLocaleString('en-US') : ''} />
                                    </div>
                                     <div>
                                        <label htmlFor="ticker" className="block text-sm font-medium text-gray-400 mb-1">Token Ticker (3 Letters)</label>
                                        <input id="ticker" name="ticker" type="text" maxLength="3" placeholder="e.g., LPR" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" onChange={handleProjectInputChange} value={newProjectData.ticker} />
                                    </div>
                                    <div>
                                        <label htmlFor="impliedPrice" className="block text-sm font-medium text-gray-400 mb-1">Implied Price Per Token</label>
                                        <input id="impliedPrice" name="impliedPrice" type="text" readOnly value={`$${impliedPrice.toFixed(2)}`} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-gray-300 font-bold" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Project Proposal (.pdf)</label>
                                    <p className="text-xs text-gray-500 mb-2">Upload your detailed project proposal, including blueprints, legal documents, etc.</p>
                                    <input type="file" accept=".pdf" className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-300 hover:file:bg-blue-500/20"/>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition">Submit for Review</button>
                        </form>
                    </div>
                );
            case 'analytics':
                 return <AnalyticsDashboard developerProjects={developerProjects} />;
            case 'marketplace':
                return <Marketplace projects={projects} setProjects={setProjects} currentUser={currentUser} />;
            case 'wallet':
                 return (
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-6">Operational Wallet</h2>
                        {!connectedWallet ? (
                             <div className="text-center mt-20">
                                <WalletIcon className="mx-auto h-16 w-16 text-gray-500" />
                                <h3 className="mt-2 text-xl font-medium text-white">Connect your operational wallet</h3>
                                <p className="mt-1 text-sm text-gray-400 max-w-lg mx-auto">This is a 'hot wallet' (like MetaMask) used for daily platform interactions such as depositing APY funds for your investors. It is separate from your secure Treasury Payout Address.</p>
                                <div className="mt-6">
                                    <button
                                        onClick={handleConnectWallet}
                                        type="button"
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                                    >
                                        Connect Wallet
                                    </button>
                                </div>
                            </div>
                        ) : (
                             <div>
                                <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 flex justify-between items-center">
                                    <div>
                                        <span className="text-sm text-gray-400">Connected Address</span>
                                        <p className="font-mono text-white break-all">{connectedWallet.address}</p>
                                    </div>
                                    <button onClick={handleDisconnectWallet} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition">Disconnect</button>
                                </div>
                                <div className="mb-6 border-b border-gray-700">
                                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                        <button onClick={() => setWalletTab('crypto')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${walletTab === 'crypto' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                                            Crypto Wallet
                                        </button>
                                        <button onClick={() => setWalletTab('fiat')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${walletTab === 'fiat' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                                            Fiat Wallet (NGN)
                                        </button>
                                    </nav>
                                </div>
                                 {walletTab === 'crypto' && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-1 space-y-4">
                                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                            <h4 className="text-gray-400 text-sm font-medium">USDT Balance</h4>
                                            <p className="text-4xl font-bold text-white mt-1">{connectedWallet.usdtBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xl text-gray-400">USDT</span></p>
                                        </div>
                                        <button onClick={() => handleWalletAction('deposit', 'crypto')} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition">Deposit Crypto</button>
                                        <button onClick={() => handleWalletAction('withdraw', 'crypto')} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition">Withdraw Crypto</button>
                                    </div>
                                    <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                        <h3 className="font-semibold text-white mb-4 text-lg">Transaction History</h3>
                                        <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="border-b border-gray-700"><tr>
                                                <th className="py-3 px-2 text-base font-semibold text-gray-400">Type</th>
                                                <th className="py-3 px-2 text-base font-semibold text-gray-400">Amount</th>
                                                <th className="py-3 px-2 text-base font-semibold text-gray-400">Date</th>
                                                <th className="py-3 px-2 text-base font-semibold text-gray-400">Status</th>
                                            </tr></thead>
                                            <tbody className="divide-y divide-gray-700/50">
                                                {cryptoTransactions.map(t => (
                                                    <tr key={t.id}>
                                                        <td className="py-4 px-2 text-lg text-white">{t.type} {t.project && `(${t.project})`}</td>
                                                        <td className={`py-4 px-2 font-semibold text-lg ${t.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>{t.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                        <td className="py-4 px-2 text-lg text-gray-400">{formatDate(t.date)}</td>
                                                        <td className="py-4 px-2"><span className={`px-2 py-1 text-sm font-semibold rounded-full ${t.status === 'Completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{t.status}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                             {walletTab === 'fiat' && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-1 space-y-4">
                                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                            <h4 className="text-gray-400 text-sm font-medium">NGN Balance</h4>
                                            <p className="text-4xl font-bold text-white mt-1">₦{mockNgnBalance.toLocaleString()}</p>
                                        </div>
                                        <button onClick={() => handleWalletAction('deposit', 'fiat')} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition">Deposit Fiat</button>
                                        <button onClick={() => handleWalletAction('withdraw', 'fiat')} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition">Withdraw Fiat</button>
                                    </div>
                                    <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                        <h3 className="font-semibold text-white mb-4 text-lg">Fiat Transaction History</h3>
                                        <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="border-b border-gray-700"><tr>
                                                <th className="py-3 px-2 text-base font-semibold text-gray-400">Type</th>
                                                <th className="py-3 px-2 text-base font-semibold text-gray-400">Amount</th>
                                                <th className="py-3 px-2 text-base font-semibold text-gray-400">Date</th>
                                                <th className="py-3 px-2 text-base font-semibold text-gray-400">Status</th>
                                            </tr></thead>
                                            <tbody className="divide-y divide-gray-700/50">
                                                {fiatTransactions.map(t => (
                                                    <tr key={t.id}>
                                                        <td className="py-4 px-2 text-lg text-white">{t.type}</td>
                                                        <td className={`py-4 px-2 font-semibold text-lg ${t.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>{`₦${t.amount.toLocaleString()}`}</td>
                                                        <td className="py-4 px-2 text-lg text-gray-400">{formatDate(t.date)}</td>
                                                        <td className="py-4 px-2"><span className={`px-2 py-1 text-sm font-semibold rounded-full ${t.status === 'Completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{t.status}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                             </div>
                        )}
                    </div>
                 );
            case 'settings':
                return (
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-6">Developer Settings</h2>
                        <div className="space-y-6 max-w-2xl">
                            <form onSubmit={handleProfileSave} className="space-y-4 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                <h3 className="text-xl font-semibold mb-4 text-white">Company Profile</h3>
                                <input name="name" value={userData.name} onChange={handleProfileUpdate} placeholder="Company Name" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                <textarea name="companyProfile" value={userData.companyProfile} onChange={handleProfileUpdate} placeholder="Company Profile" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none h-32"></textarea>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition">Save Profile Changes</button>
                            </form>
                             <TreasuryWalletPanel user={userData} setUser={(updatedUser) => { setUserData(updatedUser); onUserUpdate(updatedUser); }} />
                            <TwoFactorAuthPanel user={userData} setUser={(updatedUser) => { setUserData(updatedUser); onUserUpdate(updatedUser); }} />
                        </div>
                    </div>
                );
            case 'help':
                return (
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-6">Help & Support</h2>
                        <div className="mb-6 border-b border-gray-700">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button onClick={() => setHelpSubTab('faq')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${helpSubTab === 'faq' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                                    FAQ
                                </button>
                                <button onClick={() => setHelpSubTab('chat')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${helpSubTab === 'chat' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                                    Live Chat
                                </button>
                            </nav>
                        </div>
                        {helpSubTab === 'faq' && (
                            <div className="max-w-4xl space-y-4">
                                {developerFaqs.map((faq, index) => <FAQItem key={index} question={faq.q} answer={faq.a} />)}
                            </div>
                        )}
                        {helpSubTab === 'chat' && (
                             <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-xl shadow-lg border border-gray-700/50">
                                <div className="p-4 border-b border-gray-700">
                                    <h3 className="text-xl font-bold text-white">Support Chat</h3>
                                    <p className="text-sm text-gray-400 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Support is online</p>
                                </div>
                                <div className="p-6 h-96 overflow-y-auto space-y-4">
                                    {/* Chat messages */}
                                    <div className="flex justify-start">
                                        <div className="bg-gray-700 text-white p-3 rounded-lg max-w-xs">
                                            <p>Hello! How can we assist you with your projects today?</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-900/50 border-t border-gray-700">
                                    {selectedFile && (
                                        <div className="text-sm text-gray-400 mb-2 px-4 flex justify-between items-center">
                                            <span>Attached: {selectedFile.name}</span>
                                            <button onClick={() => setSelectedFile(null)} className="text-red-400 hover:text-red-300">&times;</button>
                                        </div>
                                    )}
                                    <form className="flex items-center space-x-4">
                                        <input type="text" placeholder="Type your message..." className="flex-1 bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                                        <button type="button" onClick={handleAttachClick} className="text-gray-400 hover:text-white">
                                            <PaperclipIcon />
                                        </button>
                                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700">Send</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <>
            <div className="flex h-full">
                 {walletModal.isOpen && <WalletActionModal walletModal={walletModal} closeWalletModal={closeWalletModal} setMockNgnBalance={setMockNgnBalance} setMockUsdtBalance={setMockUsdtBalance} setTransactions={setTransactions}/>}
                <aside className="w-64 pr-8 border-r border-gray-700 flex-shrink-0">
                    <div className="py-8 lg:py-12">
                        <nav className="space-y-2">
                            <NavItem icon={<DashboardIcon />} label="Dashboard" tabName="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <NavItem icon={<ProjectIcon />} label="My Projects" tabName="my-projects" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <NavItem icon={<SubmitProjectIcon />} label="Submit Project" tabName="submit-project" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <NavItem icon={<AnalyticsIcon />} label="Analytics" tabName="analytics" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <NavItem icon={<MarketplaceIcon />} label="Marketplace" tabName="marketplace" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <NavItem icon={<WalletIcon />} label="Operational Wallet" tabName="wallet" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <NavItem icon={<SettingsIcon />} label="Settings" tabName="settings" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <NavItem icon={<HelpIcon />} label="Help & Support" tabName="help" activeTab={activeTab} setActiveTab={setActiveTab} />
                        </nav>
                    </div>
                </aside>
                <main className="flex-grow pl-8 overflow-y-auto">
                    <div className="py-8 lg:py-12">
                        {renderContent()}
                    </div>
                </main>
            </div>

            {managingProject && (
                <Modal title={`Manage: ${managingProject.name}`} onClose={() => setManagingProject(null)}>
                    <div className="space-y-6">
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h4 className="font-semibold text-white mb-2">Withdraw Funds</h4>
                            <p className="text-sm text-gray-400 mb-4">Once a project is fully funded, you can withdraw the raised capital. Funds will be sent to your registered Treasury Payout Address.</p>
                            <button onClick={handleWithdraw} disabled={managingProject.status !== 'Funded'} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed">
                                {managingProject.status === 'Funded' ? `Withdraw $${(managingProject.amountRaised * 0.98).toLocaleString()}` : 'Project not fully funded'}
                            </button>
                             <p className="text-xs text-center text-gray-400 mt-2">A 2% platform fee will be deducted. </p>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h4 className="font-semibold text-white mb-2">Deposit Monthly APY</h4>
                            <p className="text-sm text-gray-400 mb-4">Deposit the total monthly APY payment in USDT from your connected Operational Wallet for investors to claim.</p>
                             <form onSubmit={handleDepositApy}>
                                <input type="number" value={apyAmount} onChange={(e) => setApyAmount(e.target.value)} placeholder="Enter total monthly APY in USDT" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                                <button type="submit" disabled={!connectedWallet || (managingProject.status !== 'Paying APY' && managingProject.status !== 'Funded')} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed">
                                    {!connectedWallet ? 'Connect Operational Wallet First' : 'Deposit APY Payment'}
                                </button>
                            </form>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

const WalletActionModal = ({ walletModal, closeWalletModal, setMockNgnBalance, setMockUsdtBalance, setTransactions }) => {
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');
    const [copied, setCopied] = useState(false);

    const isDeposit = walletModal.type === 'deposit';
    const isCrypto = walletModal.currency === 'crypto';
    const currencyName = isCrypto ? 'USDT' : 'NGN';
    const title = `${isDeposit ? 'Deposit' : 'Withdraw'} ${currencyName}`;

    const handleSubmit = (e) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (!isDeposit && (!numericAmount || numericAmount <= 0)) {
            return;
        }

        const newTransaction = {
            id: Date.now(),
            type: isDeposit ? 'Deposit' : 'Withdrawal',
            amount: isDeposit ? numericAmount : -numericAmount,
            currency: currencyName,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            status: isDeposit ? 'Completed' : 'Pending',
        };

        if(!isDeposit) {
            if (isCrypto) {
                setMockUsdtBalance(prev => prev - numericAmount);
            } else {
                setMockNgnBalance(prev => prev - numericAmount);
            }
        }
        
        if (isDeposit) {
             // Mock deposit confirmation
             if (isCrypto) {
                setMockUsdtBalance(prev => prev + numericAmount);
            } else {
                setMockNgnBalance(prev => prev + numericAmount);
            }
        } else {
             setTransactions(prev => [newTransaction, ...prev]);
        }

        closeWalletModal();
    };
    
    const depositAddress = isCrypto ? "0xAbCdEfGhIjKlMnOpQrStUvWxYz1234567890aBcDeF" : "9988776655";
    const accountName = "QuantuHome Finance";

    const copyToClipboard = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
    };

    return (
        <Modal title={title} onClose={closeWalletModal} maxWidth="max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                {isDeposit ? (
                    <div className="space-y-4">
                        <p className="text-gray-300">To deposit {currencyName}, please transfer funds to the details below.</p>
                        
                        {!isCrypto && (
                           <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 space-y-2">
                               <div className="flex justify-between"><span className="text-gray-400">Bank Name</span> <span className="text-white font-semibold">Providus Bank</span></div>
                               <div className="flex justify-between"><span className="text-gray-400">Account Name</span> <span className="text-white font-semibold">{accountName}</span></div>
                               <div className="flex justify-between items-center"><span className="text-gray-400">Account Number</span> 
                                 <div className="flex items-center space-x-4">
                                   <span className="text-white font-semibold font-mono">{depositAddress}</span>
                                   <button type="button" onClick={() => copyToClipboard(depositAddress)} className="text-blue-400 hover:text-blue-300 font-semibold text-sm flex-shrink-0">
                                     {copied ? 'Copied!' : 'Copy'}
                                   </button>
                                 </div>
                               </div>
                           </div>
                        )}

                        {isCrypto && (
                            <div className="bg-gray-900 p-6 rounded-lg border border-gray-600 text-center">
                               <p className="text-sm text-gray-400 mb-4">Your {currencyName} Deposit Address (ERC20)</p>
                               <div className="flex justify-center mb-4 bg-white p-2 rounded-lg inline-block">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${depositAddress}&qzone=1`} 
                                        alt="Deposit QR Code" 
                                    />
                               </div>
                               <div className="flex items-center justify-between mt-2 bg-gray-800 p-2 rounded-md">
                                 <p className="text-white font-mono break-all text-xs sm:text-sm text-left">{depositAddress}</p>
                                 <button type="button" onClick={() => copyToClipboard(depositAddress)} className="ml-4 text-blue-400 hover:text-blue-300 font-semibold text-sm flex-shrink-0">
                                     {copied ? 'Copied!' : 'Copy'}
                                 </button>
                               </div>
                            </div>
                        )}
                        <p className="text-xs text-center text-gray-500 pt-2">
                            {isCrypto ? `Only send ${currencyName} (ERC20) to this address. Sending any other asset will result in a permanent loss.` : 'Deposits are typically credited within 5 minutes.'}
                        </p>
                        <button type="button" onClick={closeWalletModal} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition">Done</button>
                    </div>
                ) : (
                     <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Amount ({currencyName})</label>
                            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                        {isCrypto ? (
                             <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Withdrawal Address (ERC20)</label>
                                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={`Enter destination ${currencyName} address`} required className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                        ) : (
                            <div>
                               <label className="block text-sm font-medium text-gray-400 mb-1">Bank Account</label>
                                <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                    <option>Select Saved Bank...</option>
                                    <option>0123456789 - GTBank</option>
                                </select>
                            </div>
                        )}
                       
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition mt-6">Submit Withdrawal Request</button>
                        <p className="text-xs text-gray-500 text-center">Withdrawals are processed within 24 hours. A small network fee applies for crypto withdrawals.</p>
                    </div>
                )}
            </form>
        </Modal>
    );
};

// --- INTERACTIVE INVESTOR DASHBOARD ---
const InvestorDashboard = ({ projects, setProjects, currentUser, onUserUpdate }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userData, setUserData] = useState(currentUser);
    const [walletTab, setWalletTab] = useState('crypto'); // 'crypto' or 'fiat'
    const [helpSubTab, setHelpSubTab] = useState('faq');
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    
    const chartContainerRef = useRef(null);
    const allocationContainerRef = useRef(null);
    const performanceChartRef = useRef(null);
    const allocationChartRef = useRef(null);

    const chartJsStatus = useScript('https://cdn.jsdelivr.net/npm/chart.js');
    const dataLabelsPluginStatus = useScript(chartJsStatus === 'ready' ? 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js' : null);


    const investorProjects = projects.filter(p => p.investors[currentUser.id]);
    const totalInvested = investorProjects.reduce((acc, p) => acc + (p.investors[currentUser.id] || 0), 0);


    const [walletModal, setWalletModal] = useState({ isOpen: false, type: '', currency: '' });

    const [mockNgnBalance, setMockNgnBalance] = useState(750000);
    const [mockUsdtBalance, setMockUsdtBalance] = useState(2345.50);

    const initialTransactions = [
        { id: 1, type: 'Deposit', amount: 5000, currency: 'USDT', date: '2023-10-26', status: 'Completed' },
        { id: 2, type: 'Investment', amount: -2500, currency: 'USDT', date: '2023-10-25', status: 'Completed', project: 'Lekki Pearl' },
        { id: 3, type: 'APY Claim', amount: 125.50, currency: 'USDT', date: '2023-10-22', status: 'Completed', project: 'Ikoyi Gardens' },
        { id: 4, type: 'Withdrawal', amount: -1000, currency: 'USDT', date: '2023-10-20', status: 'Pending' },
        { id: 5, type: 'Deposit', amount: 1000000, currency: 'NGN', date: '2023-10-19', status: 'Completed' },
        { id: 6, type: 'Withdrawal', amount: -250000, currency: 'NGN', date: '2023-10-18', status: 'Completed' },
    ];
    const [transactions, setTransactions] = useState(initialTransactions);

    const investorFaqs = [
        { q: "What is property tokenization?", a: "Property tokenization is the process of converting the rights to a real estate asset into a digital token on a blockchain. This allows for fractional ownership, meaning you can buy and own a small piece of a larger property, making real estate investing more accessible." },
        { q: "How do I earn returns on my investment?", a: "You earn returns primarily through the annual percentage yield (APY) paid out from the property's income (e.g., rent). When developers deposit APY funds, you can claim your proportional share directly to your wallet." },
        { q: "Is my investment secure?", a: "Every project on QuantuHome is backed by a real, physical asset. Your ownership is recorded on a secure blockchain, ensuring transparency. We conduct rigorous due diligence on all listed properties." },
        { q: "Why do I need to complete KYC?", a: "Know Your Customer (KYC) is a mandatory regulatory requirement. It helps us prevent fraud and comply with Anti-Money Laundering (AML) laws, ensuring a secure platform for all users." }
    ];

    useEffect(() => {
        if (activeTab === 'dashboard' && chartJsStatus ==='ready' && dataLabelsPluginStatus === 'ready' && window.Chart && window.ChartDataLabels && investorProjects.length > 0) {
            
            window.Chart.register(window.ChartDataLabels);

            if (performanceChartRef.current) {
                performanceChartRef.current.destroy();
            }
            if (allocationChartRef.current) {
                allocationChartRef.current.destroy();
            }

            // Performance Chart
            const performanceCtx = chartContainerRef.current.getContext('2d');
            performanceChartRef.current = new window.Chart(performanceCtx, {
                type: 'line',
                data: {
                    labels: ['4m ago', '3m ago', '2m ago', '1m ago', 'Today'],
                    datasets: [{
                        label: 'Portfolio Value',
                        data: [totalInvested * 0.95, totalInvested * 0.98, totalInvested * 1.01, totalInvested * 1.02, totalInvested * 1.05],
                        borderColor: 'rgba(59, 130, 246, 0.8)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { ticks: { color: '#9ca3af' } },
                        x: { ticks: { color: '#9ca3af' } }
                    },
                    plugins: { 
                        legend: { display: false },
                        datalabels: { display: false }
                    }
                }
            });

            // Allocation Chart
            const allocationCtx = allocationContainerRef.current.getContext('2d');
            const allocationData = {
                labels: investorProjects.map(p => p.name),
                datasets: [{
                    data: investorProjects.map(p => p.investors[currentUser.id]),
                    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
                    borderColor: '#111827',
                    borderWidth: 2,
                }]
            };
            allocationChartRef.current = new window.Chart(allocationCtx, {
                type: 'doughnut',
                data: allocationData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    const value = context.parsed;
                                    const sum = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / sum) * 100).toFixed(1) + '%';
                                    return `${label}$${value.toLocaleString()} (${percentage})`;
                                }
                            }
                        },
                        datalabels: {
                             formatter: (value, ctx) => {
                                 const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                                 const percentage = ((value / sum) * 100).toFixed(1) + "%";
                                 return percentage;
                             },
                             color: '#fff',
                             font: {
                                 weight: 'bold',
                                 size: 12,
                             },
                             display: 'auto'
                        }
                    }
                }
            });
        }

        return () => {
            if (performanceChartRef.current) {
                performanceChartRef.current.destroy();
            }
            if (allocationChartRef.current) {
                allocationChartRef.current.destroy();
            }
        };
    }, [activeTab, investorProjects, totalInvested, chartJsStatus, dataLabelsPluginStatus]);


    const handleFileSelect = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleAttachClick = () => {
        fileInputRef.current.click();
    };

    const handleClaimApy = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        const totalInvestment = project.amountRaised;
        const investorShare = project.investors[currentUser.id] / totalInvestment;
        const totalApyForMonth = project.apyFundsDeposited;
        const investorApyPayout = investorShare * totalApyForMonth;

        setProjects(prev => prev.map(p => 
            p.id === projectId ? {
                ...p,
                apyClaimedBy: {...p.apyClaimedBy, [currentUser.id]: true }
            } : p
        ));
    };

    const handleWalletAction = (action, currency) => {
        setWalletModal({ isOpen: true, type: action, currency });
    };

    const closeWalletModal = () => {
        setWalletModal({ isOpen: false, type: '', currency: '' });
    };
        
    const cryptoTransactions = transactions.filter(t => t.currency === 'USDT');
    const fiatTransactions = transactions.filter(t => t.currency === 'NGN');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                const allocationData = investorProjects.map(p => ({
                    name: p.name,
                    value: p.investors[currentUser.id]
                }));
                const totalAllocation = allocationData.reduce((sum, item) => sum + item.value, 0);

                return (
                    <div>
                         <div className="mb-6">
                            <h2 className="text-4xl font-bold text-white">Investor Dashboard</h2>
                             <p className="text-lg text-gray-400">Welcome back! Today is {formatDate(new Date())}.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                            <StatCard title="Portfolio Value" value={`$${(totalInvested * 1.05).toLocaleString()}`} subtext="Estimated value inc. appreciation" />
                            <StatCard title="Total Invested" value={`$${totalInvested.toLocaleString()}`} />
                            <StatCard title="Lifetime Returns" value={`$${(totalInvested * 0.05).toLocaleString()}`} />
                            <StatCard title="Projects Invested" value={investorProjects.length} />
                        </div>
                         <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                            <div className="xl:col-span-3 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                <h3 className="font-semibold text-white mb-4 text-lg">Portfolio Performance</h3>
                                <div className="h-96">
                                    {(chartJsStatus === 'ready' && dataLabelsPluginStatus === 'ready') ? <canvas ref={chartContainerRef}></canvas> : <p>Loading Chart...</p>}
                                </div>
                            </div>
                            <div className="xl:col-span-2 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                <h3 className="font-semibold text-white mb-4 text-lg">Asset Allocation</h3>
                                <div className="h-64 relative">
                                    {(chartJsStatus === 'ready' && dataLabelsPluginStatus === 'ready') ? <canvas ref={allocationContainerRef}></canvas> : <p>Loading Chart...</p>}
                                </div>
                                <div className="mt-4 space-y-2">
                                    {allocationData.map((item, index) => (
                                        <div key={item.name} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center">
                                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index] }}></span>
                                                <span className="text-gray-300">{item.name}</span>
                                            </div>
                                            <span className="font-semibold text-white">{((item.value / totalAllocation) * 100).toFixed(1)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'portfolio':
                return (
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-6">My Portfolio</h2>
                        <div className="space-y-6">
                            {investorProjects.map(p => {
                                const userInvestment = p.investors[currentUser.id];
                                const canClaim = p.apyFundsDeposited > 0 && !p.apyClaimedBy[currentUser.id];
                                return (
                                    <div key={p.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 flex flex-col sm:flex-row items-center justify-between">
                                        <div>
                                            <h4 className="text-xl font-bold text-white">{p.name}</h4>
                                            <p className="text-gray-300 mt-1">Your Investment: <span className="font-semibold text-green-400">${userInvestment.toLocaleString()}</span></p>
                                            <p className="text-sm text-gray-400">Project APY: {p.apy}%</p>
                                        </div>
                                        <button onClick={() => handleClaimApy(p.id)} disabled={!canClaim} className="mt-4 sm:mt-0 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed">
                                            {p.apyClaimedBy[currentUser.id] ? 'Claimed' : 'Claim APY'}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                );
            case 'marketplace':
                if (!userData.kycVerified) {
                    return (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 max-w-md">
                                <ShieldExclamationIcon className="mx-auto h-16 w-16 text-yellow-400" />
                                <h3 className="mt-4 text-2xl font-bold text-white">Access Denied</h3>
                                <p className="mt-2 text-gray-400">Please complete KYC verification in the Settings tab to access the Marketplace and start investing.</p>
                                <button onClick={() => setActiveTab('settings')} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition">
                                    Go to Settings
                                </button>
                            </div>
                        </div>
                    );
                }
                return <Marketplace projects={projects} setProjects={setProjects} currentUser={currentUser} />;
            case 'wallet':
                if (!userData.kycVerified) {
                    return (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 max-w-md">
                                <ShieldExclamationIcon className="mx-auto h-16 w-16 text-yellow-400" />
                                <h3 className="mt-4 text-2xl font-bold text-white">Access Denied</h3>
                                <p className="mt-2 text-gray-400">Please complete KYC verification in the Settings tab to access your wallet.</p>
                                <button onClick={() => setActiveTab('settings')} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition">
                                    Go to Settings
                                </button>
                            </div>
                        </div>
                    );
                }
                return (
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-6">My Wallet</h2>
                        
                        <div className="mb-6 border-b border-gray-700">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button
                                    onClick={() => setWalletTab('crypto')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${walletTab === 'crypto' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                                >
                                    Crypto Wallet
                                </button>
                                <button
                                    onClick={() => setWalletTab('fiat')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${walletTab === 'fiat' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                                >
                                    Fiat Wallet (NGN)
                                </button>
                            </nav>
                        </div>

                        <div>
                            {walletTab === 'crypto' && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-1 space-y-4">
                                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                            <h4 className="text-gray-400 text-sm font-medium">USDT Balance</h4>
                                            <p className="text-4xl font-bold text-white mt-1">{mockUsdtBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xl text-gray-400">USDT</span></p>
                                        </div>
                                        <button onClick={() => handleWalletAction('deposit', 'crypto')} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition">Deposit Crypto</button>
                                        <button onClick={() => handleWalletAction('withdraw', 'crypto')} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition">Withdraw Crypto</button>
                                    </div>
                                    <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                        <h3 className="font-semibold text-white mb-4 text-lg">Crypto Transaction History</h3>
                                        <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="border-b border-gray-700"><tr>
                                                <th className="py-3 px-2 text-base font-semibold text-gray-400">Type</th>
                                                <th className="py-3 px-2 text-base font-semibold text-gray-400">Amount</th>
                                                <th className="py-3 px-2 text-base font-semibold text-gray-400">Date</th>
                                                <th className="py-3 px-2 text-base font-semibold text-gray-400">Status</th>
                                            </tr></thead>
                                            <tbody className="divide-y divide-gray-700/50">
                                                {cryptoTransactions.map(t => (
                                                    <tr key={t.id}>
                                                        <td className="py-4 px-2 text-lg text-white">{t.type} {t.project && `(${t.project})`}</td>
                                                        <td className={`py-4 px-2 font-semibold text-lg ${t.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>{t.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                        <td className="py-4 px-2 text-lg text-gray-400">{formatDate(t.date)}</td>
                                                        <td className="py-4 px-2"><span className={`px-2 py-1 text-sm font-semibold rounded-full ${t.status === 'Completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{t.status}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {walletTab === 'fiat' && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-1 space-y-4">
                                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                            <h4 className="text-gray-400 text-sm font-medium">NGN Balance</h4>
                                            <p className="text-4xl font-bold text-white mt-1">₦{mockNgnBalance.toLocaleString()}</p>
                                        </div>
                                        <button onClick={() => handleWalletAction('deposit', 'fiat')} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition">Deposit Fiat</button>
                                        <button onClick={() => handleWalletAction('withdraw', 'fiat')} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition">Withdraw Fiat</button>
                                    </div>
                                    <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                                        <h3 className="font-semibold text-white mb-4 text-lg">Fiat Transaction History</h3>
                                        <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="border-b border-gray-700"><tr>
                                                <th className="py-3 px-2 text-base font-semibold text-gray-400">Type</th>
                                                <th className="py-3 px-2 text-base font-semibold text-gray-400">Amount</th>
                                                <th className="py-3 px-2 text-base font-semibold text-gray-400">Date</th>
                                                <th className="py-3 px-2 text-base font-semibold text-gray-400">Status</th>
                                            </tr></thead>
                                            <tbody className="divide-y divide-gray-700/50">
                                                {fiatTransactions.map(t => (
                                                    <tr key={t.id}>
                                                        <td className="py-4 px-2 text-lg text-white">{t.type}</td>
                                                        <td className={`py-4 px-2 font-semibold text-lg ${t.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>{`₦${t.amount.toLocaleString()}`}</td>
                                                        <td className="py-4 px-2 text-lg text-gray-400">{formatDate(t.date)}</td>
                                                        <td className="py-4 px-2"><span className={`px-2 py-1 text-sm font-semibold rounded-full ${t.status === 'Completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{t.status}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-6">Settings</h2>
                        <div className="space-y-6 max-w-2xl">
                            <KycPanel user={userData} setUser={(updatedUser) => { setUserData(updatedUser); onUserUpdate(updatedUser); }} />
                            <TwoFactorAuthPanel user={userData} setUser={(updatedUser) => { setUserData(updatedUser); onUserUpdate(updatedUser); }} />
                        </div>
                    </div>
                );
            case 'help':
                return (
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-6">Help & Support</h2>
                        <div className="mb-6 border-b border-gray-700">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button onClick={() => setHelpSubTab('faq')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${helpSubTab === 'faq' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                                    FAQ
                                </button>
                                <button onClick={() => setHelpSubTab('chat')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${helpSubTab === 'chat' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                                    Live Chat
                                </button>
                            </nav>
                        </div>
                        {helpSubTab === 'faq' && (
                            <div className="max-w-4xl space-y-4">
                                {investorFaqs.map((faq, index) => <FAQItem key={index} question={faq.q} answer={faq.a} />)}
                            </div>
                        )}
                        {helpSubTab === 'chat' && (
                             <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-xl shadow-lg border border-gray-700/50">
                                <div className="p-4 border-b border-gray-700">
                                    <h3 className="text-xl font-bold text-white">Support Chat</h3>
                                    <p className="text-sm text-gray-400 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Support is online</p>
                                </div>
                                <div className="p-6 h-96 overflow-y-auto space-y-4">
                                    {/* Chat messages */}
                                    <div className="flex justify-start">
                                        <div className="bg-gray-700 text-white p-3 rounded-lg max-w-xs">
                                            <p>Hello! How can we help you today?</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-900/50 border-t border-gray-700">
                                     {selectedFile && (
                                        <div className="text-sm text-gray-400 mb-2 px-4 flex justify-between items-center">
                                            <span>Attached: {selectedFile.name}</span>
                                            <button onClick={() => setSelectedFile(null)} className="text-red-400 hover:text-red-300">&times;</button>
                                        </div>
                                    )}
                                    <form className="flex items-center space-x-4">
                                        <input type="text" placeholder="Type your message..." className="flex-1 bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                                        <button type="button" onClick={handleAttachClick} className="text-gray-400 hover:text-white">
                                            <PaperclipIcon />
                                        </button>
                                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700">Send</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="flex h-full">
            {walletModal.isOpen && <WalletActionModal walletModal={walletModal} closeWalletModal={closeWalletModal} setMockNgnBalance={setMockNgnBalance} setMockUsdtBalance={setMockUsdtBalance} setTransactions={setTransactions}/>}
            <aside className="w-64 pr-8 border-r border-gray-700 flex-shrink-0">
                <div className="py-8 lg:py-12">
                    <nav className="space-y-2">
                        <NavItem icon={<DashboardIcon />} label="Dashboard" tabName="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <NavItem icon={<PortfolioIcon />} label="Portfolio" tabName="portfolio" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <NavItem icon={<MarketplaceIcon />} label="Marketplace" tabName="marketplace" activeTab={activeTab} setActiveTab={setActiveTab} disabled={!userData.kycVerified} />
                        <NavItem icon={<WalletIcon />} label="Wallet" tabName="wallet" activeTab={activeTab} setActiveTab={setActiveTab} disabled={!userData.kycVerified} />
                        <NavItem icon={<SettingsIcon />} label="Settings" tabName="settings" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <NavItem icon={<HelpIcon />} label="Help & Support" tabName="help" activeTab={activeTab} setActiveTab={setActiveTab} />
                    </nav>
                </div>
            </aside>
            <main className="flex-grow pl-8 overflow-y-auto">
                <div className="py-8 lg:py-12">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

const LoginOrRegister = ({ onLogin }) => {
    const [view, setView] = useState('login');

    return (
        <div className="max-w-md mx-auto mt-20 bg-gray-800/50 p-8 rounded-xl shadow-2xl border border-gray-700/50">
             <div className="flex border-b border-gray-600 mb-6">
                <button onClick={() => setView('login')} className={`flex-1 py-2 font-semibold text-center transition ${view === 'login' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>Log In</button>
                <button onClick={() => setView('register')} className={`flex-1 py-2 font-semibold text-center transition ${view === 'register' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>Register</button>
            </div>

            {view === 'login' && (
                <div className="space-y-4">
                     <input type="email" placeholder="Email" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                     <input type="password" placeholder="Password" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                     <button onClick={() => onLogin(users.investor1)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition">Log In</button>
                     <p className="text-center text-sm text-gray-400">For demo, login as <span onClick={() => onLogin(users.investor1)} className="text-blue-400 cursor-pointer">investor</span> or <span onClick={() => onLogin(users.dev1)} className="text-blue-400 cursor-pointer">developer</span> or <span onClick={() => onLogin(users.admin)} className="text-blue-400 cursor-pointer">admin</span>.</p>
                </div>
            )}

            {view === 'register' && (
                 <div className="space-y-4">
                    <p className="text-center text-gray-300">Join QuantuHome to start building your digital real estate portfolio.</p>
                    <button onClick={() => onLogin(users.investor2)} className="w-full text-left p-4 rounded-lg bg-gray-700 hover:bg-blue-600 transition flex items-center space-x-4">
                        <PortfolioIcon />
                        <div><p className="font-bold text-lg">Register as an Investor</p><p className="text-sm text-gray-400">Start investing in properties.</p></div>
                    </button>
                    <button onClick={() => onLogin(users.dev2)} className="w-full text-left p-4 rounded-lg bg-gray-700 hover:bg-blue-600 transition flex items-center space-x-4">
                       <ProjectIcon />
                       <div><p className="font-bold text-lg">Register as a Developer</p><p className="text-sm text-gray-400">Get your projects funded.</p></div>
                    </button>
                 </div>
            )}
        </div>
    );
}

const DashboardContainer = ({ onLogout }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [projects, setProjects] = useState(initialProjects);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications);
    const notificationRef = useRef(null);

    const userNotifications = notifications.filter(n => n.userId === currentUser?.id || n.userId === 'admin' || n.userId === 'all'); 
    const hasUnread = userNotifications.some(n => !n.read);

    const handleMarkAllAsRead = () => {
        setNotifications(prev =>
            prev.map(n =>
                n.userId === currentUser?.id ? { ...n, read: true } : n
            )
        );
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notificationRef]);

    
    useEffect(() => {
        if (currentUser && currentUser.role === 'Developer' && !currentUser.onboarded) {
            setShowOnboarding(true);
        } else {
            setShowOnboarding(false);
        }
    }, [currentUser]);

    const handleLogin = (user) => {
        setCurrentUser(user);
    };

    const handleInternalLogout = () => {
        setCurrentUser(null);
    };
    
    const updateUserInState = (updatedUser) => {
        // This persists KYC/onboarding changes from the modals
        const userKey = Object.keys(users).find(key => users[key].id === updatedUser.id);
        if(userKey) {
            users[userKey] = updatedUser;
        }
        setCurrentUser(updatedUser);
    };

    const renderDashboard = () => {
        if (!currentUser) return null;
        if (showOnboarding) {
            return <DeveloperOnboarding user={currentUser} setUser={updateUserInState}/>
        }

        switch (currentUser.role) {
            case 'Admin': return <AdminDashboard projects={projects} setProjects={setProjects} />;
            case 'Developer': return <DeveloperDashboard projects={projects} setProjects={setProjects} currentUser={currentUser} onUserUpdate={updateUserInState} />;
            case 'Investor': return <InvestorDashboard projects={projects} setProjects={setProjects} currentUser={currentUser} onUserUpdate={updateUserInState} />;
            default: return null;
        }
    };
    
     return (
        <div className="bg-gray-900 text-white h-screen font-sans flex flex-col">
            <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 p-4 lg:px-8 flex justify-between items-center z-10 flex-shrink-0">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={onLogout}>
                    <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    <h1 className="text-2xl font-bold">QuantuHome</h1>
                </div>
                {currentUser && (
                     <div className="flex items-center space-x-6">
                        <div className="relative" ref={notificationRef}>
                             <button onClick={() => setNotificationOpen(prev => !prev)} className="relative text-gray-400 hover:text-white">
                                 <BellSVG />
                                 {hasUnread && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-gray-900"></span>}
                             </button>
                             {isNotificationOpen && <NotificationPanel userNotifications={userNotifications} onMarkAsRead={handleMarkAllAsRead} />}
                         </div>
                        <span className="text-gray-300 hidden sm:inline">Welcome, <span className="font-semibold text-white">{currentUser.name}</span> ({currentUser.role})</span>
                        <button onClick={handleInternalLogout} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition">Sign Out</button>
                    </div>
                )}
            </header>
            
            <main className="flex-grow overflow-hidden">
                {!currentUser ? (
                    <div className="h-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                        <LoginOrRegister onLogin={handleLogin} />
                    </div>
                ) : (
                    <div className="max-w-screen-2xl mx-auto h-full px-4 sm:px-6 lg:px-8">
                        {renderDashboard()}
                    </div>
                )}
            </main>
        </div>
    );
}


// --- MAIN APP COMPONENT ---

export default function App() {
    const [appState, setAppState] = useState('landing'); // 'landing' or 'dashboard'

    switch (appState) {
        case 'landing':
            return <LandingPage onEnterApp={() => setAppState('dashboard')} />;
        case 'dashboard':
            return <DashboardContainer onLogout={() => setAppState('landing')} />;
        default:
            return null;
    }
}







