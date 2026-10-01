import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'treinador'
  });
  const [isLoading, setIsLoading] = useState(false);
  const register = useAuthStore(state => state.register);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    setIsLoading(true);
    try {
      await register(formData);
      toast.success('Conta criada com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erro ao criar conta.');
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
          <h1 className="text-3xl font-bold text-text tracking-tight">Criar Conta</h1>
          <p className="text-gray-400 mt-2">Junte-se ao FormaSync</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome Completo"
              name="name"
              placeholder="João Silva"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              required
            />
            
            <Input
              label="E-mail"
              name="email"
              type="email"
              placeholder="joao@exemplo.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Perfil</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full rounded-lg bg-background border border-gray-700 text-text focus:ring-primary focus:border-primary sm:text-sm p-2"
              >
                <option value="treinador">Treinador</option>
                <option value="atleta">Atleta</option>
              </select>
            </div>
            
            <Input
              label="Senha"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              required
            />

            <Input
              label="Confirmar Senha"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={Lock}
              required
            />
            
            <Button
              type="submit"
              className="w-full mt-6"
              isLoading={isLoading}
            >
              Registrar
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Já tem uma conta? </span>
            <Link to="/" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Faça login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
