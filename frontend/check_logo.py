from PIL import Image

img = Image.open('src/assets/formclub-logo.png').convert("RGBA")
w, h = img.size

# find columns with any non-transparent pixels
columns = []
for x in range(w):
    has_pixel = False
    for y in range(h):
        _, _, _, a = img.getpixel((x, y))
        if a > 10:
            has_pixel = True
            break
    columns.append(has_pixel)

# Find the gap
in_man = False
man_end = 0
for x in range(w):
    if columns[x]:
        in_man = True
    elif in_man and not columns[x]:
        # we found a gap!
        gap_start = x
        # verify how wide the gap is
        gap_end = x
        while gap_end < w and not columns[gap_end]:
            gap_end += 1
        print(f"Gap from {gap_start} to {gap_end}")
        in_man = False
