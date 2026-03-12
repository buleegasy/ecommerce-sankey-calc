import json
import random
import time
import psycopg2
from faker import Faker
from cogs_service import get_realtime_cogs

fake = Faker()

# Database Connection Config
DB_CONFIG = {
    "dbname": "bi_analytics",
    "user": "bi_admin",
    "password": "bi_password_2026",
    "host": "localhost",
    "port": "5432"
}

def inject_order(order_data):
    """
    Injects a calculated order into the raw_orders table.
    """
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Calculate Costs & Fees
        gross_revenue = order_data['gross_revenue']
        cogs = get_realtime_cogs(order_data['product_id'], gross_revenue)
        
        # Mock Fees
        shipping_cost = random.uniform(5, 12)
        transaction_fee = gross_revenue * 0.035 # 3.5% Stripe Fee
        returns_reserve = gross_revenue * 0.05   # 5% Reserve
        
        query = """
        INSERT INTO raw_orders (
            order_id, platform, gross_revenue, cogs, shipping_cost, transaction_fee, returns_reserve
        ) VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (order_id) DO NOTHING;
        """
        
        cur.execute(query, (
            order_data['order_id'],
            order_data['platform'],
            gross_revenue,
            cogs,
            shipping_cost,
            transaction_fee,
            returns_reserve
        ))
        
        conn.commit()
        print(f"✅ Injected Order {order_data['order_id']}: Rev ${gross_revenue}, COGS ${cogs:.2f}")
        
    except Exception as e:
        print(f"❌ Error injecting order: {e}")
    finally:
        if conn:
            cur.close()
            conn.close()

def simulate_webhook():
    """
    Simulates Shopify Webhook delivery.
    """
    print("🚀 Starting Webhook Simulator...")
    
    platforms = ['Shopify', 'WooCommerce', 'Amazon']
    products = ['AI_SOFTWARE', 'LEATHER_JACKET', 'SMART_WATCH', 'COFFEE_MAKER']
    
    while True:
        order_payload = {
            "order_id": f"ORD-{fake.unique.random_number(digits=8)}",
            "platform": random.choice(platforms),
            "product_id": random.choice(products),
            "gross_revenue": random.uniform(20, 200),
        }
        
        inject_order(order_payload)
        time.sleep(random.uniform(2, 5)) # Simulate delay between orders

if __name__ == "__main__":
    simulate_webhook()
