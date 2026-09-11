import pymysql

conn = pymysql.connect(host='localhost', user='root', password='123456', database='art_flair', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)
with conn.cursor() as cur:
    cur.execute("SELECT product_id, product_name, category_id, product_image FROM products LIMIT 10;")
    rows = cur.fetchall()
    print("Sample 10 product_image records:")
    for r in rows:
        print(f"  {r['product_id']}: {r['product_name']} -> '{r['product_image']}'")
conn.close()
