const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'location-pages');

// Massive content generator
function generateExpandedContent(keyword, location) {
    return `
        <!-- EXPANDED CONTENT BLOCK -->
        <section class="comprehensive-details" style="padding: 60px 20px; background: #ffffff;">
            <div class="container" style="max-width: 1000px; margin: 0 auto; color: var(--text-dark); line-height: 1.8;">
                
                <h2 style="color: var(--navy-blue); font-size: 28px; margin-bottom: 25px; font-weight: 600;">Comprehensive Understanding of IVF in ${location}</h2>
                <p>When searching for the <strong>${keyword.toLowerCase()} in ${location}</strong>, it is absolutely essential to look beyond basic clinical facilities and seek out a comprehensive reproductive healthcare partner. In Vitro Fertilization (IVF) is not merely a single procedure; it is a highly sophisticated series of medical protocols designed to assist with conception, prevent genetic problems, and ultimately help you safely welcome a healthy child into your family. At Kindle Womb, we have revolutionized the approach to fertility treatments in ${location}. Our philosophy integrates advanced medical endocrinology, cutting-edge embryology laboratory practices, and an unwavering commitment to compassionate patient care.</p>
                
                <p>Infertility can be a profoundly emotional and challenging diagnosis, affecting millions of couples worldwide. Whether you are dealing with unexplained infertility, male factor infertility (such as low sperm count or motility), endometriosis, polycystic ovary syndrome (PCOS), or tubal blockages, our multidisciplinary team of specialists in ${location} is equipped to handle the most complex clinical cases. Our goal is to demystify the IVF process, providing you with transparent data, clear timelines, and a customized treatment architecture that maximizes your chances of a successful pregnancy.</p>
                <p>By choosing Kindle Womb in ${location}, you are gaining access to a network of top-tier fertility experts who collaborate on your case daily. We believe in evidence-based medicine, meaning every recommendation we make is backed by the latest global research in reproductive science.</p>

                <h2 style="color: var(--navy-blue); font-size: 28px; margin-top: 50px; margin-bottom: 25px; font-weight: 600;">Detailed Breakdown of the IVF Process & Timelines</h2>
                <p>Understanding the timeline and physical commitment required for IVF is the first step toward feeling empowered. While every patient’s biological response is unique, a standard IVF cycle at our ${location} center typically spans 4 to 6 weeks and follows a meticulously calculated sequence:</p>
                <ul style="margin-left: 20px; margin-bottom: 20px;">
                    <li style="margin-bottom: 15px;"><strong>Phase 1: Initial Consultation and Diagnostic Workup (1-2 Weeks)</strong><br>Before any treatment begins, our clinical team conducts a thorough evaluation. This includes detailed pelvic ultrasounds, hormonal profiling (such as AMH, FSH, and LH levels), and comprehensive semen analysis. This baseline data allows our specialists in ${location} to tailor the ovarian stimulation protocol precisely to your unique physiology.</li>
                    <li style="margin-bottom: 15px;"><strong>Phase 2: Ovarian Stimulation and Monitoring (10-14 Days)</strong><br>To maximize the number of mature eggs available for fertilization, patients self-administer daily subcutaneous hormone injections. During this critical window, you will visit our ${location} clinic for frequent transvaginal ultrasounds and blood tests to monitor follicular growth and ensure your safety, preventing complications like Ovarian Hyperstimulation Syndrome (OHSS).</li>
                    <li style="margin-bottom: 15px;"><strong>Phase 3: The Egg Retrieval Procedure (Day 15)</strong><br>Once the follicles reach optimal maturity, a 'trigger shot' is administered. Exactly 36 hours later, our expert surgeons perform the egg retrieval. This is a minimally invasive outpatient procedure performed under light, short-acting anesthesia at our specialized ${location} facility, taking only 15-20 minutes.</li>
                    <li style="margin-bottom: 15px;"><strong>Phase 4: Laboratory Fertilization and Embryo Culture (5-6 Days)</strong><br>In our state-of-the-art embryology laboratory, the retrieved eggs are fertilized with sperm. Our senior embryologists utilize advanced incubators that perfectly mimic the human body's environment. The embryos are cultured and monitored daily until they reach the robust blastocyst stage.</li>
                    <li style="margin-bottom: 15px;"><strong>Phase 5: Embryo Transfer and The Two-Week Wait</strong><br>The healthiest, highest-graded embryo is carefully transferred into the uterus using a soft, flexible catheter under ultrasound guidance. This procedure is completely painless. Following the transfer, patients endure the "two-week wait" before a Beta hCG blood test confirms the pregnancy.</li>
                </ul>

                <h2 style="color: var(--navy-blue); font-size: 28px; margin-top: 50px; margin-bottom: 25px; font-weight: 600;">Advanced Reproductive Technologies Available</h2>
                <p>What truly sets us apart as the ${keyword.toLowerCase()} in ${location} is our investment in next-generation laboratory technologies. Standard IVF is just the foundation; we employ a suite of advanced micro-manipulation techniques to conquer severe infertility factors:</p>
                <ul style="margin-left: 20px; margin-bottom: 20px;">
                    <li style="margin-bottom: 15px;"><strong>Intracytoplasmic Sperm Injection (ICSI):</strong> A game-changer for male factor infertility. Instead of allowing sperm to penetrate the egg naturally in a petri dish, our embryologists select a single, morphologically perfect sperm and inject it directly into the cytoplasm of the egg, drastically improving fertilization rates.</li>
                    <li style="margin-bottom: 15px;"><strong>Preimplantation Genetic Testing (PGT-A & PGT-M):</strong> We can safely biopsy a few cells from the outer layer of a blastocyst embryo to screen for chromosomal abnormalities (aneuploidy) or specific single-gene genetic disorders. Transferring only genetically normal (euploid) embryos significantly reduces the risk of miscarriage and increases live birth rates.</li>
                    <li style="margin-bottom: 15px;"><strong>Laser Assisted Hatching:</strong> For an embryo to implant successfully into the uterine lining, it must "hatch" out of its protective outer shell (the zona pellucida). We use a highly precise medical laser to create a microscopic thinning in this shell, aiding implantation for older patients or those with previous failed cycles.</li>
                </ul>
                <p>These sophisticated tools allow our team in ${location} to pivot and adapt to your body’s unique responses in real-time, leaving nothing to chance.</p>

                <h2 style="color: var(--navy-blue); font-size: 28px; margin-top: 50px; margin-bottom: 25px; font-weight: 600;">Cost Transparency & Financial Guidance for IVF Treatment</h2>
                <p>We understand that the financial aspect of fertility treatment can be a significant source of stress. As the leading ${keyword.toLowerCase()} in ${location}, we are fiercely committed to absolute cost transparency. The total investment for an IVF cycle can vary widely depending on the specific pharmacological protocols required, whether advanced techniques like ICSI or PGT are utilized, and whether you are using donor gametes.</p>
                <p>During your initial consultation at our ${location} center, you will be assigned a dedicated financial counselor. They will provide a detailed, itemized breakdown of all anticipated costs, ensuring there are zero hidden fees or surprise medical bills. We walk you through what is covered by your specific insurance provider and explore various financing options, EMI medical loans, and multi-cycle package discounts designed to make family building accessible without compromising on the quality of clinical care.</p>

                <h2 style="color: var(--navy-blue); font-size: 28px; margin-top: 50px; margin-bottom: 25px; font-weight: 600;">Success Rates and What Affects Them</h2>
                <p>Success rates are a critical metric when selecting an IVF clinic. While we proudly maintain some of the highest clinical pregnancy rates in ${location}, it is vital to understand that success is multifactorial. The single most significant determinant is the biological age of the female partner, which directly correlates with egg quality and chromosomal integrity. Other critical factors include ovarian reserve (measured by AMH levels), sperm DNA fragmentation, uterine receptivity, and the specific underlying causes of infertility.</p>
                <p>Our superior success metrics are not just a result of excellent medical protocols, but also our world-class embryology laboratory. The air quality, temperature control, and gas mixtures in our ${location} lab are regulated to exact tolerances, creating the perfect environment for embryo development. We do not believe in a "one-size-fits-all" approach; if a cycle fails, we conduct a rigorous clinical review to adjust the protocol for the next attempt.</p>

                <h2 style="color: var(--navy-blue); font-size: 28px; margin-top: 50px; margin-bottom: 25px; font-weight: 600;">Holistic Preparation & Lifestyle Adjustments</h2>
                <p>Preparing your body for IVF is just as important as the clinical procedures themselves. We strongly encourage a holistic approach to maximize your chances of success. Our experts in ${location} recommend optimizing your diet by focusing on anti-inflammatory, antioxidant-rich whole foods like leafy greens, lean proteins, and omega-3 fatty acids, which can positively impact egg and sperm quality.</p>
                <p>Equally important is stress management. The cortisol spikes associated with chronic stress can interfere with reproductive hormones. We recommend integrating mindfulness practices, prenatal yoga, or acupuncture into your daily routine. Additionally, achieving a healthy BMI and abstaining from smoking, alcohol, and excessive caffeine intake at least three months prior to your cycle can dramatically improve your physiological readiness for pregnancy.</p>

                <h2 style="color: var(--navy-blue); font-size: 28px; margin-top: 50px; margin-bottom: 25px; font-weight: 600;">Expanded ${location} IVF FAQs</h2>
                <div style="border-left: 4px solid var(--brand-rust); padding-left: 20px; margin-bottom: 30px;">
                    <h3 style="font-size: 20px; color: var(--navy-blue); margin-bottom: 10px;">Are the fertility injection medications painful?</h3>
                    <p>The medications used for ovarian stimulation are administered via tiny, subcutaneous needles (similar to an insulin pen). Most patients in our ${location} clinic report that the injections cause only mild, temporary discomfort and become quite easy to self-administer after the first few days.</p>
                </div>
                <div style="border-left: 4px solid var(--brand-rust); padding-left: 20px; margin-bottom: 30px;">
                    <h3 style="font-size: 20px; color: var(--navy-blue); margin-bottom: 10px;">Can I choose the gender of my baby through IVF?</h3>
                    <p>In accordance with strict Indian medical laws (PCPNDT Act), gender determination or selection is completely illegal and strictly prohibited at our ${location} facility and throughout the country, regardless of the medical technology available.</p>
                </div>
                <div style="border-left: 4px solid var(--brand-rust); padding-left: 20px; margin-bottom: 30px;">
                    <h3 style="font-size: 20px; color: var(--navy-blue); margin-bottom: 10px;">How many embryos do you transfer at once?</h3>
                    <p>To prioritize the health of the mother and baby and minimize the risks associated with multiple pregnancies (twins/triplets), our standard protocol in ${location} strongly favors Elective Single Embryo Transfer (eSET), especially when transferring high-quality blastocysts.</p>
                </div>
                <div style="border-left: 4px solid var(--brand-rust); padding-left: 20px; margin-bottom: 30px;">
                    <h3 style="font-size: 20px; color: var(--navy-blue); margin-bottom: 10px;">What happens to my remaining embryos?</h3>
                    <p>Any extra high-quality embryos that are not transferred can be cryopreserved (frozen) using an ultra-rapid cooling technique called vitrification. These can be safely stored at our ${location} center for years, allowing you to expand your family in the future without undergoing another full stimulation cycle.</p>
                </div>
                <div style="border-left: 4px solid var(--brand-rust); padding-left: 20px; margin-bottom: 30px;">
                    <h3 style="font-size: 20px; color: var(--navy-blue); margin-bottom: 10px;">Do I need to take bed rest after the embryo transfer?</h3>
                    <p>Extensive medical research shows that strict bed rest does not improve implantation rates and can actually cause unnecessary stress. We advise our patients in ${location} to return to normal, light activities the following day, while avoiding strenuous exercise or heavy lifting.</p>
                </div>

            </div>
        </section>
        <!-- END EXPANDED CONTENT BLOCK -->
    `;
}

