# Node 22 LTS
FROM node:22-alpine

# Çalışma dizini
WORKDIR /app

# package.json ve package-lock.json kopyala
COPY package.json package-lock.json ./

# Bağımlılıkları yükle
RUN npm install

# Tüm dosyaları kopyala
COPY . .

# Build
RUN npm run build

# Serve için tini + npm serve gibi basit bir server
RUN npm install -g serve

# Build dizinini serve et
CMD ["serve", "-s", "dist", "-l", "3000"]

EXPOSE 3000
