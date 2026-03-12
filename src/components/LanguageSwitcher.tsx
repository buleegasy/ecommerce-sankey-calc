"use client";

import { Language, translations } from "@/lib/translations";
import { Globe, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Props {
  currentLang: Language;
  setLang: (lang: Language) => void;
}

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '简体中文', flag: '🇨🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'jp', label: '日本語', flag: '🇯🇵' },
  { code: 'kr', label: '한국어', flag: '🇰🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

export default function LanguageSwitcher({ currentLang, setLang }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all text-sm font-medium text-slate-300"
      >
        <Globe className="w-4 h-4 text-indigo-400" />
        <span>{languages.find(l => l.code === currentLang)?.flag}</span>
        <span className="hidden sm:inline">{languages.find(l => l.code === currentLang)?.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 rounded-xl bg-[#0f172a]/95 border border-white/10 backdrop-blur-xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
          <div className="max-h-[300px] overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLang(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-white/10 transition-colors ${currentLang === lang.code ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
              >
                <div className="flex items-center gap-3">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {currentLang === lang.code && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
