import colors from "@/constants/colors";
import { getRgbValues } from "@/lib/utils";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface IProps {
  firstName: string;
  lastName: string;
}

export default function TutorAgreementContent({ firstName, lastName }: IProps) {
  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentYear = new Date().toLocaleString("en-US", { year: "numeric" });

  return (
    <View>
      <Text style={styles.paragraph}>
        This INDEPENDENT TUTOR AGREEMENT (this &quot;Agreement&quot;), effective
        as of {currentMonth}, {currentYear} (the &quot;Effective Date&quot;), is
        entered into by and between STL TUTORING SOLUTIONS, LLC, a Missouri
        limited liability company, doing business as ARCH CITY TUTORS (the
        &quot;Company&quot;, &quot;ACT&quot;, &quot;we&quot;, &quot;us&quot;
        and/or &quot;our&quot;) and {firstName} {lastName} (&quot;Provider&quot;
        and/or &quot;you&quot;) (the Company and Provider are each referred to
        individually as a &quot;Party&quot; and collectively as the
        &quot;Parties&quot;),
      </Text>

      <Text style={styles.centerHeading}>WITNESSETH:</Text>

      <Text style={styles.paragraph}>
        WHEREAS, the Company is a limited liability company organized and
        existing, in good standing, under the laws of the State of Missouri;
        {"\n\n"}WHEREAS, the Company is in the business of providing and/or
        arranging for the provision of accessible, affordable, and more
        convenient supplemental educational instruction and tutoring solutions
        to help students achieve academic excellence; and
        {"\n\n"}WHEREAS, Provider desires to create an account on the Company’s
        Site (as defined below) or otherwise access the Company’s various
        platforms in order to provide tutoring services for and on behalf of the
        Company and the Company’s clients;
        {"\n\n"}WHEREAS, Provider expressly warrants that Provider has the
        skills, qualifications, knowledge, and training necessary to provide the
        tutoring services for and on behalf of the Company’s Clients and
        Students, in accordance with the terms and conditions set forth in this
        Agreement; and
        {"\n\n"}WHEREAS, the Company desires to grant Provider access to the
        Site in order to provide tutoring services in accordance with the terms
        and conditions set forth in this Agreement and/or any ancillary
        agreement(s) entered into contemporaneously or subsequently with this
        Agreement, all of which are expressly incorporated herein by this
        reference.
        {"\n\n"}NOW THEREFORE, for and in consideration of the mutual covenants
        and benefits conferred herein, and for such other adequate and valuable
        consideration, the receipt and sufficiency of which is hereby expressly
        acknowledged by the Parties, Provider, and the Company, intending to be
        legally bound hereby, do expressly and forever agree as follows:
      </Text>

      {clauses.map((clause, index) => (
        <Text key={index} style={styles.listItem}>
          <Text style={styles.bold}>
            {index + 1}. {clause.title}:
          </Text>{" "}
          {clause.content}
        </Text>
      ))}

      <View style={styles.addressContainer}>
        <Text style={styles.paragraph}>To the Company:</Text>
        <Text style={styles.paragraph}>
          STL Tutoring Solutions, LLC{"\n"}
          d/b/a Arch City Tutors{"\n"}
          8011 Clayton Road, Suite 300{"\n"}
          St. Louis, Missouri 63117
        </Text>
      </View>
    </View>
  );
}

