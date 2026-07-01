#!/bin/bash
# Kumsal web sitesini baslatir:
# 1) fotograflar klasorunu tarar ve listeyi gunceller
# 2) yerel bir sunucu baslatir
# 3) tarayicida acar

cd "$(dirname "$0")" || exit 1

echo "🐚 Kumsal sitesi hazirlaniyor..."

# --- Fotograf ve video listesini olustur ---
python3 - <<'PYEOF'
import os, json

def tara(klasor, uzantilar):
    bulunan = []
    if os.path.isdir(klasor):
        for f in sorted(os.listdir(klasor)):
            if f.lower().endswith(uzantilar):
                bulunan.append(f)
    return bulunan

fotolar = tara("fotograflar", (".jpg", ".jpeg", ".png", ".webp", ".gif"))
videolar = tara("videolar", (".mp4", ".webm", ".mov", ".ogg"))

icerik = (
    "// Bu dosya otomatik olusturulur.\n"
    "window.KUMSAL_FOTOLAR = " + json.dumps(fotolar, ensure_ascii=False) + ";\n"
    "window.KUMSAL_VIDEOLAR = " + json.dumps(videolar, ensure_ascii=False) + ";\n"
)
with open(os.path.join("fotograflar", "liste.js"), "w", encoding="utf-8") as fh:
    fh.write(icerik)
print(f"✅ {len(fotolar)} fotograf, {len(videolar)} video bulundu.")
PYEOF

# --- Sunucuyu baslat ---
PORT=8000
while lsof -i :$PORT >/dev/null 2>&1; do
  PORT=$((PORT+1))
done

echo "🌐 Site aciliyor:  http://localhost:$PORT"
echo "   (Kapatmak icin bu pencerede Control + C'ye bas)"

# Tarayiciyi 1 saniye sonra ac
( sleep 1 && open "http://localhost:$PORT" ) &

python3 -m http.server $PORT
