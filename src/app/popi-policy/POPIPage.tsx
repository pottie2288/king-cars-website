export function POPIPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-king-blue section-padding pt-36 pb-16 text-center">
        <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-4">
          POPI <span className="text-king-blue">Policy</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Protection of Personal Information Act (POPIA) — how King Cars collects,
          uses, and protects your personal information.
        </p>
        <p className="text-gray-500 text-sm mt-4">Last updated: June 2026</p>
      </section>

      {/* Content */}
      <div className="section-padding py-16 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 space-y-10 text-gray-700 leading-relaxed">

          <Section title="1. Introduction">
            <p>
              King Cars (&ldquo;King Cars&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting
              your privacy and ensuring the lawful processing of your personal information in
              accordance with the Protection of Personal Information Act 4 of 2013 (&ldquo;POPIA&rdquo;).
            </p>
            <p className="mt-3">
              This policy explains what personal information we collect, why we collect it,
              how we use and protect it, and what rights you have as a data subject.
            </p>
          </Section>

          <Section title="2. Who We Are">
            <p>
              King Cars is a partnership that operates a group of licensed used motor vehicle
              dealerships (the &ldquo;King Cars Group&rdquo;), with branches across the Western Cape and
              Eastern Cape provinces of South Africa. We are registered as a Financial Services
              Provider (FSP Licence No. 10220). As a partnership conducting business in South
              Africa, King Cars is a &ldquo;private body&rdquo; for the purposes of POPIA and acts as the
              Responsible Party in respect of the personal information we process.
            </p>
            <div className="mt-4 bg-gray-50 rounded-xl p-4 text-sm space-y-1">
              <p><strong>Information Officer:</strong> Pierre Potgieter</p>
              <p><strong>Email:</strong> <a href="mailto:info@kingcars.co.za" className="text-king-blue hover:underline">info@kingcars.co.za</a></p>
              <p><strong>Phone:</strong> <a href="tel:0835008181" className="text-king-blue hover:underline">083 500 8181</a></p>
              <p><strong>Address:</strong> 25 Strand Rd, Bellville, Cape Town, 7530</p>
            </div>
          </Section>

          <Section title="3. Personal Information We Collect">
            <p>We may collect the following categories of personal information:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Identity information:</strong> Full name, ID number, date of birth</li>
              <li><strong>Contact information:</strong> Phone number, email address, physical address</li>
              <li><strong>Financial information:</strong> Income details, credit history (for finance applications only)</li>
              <li><strong>Vehicle information:</strong> Details about vehicles you wish to buy, sell, or trade in</li>
              <li><strong>Communication records:</strong> Records of enquiries and correspondence with us</li>
              <li><strong>Website usage data:</strong> IP address, browser type, pages visited (via analytics tools)</li>
            </ul>
          </Section>

          <Section title="4. Why We Collect Your Personal Information">
            <p>We collect and process your personal information for the following purposes:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Processing vehicle purchase, sale, or trade-in transactions</li>
              <li>Facilitating vehicle finance applications through our banking partners</li>
              <li>Responding to enquiries submitted through our website or in-branch</li>
              <li>Providing after-sales support and warranty services</li>
              <li>Sending relevant marketing communications (only with your consent)</li>
              <li>Complying with legal and regulatory obligations</li>
              <li>Improving the functionality and user experience of our website</li>
            </ul>
          </Section>

          <Section title="5. Legal Basis for Processing">
            <p>We process your personal information on the following lawful grounds:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Contract:</strong> Processing is necessary to fulfil a transaction you have entered into</li>
              <li><strong>Legal obligation:</strong> We are required by law to retain certain records</li>
              <li><strong>Legitimate interest:</strong> Processing is necessary for our legitimate business operations</li>
              <li><strong>Consent:</strong> Where you have provided explicit consent (e.g. marketing communications)</li>
            </ul>
          </Section>

          <Section title="6. Sharing of Personal Information">
            <p>We do not sell your personal information. We may share it with:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Finance providers:</strong> ABSA, Standard Bank, FNB, Nedbank, Capitec, WesBank — solely for finance application processing</li>
              <li><strong>VMG Software:</strong> Our inventory management system provider, who processes vehicle and deal data on our behalf</li>
              <li><strong>Regulatory authorities:</strong> Where required by law (e.g. SARS, the FIC)</li>
              <li><strong>Professional advisors:</strong> Lawyers, auditors, and insurers under strict confidentiality obligations</li>
            </ul>
            <p className="mt-3">
              All third parties are required to handle your information in accordance with POPIA
              and our data processing agreements.
            </p>
          </Section>

          <Section title="7. How We Protect Your Information">
            <p>
              We implement appropriate technical and organisational measures to protect your
              personal information against unauthorised access, disclosure, alteration, or
              destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Secure HTTPS encryption on our website</li>
              <li>Access controls limiting who within our organisation can view personal data</li>
              <li>Regular staff training on data protection obligations</li>
              <li>Secure physical storage of paper-based records</li>
            </ul>
          </Section>

          <Section title="8. Retention of Information">
            <p>
              We retain your personal information only for as long as necessary to fulfil the
              purposes for which it was collected, or as required by applicable law. Vehicle
              transaction records are typically retained for a minimum of five (5) years in
              accordance with financial and tax legislation. After this period, records are
              securely destroyed.
            </p>
          </Section>

          <Section title="9. Your Rights as a Data Subject">
            <p>Under POPIA, you have the right to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request that inaccurate or outdated information be corrected</li>
              <li><strong>Deletion:</strong> Request deletion of your information, subject to legal retention requirements</li>
              <li><strong>Objection:</strong> Object to the processing of your information for marketing purposes</li>
              <li><strong>Withdrawal of consent:</strong> Withdraw consent at any time where processing is based on consent</li>
              <li><strong>Complaint:</strong> Lodge a complaint with the Information Regulator of South Africa</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact our Information Officer at{' '}
              <a href="mailto:info@kingcars.co.za" className="text-king-blue hover:underline">info@kingcars.co.za</a>.
              We will respond within 30 days of receiving your request.
            </p>
          </Section>

          <Section title="10. Cookies and Website Analytics">
            <p>
              Our website uses Google Analytics (GA4) to understand how visitors interact with
              our site. This involves the collection of anonymised usage data such as pages
              visited, time on site, and device type. This data does not identify you personally.
              You may opt out of analytics tracking by enabling &ldquo;Do Not Track&rdquo; in your browser
              settings or installing the Google Analytics Opt-out Browser Add-on.
            </p>
          </Section>

          <Section title="11. Information Regulator">
            <p>
              You have the right to lodge a complaint with the Information Regulator of South
              Africa if you believe your personal information has been processed in violation of POPIA:
            </p>
            <div className="mt-3 bg-gray-50 rounded-xl p-4 text-sm space-y-1">
              <p><strong>Information Regulator (South Africa)</strong></p>
              <p>Website: <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-king-blue hover:underline">inforegulator.org.za</a></p>
              <p>Email: <a href="mailto:inforeg@justice.gov.za" className="text-king-blue hover:underline">inforeg@justice.gov.za</a></p>
            </div>
          </Section>

          <Section title="12. Changes to This Policy">
            <p>
              We may update this policy from time to time to reflect changes in our practices
              or legal requirements. The &ldquo;last updated&rdquo; date at the top of this page indicates
              when the most recent revision was made. We encourage you to review this policy
              periodically.
            </p>
          </Section>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display font-bold text-xl sm:text-2xl text-gray-900 mb-3 pb-2 border-b border-gray-100">
        {title}
      </h2>
      <div className="text-gray-600 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}
