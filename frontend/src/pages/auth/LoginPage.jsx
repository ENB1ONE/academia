import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

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
    
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 border border-primary/30">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-text tracking-tight">FormClub</h1>
          <p className="text-gray-400 mt-2">Gestão de Carga e Treinamento</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />
            
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />
            
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Não tem uma conta? </span>
            <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Registre-se
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
