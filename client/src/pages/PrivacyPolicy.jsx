import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-3">Your privacy matters to us. This policy explains how we collect, use, and protect your personal information.</p>

      <h2 className="text-lg font-semibold mt-4">Information we collect</h2>
      <ul className="list-disc list-inside">
        <li>Account and profile information you provide (name, email, address).</li>
        <li>Order history and purchase details.</li>
        <li>Usage data collected automatically (e.g. pages visited).</li>
      </ul>

      <h2 className="text-lg font-semibold mt-4">How we use information</h2>
      <p>We use data to process orders, improve the service, send important updates and for fraud prevention. We do not sell your personal information to third parties.</p>
    </div>
  );
};

export default PrivacyPolicy;
