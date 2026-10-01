# coding: utf-8
import re

with open("src/pages/auth/ProfilePage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

target1 = r"""        const reader = new FileReader\(\);
        reader\.onloadend = \(\) => \{
          const base64String = reader\.result;
          setAvatar\(base64String\);
          if \(user\?\.id\) \{
            localStorage\.setItem\(`userAvatar_\$\{user\.id\}`\, base64String\);
          \}
          toast\.success\('Foto de perfil atualizada!'\);
        \};
        reader\.readAsDataURL\(file\);"""

replacement1 = """        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result;
          setAvatar(base64String);
          
          if (user?.id) {
            localStorage.setItem(`userAvatar_${user.id}`, base64String);
            
            try {
              await api.put('/api/v1/auth/me', {
                name: name,
                avatar: base64String
              });
              
              const authStore = useAuthStore.getState();
              authStore.updateUser({ ...user, avatar: base64String });
              
              toast.success('Foto de perfil salva com sucesso!');
            } catch(e) {
              toast.error('Erro ao salvar foto no servidor.');
            }
          }
        };
        reader.readAsDataURL(file);"""

target2 = r"""    const handleSaveName = \(\) => \{
      if \(!name\.trim\(\)\) \{
        toast\.error\('O nome n\\u00e3o pode ser vazio'\);
        return;
      \}
      
      if \(user\?\.id\) \{
        localStorage\.setItem\(`userName_\$\{user\.id\}`\, name\);
      \}
      setIsEditingName\(false\);
      toast\.success\('Nome atualizado com sucesso!'\);
    \};"""

replacement2 = """    const handleSaveName = async () => {
      if (!name.trim()) {
        toast.error('O nome n\\u00e3o pode ser vazio');
        return;
      }
      
      if (user?.id) {
        localStorage.setItem(`userName_${user.id}`, name);
        
        try {
          await api.put('/api/v1/auth/me', {
            name: name,
            avatar: avatar
          });
          
          const authStore = useAuthStore.getState();
          authStore.updateUser({ ...user, name: name });
          
          setIsEditingName(false);
          toast.success('Nome atualizado com sucesso no servidor!');
        } catch(e) {
          toast.error('Erro ao salvar o nome no servidor.');
        }
      }
    };"""

data = re.sub(target1, replacement1, data)
data = re.sub(target2, replacement2, data)

with open("src/pages/auth/ProfilePage.jsx", "w", encoding="utf-8") as f:
    f.write(data)
