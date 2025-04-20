// Save order
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
  
    const order = {
      id: Date.now(),
      name,
      email,
      mobile,
      quantity,
      approved: false
    };
  
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
  
    alert('Order placed successfully! (Email Sent for Admin Approval)');
    this.reset();
    loadOrders();
  });
  
  // Load orders
  function loadOrders() {
    const orderList = document.getElementById('orderList');
    orderList.innerHTML = '';
  
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
  
    orders.forEach(order => {
      const div = document.createElement('div');
      div.className = 'order';
      div.innerHTML = `
        <strong>Name:</strong> ${order.name} <br>
        <strong>Email:</strong> ${order.email} <br>
        <strong>Mobile:</strong> ${order.mobile} <br>
        <strong>Quantity:</strong> ${order.quantity} Liter<br>
        <strong>Status:</strong> ${order.approved ? 'Approved' : 'Pending'}<br>
        ${!order.approved ? `<button onclick="approveOrder(${order.id})">Approve</button>` : ''}
      `;
      orderList.appendChild(div);
    });
  }
  
  // Approve order
  function approveOrder(id) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders = orders.map(order => {
      if (order.id === id) {
        order.approved = true;
        alert(`Order Approved and Email Sent to ${order.email}`);
      }
      return order;
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    loadOrders();
  }
  
  // Monthly Bill Calculation
  function calculateMonthly() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const approvedOrders = orders.filter(order => order.approved);
  
    let customerTotals = {};
  
    approvedOrders.forEach(order => {
      if (!customerTotals[order.email]) {
        customerTotals[order.email] = {
          name: order.name,
          mobile: order.mobile,
          totalLiters: 0,
          totalPrice: 0
        };
      }
      customerTotals[order.email].totalLiters += order.quantity;
      customerTotals[order.email].totalPrice += getPrice(order.quantity);
    });
  
    const monthlyBill = document.getElementById('monthlyBill');
    monthlyBill.innerHTML = '<h3>Monthly Bill Summary:</h3>';
  
    for (const email in customerTotals) {
      const customer = customerTotals[email];
      monthlyBill.innerHTML += `
        <div class="order">
          <strong>Name:</strong> ${customer.name}<br>
          <strong>Mobile:</strong> ${customer.mobile}<br>
          <strong>Email:</strong> ${email}<br>
          <strong>Total Liters:</strong> ${customer.totalLiters}L<br>
          <strong>Total Amount:</strong> ₹${customer.totalPrice}
        </div>
      `;
    }
  }
  
  // Pricing Logic
  function getPrice(quantity) {
    if (quantity === 0.25) return 10;
    if (quantity === 0.5) return 20;
    if (quantity === 0.75) return 30;
    if (quantity === 1) return 40;
    return 0;
  }
  
  // Load orders when page loads
  loadOrders();
  