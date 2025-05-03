
"use client"; // Add this directive

import { useState, useEffect } from 'react';

export default function PrivacyPolicyPage() {
  const [lastUpdatedDate, setLastUpdatedDate] = useState('');

  useEffect(() => {
    // Set the date only on the client side after hydration
    setLastUpdatedDate(new Date().toLocaleDateString());
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 prose dark:prose-invert max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">Privacy Policy</h1>
      {lastUpdatedDate && ( // Render only when date is set
        <p className="text-sm text-muted-foreground mb-8">Last updated: {lastUpdatedDate}</p>
      )}

      <p>
        Lost & Found ("us", "we", or "our") operates the Lost & Found website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
      </p>

      <h2>1. Information Collection and Use</h2>
      <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>

      <h3>Types of Data Collected</h3>
      <h4>Personal Data</h4>
      <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
      <ul>
        <li>Email address</li>
        <li>First name and last name (optional, if provided)</li>
        <li>Phone number (optional, for account recovery or specific features)</li>
        <li>Usage Data</li>
        <li>Cookies</li>
      </ul>
       <p>If you choose to log in using Google OAuth, we will receive certain profile information from Google, such as your name and email address, as permitted by your Google account settings.</p>

      <h4>Usage Data</h4>
      <p>
        We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
      </p>

      <h4>Item Report Data</h4>
        <p>When you report a lost or found item, you provide information such as:</p>
         <ul>
            <li>Item title and description</li>
            <li>Approximate location where the item was lost or found</li>
            <li>Date the item was lost or found</li>
            <li>Optional images of the item</li>
         </ul>
         <p>This information is necessary to facilitate the purpose of the Service and may be publicly visible.</p>


      <h4>Tracking & Cookies Data</h4>
      <p>
        We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
      </p>

      <h2>2. Use of Data</h2>
      <p>Lost & Found uses the collected data for various purposes:</p>
      <ul>
        <li>To provide and maintain the Service</li>
        <li>To allow you to participate in interactive features of our Service when you choose to do so (e.g., messaging)</li>
        <li>To manage your account and provide user support</li>
        <li>To monitor the usage of the Service</li>
        <li>To detect, prevent, and address technical issues</li>
        <li>To facilitate communication between users regarding lost and found items</li>
      </ul>

      <h2>3. Data Storage and Security</h2>
       <p>
          Your information, including Personal Data related to your account and item reports, is stored securely. We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. We primarily use Firebase Authentication and Firestore (or potentially a local MongoDB instance during development) for data storage, which employ industry-standard security practices. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
       </p>

      <h2>4. Disclosure of Data</h2>
       <p>We may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
        <ul>
            <li>Comply with a legal obligation</li>
            <li>Protect and defend the rights or property of Lost & Found</li>
            <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
            <li>Protect the personal safety of users of the Service or the public</li>
            <li>Protect against legal liability</li>
        </ul>
        <p>Information you include in your public item reports (title, description, general location, date, image) will be visible to other users of the Service.</p>


      <h2>5. Third-Party Services</h2>
      <p>
        We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), provide the Service on our behalf, perform Service-related services, or assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose. (e.g., Firebase for Authentication, potentially map services).
      </p>

      <h2>6. Your Data Protection Rights</h2>
      <p>
        Depending on your location, you may have certain data protection rights. Lost & Found aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data. You can usually manage your account information through your dashboard settings. If you wish to be informed about what Personal Data we hold about you and if you want it to be removed from our systems, please contact us.
      </p>

      <h2>7. Children's Privacy</h2>
      <p>
        Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Child has provided us with Personal Data, please contact us.
      </p>

      <h2>8. Changes to This Privacy Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please <a href="/contact" className="text-primary hover:underline">contact us</a>.
      </p>
    </div>
  );
}
