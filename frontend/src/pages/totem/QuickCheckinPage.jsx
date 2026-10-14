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
      // Endpoint que busca atleta por data de nascimento (DD/MM/AAAA)
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
    // Salva token temporário do atleta e redireciona para o questionário de bem-estar
    if (athleteFound?.id) {
      localStorage.setItem('quick_athlete_id', athleteFound.id);
      localStorage.setItem('quick_athlete_name', athleteFound.name);
      navigate('/monitoring/wellness');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-surface border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="flex justify-center mb-2">
          <Logo className="h-24" />
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-white">Check-in de Monitoramento</h1>
          <p className="text-xs text-gray-400">
            Acesso rápido diário FormClub para atletas
          </p>
        </div>

        {error && (
          <div className="p-3 bg-danger/10 border border-danger/30 text-danger rounded-xl text-xs text-center">
            {error}
          </div>
        )}

        {!athleteFound ? (
          <form onSubmit={handleLookup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                Informe sua Data de Nascimento:
              </label>
              <input
                type="date"
                required
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-gray-700 rounded-xl text-white text-center text-base focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !birthdate}
              className="w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
            >
              {loading ? 'Localizando Atleta...' : 'Continuar'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          /* Confirmação do Atleta */
          <div className="space-y-5 text-center pt-2">
            <div className="w-16 h-16 bg-primary/20 border border-primary/40 rounded-full flex items-center justify-center mx-auto text-primary">
              <UserCheck className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-400">Você é:</p>
              <h2 className="text-2xl font-black text-white">{athleteFound.name}?</h2>
              <p className="text-xs text-gray-500">
                {athleteFound.category || 'Atleta'} &bull; {athleteFound.position || 'Geral'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAthleteFound(null)}
                className="py-3 px-4 bg-background border border-gray-700 hover:border-gray-600 text-gray-300 rounded-xl text-sm font-semibold transition"
              >
                Não sou eu
              </button>
              <button
                type="button"
                onClick={handleConfirmAthlete}
                className="py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-primary/25"
              >
                Sim, sou eu!
              </button>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-800 text-center">
          <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1">
            <Smartphone className="h-3 w-3" /> Adicione à tela inicial do celular para abrir como App
          </p>
        </div>
      </div>
    </div>
  );
}
