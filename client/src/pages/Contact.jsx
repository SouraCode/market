import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Client-side only: show a thank-you message. For production, wire to an API or email service.
    setStatus('Thank you — we received your message. We will get back to you shortly.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>

      <p className="mb-4">Have questions? Send us a message using the form below or email us at <a href="mailto:support@example.com" className="text-green-600">support@example.com</a>.</p>

      {status && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded">{status}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea name="message" value={form.message} onChange={handleChange} rows={5} className="mt-1 block w-full border-gray-300 rounded-md"></textarea>
        </div>

        <div>
          <button type="submit" className="btn-primary">Send Message</button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
