FROM node:20-alpine

# Встановлюємо openssl
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

# Копіюємо схему
COPY prisma ./prisma/

# Тепер Prisma сама знатиме, що їй білдити завдяки змінам у schema.prisma
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]