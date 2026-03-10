/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home as HomeIcon, 
  Mic, 
  FileText, 
  FolderOpen, 
  Shield, 
  Globe, 
  Phone, 
  ChevronRight, 
  Play, 
  Square, 
  Trash2, 
  Download, 
  Share2, 
  Plus, 
  Search,
  Upload,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Orb from './components/Orb';
import { TRANSLATIONS, type Language, type Case, type EvidenceFile } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const INITIAL_CASES: Case[] = [
  {
    id: 'NYV-20240310-001',
    type: 'Physical Assault',
    date: '10 Mar 2024',
    evidenceCount: 3,
    status: 'Downloaded',
    description: 'Assaulted by local landlord while working in fields.',
    evidenceFiles: [],
    incidentType: 'Physical assault',
    filedAgainst: 'Individual',
    submitTo: 'Local Police Station'
  },
  {
    id: 'NYV-20240308-002',
    type: 'Discrimination',
    date: '08 Mar 2024',
    evidenceCount: 1,
    status: 'Generated',
    description: 'Denied entry to community well.',
    evidenceFiles: [],
    incidentType: 'Discrimination',
    filedAgainst: 'Individual',
    submitTo: 'District Magistrate'
  },
  {
    id: 'NYV-20240301-003',
    type: 'Verbal Abuse',
    date: '01 Mar 2024',
    evidenceCount: 2,
    status: 'Draft',
    description: 'Casteist slurs used by government official.',
    evidenceFiles: [],
    incidentType: 'Verbal abuse',
    filedAgainst: 'Govt official',
    submitTo: 'State SC/ST Commission'
  }
];

