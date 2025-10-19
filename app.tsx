import React, { useState, useMemo, useEffect } from 'react';
import { POSTS, CLIENTS, STATUS_MAP, CURRENT_USER } from './constants';
import { ContentPost, Client, PostStatus, Comment } from './types';
import { generateIdeaAndPrompt, generateImage, generateCopyFromIdea } from './services/geminiService';
import {
    FierroLogo, SparklesIcon, ListIcon, CalendarIcon, HeartIcon, MessageCircleIcon,
    SendIcon, BookmarkIcon, MoreHorizontalIcon, UserCircleIcon
} from './components/icons';

type View = 'list' | 'calendar';
type RightPanelView = 'media' | 'mockup' | 'comments';
type LoadingState = {
    idea?: boolean;
    copyIn?: boolean;
    copyOut?: boolean;
    image?: boolean;
};

const rightPanelViewMap: Record<RightPanelView, string> = {
    media: 'Multimedia',
    mockup: 'Previsualización',
    comments: 'Comentarios',
};

// --- Calendar Helper ---
const CalendarView = ({ posts, onPostSelect }: { posts: ContentPost[], onPostSelect: (postId: string) => void }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const startingDay = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const calendarDays = [];
    for (let i = 0; i < startingDay; i++) {
        calendarDays.push(<div key={`empty-start-${i}`} className="border-r border-b border-gray-800"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateString = date.toISOString().split('T')[0];
        const postsForDay = posts.filter(p => p.date === dateString);

        calendarDays.push(
            <div key={day} className="border-r border-b border-gray-800 p-2 min-h-[120px]">
                <span className="font-semibold">{day}</span>
                <div className="mt-1 space-y-1">
                    {postsForDay.map(post => (
                        <div
                            key={post.id}
                            onClick={() => onPostSelect(post.id)}
                            className="text-xs p-1 rounded-md cursor-pointer hover:opacity-80"
                            style={{ backgroundColor: STATUS_MAP[post.status].dotColor.replace('bg-', '#') }}
                        >
                            <p className="font-bold text-white truncate">{CLIENTS.find(c => c.id === post.clientId)?.name}</p>
                            <p className="text-white truncate">{post.topic}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    const remainingCells = 7 - (calendarDays.length % 7);
    if (remainingCells < 7) {
        for (let i = 0; i < remainingCells; i++) {
            calendarDays.push(<div key={`empty-end-${i}`} className="border-r border-b border-gray-800"></div>);
        }
    }


    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    return (
        <div className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-gray-700">&lt;</button>
                <h2 className="font-bold text-lg">{currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-gray-700">&gt;</button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs text-gray-400 border-t border-l border-gray-800">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => <div key={day} className="py-2 border-r border-b border-gray-800">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 flex-grow border-l border-gray-800">
                {calendarDays}
            </div>
        </div>
    );
};


// --- Helper Components ---

const InstagramMockup = ({ post, client }: { post: ContentPost, client?: Client }) => (
    <div className="bg-white rounded-lg border border-gray-300 w-full max-w-sm mx-auto my-4 text-black">
        <div className="flex items-center p-3">
            {client?.avatarUrl ? <img src={client.avatarUrl} alt={client.name} className="w-8 h-8 rounded-full" /> : <UserCircleIcon className="w-8 h-8 text-gray-400" />}
            <span className="font-semibold text-sm ml-3">{client?.name || 'User Name'}</span>
            <MoreHorizontalIcon className="w-5 h-5 ml-auto text-gray-600" />
        </div>
        <div className="bg-gray-200 aspect-square flex items-center justify-center">
            {post.mediaUrl ? (
                post.mediaType === 'image' ? (
                    <img src={post.mediaUrl} alt={post.topic} className="w-full h-full object-cover" />
                ) : (
                    <video src={post.mediaUrl} controls className="w-full h-full object-cover" />
                )
            ) : <span className="text-gray-500">No media</span>}
        </div>
        <div className="p-3">
            <div className="flex items-center space-x-4">
                <HeartIcon className="w-7 h-7" />
                <MessageCircleIcon className="w-7 h-7" />
                <SendIcon className="w-7 h-7" />
                <BookmarkIcon className="w-7 h-7 ml-auto" />
            </div>
            <p className="text-sm font-semibold mt-3">9,311 likes</p>
            <p className="text-sm mt-1">
                <span className="font-semibold">{client?.name || 'User Name'}</span>
                <span className="whitespace-pre-wrap"> {post.copyOut}</span>
            </p>
            <p className="text-gray-400 text-xs mt-2 uppercase">5 days ago</p>
        </div>
    </div>
);

// --- Main App Component ---

const App = () => {
    const [posts, setPosts] = useState<ContentPost[]>(() => {
        try {
            const savedPosts = window.localStorage.getItem('fierro-os-posts');
            return savedPosts ? JSON.parse(savedPosts) : POSTS;
        } catch (error) {
            console.error("Could not parse posts from localStorage", error);
            return POSTS;
        }
    });

    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [view, setView] = useState<View>('list');
    const [rightPanelView, setRightPanelView] = useState<RightPanelView>('media');
    const [loading, setLoading] = useState<LoadingState>({});
    const [selectedClientId, setSelectedClientId] = useState<string>('all');

    useEffect(() => {
        window.localStorage.setItem('fierro-os-posts', JSON.stringify(posts));
    }, [posts]);

    const filteredPosts = useMemo(() => {
        if (selectedClientId === 'all') {
            return posts;
        }
        return posts.filter(p => p.clientId === selectedClientId);
    }, [posts, selectedClientId]);

    useEffect(() => {
        // If the current selection is no longer in the filtered list, clear it.
        if (selectedPostId && !filteredPosts.find(p => p.id === selectedPostId)) {
            setSelectedPostId(null);
        }
        // If there's no selection, select the first of the filtered list.
        if (!selectedPostId && filteredPosts.length > 0) {
            setSelectedPostId(filteredPosts[0].id);
        }
    }, [filteredPosts, selectedPostId]);


    const selectedPost = useMemo(() => posts.find(p => p.id === selectedPostId), [posts, selectedPostId]);
    const selectedClient = useMemo(() => CLIENTS.find(c => c.id === selectedPost?.clientId), [selectedPost]);

    const updatePost = (postId: string, data: Partial<ContentPost>) => {
        setPosts(prev => prev.map(p => (p.id === postId ? { ...p, ...data } : p)));
    };

    const handleCreatePost = () => {
        const newPost: ContentPost = {
            id: `post-${Date.now()}`,
            clientId: selectedClientId !== 'all' ? selectedClientId : CLIENTS[0].id,
            platform: 'Instagram',
            format: 'Static',
            topic: 'Nuevo Tema',
            objective: 'Awareness',
            date: new Date().toISOString().split('T')[0],
            brief: '',
            idea: '',
            imagePrompt: '',
            copyIn: '',
            copyOut: '',
            mediaUrl: '',
            mediaType: 'image',
            status: PostStatus.Pendiente,
            comments: [],
        };
        setPosts(prev => [newPost, ...prev]);
        setSelectedPostId(newPost.id);
    };

    const handleDeletePost = () => {
        if (!selectedPostId) return;
        setPosts(prev => {
            const remainingPosts = prev.filter(p => p.id !== selectedPostId);
            const filteredRemaining = remainingPosts.filter(p => selectedClientId === 'all' || p.clientId === selectedClientId);
            setSelectedPostId(filteredRemaining.length > 0 ? filteredRemaining[0].id : null);
            return remainingPosts;
        });
    };


    const handleGenerateIdea = async () => {
        if (!selectedPost) return;
        setLoading(prev => ({ ...prev, idea: true }));
        const result = await generateIdeaAndPrompt(selectedPost.brief);
        updatePost(selectedPost.id, { idea: result.idea, imagePrompt: result.prompt });
        setLoading(prev => ({ ...prev, idea: false }));
    };
    
    const handleGenerateCopy = async (field: 'copyIn' | 'copyOut', tone: 'Más Amigable' | 'Más Técnico') => {
        if (!selectedPost) return;
        setLoading(prev => ({ ...prev, [field]: true }));
        const copy = await generateCopyFromIdea(selectedPost.idea, tone);
        updatePost(selectedPost.id, { [field]: copy });
        setLoading(prev => ({ ...prev, [field]: false }));
    };

    const handleGenerateImage = async () => {
        if (!selectedPost || !selectedPost.imagePrompt) return;
        setLoading(prev => ({ ...prev, image: true }));
        const imageUrl = await generateImage(selectedPost.imagePrompt);
        if (imageUrl) {
            updatePost(selectedPost.id, { mediaUrl: imageUrl, mediaType: 'image' });
        }
        setLoading(prev => ({ ...prev, image: false }));
    };
    
    const handleSelectPostFromCalendar = (postId: string) => {
        setSelectedPostId(postId);
        setView('list'); // Switch to list view to see the selection highlight
    };

    return (
        <div className="h-screen w-screen bg-gray-900 text-gray-300 flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <header className="flex-shrink-0 bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
                <h1 className="text-lg font-bold text-white">FIERRO OS Boost</h1>
                <FierroLogo />
            </header>

            <div className="flex flex-grow min-h-0">
                {/* Left Panel: List/Calendar */}
                <aside className="w-1/4 flex-shrink-0 border-r border-gray-700 flex flex-col">
                     <div className="p-4 border-b border-gray-700 space-y-4">
                        <button onClick={handleCreatePost} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Crear Nuevo Post</button>
                        
                        <div className="space-y-1">
                            <label htmlFor="client-filter" className="text-xs font-semibold text-gray-400">CLIENTE</label>
                            <select
                                id="client-filter"
                                value={selectedClientId}
                                onChange={e => setSelectedClientId(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Todos los clientes</option>
                                {CLIENTS.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center bg-gray-800 rounded-md">
                            <button onClick={() => setView('list')} className={`w-1/2 py-2 text-sm rounded-md flex items-center justify-center gap-2 ${view === 'list' ? 'bg-gray-600' : ''}`}><ListIcon className="w-4 h-4" /> Lista</button>
                            <button onClick={() => setView('calendar')} className={`w-1/2 py-2 text-sm rounded-md flex items-center justify-center gap-2 ${view === 'calendar' ? 'bg-gray-600' : ''}`}><CalendarIcon className="w-4 h-4" /> Calendario</button>
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-grow">
                        {view === 'list' && filteredPosts.map(post => (
                            <div key={post.id} onClick={() => setSelectedPostId(post.id)} className={`p-4 border-b border-gray-800 cursor-pointer ${selectedPostId === post.id ? 'bg-gray-700' : 'hover:bg-gray-800'}`}>
                                <p className="font-bold">{CLIENTS.find(c=>c.id === post.clientId)?.name} - {post.topic}</p>
                                <p className="text-sm text-gray-400">{post.date}</p>
                                <div className={`mt-2 flex items-center text-xs font-semibold ${STATUS_MAP[post.status].color}`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${STATUS_MAP[post.status].dotColor}`}></span>
                                    {STATUS_MAP[post.status].text}
                                </div>
                            </div>
                        ))}
                        {view === 'calendar' && <CalendarView posts={filteredPosts} onPostSelect={handleSelectPostFromCalendar} />}
                    </div>
                </aside>

                {/* Center Panel: Editor */}
                <main className="w-1/2 flex-grow p-6 overflow-y-auto">
                    {selectedPost ? (
                        <div className="space-y-5">
                            {/* Header Row */}
                            <div className="grid grid-cols-5 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-400">PLATAFORMA</label>
                                    <select value={selectedPost.format} onChange={e => updatePost(selectedPost.id, { format: e.target.value as 'Reel' | 'Static' })} className="bg-gray-800 border border-gray-700 rounded-md text-sm w-full p-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="Static">Instagram Static</option>
                                        <option value="Reel">Instagram Reel</option>
                                    </select>
                                </div>
                                <div className="space-y-1"><label className="text-xs font-semibold text-gray-400">TÓPICO</label><input type="text" value={selectedPost.topic} onChange={e => updatePost(selectedPost.id, { topic: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-md text-sm w-full p-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/></div>
                                <div className="space-y-1"><label className="text-xs font-semibold text-gray-400">OBJETIVO</label><input type="text" value={selectedPost.objective} onChange={e => updatePost(selectedPost.id, { objective: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-md text-sm w-full p-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/></div>
                                <div className="space-y-1"><label className="text-xs font-semibold text-gray-400">FECHA</label><input type="date" value={selectedPost.date} onChange={e => updatePost(selectedPost.id, { date: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-md text-sm w-full p-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/></div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-400">STATUS</label>
                                    <select value={selectedPost.status} onChange={e => updatePost(selectedPost.id, { status: e.target.value as PostStatus })} className="bg-gray-800 border border-gray-700 rounded-md text-sm w-full p-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                                        {Object.values(PostStatus).map(s => <option key={s} value={s}>{STATUS_MAP[s].text}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Text Fields */}
                            {[
                                { key: 'brief' as const, label: 'BRIEF', rows: 2 },
                                { key: 'idea' as const, label: 'IDEA', rows: 3 },
                                { key: 'imagePrompt' as const, label: 'PROMPT PARA IMAGEN', rows: 4 },
                                { key: 'copyIn' as const, label: 'COPY IN', rows: 2 },
                                { key: 'copyOut' as const, label: 'COPY OUT', rows: 8 },
                            ].map(({ key, label, rows }) => (
                                <div key={key}>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs font-semibold text-gray-400">{label}</label>
                                        {key === 'idea' && <button onClick={handleGenerateIdea} disabled={loading.idea} className="flex items-center gap-1 text-xs hover:text-white disabled:opacity-50"><SparklesIcon className="w-3 h-3"/> Generar Idea y Prompt</button>}
                                        {(key === 'copyIn' || key === 'copyOut') && (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleGenerateCopy(key, 'Más Amigable')} disabled={loading[key]} className="flex items-center gap-1 text-xs hover:text-white disabled:opacity-50"><SparklesIcon className="w-3 h-3"/> Amigable</button>
                                                <button onClick={() => handleGenerateCopy(key, 'Más Técnico')} disabled={loading[key]} className="flex items-center gap-1 text-xs hover:text-white disabled:opacity-50"><SparklesIcon className="w-3 h-3"/> Técnico</button>
                                            </div>
                                        )}
                                    </div>
                                    <textarea
                                        value={selectedPost[key]}
                                        onChange={e => updatePost(selectedPost!.id, { [key]: e.target.value })}
                                        rows={rows}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            ))}
                             <button onClick={handleDeletePost} className="text-red-400 hover:text-red-300 text-sm">Eliminar Post</button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>Selecciona un post o crea uno nuevo para empezar.</p>
                        </div>
                    )}
                </main>

                {/* Right Panel: Media/Mockup/Comments */}
                <aside className="w-1/3 flex-shrink-0 border-l border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center bg-gray-800 rounded-md p-1">
                            {(['media', 'mockup', 'comments'] as RightPanelView[]).map(view => (
                                <button key={view} onClick={() => setRightPanelView(view)} className={`w-1/3 py-1 text-sm rounded ${rightPanelView === view ? 'bg-gray-600' : ''}`}>
                                    {rightPanelViewMap[view]}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4">
                        {selectedPost && rightPanelView === 'media' && (
                             <div>
                                <div className="bg-gray-800 aspect-square rounded-md flex items-center justify-center">
                                    {loading.image ? <p>Generando imagen...</p> : (
                                        selectedPost.mediaUrl ? (
                                        selectedPost.mediaType === 'image'
                                            ? <img src={selectedPost.mediaUrl} alt={selectedPost.topic} className="object-cover w-full h-full rounded-md" />
                                            : <video src={selectedPost.mediaUrl} controls className="object-cover w-full h-full rounded-md" />
                                        ) : <p>Sin media</p>
                                    )}
                                </div>
                                <button onClick={handleGenerateImage} disabled={loading.image || !selectedPost.imagePrompt} className="w-full bg-blue-600 text-white py-2 mt-4 rounded-md hover:bg-blue-700 disabled:bg-gray-500">
                                    {loading.image ? 'Generando...' : 'Generar Imagen'}
                                </button>
                            </div>
                        )}
                        {selectedPost && rightPanelView === 'mockup' && (
                           <InstagramMockup post={selectedPost} client={selectedClient} />
                        )}
                        {selectedPost && rightPanelView === 'comments' && <div className="text-center text-gray-500">Comentarios (En desarrollo)</div>}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default App;
