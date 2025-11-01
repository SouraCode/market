import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Return Policy</h1>
      <p className="mb-3">We want you to be happy with your purchase. If you are not satisfied, you may return most items within 7 days of delivery for a full refund or exchange, subject to the conditions below.</p>

      <h2 className="text-lg font-semibold mt-4">Conditions for return</h2>
      <ul className="list-disc list-inside">
        <li>Products must be returned in original condition and packaging.</li>
        <li>Perishable goods, opened food items and personal care items cannot be returned for safety reasons.</li>
        <li>Returns must include proof of purchase (order number or invoice).</li>
      </ul>

      <h2 className="text-lg font-semibold mt-4">How to return</h2>
      <p>Contact our support team via the <a href="/contact" className="text-green-600">Contact</a> page with your order details and reason for return. We'll provide the next steps and, where applicable, a return shipping label.</p>
    </div>
  );
};

export default ReturnPolicy;
