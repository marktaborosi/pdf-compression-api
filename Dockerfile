FROM node:18-slim

RUN apt-get update && \
    apt-get install -y ghostscript cron && \
    apt-get clean

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

# Ensure binaries like jest, ts-node are in PATH
ENV PATH="./node_modules/.bin:$PATH"

COPY . .

# Ensure uploads folder exists
RUN mkdir -p /app/uploads

# Add crontab entry
RUN echo "0 0 */5 * * /app/cleanup.sh >> /var/log/cleanup.log 2>&1" > /etc/cron.d/cleanup-cron
RUN chmod 0644 /etc/cron.d/cleanup-cron && crontab /etc/cron.d/cleanup-cron
RUN touch /var/log/cleanup.log

EXPOSE 3000

CMD cron && npm start