export default function App() {
  const [lang, setLang] = useState<Language>('EN');
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showHelplines, setShowHelplines] = useState(false);
  const [cases, setCases] = useState<Case[]>(INITIAL_CASES);
  
  // Current Case State
  const [currentCase, setCurrentCase] = useState<Partial<Case>>({
    id: `NYV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    date: new Date().toLocaleDateString(),
    evidenceFiles: [],
    status: 'Draft' as Case['status']
  });

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    const hasVisited = localStorage.getItem('nyaya_visited');
    if (!hasVisited) {
      setShowWalkthrough(true);
      localStorage.setItem('nyaya_visited', 'true');
    }
    return () => clearTimeout(timer);
  }, []);

  const handleStartNewCase = () => {
    setCurrentCase({
      id: `NYV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      date: new Date().toLocaleDateString(),
      evidenceFiles: [],
      status: 'Draft' as Case['status']
    });
    setActiveTab('record');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-navy flex flex-col items-center justify-center z-50">
        <div className="w-64 h-64 relative">
          <Orb hue={220} forceHoverState={true} backgroundColor="#0A0F1E" />
        </div>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-gold text-xl font-serif tracking-wide"
        >
          {t.loadingText}
        </motion.p>
        <div className="w-48 h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-full bg-gold"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-navy text-white font-sans overflow-x-hidden">
      {/* --- Sidebar (Desktop) --- */}
      <aside className="hidden md:flex flex-col w-64 bg-black/20 border-r border-white/5 sticky top-0 h-screen z-40">
        <div className="p-6 flex items-center gap-3">
          <Shield className="text-gold w-8 h-8" />
          <h1 className="text-2xl font-serif text-gold">NyayaVoice</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavButton icon={<HomeIcon size={20} />} label={t.home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavButton icon={<Mic size={20} />} label={t.record} active={activeTab === 'record'} onClick={() => setActiveTab('record')} />
          <NavButton icon={<FolderOpen size={20} />} label={t.evidence} active={activeTab === 'evidence'} onClick={() => setActiveTab('evidence')} />
          <NavButton icon={<FileText size={20} />} label={t.complaint} active={activeTab === 'complaint'} onClick={() => setActiveTab('complaint')} />
          <NavButton icon={<FolderOpen size={20} />} label={t.myCases} active={activeTab === 'myCases'} onClick={() => setActiveTab('myCases')} />
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="bg-gold/10 p-3 rounded-lg border border-gold/20">
            <p className="text-[10px] uppercase tracking-widest text-gold font-bold mb-1">{t.scstHelpline}</p>
            <p className="text-sm font-bold">14566</p>
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col relative pb-20 md:pb-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 bg-navy/80 backdrop-blur-md z-30">
          <div className="md:hidden flex items-center gap-2">
            <Shield className="text-gold w-6 h-6" />
            <span className="font-serif text-lg text-gold">NyayaVoice</span>
          </div>
          <div className="hidden md:block"></div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm"
            >
              <Globe size={16} className="text-gold" />
              <span>{lang === 'EN' ? 'English' : 'हिंदी'}</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-bold">
              <span className="animate-pulse">●</span>
              {t.scstHelpline}
            </div>
          </div>
        </header>

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && <HomeScreen key="home" t={t} onStart={handleStartNewCase} cases={cases} setActiveTab={setActiveTab} />}
            {activeTab === 'record' && <RecordScreen key="record" t={t} currentCase={currentCase} setCurrentCase={setCurrentCase} onNext={() => setActiveTab('evidence')} />}
            {activeTab === 'evidence' && <EvidenceScreen key="evidence" t={t} currentCase={currentCase} setCurrentCase={setCurrentCase} onNext={() => setActiveTab('complaint')} />}
            {activeTab === 'complaint' && <ComplaintScreen key="complaint" t={t} currentCase={currentCase} setCurrentCase={setCurrentCase} onSave={(c) => { setCases([c as Case, ...cases]); setActiveTab('myCases'); }} />}
            {activeTab === 'myCases' && <MyCasesScreen key="myCases" t={t} cases={cases} onNew={handleStartNewCase} />}
          </AnimatePresence>
        </div>

        {/* Emergency FAB */}
        <button 
          onClick={() => setShowHelplines(true)}
          className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center red-glow hover:scale-110 transition-transform z-40"
        >
          <Phone className="text-white" />
        </button>
      </main>

      {/* --- Bottom Nav (Mobile) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 z-40">
        <MobileNavButton icon={<HomeIcon size={20} />} label={t.home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <MobileNavButton icon={<Mic size={20} />} label={t.record} active={activeTab === 'record'} onClick={() => setActiveTab('record')} />
        <MobileNavButton icon={<FolderOpen size={20} />} label={t.evidence} active={activeTab === 'evidence'} onClick={() => setActiveTab('evidence')} />
        <MobileNavButton icon={<FileText size={20} />} label={t.complaint} active={activeTab === 'complaint'} onClick={() => setActiveTab('complaint')} />
        <MobileNavButton icon={<FolderOpen size={20} />} label={t.myCases} active={activeTab === 'myCases'} onClick={() => setActiveTab('myCases')} />
      </nav>

      {/* --- Modals & Overlays --- */}
      <AnimatePresence>
        {showHelplines && (
          <Modal onClose={() => setShowHelplines(false)}>
            <div className="p-6">
              <h2 className="text-2xl font-serif text-gold mb-6 flex items-center gap-3">
                <Phone className="text-red-500" />
                {t.emergencyHelplines}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <HelplineCard label="SC/ST Atrocities" number="14566" />
                <HelplineCard label="NHRC (Human Rights)" number="14433" />
                <HelplineCard label="Legal Aid Helpline" number="15100" />
                <HelplineCard label="Women's Helpline" number="1091" />
              </div>
            </div>
          </Modal>
        )}

        {showWalkthrough && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-navy border border-gold/30 rounded-2xl max-w-md w-full p-8 text-center"
            >
              <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-gold w-10 h-10" />
              </div>
              <h2 className="text-3xl font-serif text-gold mb-4">Welcome to NyayaVoice</h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                We help you document incidents of caste-based violence securely and generate legal complaints in minutes.
              </p>
              <div className="space-y-4 mb-8 text-left">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold shrink-0">1</div>
                  <p className="text-sm">Record your testimony immediately after the incident.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold shrink-0">2</div>
                  <p className="text-sm">Upload photos, videos, or documents as evidence.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold shrink-0">3</div>
                  <p className="text-sm">Generate a formal legal complaint under the SC/ST Act.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowWalkthrough(false)}
                className="w-full py-4 bg-gold text-navy font-bold rounded-xl hover:bg-amber transition-colors"
              >
                Get Started
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-Components ---

function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
        active ? "bg-gold text-navy font-bold" : "text-white/60 hover:bg-white/5 hover:text-white"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MobileNavButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 px-2 py-1 transition-all duration-200",
        active ? "text-gold" : "text-white/40"
      )}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-navy border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white">
          <X size={24} />
        </button>
        {children}
      </motion.div>
    </div>
  );
}

