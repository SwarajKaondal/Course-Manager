from mysql.connector import pooling
import os


config = {
  'user': os.getenv("MYSQL_USER"),
  'password': os.getenv("MYSQL_PASSWORD"),
  'host': os.getenv("MYSQL_HOST"),
  'database': os.getenv("MYSQL_DATABASE"),
  'raise_on_warnings': True
}

connection_pool = pooling.MySQLConnectionPool(pool_name="pool",pool_size=5,**config)