'use client';

import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageCircle } from 'react-icons/fi';
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
      details: 'support@valoria.com',
      subDetails: 'We reply within 24 hours',
    },
    {
      icon: FiPhone,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      subDetails: 'Mon-Fri, 9am-6pm EST',
    },
    {
      icon: FiMapPin,
      title: 'Address',
      details: '123 Fashion Street',
      subDetails: 'New York, NY 10001',
    },
    {
      icon: FiClock,
      title: 'Business Hours',
      details: 'Monday - Friday',
      subDetails: '9:00 AM - 6:00 PM EST',
    },
  ];

  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy on all unworn items with original tags attached. Simply contact us to initiate a return.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available for an additional fee.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes! We ship to over 50 countries worldwide. International shipping times vary by location.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive an email with tracking information. You can also track your order in your account.',
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Contact Form & Map */}
      <section className="container-custom mb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
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

          {/* Map / Store Image */}
          <div className="card p-0 overflow-hidden">
            <div className="h-full min-h-[400px] relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304903!3d40.69766374859258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1702138800000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
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
