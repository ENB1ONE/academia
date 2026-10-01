content = """import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Lock, AlertTriangle } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ForcePasswordChangeModal = () => {
  const { user, updateUser } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user || !user.force_password_change) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('As senhas n\\u00e3o coincidem');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await api.put('/api/v1/auth/password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      
      toast.success('Senha atualizada com sucesso!');
      updateUser({ ...user, force_password_change: false });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao atualizar senha');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
      <div className="bg-surface border border-primary/30 rounded-xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
        
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-text flex items-center gap-2">
            Seguran\\u00e7a em Primeiro Lugar
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Este \\u00e9 o seu primeiro acesso. Por quest\\u00f5es de seguran\\u00e7a, voc\\u00ea precisa alterar sua senha provis\\u00f3ria antes de continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Senha Atual (Provis\\u00f3ria)"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            icon={AlertTriangle}
            placeholder="Digite a senha provis\\u00f3ria"
          />
          <Input
            label="Nova Senha"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            icon={Lock}
            placeholder="M\\u00ednimo 6 caracteres"
          />
          <Input
            label="Confirme a Nova Senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            icon={Lock}
            placeholder="Repita a nova senha"
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full mt-6 py-3" 
            isLoading={isLoading}
          >
            Atualizar Senha e Continuar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForcePasswordChangeModal;
"""

with open("src/components/auth/ForcePasswordChangeModal.jsx", "w", encoding="utf-8") as f:
    f.write(content)
