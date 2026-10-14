import React from "react";
import LegalLayout, { Section, SUPPORT_EMAIL } from "../components/common/LegalLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p className="text-sm leading-relaxed text-muted-foreground mb-8">
        ShutterSync (&quot;we&quot;, &quot;us&quot;) provides a business
        management app for photographers, available on the web and as an
        Android app. This policy explains what information we collect, how we
        use it, and the choices you have.
      </p>

      <Section id="collect" title="Information we collect">
        <p>
          <strong className="text-foreground">Account information.</strong> Your
          name, email address, and password (stored hashed, never in plain
          text). If you sign in with Google, we receive your name, email address
          and profile picture from Google.
        </p>
        <p>
          <strong className="text-foreground">Profile information you add.</strong>{" "}
          Phone number, UPI ID, address, bio, username, social media links,
          website, profile photo, brand logo, cover image and portfolio photos.
          Parts of your profile are shown publicly if you share your public
          profile link.
        </p>
        <p>
          <strong className="text-foreground">Business records you create.</strong>{" "}
          Assignments, freelance jobs, service packages, agreements and
          payments, which can include your clients&apos; names, contact details,
          event details and payment amounts. You are responsible for having the
          right to store your clients&apos; information in the app.
        </p>
        <p>
          <strong className="text-foreground">Technical information.</strong>{" "}
          Basic data needed to run the service, such as sign-in session tokens
          and server logs.
        </p>
      </Section>

      <Section id="use" title="How we use your information">
        <ul className="list-disc pl-5 space-y-1">
          <li>To create and secure your account and sign you in.</li>
          <li>To provide the app features: assignments, packages, agreements, payments, PDFs and your public profile.</li>
          <li>To send emails about your account, such as a welcome email and password reset codes.</li>
          <li>To maintain, secure and improve the service.</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </Section>

      <Section id="sharing" title="Who we share information with">
        <p>
          We use service providers to run ShutterSync. They process data only to
          provide their service to us:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Convex, for our database, file storage and backend.</li>
          <li>Google, for optional Google sign-in and for sending account emails through Gmail.</li>
          <li>Netlify, for hosting the web app.</li>
        </ul>
        <p>
          Information you choose to publish on your public profile or share with
          a client through a link is visible to anyone with that link. We may
          also disclose information if required by law.
        </p>
      </Section>

      <Section id="retention" title="Data retention">
        <p>
          We keep your information while your account is active. When you ask us
          to delete your account, we delete your account and the records linked
          to it, except where we must keep something to meet a legal
          obligation.
        </p>
      </Section>

      <Section id="delete-account" title="Deleting your account and data">
        <p>
          You can request deletion of your account and associated data at any
          time by emailing{" "}
          <a className="text-primary underline" href={`mailto:${SUPPORT_EMAIL}?subject=ShutterSync%20account%20deletion`}>
            {SUPPORT_EMAIL}
          </a>{" "}
          from the email address registered to your account, with the subject
          &quot;ShutterSync account deletion&quot;. We will confirm and complete
          the deletion within 30 days. You can also edit or remove most profile
          information directly in the app.
        </p>
      </Section>

      <Section id="security" title="Security">
        <p>
          We use encrypted connections (HTTPS) and hashed passwords, and limit
          access to your data to your account. No method of transmission or
          storage is completely secure, so we cannot guarantee absolute
          security.
        </p>
      </Section>

      <Section id="children" title="Children">
        <p>
          ShutterSync is intended for adults running a photography business and
          is not directed at children under 13. We do not knowingly collect
          information from children.
        </p>
      </Section>

      <Section id="rights" title="Your choices">
        <p>
          You can access and update your profile information in the app. To
          request a copy of your data, a correction, or deletion, contact us at
          the email below.
        </p>
      </Section>

      <Section id="changes" title="Changes to this policy">
        <p>
          We may update this policy from time to time. The &quot;Last
          updated&quot; date above shows when it last changed.
        </p>
      </Section>

      <Section id="contact" title="Contact us">
        <p>
          Questions about this policy? Email{" "}
          <a className="text-primary underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  );
}
