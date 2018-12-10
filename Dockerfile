FROM oaklabs/oak:5.0.0-rc0

WORKDIR /app
COPY . /app


RUN npm i --engine-strict=true --progress=false --loglevel="error" \
    && npm cache clean --force

CMD ["/app"]

ENV NODE_ENV=production 

EXPOSE 9999