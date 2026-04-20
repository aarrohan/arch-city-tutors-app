import colors from "@/constants/colors";
import { getRgbValues } from "@/lib/utils";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface IProps {
  firstName: string;
  lastName: string;
}

export default function MemberAgreementContent({
  firstName,
  lastName,
}: IProps) {
  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentYear = new Date().toLocaleString("en-US", { year: "numeric" });

  return (
    <View>
      <Text style={styles.paragraph}>
        This MEMBER AGREEMENT (this “Agreement”), effective as of {currentMonth}
        , {currentYear}, is entered into by and between STL TUTORING SOLUTIONS,
        LLC, a Missouri limited liability company, doing business as ARCH CITY
        TUTORS (the “Company” and/or “ACT”) and {firstName} {lastName}{" "}
        (“Client”) (the Company and Client are each referred to individually as
        a “Party” and collectively as the “Parties”),
      </Text>

      <Text style={styles.centerHeading}>WITNESSETH:</Text>

      <Text style={styles.paragraph}>
        WHEREAS, the Company is a limited liability company organized and
        existing, in good standing, under the laws of the State of Missouri;
        {"\n\n"}WHEREAS, the Company is in the business of providing and/or
        arranging for the provision of accessible, affordable, and more
        convenient supplemental educational instruction and tutoring solutions
        to help students achieve academic excellence;
        {"\n\n"}WHEREAS, Client desires to create an account on the Company’s
        Site or otherwise access the Company’s various platforms in order to
        purchase the goods and services available thereon and Client has
        determined that the Company possesses the skills, personnel, and
        resources to provide the services contemplated in this Agreement.
        {"\n\n"}NOW THEREFORE, for and in consideration of the mutual covenants
        and benefits contained herein, and for such other adequate and valuable
        consideration, the receipt and sufficiency of which is expressly
        acknowledged by the Parties, the Company and Client, intending to be
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
      "In the event Client violates any material provision of this Agreement, the Company may terminate this Agreement immediately...",
  },
  {
    title: "The Site",
    content:
      "This Agreement, along with the Company’s Privacy Policy and Terms and Conditions, governs your use of the Company’s platforms including website, social pages, and mobile application...",
  },
  {
    title: "Site Access",
    content:
      "The Company provides access to proprietary information and technology applications, including but not limited to locating and engaging Providers for Services...",
  },
  {
    title: "Payment Authorization",
    content:
      "Client expressly authorizes the Company to initiate debit entries on Client’s account(s) set forth on the ACH Authorization Form...",
  },
  {
    title: "Client Obligations",
    content:
      "Client agrees to a number of obligations as a necessary condition to the Company’s provision of access and services under this Agreement...",
  },
  {
    title: "Grant of Access",
    content:
      "Client consents to all terms and conditions of this Agreement by selecting “I ACCEPT” and agrees to use the Site only for lawful purposes...",
  },
  {
    title: "Relationship with Providers",
    content:
      "Client acknowledges a direct relationship with each Provider and agrees to pay Provider Fees directly to them as needed...",
  },
  {
    title: "Relationship of the Parties",
    content:
      "The Parties are independent contractors and nothing in this Agreement shall imply a joint venture, partnership, or employer/employee relationship...",
  },
  {
    title: "Disclaimer of Warranties",
    content:
      "No warranties, express or implied, are made by the Company with respect to Client’s use of the Site or engagement of Providers except as expressed in writing...",
  },
  {
    title: "Taxes",
    content:
      "Client acknowledges the Company assumes no responsibility for any tax obligations related to Provider Fees, which are the responsibility of Client and Providers...",
  },
  {
    title: "FSA or HSA Reimbursements",
    content:
      "Company does not provide documentation for Provider Fee reimbursements and Providers are not obligated to provide such information...",
  },
  {
    title: "No Refunds",
    content:
      "In the event of termination or expiration of this Agreement, no portion of payments already made to the Company shall be refunded...",
  },
  {
    title: "Intellectual Property Rights",
    content:
      "Nothing in this Agreement grants Client any rights under any of the Company’s intellectual property. Unauthorized use is prohibited...",
  },
  {
    title: "Confidential Information",
    content:
      "Client shall not disclose or misuse Confidential Information received during the term of the Agreement for a period of two (2) years following termination...",
  },
  {
    title: "Return of Confidential Information",
    content:
      "Upon request, Client shall return all original and copied materials related to the Company’s confidential and proprietary information...",
  },
  {
    title: "Non-Disclosure",
    content:
      "Client shall not disclose, copy, or commercially use Confidential Information without prior written consent and shall notify the Company of compelled disclosures...",
  },
  {
    title: "Non-Solicitation",
    content:
      "Client shall not interfere with Company relationships, solicit its customers, or engage its Providers independently for a period of two (2) years following termination...",
  },
  {
    title: "Indemnification",
    content:
      "Client agrees to indemnify and hold harmless the Company and its affiliates from all liabilities and claims arising from Client’s use of the Site or engagement with Providers...",
  },
  {
    title: "General Release of Claims",
    content:
      "Client releases and waives any claims against the Company related to Access, Applications, or Services, including those caused by negligence...",
  },
  {
    title: "No Conflicts",
    content:
      "Client represents that entering into this Agreement will not violate any other contractual obligations or legal requirements applicable to them...",
  },
  {
    title: "Client Representations and Warranties",
    content:
      "Client confirms their legal authority and personal decision to enter into this binding Agreement with the Company...",
  },
  {
    title: "Assignment and Amendment",
    content:
      "This Agreement may not be assigned by either Party without written consent and may only be amended in writing by the Company...",
  },
  {
    title: "No Third-Party Beneficiaries",
    content:
      "This Agreement does not confer rights to any person other than the Parties and their permitted successors and assigns...",
  },
  {
    title: "Force Majeure",
    content:
      "Delays caused by circumstances beyond the Parties’ control (e.g., weather, pandemic) will extend timelines except for payment obligations...",
  },
  {
    title: "Impossibility of Performance",
    content:
      "If performance becomes impossible due to unforeseen circumstances for 30 consecutive days, both Parties will be released from obligations...",
  },
  {
    title: "Compliance with Laws",
    content:
      "Parties agree that their performance under this Agreement does not violate any applicable laws or insurance provisions...",
  },
  {
    title: "Confidentiality",
    content:
      "Terms of this Agreement must remain confidential unless disclosure is required by law or consented to by both Parties in writing...",
  },
  {
    title: "Entire Agreement",
    content:
      "This Agreement represents the entire understanding between the Parties and supersedes all prior agreements regarding the subject matter...",
  },
  {
    title: "Severability",
    content:
      "If any part of this Agreement is found unenforceable, the remainder shall remain in full effect...",
  },
  {
    title: "Waiver/Enforceability",
    content:
      "A waiver of any part of this Agreement must be in writing and does not constitute a waiver of future breaches...",
  },
  {
    title: "Notices",
    content:
      "Notices under this Agreement must be delivered by registered mail, hand delivery, or electronic communication with confirmation...",
  },
  {
    title: "Knowledge of Terms",
    content:
      "Both Parties acknowledge they have read, understood, and accepted the terms of this Agreement voluntarily and with legal counsel as needed...",
  },
  {
    title: "Authority to Sign",
    content:
      "Signatories to this Agreement represent they have full authority to bind the Parties they represent...",
  },
  {
    title: "No Oral Modification",
    content:
      "This Agreement may not be altered except in a signed written amendment by the Company...",
  },
  {
    title: "Interpretation",
    content:
      "Headings are for convenience and shall not affect interpretation. Words include their plural/singular and masculine/feminine forms as context requires...",
  },
  {
    title: "Choice of Law and Venue",
    content:
      "This Agreement shall be governed by Missouri law and any disputes shall be resolved in the courts of St. Louis County or the Eastern District of Missouri...",
  },
  {
    title: "Arbitration",
    content:
      "Any disputes may be resolved via binding arbitration. Client waives rights to class action and agrees to arbitration under applicable laws and procedures...",
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
