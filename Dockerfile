FROM node:latest
WORKDIR /dash
COPY . .
RUN yarn install --productive
WORKDIR "/dash/Proxy"
RUN yarn install
WORKDIR "/dash/QueryService"
RUN yarn install --productive
WORKDIR "/dash/UI5app"
RUN yarn install --productive
RUN yarn run build
WORKDIR "/dash"
CMD ["node", "/dash/index.js"]
