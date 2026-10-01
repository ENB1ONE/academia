import os
from PIL import Image

# Path to the user uploaded image
img_path = r"C:/Users/eabc/.gemini/antigravity/brain/27dcc731-881e-4f3d-ae07-5331893c10a6/.user_uploaded/media_1790867028920.png"

def build_icons():
    img = Image.open(img_path).convert("RGBA")
    
    # Ensure it's a square
    w, h = img.size
    if w != h:
        size = min(w, h)
        left = (w - size) // 2
        top = (h - size) // 2
        img = img.crop((left, top, left + size, top + size))
        
    os.makedirs('public/pwa', exist_ok=True)
    
    icon_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    icon_512.save('public/pwa/icon-512x512.png')
    
    icon_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save('public/pwa/icon-192x192.png')

    icon_144 = img.resize((144, 144), Image.Resampling.LANCZOS)
    icon_144.save('public/pwa/icon-144x144.png')
    
    # For maskable, we add a little bit of padding to ensure it complies with the safe zone (central 80%)
    bg_color = (27, 32, 43, 255) # matches the background
    icon_maskable = Image.new("RGBA", (512, 512), bg_color)
    
    # The uploaded image already has some padding, but we scale it down slightly just in case
    # The maskable icon safe zone is a circle with diameter 0.8 * size.
    img_padded = img.resize((410, 410), Image.Resampling.LANCZOS)
    offset = (512 - 410) // 2
    icon_maskable.paste(img_padded, (offset, offset), img_padded)
    icon_maskable.save('public/pwa/icon-maskable-512x512.png')

build_icons()
print("New uploaded icons applied!")
