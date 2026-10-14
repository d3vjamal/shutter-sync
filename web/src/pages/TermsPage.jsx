import React from "react";
import { Link } from "react-router-dom";
import LegalLayout, { Section, SUPPORT_EMAIL } from "../components/common/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions">
      <p className="text-sm leading-relaxed text-muted-foreground mb-8">
        These terms govern your use of ShutterSync, on the web and on Android.
        By creating an account or using the app, you agree to them. If you do
        not agree, please do not use the service.
      </p>

      <Section id="service" title="The service">
        <p>
          ShutterSync is a tool for photographers to manage assignments,
          freelance jobs, packages, agreements and payment records, and to
          present a public profile. We may change or discontinue features at any
          time.
        </p>
      </Section>

      <Section id="account" title="Your account">
        <ul className="list-disc pl-5 space-y-1">
          <li>You must provide accurate information and be at least 18 years old.</li>
          <li>You are responsible for keeping your password secure and for activity under your account.</li>
          <li>Notify us right away at the support email if you suspect unauthorized access.</li>
        </ul>
      </Section>

      <Section id="content" title="Your content and clients' data">
        <p>
          You own the content you add. You give us permission to store and
          display it as needed to run the service, including on your public
          profile when you choose to share it.
        </p>
        <p>
          You are responsible for the accuracy of your records, for having the
          right to store your clients&apos; information, and for the agreements
          you create with your clients. ShutterSync is a record-keeping tool; it
          does not provide legal advice, and generated agreements are templates
          you should review before relying on them.
        </p>
      </Section>

      <Section id="payments" title="Payments">
        <p>
          ShutterSync records payments and generates receipts, but it does not
          process or hold money between you and your clients. Any payment
          happens outside the app, and disputes are between you and your client.
        </p>
      </Section>

      <Section id="acceptable-use" title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use the service for anything unlawful or to upload content you do not have the right to share.</li>
          <li>Upload harmful, abusive, infringing or misleading content.</li>
          <li>Attempt to break, overload, or gain unauthorized access to the service or other users&apos; data.</li>
          <li>Impersonate another person or business.</li>
        </ul>
        <p>
          We may suspend or remove accounts or content that violate these terms.
        </p>
      </Section>

      <Section id="termination" title="Termination">
        <p>
          You can stop using ShutterSync at any time and request deletion of your
          account as described in the{" "}
          <Link to="/privacy#delete-account" className="text-primary underline">
            Privacy Policy
          </Link>
          . We may suspend or end access if you breach these terms.
        </p>
      </Section>

      <Section id="disclaimer" title="Disclaimer and limitation of liability">
        <p>
          The service is provided &quot;as is&quot; and &quot;as available&quot;
          without warranties of any kind. To the extent permitted by law,
          ShutterSync is not liable for indirect or consequential losses, lost
          profits, or lost data arising from your use of the service, and our
          total liability is limited to the amount you paid us for the service
          in the previous 12 months (which may be zero).
        </p>
      </Section>

      <Section id="privacy" title="Privacy">
        <p>
          Our{" "}
          <Link to="/privacy" className="text-primary underline">
            Privacy Policy
          </Link>{" "}
          explains how we handle your information.
        </p>
      </Section>

      <Section id="changes" title="Changes to these terms">
        <p>
          We may update these terms from time to time. Continuing to use the
          service after a change means you accept the updated terms.
        </p>
      </Section>

      <Section id="contact" title="Contact us">
        <p>
          Questions? Email{" "}
          <a className="text-primary underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  );
}
