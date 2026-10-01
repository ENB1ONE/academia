import os
from PIL import Image

def build_icons():
    img = Image.open('src/assets/formclub-logo.png').convert("RGBA")
    w, h = img.size
    
    # Let's slice the image. Assuming the man is roughly the first 300 pixels
    man_crop = img.crop((0, 0, int(w*0.3), h))
    # Bounding box to tightly fit the man
    man_bbox = man_crop.getbbox()
    if man_bbox:
        man = man_crop.crop(man_bbox)
    else:
        man = man_crop
        
    # Assuming text is the rest
    text_crop = img.crop((int(w*0.3), 0, w, int(h*0.75))) # ignore "human performance center"
    text_bbox = text_crop.getbbox()
    if text_bbox:
        text = text_crop.crop(text_bbox)
    else:
        text = text_crop

    # Create a 512x512 canvas (Dark theme background since the logo is white)
    # Wait, the user's header is dark `#1B202B` or `#1F2937`
    bg_color = (27, 32, 43, 255) # #1B202B
    
    icon_512 = Image.new("RGBA", (512, 512), bg_color)
    
    # Resize man to fit nicely
    man.thumbnail((300, 300), Image.Resampling.LANCZOS)
    text.thumbnail((400, 100), Image.Resampling.LANCZOS)
    
    # Paste man centered, but shifted up
    mx = (512 - man.width) // 2
    my = 50 + (250 - man.height) // 2
    icon_512.paste(man, (mx, my), man)
    
    # Paste text below
    tx = (512 - text.width) // 2
    ty = my + man.height + 20
    icon_512.paste(text, (tx, ty), text)
    
    os.makedirs('public/pwa', exist_ok=True)
    icon_512.save('public/pwa/icon-512x512.png')
    
    icon_192 = icon_512.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save('public/pwa/icon-192x192.png')

    icon_144 = icon_512.resize((144, 144), Image.Resampling.LANCZOS)
    icon_144.save('public/pwa/icon-144x144.png')
    
    icon_maskable = Image.new("RGBA", (512, 512), bg_color)
    # Maskable should have 10% padding
    man.thumbnail((250, 250), Image.Resampling.LANCZOS)
    text.thumbnail((300, 80), Image.Resampling.LANCZOS)
    mx = (512 - man.width) // 2
    my = 80 + (200 - man.height) // 2
    icon_maskable.paste(man, (mx, my), man)
    tx = (512 - text.width) // 2
    ty = my + man.height + 20
    icon_maskable.paste(text, (tx, ty), text)
    icon_maskable.save('public/pwa/icon-maskable-512x512.png')

build_icons()
print("Icons generated!")