// Process the files
let filesProcessed = 0;
let filesSkipped = 0;

fs.readdirSync(targetDir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(targetDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if already expanded to avoid duplicate injection
        if (content.includes('class="comprehensive-details"')) {
            filesSkipped++;
            return;
        }

        // Extract keyword and location from the title tag
        // <title>Best IVF Center in Jaipur | Expert Fertility Specialists | Kindle Womb</title>
        const titleMatch = content.match(/<title>(.*?)\s+in\s+(.*?)\s+\|/);
        
        if (titleMatch && titleMatch.length >= 3) {
            const keyword = titleMatch[1];
            const location = titleMatch[2];

            const expandedHTML = generateExpandedContent(keyword, location);

            // Inject right after </section> of class="introduction"
            // The template looks like:
            // </div>
            // </section>
            // 
            // <!-- Related Pages -->
            
            const splitPattern = /<\/section>\s*<!-- Related Pages -->/;
            if (content.match(splitPattern)) {
                content = content.replace(splitPattern, `</section>\n${expandedHTML}\n        <!-- Related Pages -->`);
                fs.writeFileSync(filePath, content, 'utf8');
                filesProcessed++;
            } else {
                console.log(`Could not find injection point in ${file}`);
            }
        } else {
            console.log(`Could not extract keyword/location from ${file}`);
        }
    }
});

console.log(`Successfully expanded ${filesProcessed} pages to 1600+ words.`);
console.log(`Skipped ${filesSkipped} pages (already expanded).`);
