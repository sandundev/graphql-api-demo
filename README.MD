
kill -9 $(lsof -t -i :4000)



export NODE_OPTIONS=--openssl-legacy-provider
npx tsc
node dist/server.js



