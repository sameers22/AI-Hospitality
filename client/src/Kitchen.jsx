import { useEffect, useState } from 'react';

function Kitchen({ subdomain }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(`/api/${subdomain}/orders`);
      const data = await res.json();
      setOrders(data);
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [subdomain]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Kitchen Orders</h2>
      {orders.map(order => (
        <div key={order.id} className="border p-2 rounded">
          <div className="font-semibold">Table {order.tableNumber}</div>
          <ul className="list-disc ml-4">
            {order.items.map(item => (
              <li key={item.id}>{item.quantity} x {item.menuItem.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Kitchen;
