import re
with open("src/store/authStore.js", "r", encoding="utf-8") as f:
    data = f.read()

target = "logout: () => {"
replacement = """updateUser: (newUser) => {
    localStorage.setItem('user', JSON.stringify(newUser));
    set({ user: newUser });
  },
  
  logout: () => {"""

data = data.replace(target, replacement)

with open("src/store/authStore.js", "w", encoding="utf-8") as f:
    f.write(data)
