'use client';

import { useState } from 'react';
import { FiMail, FiPhone, FiClock, FiSend, FiMessageCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending message
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email',
      details: 'valoria.eg@gmail.com',
      subDetails: 'We reply within 24 hours',
    },
    {
      icon: FiPhone,
      title: 'Phone / WhatsApp',
      details: '+20 111 024 1005',
      subDetails: 'Available daily',
    },
    {
      icon: FiClock,
      title: 'Business Hours',
      details: 'Saturday - Thursday',
      subDetails: '10:00 AM - 10:00 PM Cairo Time',
    },
  ];

  const faqs = [
    {
      question: 'What is your return/refund policy?',
      answer: 'For first-time orders, we provide a checkup of the bag with the courier in front of you. Once the courier leaves, no refund is available. For second-time customers, we offer a 48-hour refund window.',
    },
    {
      question: 'Do you offer any discounts?',
      answer: 'Yes! On your second order with us, you will receive a 20% discount on all products as a loyal customer reward.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Cash on Delivery (COD) and InstaPay wallet transfers only. We do not accept Visa or Mastercard.',
    },
    {
      question: 'Where do you ship?',
      answer: 'We currently ship within Egypt only. All prices are in Egyptian Pounds (EGP).',
    },
    {
      question: 'Are your bags authentic?',
      answer: 'We sell imported bags from famous brands including Coach, Michael Kors, and Chanel.',
    },
  ];

  return (
    <div className="py-12">
      {/* Header */}
      <section className="container-custom mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Have a question or need assistance? We're here to help! 
            Reach out to us through any of the channels below.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="container-custom mb-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {contactInfo.map((info, index) => (
            <div key={index} className="card text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-full mb-4">
                <info.icon size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-1">{info.title}</h3>
              <p className="text-gray-800">{info.details}</p>
              <p className="text-sm text-gray-500">{info.subDetails}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="container-custom mb-16">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <FiMessageCircle className="text-primary-600" size={28} />
              <h2 className="text-2xl font-bold">Send Us a Message</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Question</option>
                  <option value="return">Returns & Exchanges</option>
                  <option value="product">Product Information</option>
                  <option value="wholesale">Wholesale Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-field min-h-[150px]"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <FiSend />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Can't find what you're looking for?{' '}
              <a href="mailto:support@valoria.com" className="text-primary-600 hover:text-primary-700 font-medium">
                Email us directly
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
