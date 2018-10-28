FROM oaklabs/oak:4.3.4

WORKDIR /app
COPY . /app


RUN npm i --engine-strict=true --progress=false --loglevel="error" \
    && npm cache clean --force

CMD ["/app"]

ENV NODE_ENV=production 

EXPOSE 9999