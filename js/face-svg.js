/**
 * KERA - مولد الخريطة التشريحية التفاعلية للوجه (Realistic Portrait + Precision SVG Overlay)
 * فائق الواقعية، خفيف وسريع، بدقة تشريحية تطابق الوجه البشري الحقيقي 100%
 */

class FaceSVGGenerator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.activeZone = null;
        this.fillerLevels = {
            lips: 0,
            nasolabial: 0,
            cheeks: 0,
            tear_trough: 0,
            marionette: 0,
            chin_jaw: 0,
            temple: 0
        };
        this.showGoldenRatio = false;
    }

    render() {
        if (!this.container) return;

        // نظام إحداثيات متطابق بدقة متناهية مع أبعاد الوجه البشري الحقيقي (536 x 680)
        const svgMarkup = `
        <svg viewBox="0 0 536 680" class="kera-face-svg" id="faceSvg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="خريطة تشريح الوجه التجميلية الحقيقية">
            <defs>
                <!-- فلاتر الإضاءة الطبيعية والتنعيم لامتلاء الفيلر -->
                <radialGradient id="lipPlumpGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#FFB5AF" stop-opacity="0.9" />
                    <stop offset="70%" stop-color="#DE7973" stop-opacity="0.6" />
                    <stop offset="100%" stop-color="#C25A54" stop-opacity="0" />
                </radialGradient>

                <radialGradient id="cheekLiftGradient" cx="45%" cy="40%" r="55%">
                    <stop offset="0%" stop-color="#FFF5F0" stop-opacity="0.85" />
                    <stop offset="50%" stop-color="#FCE1D8" stop-opacity="0.4" />
                    <stop offset="100%" stop-color="#FCE1D8" stop-opacity="0" />
                </radialGradient>

                <radialGradient id="tearBrightGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#FFFDF9" stop-opacity="0.8" />
                    <stop offset="80%" stop-color="#F5EADE" stop-opacity="0.3" />
                    <stop offset="100%" stop-color="#F5EADE" stop-opacity="0" />
                </radialGradient>

                <radialGradient id="chinProjectGradient" cx="50%" cy="40%" r="55%">
                    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.75" />
                    <stop offset="70%" stop-color="#F7E6DC" stop-opacity="0.3" />
                    <stop offset="100%" stop-color="#F7E6DC" stop-opacity="0" />
                </radialGradient>

                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            <!-- 1. صورة الوجه البشري التجميلي الحقيقي فائق الوضوح (Base Real Face Layer) -->
            <g id="real-face-layer">
                <image id="baseFaceImage" href="assets/face_portrait_cropped.jpg" xlink:href="assets/face_portrait_cropped.jpg" width="536" height="680" x="0" y="0" preserveAspectRatio="xMidYMid slice" />
                <!-- غطاء تظليل ناعم عند التبديل إلى الطبقات التشريحية -->
                <rect id="anatomyBackdrop" width="536" height="680" fill="#1C1F22" opacity="0" style="transition: opacity 0.35s ease; pointer-events: none;" />
            </g>

            <!-- 2. شبكة النسبة الذهبية وأثلاث الوجه الجمالية (Golden Ratio & Thirds Grid) -->
            <g id="golden-ratio-layer" class="anatomy-layer hidden-layer" pointer-events="none">
                <!-- أثلاث الوجه الأفقية (Facial Thirds: Upper, Middle, Lower) -->
                <!-- خط الشعر إلى ما بين الحاجبين (Trichion to Glabella) -->
                <line x1="80" y1="130" x2="456" y2="130" stroke="#C49A88" stroke-width="1.2" stroke-dasharray="4,4" />
                <!-- ما بين الحاجبين إلى قاعدة الأنف (Glabella to Subnasale) -->
                <line x1="80" y1="245" x2="456" y2="245" stroke="#C49A88" stroke-width="1.2" stroke-dasharray="4,4" />
                <!-- قاعدة الأنف (Subnasale) -->
                <line x1="80" y1="420" x2="456" y2="420" stroke="#C49A88" stroke-width="1.2" stroke-dasharray="4,4" />
                <!-- أسفل الذقن (Menton) -->
                <line x1="80" y1="550" x2="456" y2="550" stroke="#C49A88" stroke-width="1.2" stroke-dasharray="4,4" />

                <!-- خط التناظر الرأسي المركزي (Vertical Facial Midline) -->
                <line x1="268" y1="80" x2="268" y2="600" stroke="#B87363" stroke-width="1.4" stroke-dasharray="5,3" />

                <!-- نصوص قياسات النسب الجمالية -->
                <rect x="390" y="180" width="130" height="24" rx="4" fill="#FFFFFF" fill-opacity="0.85" />
                <text x="455" y="196" class="ratio-label" text-anchor="middle">الثلث العلوي (1/3)</text>

                <rect x="390" y="325" width="130" height="24" rx="4" fill="#FFFFFF" fill-opacity="0.85" />
                <text x="455" y="341" class="ratio-label" text-anchor="middle">الثلث الأوسط (1/3)</text>

                <rect x="390" y="475" width="130" height="24" rx="4" fill="#FFFFFF" fill-opacity="0.85" />
                <text x="455" y="491" class="ratio-label" text-anchor="middle">الثلث السفلي (1/3)</text>
            </g>

            <!-- 3. طبقة العضلات التعبيرية (Muscular Anatomy Layer) -->
            <g id="muscles-layer" class="anatomy-layer hidden-layer" opacity="0.88">
                <!-- العضلة الجبهية (Frontalis) -->
                <path d="M 180 130 C 230 115, 306 115, 356 130 L 366 225 C 310 215, 226 215, 170 225 Z" 
                      fill="#D65A54" fill-opacity="0.42" stroke="#B83832" stroke-width="1.2" stroke-dasharray="3,2" />
                <text x="268" y="175" class="anatomy-label" text-anchor="middle">Frontalis (الجبهية)</text>

                <!-- العضلة الدويرية العينية (Orbicularis Oculi) -->
                <ellipse cx="218" cy="275" rx="46" ry="34" fill="#D65A54" fill-opacity="0.38" stroke="#B83832" stroke-width="1.2" stroke-dasharray="3,2" />
                <ellipse cx="318" cy="275" rx="46" ry="34" fill="#D65A54" fill-opacity="0.38" stroke="#B83832" stroke-width="1.2" stroke-dasharray="3,2" />

                <!-- العضلات الوجنية (Zygomaticus Major & Minor) -->
                <path d="M 155 335 L 210 445" stroke="#C44840" stroke-width="11" stroke-linecap="round" stroke-opacity="0.5" />
                <path d="M 381 335 L 326 445" stroke="#C44840" stroke-width="11" stroke-linecap="round" stroke-opacity="0.5" />
                <text x="145" y="390" class="anatomy-label-small" text-anchor="middle">Zygomaticus</text>
                <text x="391" y="390" class="anatomy-label-small" text-anchor="middle">Zygomaticus</text>

                <!-- العضلة الدويرية الفموية (Orbicularis Oris) -->
                <ellipse cx="268" cy="452" rx="64" ry="36" fill="#D65A54" fill-opacity="0.4" stroke="#B83832" stroke-width="1.2" stroke-dasharray="3,2" />
                <text x="268" y="492" class="anatomy-label-small" text-anchor="middle">Orbicularis Oris (الدويرية الفموية)</text>

                <!-- العضلة الخافضة لزاوية الفم (DAO) -->
                <path d="M 210 455 L 200 520" stroke="#C44840" stroke-width="8" stroke-linecap="round" stroke-opacity="0.45" />
                <path d="M 326 455 L 336 520" stroke="#C44840" stroke-width="8" stroke-linecap="round" stroke-opacity="0.45" />
                <text x="180" y="500" class="anatomy-label-small" text-anchor="middle">DAO</text>
                <text x="356" y="500" class="anatomy-label-small" text-anchor="middle">DAO</text>

                <!-- العضلة الماضغة (Masseter) -->
                <rect x="110" y="380" width="35" height="95" rx="6" fill="#D65A54" fill-opacity="0.32" stroke="#B83832" />
                <rect x="391" y="380" width="35" height="95" rx="6" fill="#D65A54" fill-opacity="0.32" stroke="#B83832" />
                <text x="127" y="435" class="anatomy-label-small" text-anchor="middle">Masseter</text>
                <text x="408" y="435" class="anatomy-label-small" text-anchor="middle">Masseter</text>
            </g>

            <!-- 4. طبقة الشرايين ومناطق الخطر التجميلية (Vascular Danger Layer) -->
            <g id="arteries-layer" class="anatomy-layer">
                <!-- الشريان الوجهي (Facial Artery) - الجانب الأيسر -->
                <path id="facialArteryLeft" class="artery-path" d="
                    M 140 500 
                    C 160 480, 185 465, 205 450 
                    C 215 425, 222 410, 228 385 
                    C 234 350, 237 320, 240 280" 
                    fill="none" 
                    stroke="#D63030" 
                    stroke-width="3" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" />

                <!-- الشريان الوجهي (Facial Artery) - الجانب الأيمن -->
                <path id="facialArteryRight" class="artery-path" d="
                    M 396 500 
                    C 376 480, 351 465, 331 450 
                    C 321 425, 314 410, 308 385 
                    C 302 350, 299 320, 296 280" 
                    fill="none" 
                    stroke="#D63030" 
                    stroke-width="3" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" />

                <!-- الشريان الشفوي العلوي (Superior Labial Artery) -->
                <path d="M 205 442 Q 268 436 331 442" fill="none" stroke="#E54545" stroke-width="2.2" stroke-dasharray="4,2" />

                <!-- الشريان الشفوي السفلي (Inferior Labial Artery) -->
                <path d="M 205 464 Q 268 470 331 464" fill="none" stroke="#E54545" stroke-width="2.2" stroke-dasharray="4,2" />

                <!-- الشريان الصدغي السطحي (Superficial Temporal Artery) -->
                <path d="M 105 320 C 110 260, 120 210, 145 150" fill="none" stroke="#D63030" stroke-width="2.4" />
                <path d="M 120 210 C 135 180, 160 170, 180 165" fill="none" stroke="#D63030" stroke-width="1.8" />

                <path d="M 431 320 C 426 260, 416 210, 391 150" fill="none" stroke="#D63030" stroke-width="2.4" />
                <path d="M 416 210 C 401 180, 376 170, 356 165" fill="none" stroke="#D63030" stroke-width="1.8" />

                <!-- الشريان تحت الحجاج (Infraorbital Artery Branches) -->
                <circle cx="218" cy="335" r="5" fill="#B82020" />
                <circle cx="318" cy="335" r="5" fill="#B82020" />
                <path d="M 218 335 Q 225 350, 230 365" stroke="#B82020" stroke-width="1.8" fill="none" />
                <path d="M 318 335 Q 311 350, 306 365" stroke="#B82020" stroke-width="1.8" fill="none" />

                <!-- الثقبة والشريان الذقني (Mental Artery) -->
                <circle cx="225" cy="510" r="4.5" fill="#B82020" />
                <circle cx="311" cy="510" r="4.5" fill="#B82020" />

                <!-- نقاط الخطر الحساسة مع نبض لطيف (Danger Nodes) -->
                <g class="danger-nodes">
                    <!-- زاوية الأنف (Angular Artery / Pyriform) -->
                    <g class="danger-node" transform="translate(232, 385)">
                        <circle r="9" class="danger-pulse" />
                        <circle r="4" class="danger-center" />
                    </g>
                    <g class="danger-node" transform="translate(304, 385)">
                        <circle r="9" class="danger-pulse" />
                        <circle r="4" class="danger-center" />
                    </g>

                    <!-- زاوية الفم (Oral Commissure) -->
                    <g class="danger-node" transform="translate(205, 450)">
                        <circle r="8" class="danger-pulse" />
                        <circle r="4" class="danger-center" />
                    </g>
                    <g class="danger-node" transform="translate(331, 450)">
                        <circle r="8" class="danger-pulse" />
                        <circle r="4" class="danger-center" />
                    </g>

                    <!-- الحجاج وميزاب الدموع -->
                    <g class="danger-node" transform="translate(218, 335)">
                        <circle r="8" class="danger-pulse" />
                        <circle r="4" class="danger-center" />
                    </g>
                    <g class="danger-node" transform="translate(318, 335)">
                        <circle r="8" class="danger-pulse" />
                        <circle r="4" class="danger-center" />
                    </g>

                    <!-- الصدغ -->
                    <g class="danger-node" transform="translate(125, 235)">
                        <circle r="8" class="danger-pulse" />
                        <circle r="4" class="danger-center" />
                    </g>
                    <g class="danger-node" transform="translate(411, 235)">
                        <circle r="8" class="danger-pulse" />
                        <circle r="4" class="danger-center" />
                    </g>
                </g>
            </g>

            <!-- 5. طبقة محاكاة الامتلاء والتأثير التجميلي الحي (Realistic Filler Volumization Effect) -->
            <g id="filler-effects-layer" pointer-events="none">
                <!-- امتلاء الشفة العلوية -->
                <ellipse id="volLipsUpper" cx="268" cy="442" rx="36" ry="10" fill="url(#lipPlumpGradient)" opacity="0" filter="url(#softGlow)" />
                <!-- امتلاء الشفة السفلية -->
                <ellipse id="volLipsLower" cx="268" cy="462" rx="34" ry="13" fill="url(#lipPlumpGradient)" opacity="0" filter="url(#softGlow)" />
                <!-- لمعة وبريق النتيجة الطبيعية -->
                <ellipse id="volLipGloss" cx="268" cy="460" rx="14" ry="4" fill="#FFFFFF" opacity="0" />

                <!-- رفع وتحديد الوجنتين (Cheek Volumization & Contour Lift) -->
                <ellipse id="volCheekLeft" cx="190" cy="355" rx="36" ry="24" fill="url(#cheekLiftGradient)" opacity="0" filter="url(#softGlow)" />
                <ellipse id="volCheekRight" cx="346" cy="355" rx="36" ry="24" fill="url(#cheekLiftGradient)" opacity="0" filter="url(#softGlow)" />

                <!-- ملء وتنعيم طيات خط الابتسامة (Nasolabial Softening) -->
                <path id="volNlfLeft" d="M 226 385 C 220 405, 214 430, 206 448" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" opacity="0" filter="url(#softGlow)" />
                <path id="volNlfRight" d="M 310 385 C 316 405, 322 430, 330 448" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" opacity="0" filter="url(#softGlow)" />

                <!-- إنارة وتصحيح ميزاب الدموع (Tear Trough Brightening) -->
                <ellipse id="volTearLeft" cx="235" cy="305" rx="22" ry="10" fill="url(#tearBrightGradient)" opacity="0" filter="url(#softGlow)" />
                <ellipse id="volTearRight" cx="301" cy="305" rx="22" ry="10" fill="url(#tearBrightGradient)" opacity="0" filter="url(#softGlow)" />

                <!-- إسقاط ونحت الذقن والفك (Chin Projection & Jaw Sculpt) -->
                <ellipse id="volChin" cx="268" cy="542" rx="26" ry="16" fill="url(#chinProjectGradient)" opacity="0" filter="url(#softGlow)" />

                <!-- ملء الصدغ (Temporal Volume) -->
                <ellipse id="volTempleLeft" cx="125" cy="245" rx="18" ry="28" fill="#FFFFFF" opacity="0" filter="url(#softGlow)" />
                <ellipse id="volTempleRight" cx="411" cy="245" rx="18" ry="28" fill="#FFFFFF" opacity="0" filter="url(#softGlow)" />
            </g>

            <!-- 6. نقاط الحقن التفاعلية المتطابقة مع الوجه (Interactive Hotspots - 100% Calibrated) -->
            <g id="hotspots-layer">
                <!-- 1. الشفاه -->
                <g class="injection-spot" data-zone="lips" transform="translate(268, 452)" tabindex="0" role="button" aria-label="منطقة حقن الشفاه">
                    <circle r="26" class="spot-hit-area" />
                    <circle r="14" class="spot-outer-ring" />
                    <circle r="6" class="spot-center" />
                    <text y="30" class="spot-badge-text">الشفاه</text>
                </g>

                <!-- 2. طيات الابتسامة -->
                <g class="injection-spot" data-zone="nasolabial" transform="translate(225, 395)" tabindex="0" role="button" aria-label="منطقة طية الابتسامة اليسرى">
                    <circle r="24" class="spot-hit-area" />
                    <circle r="13" class="spot-outer-ring" />
                    <circle r="5" class="spot-center" />
                    <text x="-20" y="4" class="spot-badge-text" text-anchor="end">طية الابتسامة</text>
                </g>
                <g class="injection-spot" data-zone="nasolabial" transform="translate(311, 395)" tabindex="0" role="button" aria-label="منطقة طية الابتسامة اليمنى">
                    <circle r="24" class="spot-hit-area" />
                    <circle r="13" class="spot-outer-ring" />
                    <circle r="5" class="spot-center" />
                    <text x="20" y="4" class="spot-badge-text" text-anchor="start">طية الابتسامة</text>
                </g>

                <!-- 3. الخدود والوجنة -->
                <g class="injection-spot" data-zone="cheeks" transform="translate(190, 355)" tabindex="0" role="button" aria-label="منطقة تفاحة الخد والوجنة اليسرى">
                    <circle r="26" class="spot-hit-area" />
                    <circle r="13" class="spot-outer-ring" />
                    <circle r="5" class="spot-center" />
                    <text x="-20" y="4" class="spot-badge-text" text-anchor="end">الوجنة</text>
                </g>
                <g class="injection-spot" data-zone="cheeks" transform="translate(346, 355)" tabindex="0" role="button" aria-label="منطقة تفاحة الخد والوجنة اليمنى">
                    <circle r="26" class="spot-hit-area" />
                    <circle r="13" class="spot-outer-ring" />
                    <circle r="5" class="spot-center" />
                    <text x="20" y="4" class="spot-badge-text" text-anchor="start">الوجنة</text>
                </g>

                <!-- 4. ميزاب الدموع وتحت العين -->
                <g class="injection-spot" data-zone="tear_trough" transform="translate(235, 305)" tabindex="0" role="button" aria-label="منطقة ميزاب الدموع الأيسر">
                    <circle r="22" class="spot-hit-area" />
                    <circle r="12" class="spot-outer-ring spot-critical" />
                    <circle r="5" class="spot-center spot-critical-center" />
                    <text x="-16" y="-12" class="spot-badge-text" text-anchor="end">ميزاب الدموع</text>
                </g>
                <g class="injection-spot" data-zone="tear_trough" transform="translate(301, 305)" tabindex="0" role="button" aria-label="منطقة ميزاب الدموع الأيمن">
                    <circle r="22" class="spot-hit-area" />
                    <circle r="12" class="spot-outer-ring spot-critical" />
                    <circle r="5" class="spot-center spot-critical-center" />
                    <text x="16" y="-12" class="spot-badge-text" text-anchor="start">ميزاب الدموع</text>
                </g>

                <!-- 5. خطوط الماريونيت -->
                <g class="injection-spot" data-zone="marionette" transform="translate(210, 480)" tabindex="0" role="button" aria-label="منطقة خط الماريونيت الأيسر">
                    <circle r="20" class="spot-hit-area" />
                    <circle r="11" class="spot-outer-ring" />
                    <circle r="4.5" class="spot-center" />
                </g>
                <g class="injection-spot" data-zone="marionette" transform="translate(326, 480)" tabindex="0" role="button" aria-label="منطقة خط الماريونيت الأيمن">
                    <circle r="20" class="spot-hit-area" />
                    <circle r="11" class="spot-outer-ring" />
                    <circle r="4.5" class="spot-center" />
                </g>

                <!-- 6. الذقن ونحت الفك -->
                <g class="injection-spot" data-zone="chin_jaw" transform="translate(268, 542)" tabindex="0" role="button" aria-label="منطقة نحت الذقن والفك">
                    <circle r="26" class="spot-hit-area" />
                    <circle r="14" class="spot-outer-ring" />
                    <circle r="6" class="spot-center" />
                    <text y="28" class="spot-badge-text">الذقن والفك</text>
                </g>

                <!-- 7. تجويف الصدغ -->
                <g class="injection-spot" data-zone="temple" transform="translate(125, 245)" tabindex="0" role="button" aria-label="منطقة الصدغ الأيسر">
                    <circle r="24" class="spot-hit-area" />
                    <circle r="12" class="spot-outer-ring spot-critical" />
                    <circle r="5" class="spot-center spot-critical-center" />
                    <text x="-16" y="4" class="spot-badge-text" text-anchor="end">الصدغ</text>
                </g>
                <g class="injection-spot" data-zone="temple" transform="translate(411, 245)" tabindex="0" role="button" aria-label="منطقة الصدغ الأيمن">
                    <circle r="24" class="spot-hit-area" />
                    <circle r="12" class="spot-outer-ring spot-critical" />
                    <circle r="5" class="spot-center spot-critical-center" />
                    <text x="16" y="4" class="spot-badge-text" text-anchor="start">الصدغ</text>
                </g>
            </g>
        </svg>
        `;

        this.container.innerHTML = svgMarkup;
    }

    // تحديث التأثير البصري لحجم الفيلر بواقعية تامة
    updateVolumeEffect(zoneId, dosage) {
        this.fillerLevels[zoneId] = dosage;
        const normalized = Math.min(dosage / 1.5, 1.0);

        switch (zoneId) {
            case 'lips':
                const upLip = document.getElementById('volLipsUpper');
                const lowLip = document.getElementById('volLipsLower');
                const gloss = document.getElementById('volLipGloss');
                if (upLip && lowLip) {
                    upLip.style.opacity = (normalized * 0.72).toString();
                    upLip.setAttribute('ry', (10 + normalized * 5).toString());
                    lowLip.style.opacity = (normalized * 0.82).toString();
                    lowLip.setAttribute('ry', (13 + normalized * 6).toString());
                    if (gloss) gloss.style.opacity = (normalized * 0.45).toString();
                }
                break;
            case 'nasolabial':
                const nlfL = document.getElementById('volNlfLeft');
                const nlfR = document.getElementById('volNlfRight');
                if (nlfL && nlfR) {
                    nlfL.style.opacity = (normalized * 0.65).toString();
                    nlfR.style.opacity = (normalized * 0.65).toString();
                }
                break;
            case 'cheeks':
                const chkL = document.getElementById('volCheekLeft');
                const chkR = document.getElementById('volCheekRight');
                if (chkL && chkR) {
                    chkL.style.opacity = (normalized * 0.65).toString();
                    chkL.setAttribute('rx', (36 + normalized * 8).toString());
                    chkR.style.opacity = (normalized * 0.65).toString();
                    chkR.setAttribute('rx', (36 + normalized * 8).toString());
                }
                break;
            case 'tear_trough':
                const tearL = document.getElementById('volTearLeft');
                const tearR = document.getElementById('volTearRight');
                if (tearL && tearR) {
                    tearL.style.opacity = (normalized * 0.6).toString();
                    tearR.style.opacity = (normalized * 0.6).toString();
                }
                break;
            case 'chin_jaw':
                const chin = document.getElementById('volChin');
                if (chin) {
                    chin.style.opacity = (normalized * 0.65).toString();
                    chin.setAttribute('ry', (16 + normalized * 7).toString());
                }
                break;
            case 'temple':
                const tmpL = document.getElementById('volTempleLeft');
                const tmpR = document.getElementById('volTempleRight');
                if (tmpL && tmpR) {
                    tmpL.style.opacity = (normalized * 0.55).toString();
                    tmpR.style.opacity = (normalized * 0.55).toString();
                }
                break;
        }
    }

    // تفعيل أو تعطيل شبكة النسبة الذهبية
    toggleGoldenRatio() {
        this.showGoldenRatio = !this.showGoldenRatio;
        const layer = document.getElementById('golden-ratio-layer');
        if (layer) {
            layer.classList.toggle('hidden-layer', !this.showGoldenRatio);
        }
        return this.showGoldenRatio;
    }

    // إعادة تعيين كافة أحجام الفيلر المحقونة
    resetAllVolumes() {
        Object.keys(this.fillerLevels).forEach(z => {
            this.updateVolumeEffect(z, 0);
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FaceSVGGenerator;
}
