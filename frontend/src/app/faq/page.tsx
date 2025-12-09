'use client';

import { useState } from 'react';
import { FiHelpCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How long does delivery take?',
    answer: 'Delivery usually takes 3–4 business days depending on your location in Egypt.',
  },
  {
    question: 'Do you offer Cash on Delivery?',
    answer: 'Yes — Cash on Delivery is available across Egypt.',
  },
  {
    question: 'How can I track my order?',
    answer: 'You will receive a tracking link via SMS or email as soon as your order ships.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept Cash on Delivery and Wallet payments (InstaPay).',
  },
  {
    question: 'Can I cancel my order?',
    answer: 'Orders can be canceled before they are shipped. Once shipped, cancellation is no longer possible, but you may request a return after delivery.',
  },
  {
    question: 'What if I receive a defective product?',
    answer: 'If the item is damaged or defective, contact us within 48 hours and we will replace it at no extra cost.',
  },
  {
    question: 'Do you restock sold-out items?',
    answer: 'Yes — popular products are restocked regularly. Follow us on our social channels for updates.',
  },
  {
    question: 'What is your return policy for first-time orders?',
    answer: 'For first-time orders, you can inspect the bag with the courier. However, once the courier leaves, no refunds are available.',
  },
  {
    question: 'What about returns for repeat customers?',
    answer: 'For second-time orders and beyond, we accept returns within 2 days if the item is unused, in original packaging, and with all tags included.',
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can reach us at valoria.eg@gmail.com or call us at +20 111 024 1005. Our team is available Saturday to Thursday, 10 AM – 10 PM Cairo Time.',
  },
];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full py-5 flex items-center justify-between text-left hover:text-primary-600 transition-colors"
        onClick={onToggle}
      >
        <span className="font-semibold pr-4">{item.question}</span>
        {isOpen ? (
          <FiChevronUp className="text-primary-600 flex-shrink-0" />
        ) : (
          <FiChevronDown className="text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-5 text-gray-600 animate-fadeIn">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiHelpCircle className="text-3xl text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600">
            Find answers to common questions about Valoria
          </p>
        </div>

        {/* FAQ List */}
        <div className="card">
          {faqs.map((faq, index) => (
            <FAQAccordion
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Can&apos;t find the answer you&apos;re looking for? Our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:valoria.eg@gmail.com" 
              className="btn-primary inline-block"
            >
              Email Us
            </a>
            <a 
              href="/contact" 
              className="btn-secondary inline-block"
            >
              Contact Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
