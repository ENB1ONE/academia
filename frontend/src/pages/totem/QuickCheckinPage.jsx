import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, UserCheck, ShieldAlert, ArrowRight, Smartphone } from 'lucide-react';
import Logo from '../../components/ui/Logo';
import api from '../../services/api';

export default function QuickCheckinPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [birthdate, setBirthdate] = useState('');
  const [loading, setLoading] = useState(false);
  const [athleteFound, setAthleteFound] = useState(null);
  const [error, setError] = useState('');

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!birthdate) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/v1/totem/lookup-by-birthdate', {
        token: token || 'formclub-hub',
        birthdate: birthdate,
      });

      if (res.data?.athlete) {
        setAthleteFound(res.data.athlete);
      } else {
        setError('Nenhum atleta encontrado com esta data de nascimento.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Data de nascimento não localizada na organização.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAthlete = () => {
    if (athleteFound?.id) {
      localStorage.setItem('quick_athlete_id', athleteFound.id);
      localStorage.setItem('quick_athlete_name', athleteFound.name);
      navigate('/monitoring/wellness');
    }
  };

  const firstName = athleteFound?.name?.split(' ')[0] || athleteFound?.name;

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] relative">
        <div className="flex justify-center mb-1">
          <Logo className="h-16" />
        </div>

        <div className="text-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#3B7DDD] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
            FORMCLUB &bull; CONVITE RÁPIDO
          </span>
          <h1 className="text-xl font-bold text-gray-900 pt-1">Check-in de Monitoramento</h1>
          <p className="text-xs text-gray-500">
            Acesso sem senha &bull; Responda seu bem-estar diário
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs text-center font-medium">
            {error}
          </div>
        )}

        {!athleteFound ? (
          <form onSubmit={handleLookup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-700 font-semibold flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#3B7DDD]" />
                Informe sua Data de Nascimento:
              </label>
              <input
                type="date"
                required
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 text-center text-base focus:border-[#3B7DDD] focus:ring-1 focus:ring-[#3B7DDD] focus:outline-none shadow-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !birthdate}
              className="w-full py-3 bg-[#3B7DDD] hover:bg-[#2F64B1] disabled:opacity-50 text-white font-bold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? 'Localizando Atleta...' : 'Continuar'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          /* Confirmação do Atleta estilo eLoad ("Fernando? [Sim] [Não]") */
          <div className="space-y-5 text-center pt-2">
            <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto text-[#3B7DDD]">
              <UserCheck className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium">Você é:</p>
              <h2 className="text-2xl font-black text-gray-900">{firstName}?</h2>
              <p className="text-xs text-gray-500">
                {athleteFound.name} &bull; {athleteFound.position || athleteFound.sport || 'Atleta FORMCLUB'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAthleteFound(null)}
                className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition"
              >
                Não sou eu
              </button>
              <button
                type="button"
                onClick={handleConfirmAthlete}
                className="py-2.5 px-4 bg-[#3B7DDD] hover:bg-[#2F64B1] text-white rounded-xl text-sm font-bold transition shadow-sm"
              >
                Sim, sou eu!
              </button>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5 font-medium">
            <Smartphone className="h-3.5 w-3.5 text-gray-400" />
            Salve na tela de início do seu smartphone para abrir como aplicativo
          </p>
        </div>
      </div>
    </div>
  );
}
