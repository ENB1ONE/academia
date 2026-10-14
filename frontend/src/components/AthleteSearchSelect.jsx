import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X, User } from 'lucide-react';
import defaultAvatar from '../assets/avatar-default.png';

export default function AthleteSearchSelect({
  athletes = [],
  value = '',
  onChange = () => {},
  placeholder = 'Buscar ou selecionar atleta...',
  required = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  // Normaliza string para busca sem acentos
  const normalizeText = (text) => {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  // Encontrar o atleta atualmente selecionado
  const selectedAthlete = athletes.find((a) => String(a.id) === String(value));

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ordenar alfabeticamente
  const sortedAthletes = [...athletes].sort((a, b) => 
    (a.name || '').localeCompare(b.name || '')
  );

  // Filtrar pela busca
  const filteredAthletes = sortedAthletes.filter((a) => {
    if (!searchTerm.trim()) return true;
    const term = normalizeText(searchTerm);
    const nameMatch = normalizeText(a.name).includes(term);
    const groupMatch = normalizeText(a.group_name || a.group || a.nomeGrupo).includes(term);
    return nameMatch || groupMatch;
  });

  const handleSelect = (athlete) => {
    onChange(athlete.id, athlete);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('', null);
    setSearchTerm('');
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      {/* Campo Principal */}
      <div
        onClick={() => setIsOpen(true)}
        className="w-full min-h-[42px] px-3.5 py-2 bg-[#0A0A0C] border border-gray-700 hover:border-[#E5A910]/60 focus-within:border-[#E5A910] rounded-xl flex items-center justify-between gap-2 cursor-pointer transition shadow-sm"
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Search className="h-4 w-4 text-[#E5A910] shrink-0" />
          
          {isOpen ? (
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome do atleta..."
              className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-500 font-medium"
              onClick={(e) => e.stopPropagation()}
            />
          ) : selectedAthlete ? (
            <div className="flex items-center gap-2 truncate">
              <span className="text-white text-sm font-bold truncate">
                {selectedAthlete.name}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5A910]/15 text-[#E5A910] border border-[#E5A910]/30 shrink-0">
                {selectedAthlete.group_name || selectedAthlete.group || selectedAthlete.nomeGrupo || 'FORMCLUB'}
              </span>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {selectedAthlete && !isOpen && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition"
              title="Limpar seleção"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#E5A910]' : ''
            }`}
          />
        </div>
      </div>

      {/* Menu Suspenso */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-[#111827] border border-[#E5A910]/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.06] p-1.5 space-y-0.5">
            {filteredAthletes.length > 0 ? (
              filteredAthletes.map((ath) => {
                const isSelected = String(ath.id) === String(value);
                const cid = ath.codigoAtleta || ath.id;
                const rawAvatar = ath.photo_url || ath.avatar;
                const avatar = (rawAvatar && !rawAvatar.includes('default') && !rawAvatar.includes('avatar-default'))
                  ? rawAvatar
                  : `./avatars/athlete_${cid}.jpg`;

                return (
                  <button
                    key={ath.id}
                    type="button"
                    onClick={() => handleSelect(ath)}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition ${
                      isSelected
                        ? 'bg-[#E5A910]/20 border border-[#E5A910]/50 text-white font-bold'
                        : 'hover:bg-white/[0.06] text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={avatar}
                        alt={ath.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultAvatar;
                        }}
                        className="h-8 w-8 rounded-full object-cover border border-[#E5A910]/40 bg-black/60 shrink-0 p-0.5"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate leading-tight">
                          {ath.name}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">
                          {ath.group_name || ath.group || ath.nomeGrupo || 'Atleta sem grupo'} &bull; {ath.sport || 'Performance'}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] text-gray-500 font-mono ml-2 shrink-0">
                      #{String(cid).slice(0, 8)}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-gray-400">
                Nenhum atleta encontrado para "<span className="text-[#E5A910]">{searchTerm}</span>"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