const clauses = [
  {
    title: "Term",
    content:
      "The Term of this Agreement shall commence upon the Effective Date first set forth above and shall remain in full force and effect for a period of six (6) consecutive months (the “Term”)...",
  },
  {
    title: "Termination",
    content:
      "In the event Provider violates any material provision of this Agreement, the Company may terminate this Agreement immediately...",
  },
  {
    title: "The Site",
    content:
      "This Agreement, along with the Company’s Privacy Policy and Terms and Conditions, shall govern your use of the Company’s platforms...",
  },
  {
    title: "Site Access",
    content:
      "The Company provides access to proprietary information and technology applications, including a website and mobile app, through which Provider may locate and engage with Clients...",
  },
  {
    title: "Schedule of Services",
    content:
      "Provider shall be responsible for establishing their own availability and updating it via the Site’s scheduling system...",
  },
  {
    title: "Compensation",
    content:
      "All compensation for services shall be paid by Clients directly to Provider. Provider may set their own hourly rates, subject to dispute resolution by the Company...",
  },
  {
    title: "Expenses",
    content:
      "Provider acknowledges the Company will not reimburse expenses incurred in connection with the provision of services...",
  },
  {
    title: "Provider Documents",
    content:
      "Documents created or provided by Provider may be retained by the Company for record-keeping and administrative purposes...",
  },
  {
    title: "Taxes; Withholding and Benefits",
    content:
      "Provider is responsible for their own taxes and benefits. The Company will not withhold or provide any employment benefits...",
  },
  {
    title: "FSA or HAS Reimbursements",
    content:
      "The Company cannot provide receipts or tax information required for FSA or HSA reimbursement, and Providers are not obligated to do so...",
  },
  {
    title: "No Refunds",
    content:
      "No payments made to the Company are refundable. Credits apply only to future fees...",
  },
  {
    title: "Exclusive Billing",
    content:
      "The Company owns all fees charged to Clients. Providers may not collect or claim these fees...",
  },
  {
    title: "Tutor Status",
    content:
      "The Company acts solely as a platform to connect Providers and Clients. Engagements are between the Client and Provider...",
  },
  {
    title: "Relationship Between the Parties",
    content:
      "This Agreement does not create a partnership, employment, or joint venture relationship between the Parties...",
  },
  {
    title: "Relationship with Clients",
    content:
      "Provider shall not engage Clients outside the Site. All communication and agreements must occur through the Company platform...",
  },
  {
    title: "Non-Exclusivity",
    content:
      "This Agreement is non-exclusive. Both Parties may engage in other work or business...",
  },
  {
    title: "Hours/Cancellation Fee",
    content:
      "Provider sets their own schedule. If a scheduled session is cancelled after Client payment, Provider may be required to reimburse the Scheduling Fee...",
  },
  {
    title: "Independent Tutoring Judgment",
    content:
      "Provider is entitled to use their own judgment to provide services in the best interest of the Client...",
  },
  {
    title: "Provider Obligations",
    content:
      "Provider agrees to comply with Site guidelines, refrain from off-platform contact, and authorize background checks as necessary...",
  },
  {
    title: "No Discrimination",
    content:
      "Provider agrees not to discriminate against any protected class in connection with providing services...",
  },
  {
    title: "On-Boarding Fees",
    content:
      "Provider agrees to pay a $25 onboarding fee to help cover background verification costs...",
  },
  {
    title: "Education and Experience",
    content:
      "Provider warrants they have the necessary education and experience to perform services...",
  },
  {
    title: "Criminal History",
    content:
      "Provider must disclose any felony convictions and agrees to background checks...",
  },
  {
    title: "Registered Offender",
    content:
      "Provider warrants they are not and have never been required to register as a sex offender...",
  },
  {
    title: "Background Check",
    content:
      "The Company may conduct background checks at its discretion to ensure safety...",
  },
  {
    title: "Motor Vehicle Records",
    content:
      "Provider consents to the Company obtaining and reviewing their motor vehicle records as a condition of access...",
  },
  {
    title: "Intellectual Property Rights",
    content:
      "Provider may not use the Company’s IP without written permission. Unauthorized use is a breach of this Agreement...",
  },
  {
    title: "Copyright Assignment",
    content:
      "Provider grants the Company a license to use submitted content. Provider retains ownership unless otherwise agreed...",
  },
  {
    title: "Academic Dishonesty",
    content:
      "Provider agrees not to engage in academic dishonesty on behalf of Clients...",
  },
  {
    title: "Confidential Information",
    content:
      "Provider agrees not to disclose or misuse confidential information for two years following Agreement termination...",
  },
  {
    title: "Return of Confidential Information",
    content:
      "Provider must return all confidential materials upon request or termination...",
  },
  {
    title: "Non-Disclosure",
    content:
      "Provider may not disclose confidential information to third parties without consent or legal compulsion...",
  },
  {
    title: "Non-Solicitation",
    content:
      "Provider may not solicit or divert clients or other Providers for two years post-termination...",
  },
  {
    title: "Indemnification",
    content:
      "Provider agrees to defend and indemnify the Company against all liabilities arising from use of the Site or provision of services...",
  },
  {
    title: "General Release of Claims",
    content:
      "Provider releases the Company from liability related to use of the Site and services...",
  },
  {
    title: "No Conflicts",
    content:
      "Provider confirms this Agreement does not violate any existing agreements or legal obligations...",
  },
  {
    title: "Provider’s Representations and Warranties",
    content:
      "Provider represents they are legally able to enter into this Agreement and authorize promotional use of their likeness...",
  },
  {
    title: "Disclaimer of Warranties",
    content:
      "The Company disclaims all warranties regarding use of the Site and Provider engagement except as stated in writing...",
  },
  {
    title: "Assignment and Amendment",
    content:
      "This Agreement may not be assigned without consent and may only be amended in writing by the Company...",
  },
  {
    title: "No Third-Party Beneficiaries",
    content:
      "This Agreement is only for the benefit of the Parties and their permitted successors...",
  },
  {
    title: "Force Majeure",
    content:
      "Neither Party shall be liable for delays due to events beyond their control such as natural disasters, war, or pandemics...",
  },
  {
    title: "Impossibility of Performance",
    content:
      "If performance is impossible for 30 days, both Parties may be released from obligations...",
  },
  {
    title: "Compliance with Laws",
    content:
      "The Parties affirm that their actions under this Agreement comply with all applicable laws...",
  },
  {
    title: "Confidentiality",
    content:
      "The Agreement’s terms and conditions are to remain confidential except as required by law or mutual written consent...",
  },
  {
    title: "Entire Agreement",
    content:
      "This document represents the entire agreement between the Parties and supersedes prior agreements...",
  },
  {
    title: "Severability",
    content:
      "If any part of this Agreement is invalid, the remainder shall remain in effect...",
  },
  {
    title: "Waiver/Enforceability",
    content:
      "A waiver must be in writing and does not waive future breaches...",
  },
  {
    title: "Notices",
    content:
      "Notices must be sent via certified mail, email, or other verified method to the addresses listed in this Agreement...",
  },
  {
    title: "Knowledge of Terms",
    content:
      "The Parties acknowledge they have read and understood this Agreement and enter into it voluntarily...",
  },
  {
    title: "Authority to Sign",
    content:
      "The signatories confirm they have the authority to bind their respective Parties...",
  },
  {
    title: "No Oral Modification",
    content:
      "This Agreement can only be changed through a signed written amendment...",
  },
  {
    title: "Interpretation",
    content:
      "Headings are for reference only and shall not affect interpretation. Words shall be interpreted contextually...",
  },
  {
    title: "Choice of Law and Venue",
    content:
      "This Agreement is governed by Missouri law and any legal action must be brought in Missouri courts...",
  },
  {
    title: "ARBITRATION",
    content:
      "Any disputes may be resolved via binding arbitration. Class action waivers apply. Arbitration is governed by the Federal and Missouri Arbitration Acts...",
  },
  {
    title: "Acceptance",
    content:
      "By selecting “I ACCEPT”, Provider agrees to all terms and conditions herein and consents to receive messages as outlined in the Agreement...",
  },
];

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: `rgba(${getRgbValues(colors.primary)}, 0.65)`,
    marginBottom: 20,
  },
  centerHeading: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 12,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  bold: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  addressContainer: {
    marginTop: 20,
  },
});
