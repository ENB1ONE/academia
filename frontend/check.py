import glob

for f in glob.glob('src/**/*.jsx', recursive=True):
    try:
        content = open(f, 'rb').read().decode('utf-8')
    except Exception as e:
        print("UTF-8 ERROR:", f, e)
        # fallback
        content = open(f, 'rb').read().decode('latin-1')
        print("Content decoded as latin-1. Default export?", 'export default' in content)
    
    if 'export default' not in content:
        print("MISSING DEFAULT EXPORT:", f)
