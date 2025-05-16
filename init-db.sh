#!/bin/bash

# Load environment variables
source /root/vitasync-telegram-webapp/.env

# Create database and user
sudo -u postgres createdb vitasync_db
sudo -u postgres psql -c "CREATE USER vitasync WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE vitasync_db TO vitasync;"
sudo -u postgres psql -c "ALTER DATABASE vitasync_db OWNER TO vitasync;"

echo "Database setup completed!"