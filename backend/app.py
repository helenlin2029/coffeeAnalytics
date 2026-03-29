from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

all_orders = []

@app.route('/api/checkout', methods=['POST'])
def handle_checkout():
    data = request.json
    items = data.get('order_items', [])
    
    new_order = {
        "items": items,
        "timestamp": datetime.now(), 
        "hour": datetime.now().hour
    }
    
    all_orders.append(new_order)
    print(f"Order Received! Total: {len(all_orders)}")
    return jsonify({"status": "success"}), 200


# freq-chart
from flask import jsonify

@app.route('/api/cafe-activity')
def cafe_activity():
    # 1. Define the range: 8 AM (8) to 10 PM (22)
    full_day_range = range(8, 23)
    
    # 2. DECLARE the variable here (This fixes your error!)
    activity_data = {h: 0 for h in full_day_range}
    
    # 3. Populate with actual order data
    # Note: 'all_orders' must be a global list defined at the top of app.py
    for order in all_orders:
        try:
            # Ensure the hour is an integer so it matches the keys in activity_data
            hour = int(order.get('hour', 0))
            if hour in activity_data:
                activity_data[hour] += 1
        except (ValueError, TypeError):
            continue

    # 4. Format labels and values for the frontend
    labels = [f"{h % 12 or 12} {'AM' if h < 12 else 'PM'}" for h in full_day_range]
    values = [activity_data[h] for h in full_day_range]
    
    return jsonify({
    "labels": labels,  # This name MUST be plural
    "values": values   # This name MUST be plural
    })  


@app.route('/api/stats', methods=['GET'])
def get_stats():
    total_revenue = 0
    item_counts = {}
    
    # 1. Add this line here to fix the "undeclared" error!
    hourly_traffic = {h: 0 for h in range(8, 23)} 

    for order in all_orders:
        # Update revenue
        total_revenue += float(order.get('price', 0))
        
        # Update item popularity
        item = order.get('name')
        item_counts[item] = item_counts.get(item, 0) + 1
        
        # 2. Update the hourly traffic (using the local variable)
        try:
            hour = int(order.get('hour'))
            if hour in hourly_traffic:
                hourly_traffic[hour] += 1
        except (TypeError, ValueError):
            continue

    # Sort items by popularity
    sorted_popularity = sorted(item_counts.items(), key=lambda x: x[1], reverse=True)

    return jsonify({
        "total_revenue": round(total_revenue, 2),
        "popularity": sorted_popularity,
        # 3. Use hourly_traffic here instead of activity_data
        "busiest_hour": max(hourly_traffic, key=hourly_traffic.get) if all_orders else "No data"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)




