import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
          <p className="text-gray-600">
            By accessing or using Medi-Project's website, you agree to be bound by these Terms of
            Service. If you disagree with any part of these terms, you may not access the website
            or use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Use License</h2>
          <div className="text-gray-600 space-y-4">
            <p>
              Permission is granted to temporarily access the materials (information or software) on
              Medi-Project's website for personal, non-commercial transitory viewing only.
            </p>
            <p>This license shall automatically terminate if you violate any of these restrictions and
              may be terminated by Medi-Project at any time.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Product Information</h2>
          <div className="text-gray-600 space-y-4">
            <p>
              We strive to provide accurate product information, including descriptions, pricing,
              and availability. However, we do not warrant that product descriptions or other
              content is accurate, complete, reliable, current, or error-free.
            </p>
            <p>
              Prices for our products are subject to change without notice. We reserve the right
              to modify or discontinue any product without notice.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Ordering and Payment</h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>You must be at least 18 years old to place an order</li>
            <li>You agree to provide current, complete, and accurate purchase information</li>
            <li>We reserve the right to refuse any order</li>
            <li>Payment must be received prior to order fulfillment</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping and Delivery</h2>
          <div className="text-gray-600 space-y-4">
            <p>
              We will make every effort to deliver products within the estimated delivery time.
              However, we are not responsible for delivery delays beyond our control.
            </p>
            <p>
              Risk of loss and title for items purchased pass to you upon delivery of the items
              to the carrier.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Returns and Refunds</h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>Returns must be initiated within 14 days of delivery</li>
            <li>Products must be unused and in original packaging</li>
            <li>Certain items are not eligible for return (e.g., personal care items)</li>
            <li>Refunds will be processed within 5-7 business days</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Disclaimer of Warranties</h2>
          <p className="text-gray-600">
            The materials on Medi-Project's website are provided on an 'as is' basis. Medi-Project
            makes no warranties, expressed or implied, and hereby disclaims and negates all other
            warranties including, without limitation, implied warranties or conditions of
            merchantability, fitness for a particular purpose, or non-infringement of intellectual
            property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
          <p className="text-gray-600">
            In no event shall Medi-Project or its suppliers be liable for any damages (including,
            without limitation, damages for loss of data or profit, or due to business
            interruption) arising out of the use or inability to use the materials on
            Medi-Project's website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
          <p className="text-gray-600">
            These terms and conditions are governed by and construed in accordance with the laws,
            and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
          <p className="text-gray-600">
            We reserve the right to modify these terms at any time. By using this website, you
            agree to be bound by the current version of these Terms of Service.
          </p>
          <p className="text-gray-600 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="text-gray-600">
            Questions about the Terms of Service should be sent to us at:
            <br />
            Email: legal@medi-project.com
            <br />
            Phone: +1 (555) 123-4567
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService; 