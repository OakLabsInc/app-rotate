FROM oaklabs/oak:6.0.1

WORKDIR /app
COPY . /app


RUN npm i --progress=false --loglevel="error" \
    && npm cache clean --force

CMD ["/app/src/server.js"]