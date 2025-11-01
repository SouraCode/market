import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Refund Policy</h1>
      <p className="mb-3">We process refunds as quickly as possible. Once your return is received and inspected, we'll notify you of the approval or rejection of your refund.</p>

      <h2 className="text-lg font-semibold mt-4">Refund timeline</h2>
      <p>Approved refunds will be processed within 7-10 business days. The time it takes for the refund to reflect in your account depends on your original payment method and bank.</p>

      <h2 className="text-lg font-semibold mt-4">Partial refunds</h2>
      <p>In some cases, only partial refunds are granted (e.g., items not in original condition, missing parts, or items returned past the allowed days).</p>
    </div>
  );
};

export default RefundPolicy;
