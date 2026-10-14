import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import logo from '../../assets/formclub-logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao realizar login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#0A0A0C]">
      {/* Background Decorativo FormClub com Brilho Dourado */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E5A910]/[0.07] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <img
          className="mx-auto h-36 w-auto object-contain drop-shadow-[0_10px_25px_rgba(229,169,16,0.2)]"
          src={logo}
          alt="FormClub"
        />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="shadow-2xl border-white/[0.08] backdrop-blur-md bg-[#141418]/90 p-8 sm:p-10 rounded-3xl">
          <div className="text-center mb-8 space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#E5A910]">
              Human Performance Center
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Acesse sua conta
            </h2>
            <p className="text-xs text-gray-400">
              Painel Integrado de Monitoramento de Atletas
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@formclub.com.br"
              icon={Mail}
            />

            <div className="space-y-1">
              <Input
                label="Senha"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                icon={Lock}
              />
              <div className="flex items-center justify-end pt-1">
                <Link to="/forgot-password" className="text-xs font-semibold text-[#E5A910] hover:underline transition-colors">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full py-3 text-sm font-black flex items-center justify-center gap-2 mt-2" isLoading={isLoading}>
              <span>Entrar no Sistema</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
