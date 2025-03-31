import mysql.connector
import os
from dotenv import load_dotenv
from connect_db import get_connection

load_dotenv()  # Load .env variables

conn = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)

cursor = conn.cursor()
cursor.execute("SHOW TABLES;")
for table in cursor.fetchall():
    print("✅ Found table:", table)

cursor.close()
conn.close()
