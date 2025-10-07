export default function Privacy() {
    return(
        <main className="container" role="main">
            <header>
                <h1>Privacy Policy</h1>
                <p className="meta">Last updated: <time dateTime="[YYYY-MM-DD]">[DD Month YYYY]</time></p>
            </header>

            <section id="intro">
                <h2>1. Introduction</h2>
                <p>Welcome to the official website of <strong>[Conference Name]</strong> (“the Conference”). We respect
                    your privacy and are committed to protecting your personal data. This Privacy Policy explains what
                    information we collect, how we use it, and your rights under applicable data protection laws,
                    including the EU General Data Protection Regulation (GDPR).</p>
                <p>By using this website or registering for the Conference, you agree to this Privacy Policy.</p>
            </section>

            <section id="controller">
                <h2>2. Data Controller</h2>
                <p>The data controller responsible for your personal data is:</p>
                <address>
                    <strong>[Organization / Conference Committee Name]</strong><br/>
                    [Street, City, Country]<br/>
                    Email: <a href="mailto:office@wrt2026.com.ua">[contact@email]</a><br/>
                    Website: <a href="https://wrt2026.com.ua">[conference-domain.example]</a>
                </address>
            </section>

            <section id="data-we-collect">
                <h2>3. Information We Collect</h2>
                <h3>a) Information you provide directly</h3>
                <ul>
                    <li>Name, surname, academic title</li>
                    <li>Institution/organization and role</li>
                    <li>Contact details (email, phone, country)</li>
                    <li>Billing and payment details (when applicable)</li>
                    <li>Abstracts, papers, presentations and other submitted materials</li>
                    <li>Dietary or accessibility preferences (if provided voluntarily)</li>
                </ul>
                <h3>b) Information collected automatically</h3>
                <ul>
                    <li>IP address, browser type, device information</li>
                    <li>Date, time, duration of your visit; pages viewed; referrer</li>
                    <li>Cookies and similar technologies (see “Cookies” below)</li>
                </ul>
            </section>

            <section id="purpose-legal-basis">
                <h2>4. Purpose and Legal Basis of Processing</h2>
                <table aria-label="Purposes and legal bases">
                    <thead>
                    <tr>
                        <th scope="col">Purpose</th>
                        <th scope="col">Legal Basis</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Registration and participation management</td>
                        <td>Contract performance (Art. 6(1)(b) GDPR)</td>
                    </tr>
                    <tr>
                        <td>Communications about submissions or participation</td>
                        <td>Legitimate interests / Contract (Art. 6(1)(f)/(b))</td>
                    </tr>
                    <tr>
                        <td>Payment processing and invoicing</td>
                        <td>Legal obligation (Art. 6(1)(c))</td>
                    </tr>
                    <tr>
                        <td>Publication of abstracts/proceedings and participant lists</td>
                        <td>Consent where required (Art. 6(1)(a))</td>
                    </tr>
                    <tr>
                        <td>Website analytics and event improvement</td>
                        <td>Legitimate interests (Art. 6(1)(f)); consent where required</td>
                    </tr>
                    <tr>
                        <td>Marketing of future conferences (e.g., newsletter)</td>
                        <td>Consent (Art. 6(1)(a))</td>
                    </tr>
                    </tbody>
                </table>
            </section>

            <section id="sharing">
                <h2>5. Data Sharing</h2>
                <p>We may share personal data with:</p>
                <ul>
                    <li>Organizing and scientific committees</li>
                    <li>Payment processors and banks for fee collection</li>
                    <li>Web hosting, email, and IT service providers under data processing agreements</li>
                    <li>Publishers for conference proceedings (when applicable)</li>
                </ul>
                <p>We do not sell or rent your personal data.</p>
            </section>

            <section id="transfers">
                <h2>6. International Transfers</h2>
                <p>If data is transferred outside the EEA, we implement appropriate safeguards, such as EU Standard
                    Contractual Clauses or equivalent protection measures.</p>
            </section>

            <section id="retention">
                <h2>7. Data Retention</h2>
                <ul>
                    <li>Registration and payment records: up to 5 years (legal/accounting requirements)</li>
                    <li>Abstracts, papers, and proceedings: indefinitely if published as part of conference materials
                    </li>
                    <li>Mailing list data: until you unsubscribe or withdraw consent</li>
                </ul>
            </section>

            <section id="cookies">
                <h2>8. Cookies</h2>
                <p>We use cookies to operate our website, remember preferences, and analyze traffic. You can manage
                    cookies in your browser settings. </p>
            </section>

            <section id="rights">
                <h2>9. Your Rights</h2>
                <p>Under the GDPR, you have the right to:</p>
                <ul>
                    <li>Access your personal data</li>
                    <li>Rectify inaccurate or incomplete data</li>
                    <li>Request erasure (“right to be forgotten”)</li>
                    <li>Restrict or object to processing</li>
                    <li>Data portability</li>
                    <li>Withdraw consent at any time (for consent-based processing)</li>
                </ul>
                <p>To exercise your rights, contact us at <a href="mailto:office@wrt2026.com.ua">office@wrt2026.com.ua</a>. We will
                    respond within one month.</p>
            </section>

            <section id="security">
                <h2>10. Data Security</h2>
                <p>We apply appropriate technical and organizational measures to protect your data against unauthorized
                    access, loss, misuse, or alteration.</p>
            </section>

            <section id="links">
                <h2>11. Links to Other Websites</h2>
                <p>Our website may contain links to external sites. We are not responsible for their privacy practices.
                    Please review their privacy policies separately.</p>
            </section>

            <section id="changes">
                <h2>12. Updates to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an
                    updated “Last updated” date.</p>
            </section>

            <section id="contact">
                <h2>Contact</h2>
                <p>If you have questions about this Privacy Policy or how we process your data, please contact:</p>
                <address className="footer-note">
                    <strong>[Organization / Conference Committee Name]</strong><br/>
                    Email: <a href="mailto:office@wrt2026.com.ua">office@wrt2026.com.ua</a><br/>
                    Address: [Street, City, Postal Code, Country]
                </address>
            </section>
        </main>
    )
}