function HelplineCard({ label, number }: { label: string, number: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
      <div>
        <p className="text-xs text-white/40 uppercase tracking-widest font-bold">{label}</p>
        <p className="text-xl font-bold text-white group-hover:text-gold transition-colors">{number}</p>
      </div>
      <a href={`tel:${number}`} className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
        <Phone size={18} />
      </a>
    </div>
  );
}

// --- Screens ---

function HomeScreen({ t, onStart, cases, setActiveTab }: { t: any, onStart: () => void, cases: Case[], setActiveTab: (t: string) => void, key?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col"
    >
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Orb hue={220} backgroundColor="#0A0F1E" hoverIntensity={0.3} rotateOnHover={true} />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight drop-shadow-lg"
          >
            {t.heroTitle}
          </motion.h2>
          <motion.button 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={onStart}
            className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl text-lg red-glow hover:bg-red-700 transition-all flex items-center gap-3 mx-auto"
          >
            <Mic size={24} />
            {t.startRecording}
          </motion.button>
        </div>
      </section>

      {/* 3-Step Flow */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard icon={<Mic className="text-gold" />} step="1" title={t.step1} />
          <StepCard icon={<Upload className="text-gold" />} step="2" title={t.step2} />
          <StepCard icon={<FileText className="text-gold" />} step="3" title={t.step3} />
        </div>
      </section>

      {/* Recent Cases */}
      <section className="py-12 px-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-serif text-gold">{t.recentCases}</h3>
          <button onClick={() => setActiveTab('myCases')} className="text-gold/60 hover:text-gold flex items-center gap-1 text-sm">
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.slice(0, 3).map(c => (
            <CaseCard key={c.id} caseData={c} />
          ))}
        </div>
      </section>

      {/* Footer Strip */}
      <footer className="py-8 px-6 bg-black/20 text-center">
        <p className="text-sm text-white/40 max-w-2xl mx-auto italic">
          {t.disclaimer}
        </p>
      </footer>
    </motion.div>
  );
}

function StepCard({ icon, step, title }: { icon: React.ReactNode, step: string, title: string }) {
  return (
    <div className="glass p-8 rounded-2xl flex flex-col items-center text-center group hover:border-gold/30 transition-colors">
      <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-xs font-bold text-gold uppercase tracking-widest mb-2">Step {step}</p>
      <h4 className="text-xl font-serif">{title}</h4>
    </div>
  );
}

function CaseCard({ caseData }: { caseData: Case, key?: string }) {
  return (
    <div className="glass p-6 rounded-2xl hover:border-white/20 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-white/40 tracking-tighter">{caseData.id}</span>
        <StatusBadge status={caseData.status} />
      </div>
      <h4 className="text-lg font-serif mb-2">{caseData.type}</h4>
      <div className="flex items-center justify-between text-xs text-white/40">
        <span>{caseData.date}</span>
        <span className="flex items-center gap-1"><FolderOpen size={12} /> {caseData.evidenceCount} files</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Case['status'] }) {
  const styles = {
    Draft: "bg-white/10 text-white/60",
    Generated: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    Downloaded: "bg-green-500/10 text-green-400 border border-green-500/20"
  };
  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", styles[status])}>
      {status}
    </span>
  );
}

