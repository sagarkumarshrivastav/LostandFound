
"use client"; // Add this directive

import { useState, useEffect } from 'react';

export default function TermsPage() {
 const [lastUpdatedDate, setLastUpdatedDate] = useState('');

  useEffect(() => {
    // Set the date only on the client side after hydration
    setLastUpdatedDate(new Date().toLocaleDateString());
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 prose dark:prose-invert max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">Terms of Service</h1>
       {lastUpdatedDate && ( // Render only when date is set
        <p className="text-sm text-muted-foreground mb-8">Last updated: {lastUpdatedDate}</p>
       )}

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using the FindIt Local platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        FindIt Local provides a platform for users to report lost items and search for found items within their local community. The Service includes features for posting item details, searching listings, and communicating with other users regarding listed items.
      </p>

      <h2>3. User Accounts</h2>
      <p>
        To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for any activities or actions under your account. FindIt Local cannot and will not be liable for any loss or damage arising from your failure to comply with this security obligation.
      </p>

      <h2>4. User Conduct</h2>
      <p>You agree not to use the Service to:</p>
      <ul>
        <li>Post any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable.</li>
        <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
        <li>Post any unsolicited or unauthorized advertising, promotional materials, "junk mail," "spam," "chain letters," "pyramid schemes," or any other form of solicitation.</li>
        <li>Post any content that infringes any patent, trademark, trade secret, copyright, or other proprietary rights of any party.</li>
        <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
        <li>Attempt to gain unauthorized access to the Service, other accounts, computer systems, or networks connected to the Service.</li>
      </ul>
        <p>FindIt Local reserves the right to remove content and terminate accounts for users who violate these terms.</p>


      <h2>5. Content Ownership and Responsibility</h2>
      <p>
        You retain ownership of the content you post on the Service (text, images, etc.). However, by posting content, you grant FindIt Local a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute your content in connection with operating and promoting the Service. You are solely responsible for the content you post and the consequences of posting it.
      </p>

       <h2>6. Item Recovery and Disputes</h2>
        <p>
            FindIt Local acts solely as a platform to facilitate connections between users regarding lost and found items. We are not involved in the actual exchange or verification of items. We do not guarantee the return of any lost item or the authenticity of any found item listing. Any disputes regarding ownership or the condition of an item must be resolved directly between the users involved. FindIt Local is not responsible for any loss, theft, damage, or disputes arising from interactions facilitated by the Service. Users are encouraged to exercise caution and good judgment when arranging to meet or exchange items.
        </p>

      <h2>7. Disclaimers</h2>
      <p>
        The Service is provided on an "AS IS" and "AS AVAILABLE" basis. FindIt Local expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. FindIt Local makes no warranty that the Service will meet your requirements, be uninterrupted, timely, secure, or error-free.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        You expressly understand and agree that FindIt Local shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses (even if FindIt Local has been advised of the possibility of such damages), resulting from the use or the inability to use the Service.
      </p>

      <h2>9. Modifications to Terms</h2>
      <p>
        FindIt Local reserves the right, at its sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These Terms shall be governed and construed in accordance with the laws of [Your State/Country, e.g., California, United States], without regard to its conflict of law provisions.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about these Terms, please <a href="/contact" className="text-primary hover:underline">contact us</a>.
      </p>
    </div>
  );
}
