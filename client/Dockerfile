FROM node:14
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build
ENTRYPOINT ["npm"]
CMD ["start"]