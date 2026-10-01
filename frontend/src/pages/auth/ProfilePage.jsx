import React, { useState } from 'react';
import { User, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ProfilePage = () => {
  const { user, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error('A nova senha e a confirmação não coincidem');
      return;
    }
    if (passwords.new_password.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setIsLoading(true);
      await api.put('/api/v1/auth/password', {
        current_password: passwords.current_password,
        new_password: passwords.new_password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Senha atualizada com sucesso!');
      setPasswords({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao atualizar senha');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <User className="text-primary h-6 w-6" /> 
          Meu Perfil
        </h1>
        <p className="text-gray-400 mt-1">Gerencie suas informações de acesso</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="text-center py-8">
            <div className="h-24 w-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl border border-primary/30 mb-4">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <h2 className="text-xl font-bold text-text">{user?.name}</h2>
            <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
            <div className="mt-4 inline-block px-3 py-1 bg-surface border border-gray-700 rounded-full text-xs font-medium text-gray-300 capitalize">
              Perfil: {user?.role}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
              <Lock className="text-primary h-5 w-5" />
              <h2 className="text-lg font-bold text-text">Alterar Senha</h2>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input 
                label="Senha Atual" 
                type="password" 
                placeholder="Sua senha atual" 
                value={passwords.current_password} 
                onChange={(e) => setPasswords({...passwords, current_password: e.target.value})} 
                required 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Nova Senha" 
                  type="password" 
                  placeholder="Mínimo 6 caracteres" 
                  value={passwords.new_password} 
                  onChange={(e) => setPasswords({...passwords, new_password: e.target.value})} 
                  required 
                />
                <Input 
                  label="Confirmar Nova Senha" 
                  type="password" 
                  placeholder="Repita a nova senha" 
                  value={passwords.confirm_password} 
                  onChange={(e) => setPasswords({...passwords, confirm_password: e.target.value})} 
                  required 
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" isLoading={isLoading} className="gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Nova Senha
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
