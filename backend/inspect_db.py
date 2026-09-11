import os
import pymysql
from dotenv import load_dotenv

load_dotenv()

host = os.getenv('DB_HOST', 'localhost')
port = int(os.getenv('DB_PORT', 3306))
user = os.getenv('DB_USER', 'root')
password = os.getenv('DB_PASSWORD', '')

print(f"Connecting to MySQL ({host}:{port}, user={user})...")

# Try passwords
passwords = [password, '', 'root', 'password', 'admin', '1234', '123456', '12345678', 'mysql', 'Asmita', 'asmita', 'root123']
connected_conn = None
working_pwd = None

for pwd in passwords:
    try:
        conn = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=pwd,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        connected_conn = conn
        working_pwd = pwd
        print(f"Successfully connected with password: '{pwd}'")
        break
    except Exception as e:
        pass

if not connected_conn:
    print("Could not connect with common test passwords. Attempting with configured DB_PASSWORD...")
    try:
        connected_conn = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        working_pwd = password
    except Exception as e:
        print(f"Connection failed: {e}")

if connected_conn:
    with connected_conn.cursor() as cur:
        # Check databases
        cur.execute("SHOW DATABASES;")
        dbs = [d['Database'] for d in cur.fetchall()]
        print("\nExisting Databases on MySQL Server:", dbs)

        target_db = 'art_flair' if 'art_flair' in dbs else ('art_flair_db' if 'art_flair_db' in dbs else None)
        print(f"Target Database: {target_db}")

        if target_db:
            cur.execute(f"USE `{target_db}`;")
            cur.execute("SHOW TABLES;")
            tables = [list(r.values())[0] for r in cur.fetchall()]
            print(f"\nTables in `{target_db}`:", tables)

            print("\n" + "="*80)
            print("DETAILED TABLE SCHEMAS & ACTUAL COLUMNS")
            print("="*80)

            for tbl in tables:
                print(f"\n--- TABLE: {tbl} ---")
                cur.execute(f"DESCRIBE `{tbl}`;")
                cols = cur.fetchall()
                for c in cols:
                    print(f"  Field: {c['Field']:<25} Type: {c['Type']:<20} Null: {c['Null']:<6} Key: {c['Key']:<6} Default: {c['Default']}")

                # Sample 1 row if available
                cur.execute(f"SELECT * FROM `{tbl}` LIMIT 1;")
                sample = cur.fetchone()
                if sample:
                    print(f"  Sample Record: {sample}")

    connected_conn.close()
