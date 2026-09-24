import segno, os
from PIL import Image

URL = "https://xn--bykbesiktascarsisi-m6bb.com"
OUT = "/Users/camoka/sites/besiktas-carsisi/qr"
INK, PAPER = "#101112", "#FFFFFF"

qr = segno.make(URL, error="h")

# VEKTOR — baski ustasi. Her olcude keskin, buyutunce bozulmaz.
qr.save(f"{OUT}/bbc-qr.svg", kind="svg", scale=10, border=4, dark=INK, light=PAPER)
qr.save(f"{OUT}/bbc-qr.pdf", kind="pdf", scale=10, border=4, dark=INK, light=PAPER)
qr.save(f"{OUT}/bbc-qr.eps", kind="eps", scale=10, border=4, dark=INK, light=PAPER)

# RASTER — dijital kullanim
qr.save(f"{OUT}/bbc-qr.png", kind="png", scale=50, border=4, dark=INK, light=PAPER)
qr.save(f"{OUT}/bbc-qr-seffaf.png", kind="png", scale=50, border=4, dark=INK, light=None)

# AMBLEMLI
qr.save("_b.png", kind="png", scale=80, border=4, dark=INK, light=PAPER)
base = Image.open("_b.png").convert("RGBA"); W, H = base.size
logo = Image.open("/Users/camoka/sites/besiktas-carsisi/scripts/assets/amblem.gif").convert("RGBA")
s = min(logo.size)
logo = logo.crop(((logo.width-s)//2, (logo.height-s)//2, (logo.width+s)//2, (logo.height+s)//2))
t = int(W * 0.18)
logo = logo.resize((t, t), Image.LANCZOS)
pad = int(t * 0.10)
plate = Image.new("RGBA", (t+pad*2, t+pad*2), (255,255,255,255))
plate.paste(logo, (pad, pad), logo)
base.paste(plate, ((W-plate.width)//2, (H-plate.height)//2), plate)
base.convert("RGB").save(f"{OUT}/bbc-qr-amblemli.png", optimize=True)
os.remove("_b.png")

for f in sorted(os.listdir(OUT)):
    p = os.path.join(OUT, f)
    extra = ""
    if f.endswith(".png"):
        extra = f"  {Image.open(p).size[0]}×{Image.open(p).size[1]}px"
    print(f"  {f:24} {os.path.getsize(p)/1024:8.1f} KB{extra}")