function RecordScreen({ t, currentCase, setCurrentCase, onNext }: { t: any, currentCase: any, setCurrentCase: any, onNext: () => void, key?: string }) {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setCurrentCase({ ...currentCase, audioBlob: blob });
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied. Please enable it to record testimony.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 max-w-2xl mx-auto w-full min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center"
    >
      <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Orb hue={0} backgroundColor="#0A0F1E" forceHoverState={isRecording} />
        </div>
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className={cn(
            "relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300",
            isRecording ? "bg-red-600 scale-110 red-glow" : "bg-gold hover:bg-amber"
          )}
        >
          {isRecording ? <Square size={48} className="text-white" /> : <Mic size={48} className="text-navy" />}
        </button>
      </div>

      <h2 className="text-3xl font-serif mb-4">
        {isRecording ? t.recording : t.tapToStart}
      </h2>
      
      <div className="text-5xl font-mono mb-8 text-white/80">
        {formatTime(timer)}
      </div>

      {isRecording && (
        <div className="flex gap-1 h-8 items-end mb-12">
          {[...Array(12)].map((_, i) => (
            <motion.div 
              key={i}
              animate={{ height: [10, Math.random() * 30 + 10, 10] }}
              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
              className="w-1.5 bg-red-500 rounded-full"
            />
          ))}
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <audio src={audioUrl} controls className="w-full h-12 rounded-lg" />
          <div className="flex gap-4">
            <button 
              onClick={() => { setAudioUrl(null); setTimer(0); }}
              className="flex-1 py-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={20} /> {t.reRecord}
            </button>
            <button 
              onClick={onNext}
              className="flex-1 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-amber transition-colors flex items-center justify-center gap-2"
            >
              {t.saveContinue} <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 p-4 bg-white/5 rounded-xl border border-white/10 flex gap-3 text-left">
        <Shield className="text-gold shrink-0" size={20} />
        <p className="text-xs text-white/60 leading-relaxed">
          {t.localNotice}
        </p>
      </div>
    </motion.div>
  );
}

function EvidenceScreen({ t, currentCase, setCurrentCase, onNext }: { t: any, currentCase: any, setCurrentCase: any, onNext: () => void, key?: string }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles: EvidenceFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      timestamp: new Date().toLocaleString(),
      description: ''
    }));
    setCurrentCase({
      ...currentCase,
      evidenceFiles: [...(currentCase.evidenceFiles || []), ...newFiles]
    });
  };

  const removeFile = (id: string) => {
    setCurrentCase({
      ...currentCase,
      evidenceFiles: currentCase.evidenceFiles.filter((f: any) => f.id !== id)
    });
  };

  const updateDescription = (id: string, desc: string) => {
    setCurrentCase({
      ...currentCase,
      evidenceFiles: currentCase.evidenceFiles.map((f: any) => f.id === id ? { ...f, description: desc } : f)
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 max-w-4xl mx-auto w-full"
    >
      <h2 className="text-3xl font-serif mb-8 text-gold">{t.step2}</h2>

      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        className={cn(
          "border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 mb-8",
          isDragging ? "border-gold bg-gold/10" : "border-white/10 bg-white/5 hover:border-white/20"
        )}
      >
        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="text-gold" size={32} />
        </div>
        <p className="text-lg mb-2">Drag and drop files here</p>
        <p className="text-sm text-white/40 mb-6">JPG, PNG, MP4, MOV, MP3, WAV, PDF</p>
        <label className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl cursor-pointer transition-colors font-bold">
          Select Files
          <input type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </label>
      </div>

      <div className="space-y-4 mb-12">
        {currentCase.evidenceFiles?.map((f: any) => (
          <div key={f.id} className="glass p-4 rounded-xl flex flex-col sm:flex-row gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
              {f.file.type.startsWith('image/') ? <Plus size={24} className="text-white/20" /> : <FileText size={24} className="text-white/20" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold truncate text-sm">{f.file.name}</p>
                <button onClick={() => removeFile(f.id)} className="text-white/40 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-[10px] text-white/40 mb-3 uppercase tracking-wider">{f.timestamp} • {(f.file.size / 1024 / 1024).toFixed(2)} MB</p>
              <input 
                type="text" 
                placeholder="Brief description of this evidence..."
                value={f.description}
                onChange={(e) => updateDescription(f.id, e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-gold/5 border border-gold/20 rounded-2xl">
        <div className="text-center sm:text-left">
          <p className="text-sm text-gold/60">{t.uploadNotice}</p>
          <p className="font-bold">{currentCase.evidenceFiles?.length || 0} files uploaded</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={onNext}
            className="flex-1 sm:flex-none px-6 py-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
          >
            Skip
          </button>
          <button 
            disabled={!currentCase.evidenceFiles?.length}
            onClick={onNext}
            className="flex-1 sm:flex-none px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-amber transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue to Complaint <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ComplaintScreen({ t, currentCase, setCurrentCase, onSave }: { t: any, currentCase: any, setCurrentCase: any, onSave: (c: any) => void, key?: string }) {
  const [isGenerated, setIsGenerated] = useState(false);
  
  const handleGenerate = () => {
    if (!currentCase.description) {
      alert("Please describe the incident first.");
      return;
    }
    setIsGenerated(true);
  };

  const handleDownloadPDF = () => {
    try {
      // @ts-ignore
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text("COMPLAINT UNDER SC/ST (PREVENTION OF ATROCITIES) ACT, 1989", 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`Case Reference: ${currentCase.id}`, 20, 40);
      doc.text(`Date: ${currentCase.date}`, 150, 40);
      
      doc.text(`To,`, 20, 60);
      doc.text(`The Officer-in-Charge,`, 20, 65);
      doc.text(`${currentCase.submitTo || '[Authority Name]'}`, 20, 70);
      
      doc.setFont(undefined, 'bold');
      doc.text(`Subject: Complaint under the Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989.`, 20, 85, { maxWidth: 170 });
      
      doc.setFont(undefined, 'normal');
      doc.text(`Respected Sir/Madam,`, 20, 100);
      
      const splitDescription = doc.splitTextToSize(`I am filing this formal complaint regarding an incident of ${currentCase.incidentType || 'violence/discrimination'} that occurred on ${currentCase.date}. ${currentCase.description}`, 170);
      doc.text(splitDescription, 20, 110);
      
      doc.text(`Applicable Legal Provisions:`, 20, 150);
      doc.text(`- SC/ST (Prevention of Atrocities) Act, 1989`, 25, 155);
      doc.text(`- IPC Section 153A (Promoting enmity)`, 25, 160);
      doc.text(`- IPC Section 354 (Assault on modesty)`, 25, 165);
      
      doc.text(`I request you to register an FIR immediately and take necessary action against the accused ${currentCase.filedAgainst}.`, 20, 180, { maxWidth: 170 });
      
      doc.text(`Complainant`, 150, 210);
      
      doc.setFontSize(10);
      doc.text(`Generated by NyayaVoice | For legal filing purposes`, 105, 280, { align: 'center' });
      
      doc.save(`NyayaVoice_Complaint_${currentCase.id}.pdf`);
      setCurrentCase({ ...currentCase, status: 'Downloaded' as Case['status'] });
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try again.");
    }
  };

  const handleShare = () => {
    const text = `Complaint filed. Case: ${currentCase.id}. Via NyayaVoice.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 max-w-6xl mx-auto w-full"
    >
      <h2 className="text-3xl font-serif mb-8 text-gold">{t.step3}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left - Input Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-white/60 uppercase tracking-widest">{t.describeIncident}</label>
            <textarea 
              rows={6}
              value={currentCase.description || ''}
              onChange={(e) => setCurrentCase({ ...currentCase, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="Provide as much detail as possible: who, what, where, when..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SelectField 
              label={t.incidentType} 
              options={['Physical assault', 'Verbal abuse', 'Property damage', 'Discrimination', 'Sexual violence', 'Other']} 
              value={currentCase.incidentType}
              onChange={(v) => setCurrentCase({ ...currentCase, incidentType: v })}
            />
            <SelectField 
              label={t.filedAgainst} 
              options={['Individual', 'Police officer', 'Govt official', 'Unknown']} 
              value={currentCase.filedAgainst}
              onChange={(v) => setCurrentCase({ ...currentCase, filedAgainst: v })}
            />
          </div>

          <SelectField 
            label={t.submitTo} 
            options={['Local Police Station', 'District Magistrate', 'State SC/ST Commission', 'NHRC', 'Legal Aid']} 
            value={currentCase.submitTo}
            onChange={(v) => setCurrentCase({ ...currentCase, submitTo: v })}
          />

          <button 
            onClick={handleGenerate}
            className="w-full py-4 bg-gold text-navy font-bold rounded-xl hover:bg-amber transition-all gold-glow flex items-center justify-center gap-2"
          >
            <FileText size={20} /> {t.generateComplaint}
          </button>
        </div>

        {/* Right - Preview */}
        <div className="relative">
          <AnimatePresence>
            {isGenerated ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white text-navy p-8 rounded-2xl shadow-2xl min-h-[500px] flex flex-col"
              >
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 z-0 pointer-events-none">
                  <Orb hue={120} forceHoverState={true} backgroundColor="#FFFFFF" />
                </div>
                
                <div className="relative z-10 flex-1">
                  <div className="border-b-2 border-navy/10 pb-4 mb-6 flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Case Reference</p>
                      <p className="font-mono font-bold">{currentCase.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Date</p>
                      <p className="font-bold">{currentCase.date}</p>
                    </div>
                  </div>

                  <div className="space-y-6 text-sm leading-relaxed">
                    <p className="font-bold">To,<br />The Officer-in-Charge,<br />{currentCase.submitTo || '[Authority Name]'}</p>
                    
                    <p className="font-bold underline uppercase">Subject: Complaint under the Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989.</p>

                    <p>Respected Sir/Madam,</p>
                    
                    <p className="italic">
                      I am filing this formal complaint regarding an incident of {currentCase.incidentType || 'violence/discrimination'} that occurred on {currentCase.date}. 
                      {currentCase.description}
                    </p>

                    <div className="bg-navy/5 p-4 rounded-lg border border-navy/10">
                      <p className="font-bold text-xs mb-2 uppercase tracking-widest opacity-60">Applicable Legal Provisions</p>
                      <ul className="list-disc list-inside space-y-1 text-xs font-medium">
                        <li>SC/ST (Prevention of Atrocities) Act, 1989</li>
                        <li>IPC Section 153A (Promoting enmity)</li>
                        <li>IPC Section 354 (Assault on modesty)</li>
                      </ul>
                    </div>

                    <p>I request you to register an FIR immediately and take necessary action against the accused {currentCase.filedAgainst}.</p>
                    
                    <div className="pt-8 flex justify-between items-end">
                      <div className="w-32 h-12 border-b border-navy/20 flex items-center justify-center text-[10px] opacity-40 italic">Signature Placeholder</div>
                      <p className="font-bold">Complainant</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-navy/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button onClick={handleDownloadPDF} className="p-3 bg-navy text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold hover:bg-navy/90 transition-colors">
                    <Download size={14} /> PDF
                  </button>
                  <button onClick={() => alert("Text copied to clipboard")} className="p-3 border border-navy/20 rounded-lg flex items-center justify-center gap-2 text-xs font-bold hover:bg-navy/5 transition-colors">
                    <FileText size={14} /> Copy
                  </button>
                  <button onClick={handleShare} className="p-3 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold hover:bg-green-700 transition-colors">
                    <Share2 size={14} /> WhatsApp
                  </button>
                </div>
                
                <button 
                  onClick={() => onSave({ ...currentCase, status: 'Generated' as Case['status'], type: currentCase.incidentType, evidenceCount: currentCase.evidenceFiles?.length || 0 })}
                  className="mt-4 w-full py-3 bg-gold text-navy font-bold rounded-xl hover:bg-amber transition-colors"
                >
                  Save to My Cases
                </button>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 glass rounded-2xl border-dashed">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <FileText className="text-white/20" size={40} />
                </div>
                <p className="text-white/40 italic">Fill in the details and click "Generate Complaint" to see the legal draft here.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function SelectField({ label, options, value, onChange }: { label: string, options: string[], value?: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-white/60 uppercase tracking-widest">{label}</label>
      <select 
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-gold/50 transition-colors appearance-none"
      >
        <option value="" disabled className="bg-navy">Select option...</option>
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-navy">{opt}</option>
        ))}
      </select>
    </div>
  );
}

function MyCasesScreen({ t, cases, onNew }: { t: any, cases: Case[], onNew: () => void, key?: string }) {
  const [search, setSearch] = useState('');
  
  const filteredCases = cases.filter(c => 
    c.id.toLowerCase().includes(search.toLowerCase()) || 
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 max-w-6xl mx-auto w-full"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
        <h2 className="text-3xl font-serif text-gold">{t.myCases}</h2>
        <button 
          onClick={onNew}
          className="px-6 py-3 bg-gold text-navy font-bold rounded-xl hover:bg-amber transition-colors flex items-center gap-2"
        >
          <Plus size={20} /> New Case
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
        <input 
          type="text" 
          placeholder="Search by Case ID or Type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <div className="space-y-4">
        {filteredCases.length > 0 ? (
          filteredCases.map(c => (
            <div key={c.id} className="glass p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-white/20 transition-colors group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold text-white/40 tracking-widest font-mono">{c.id}</span>
                  <StatusBadge status={c.status} />
                </div>
                <h3 className="text-xl font-serif mb-1 group-hover:text-gold transition-colors">{c.type}</h3>
                <p className="text-sm text-white/60 line-clamp-1">{c.description}</p>
              </div>
              
              <div className="flex items-center gap-8 text-sm text-white/40">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold mb-1">Date</p>
                  <p className="text-white/80">{c.date}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold mb-1">Evidence</p>
                  <p className="text-white/80">{c.evidenceCount} files</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold">View</button>
                <button className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-colors text-xs font-bold flex items-center justify-center gap-2">
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 glass rounded-2xl border-dashed">
            <AlertTriangle className="text-white/20 mx-auto mb-4" size={48} />
            <p className="text-white/40 italic">No cases found matching your search.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
