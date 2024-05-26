FROM node:18

EXPOSE 3000
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build
CMD ["npm", "start"]
