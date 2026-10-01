import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, Save, Camera, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ProfilePage = () => {
  const { user, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [avatar, setAvatar] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');

  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    // Load mocked avatar and name from local storage if exists
    if (user?.id) {
      const savedAvatar = localStorage.getItem(`userAvatar_${user.id}`);
      if (savedAvatar) setAvatar(savedAvatar);
      
      const savedName = localStorage.getItem(`userName_${user.id}`);
      if (savedName) setName(savedName);
    }
  }, [user?.id]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        setAvatar(base64String);
        if (user?.id) {
          localStorage.setItem(`userAvatar_${user.id}`, base64String);
          try {
            await api.put('/api/v1/auth/me', { name: name, avatar: base64String });
            const authStore = useAuthStore.getState();
            authStore.updateUser({ ...user, avatar: base64String });
            toast.success('Foto de perfil salva no servidor!');
          } catch(e) {
            toast.error('Erro ao salvar no servidor.');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveName = async () => {
    if (!name.trim()) {
      toast.error('O nome não pode ser vazio');
      return;
    }
    if (user?.id) {
      localStorage.setItem(`userName_${user.id}`, name);
      try {
        await api.put('/api/v1/auth/me', { name: name, avatar: avatar });
        const authStore = useAuthStore.getState();
        authStore.updateUser({ ...user, name: name });
        setIsEditingName(false);
        toast.success('Nome atualizado com sucesso no servidor!');
      } catch(e) {
        toast.error('Erro ao salvar o nome no servidor.');
      }
    }
  };

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
          <Card className="text-center py-8 relative group">
            <div className="relative h-28 w-28 mx-auto mb-4">
              {avatar ? (
                <img 
                  src={avatar} 
                  alt="Avatar" 
                  className="h-28 w-28 rounded-full object-cover border-2 border-primary/50 shadow-lg"
                />
              ) : (
                <div className="h-28 w-28 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-4xl border border-primary/30 shadow-lg">
                  {name.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-105"
                title="Trocar Foto"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div className="flex items-center justify-center gap-2 mb-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background border border-gray-700 rounded px-2 py-1 text-sm text-text max-w-[140px]"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="text-success hover:text-green-400">
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-text">{name}</h2>
                  <button onClick={() => setIsEditingName(true)} className="text-gray-400 hover:text-primary transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>

            <p className="text-sm text-gray-400">{user?.email}</p>
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
