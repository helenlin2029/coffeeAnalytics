from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

all_orders = []

@app.route('/api/checkout', methods=['POST'])
def handle_checkout():
    data = request.json
    # We look for 'order_items' because that is what JS is sending
    items = data.get('order_items', [])
    
    new_order = {
        "items": items,
        "timestamp": datetime.now(),
        "hour": datetime.now().hour
    }
    
    all_orders.append(new_order)
    print(f"Order Received! Total: {len(all_orders)}")
    return jsonify({"status": "success"}), 200

@app.route('/api/stats', methods=['GET'])
def get_stats():
    total_revenue = 0
    item_counts = {}
    hourly_traffic = {}

    for order in all_orders:
        try:
            for item in order['items']:
                # The 'KeyError' happened here. 
                # .get('name') returns 'Unknown' instead of crashing if 'name' is missing
                name = item.get('name', 'Unknown')
                price = item.get('price', 0)
                qty = item.get('quantity', 1)

                total_revenue += (price * qty)
                item_counts[name] = item_counts.get(name, 0) + qty
            
            h = order['hour']
            hourly_traffic[h] = hourly_traffic.get(h, 0) + 1
        except Exception as e:
            print(f"Skipping a bad order record: {e}")

    sorted_popularity = sorted(item_counts.items(), key=lambda x: x[1], reverse=True)

    return jsonify({
        "total_revenue": round(total_revenue, 2),
        "popularity": sorted_popularity,
        "busiest_hour": max(hourly_traffic, key=hourly_traffic.get) if hourly_traffic else "No data"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)