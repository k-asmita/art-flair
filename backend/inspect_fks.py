import pymysql

conn = pymysql.connect(host='localhost', user='root', password='123456', database='art_flair', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    cur.execute("""
        SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = 'art_flair' AND REFERENCED_TABLE_NAME IS NOT NULL;
    """)
    fks = cur.fetchall()
    print("=== FOREIGN KEYS IN art_flair DATABASE ===")
    for fk in fks:
        print(f"  {fk['TABLE_NAME']}.{fk['COLUMN_NAME']} -> {fk['REFERENCED_TABLE_NAME']}.{fk['REFERENCED_COLUMN_NAME']}")
conn.close()
