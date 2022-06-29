FROM node:12
WORKDIR /app
COPY package.json /app
RUN apt-get update && apt-get install -y ffmpeg
RUN npm install
COPY . /app
CMD node .