import sys
try:
    from PIL import Image
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

frames = []

for i in range(6):
    img = Image.new("RGBA", (32, 32), (0,0,0,0))
    pixels = img.load()
    
    # Body
    for y in range(12, 24):
        for x in range(12, 20):
            pixels[x, y] = (30, 30, 30, 255)
            
    # Ears
    pixels[13, 10] = (30, 30, 30, 255)
    pixels[13, 11] = (30, 30, 30, 255)
    pixels[18, 10] = (30, 30, 30, 255)
    pixels[18, 11] = (30, 30, 30, 255)
    
    # Eyes
    pixels[14, 14] = (255, 255, 255, 255)
    pixels[17, 14] = (255, 255, 255, 255)

    # Wings (animated based on frame i)
    wing_offsets = [4, 2, 0, -2, -4, -2]
    wo = wing_offsets[i]
    
    # Left wing
    for x in range(2, 12):
        for y in range(14 + wo, 18 + wo + int(x/2)):
            pixels[x, y] = (30, 30, 30, 255)
            
    # Right wing
    for x in range(20, 30):
        for y in range(14 + wo, 18 + wo + int((31-x)/2)):
            pixels[x, y] = (30, 30, 30, 255)
            
    frames.append(img)

spritesheet = Image.new("RGBA", (192, 32), (0,0,0,0))
for i, frame in enumerate(frames):
    spritesheet.paste(frame, (i * 32, 0))

spritesheet.save("public/bat-sprite.png")
print("Sprite sheet generated!")
