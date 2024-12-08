FROM node:18
WORKDIR /app

# Устанавливаем зависимости
COPY package.json package-lock.json ./
RUN npm install

# Копируем файлы проекта
COPY . .
  
# Порт для сервера
EXPOSE 5000
   
# Запуск сервера
CMD ["node", "app.js"]