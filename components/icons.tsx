import React from 'react';

export const FierroLogo = () => (
    <svg width="80" height="24" viewBox="0 0 97 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.8239 27.054H33.3439V0.753998H25.8239V27.054Z" fill="#E5E7EB"/>
        <path d="M0.583984 0.753998H11.564V8.774H8.08398V5.294H4.30398V23.334H8.08398V19.854H11.564V27.054H0.583984V0.753998Z" fill="#E5E7EB"/>
        <path d="M0.583984 0.753998H22.064V5.294H4.30398V11.534H18.344V16.094H4.30398V23.334H22.064V27.054H0.583984V0.753998Z" fill="#E5E7EB"/>
        <path d="M36.704 27.054H58.184V23.334H40.424V16.094H54.464V11.534H40.424V5.294H58.184V0.753998H36.704V27.054Z" fill="#E5E7EB"/>
        <path d="M61.424 0.753998H68.944L76.844 13.914L84.744 0.753998H92.264V27.054H87.724V7.23399L80.684 18.974H72.824L65.984 7.23399V27.054H61.424V0.753998Z" fill="#E5E7EB"/>
        <path d="M96.104 27.054H92.384V5.294H88.604V0.753998H96.104V27.054Z" fill="#E5E7EB"/>
    </svg>
);

export const SparklesIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M19 3v4M17 5h4M14 11v4M12 13h4M5 17v4M3 19h4" />
    </svg>
);

export const ListIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

export const CalendarIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const UserCircleIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
);

// --- Instagram Mockup Icons ---

export const HeartIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

export const MessageCircleIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

export const SendIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

export const BookmarkIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

export const MoreHorizontalIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
    </svg>
);
