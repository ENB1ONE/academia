# coding: utf-8
import re

with open("src/pages/auth/ProfilePage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

def replace_func(match):
    return """  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('A imagem deve ter no m\u00e1ximo 2MB');
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
  };"""

data = re.sub(r'  const handlePhotoUpload = \(e\) => \{[\s\S]*?reader\.readAsDataURL\(file\);\s*\}\s*\};', replace_func, data)

def replace_name(match):
    return """  const handleSaveName = async () => {
    if (!name.trim()) {
      toast.error('O nome n\u00e3o pode ser vazio');
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
  };"""

data = re.sub(r'  const handleSaveName = \(\) => \{[\s\S]*?toast\.success\([^)]+\);\s*\};', replace_name, data)

with open("src/pages/auth/ProfilePage.jsx", "w", encoding="utf-8") as f:
    f.write(data)
