/**
 * KERA - مولد الخريطة التشريحية التفاعلية للوجه (Realistic Portrait + Precision SVG Overlay)
 * فائق الواقعية، خفيف وسريع، بدقة تشريحية تطابق الوجه البشري الحقيقي 100%
 * يتضمن محاكاة بصرية حية للنتائج الصحيحة والمضاعفات السريرية (النخر، تيندال، الورم الدموي، التكتل)
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
        this.activeComplication = null;
    }

    render() {
        if (!this.container) return;

        const svgMarkup = `
        <svg viewBox="0 0 536 680" class="kera-face-svg" id="faceSvg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="خريطة تشريح الوجه التجميلية الحقيقية">
            <defs>
                <!-- فلاتر الإضاءة والتنعيم لامتلاء الفيلر الصحيح -->
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

                <!-- تدرجات المضاعفات والأخطاء السريرية البصرية الحقيقية -->
                <!-- 1. نخر إقفاري وابيضاض جلدي شاحب مع شبكة بنفسجية (Ischemic Necrosis / Blanching) -->
                <radialGradient id="necrosisGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#F0ECE1" stop-opacity="0.95" />
                    <stop offset="35%" stop-color="#B88A96" stop-opacity="0.85" />
                    <stop offset="75%" stop-color="#542938" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#381924" stop-opacity="0" />
                </radialGradient>

                <!-- 2. ظاهرة تيندال المزرق المائي (Tyndall Effect Bluish Discoloration) -->
                <radialGradient id="tyndallGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#7DA0B8" stop-opacity="0.9" />
                    <stop offset="50%" stop-color="#557C9C" stop-opacity="0.7" />
                    <stop offset="85%" stop-color="#3D6382" stop-opacity="0.4" />
                    <stop offset="100%" stop-color="#3D6382" stop-opacity="0" />
                </radialGradient>

                <!-- 3. ورم دموي وكدمة شريانية عميقة (Hematoma / Ecchymosis) -->
                <radialGradient id="hematomaGradient" cx="45%" cy="45%" r="50%">
                    <stop offset="0%" stop-color="#3B101E" stop-opacity="0.92" />
                    <stop offset="45%" stop-color="#5C1630" stop-opacity="0.8" />
                    <stop offset="80%" stop-color="#7D3249" stop-opacity="0.5" />
                    <stop offset="100%" stop-color="#7D3249" stop-opacity="0" />
                </radialGradient>

                <!-- 4. تكتل مفرط شاذ غير متناسق (Overfill / Duck Lip Bump) -->
                <radialGradient id="overfillGradient" cx="50%" cy="35%" r="55%">
                    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
                    <stop offset="40%" stop-color="#DE8C88" stop-opacity="0.8" />
                    <stop offset="85%" stop-color="#9E443F" stop-opacity="0.6" />
                    <stop offset="100%" stop-color="#9E443F" stop-opacity="0" />
                </radialGradient>

                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            <!-- 1. صورة الوجه البشري التجميلي الحقيقي فائق الوضوح (Base Real Face Layer) -->
            <g id="real-face-layer">
                <image id="baseFaceImage" href="assets/face_portrait_cropped.jpg" xlink:href="assets/face_portrait_cropped.jpg" width="536" height="680" x="0" y="0" preserveAspectRatio="xMidYMid slice" />
                <rect id="anatomyBackdrop" width="536" height="680" fill="#1C1F22" opacity="0" style="transition: opacity 0.35s ease; pointer-events: none;" />
            </g>

            <!-- 2. شبكة النسبة الذهبية وأثلاث الوجه الجمالية (Golden Ratio & Thirds Grid) -->
            <g id="golden-ratio-layer" class="anatomy-layer hidden-layer" pointer-events="none">
                <line x1="80" y1="130" x2="456" y2="130" stroke="#C49A88" stroke-width="1.2" stroke-dasharray="4,4" />
                <line x1="80" y1="245" x2="456" y2="245" stroke="#C49A88" stroke-width="1.2" stroke-dasharray="4,4" />
                <line x1="80" y1="420" x2="456" y2="420" stroke="#C49A88" stroke-width="1.2" stroke-dasharray="4,4" />
                <line x1="80" y1="550" x2="456" y2="550" stroke="#C49A88" stroke-width="1.2" stroke-dasharray="4,4" />
                <line x1="268" y1="80" x2="268" y2="600" stroke="#B87363" stroke-width="1.4" stroke-dasharray="5,3" />

                <rect x="390" y="180" width="130" height="24" rx="4" fill="#FFFFFF" fill-opacity="0.85" />
                <text x="455" y="196" class="ratio-label" text-anchor="middle">الثلث العلوي (1/3)</text>

                <rect x="390" y="325" width="130" height="24" rx="4" fill="#FFFFFF" fill-opacity="0.85" />
                <text x="455" y="341" class="ratio-label" text-anchor="middle">الثلث الأوسط (1/3)</text>

                <rect x="390" y="475" width="130" height="24" rx="4" fill="#FFFFFF" fill-opacity="0.85" />
                <text x="455" y="491" class="ratio-label" text-anchor="middle">الثلث السفلي (1/3)</text>
            </g>

            <!-- 3. طبقة العضلات التعبيرية (Muscular Anatomy Layer) -->
            <g id="muscles-layer" class="anatomy-layer hidden-layer" opacity="0.88">
                <path d="M 180 130 C 230 115, 306 115, 356 130 L 366 225 C 310 215, 226 215, 170 225 Z" 
                      fill="#D65A54" fill-opacity="0.42" stroke="#B83832" stroke-width="1.2" stroke-dasharray="3,2" />
                <text x="268" y="175" class="anatomy-label" text-anchor="middle">Frontalis (الجبهية)</text>

                <ellipse cx="218" cy="275" rx="46" ry="34" fill="#D65A54" fill-opacity="0.38" stroke="#B83832" stroke-width="1.2" stroke-dasharray="3,2" />
                <ellipse cx="318" cy="275" rx="46" ry="34" fill="#D65A54" fill-opacity="0.38" stroke="#B83832" stroke-width="1.2" stroke-dasharray="3,2" />

                <path d="M 155 335 L 210 445" stroke="#C44840" stroke-width="11" stroke-linecap="round" stroke-opacity="0.5" />
                <path d="M 381 335 L 326 445" stroke="#C44840" stroke-width="11" stroke-linecap="round" stroke-opacity="0.5" />
                <text x="145" y="390" class="anatomy-label-small" text-anchor="middle">Zygomaticus</text>
                <text x="391" y="390" class="anatomy-label-small" text-anchor="middle">Zygomaticus</text>

                <ellipse cx="268" cy="452" rx="64" ry="36" fill="#D65A54" fill-opacity="0.4" stroke="#B83832" stroke-width="1.2" stroke-dasharray="3,2" />
                <text x="268" y="492" class="anatomy-label-small" text-anchor="middle">Orbicularis Oris (الدويرية الفموية)</text>

                <path d="M 210 455 L 200 520" stroke="#C44840" stroke-width="8" stroke-linecap="round" stroke-opacity="0.45" />
                <path d="M 326 455 L 336 520" stroke="#C44840" stroke-width="8" stroke-linecap="round" stroke-opacity="0.45" />
                <text x="180" y="500" class="anatomy-label-small" text-anchor="middle">DAO</text>
                <text x="356" y="500" class="anatomy-label-small" text-anchor="middle">DAO</text>

                <rect x="110" y="380" width="35" height="95" rx="6" fill="#D65A54" fill-opacity="0.32" stroke="#B83832" />
                <rect x="391" y="380" width="35" height="95" rx="6" fill="#D65A54" fill-opacity="0.32" stroke="#B83832" />
                <text x="127" y="435" class="anatomy-label-small" text-anchor="middle">Masseter</text>
                <text x="408" y="435" class="anatomy-label-small" text-anchor="middle">Masseter</text>
            </g>

            <!-- 4. طبقة الشرايين ومناطق الخطر التجميلية (Vascular Danger Layer) -->
            <g id="arteries-layer" class="anatomy-layer">
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

                <path d="M 205 442 Q 268 436 331 442" fill="none" stroke="#E54545" stroke-width="2.2" stroke-dasharray="4,2" />
                <path d="M 205 464 Q 268 470 331 464" fill="none" stroke="#E54545" stroke-width="2.2" stroke-dasharray="4,2" />

                <path d="M 105 320 C 110 260, 120 210, 145 150" fill="none" stroke="#D63030" stroke-width="2.4" />
                <path d="M 120 210 C 135 180, 160 170, 180 165" fill="none" stroke="#D63030" stroke-width="1.8" />

                <path d="M 431 320 C 426 260, 416 210, 391 150" fill="none" stroke="#D63030" stroke-width="2.4" />
                <path d="M 416 210 C 401 180, 376 170, 356 165" fill="none" stroke="#D63030" stroke-width="1.8" />

                <circle cx="218" cy="335" r="5" fill="#B82020" />
                <circle cx="318" cy="335" r="5" fill="#B82020" />
                <path d="M 218 335 Q 225 350, 230 365" stroke="#B82020" stroke-width="1.8" fill="none" />
                <path d="M 318 335 Q 311 350, 306 365" stroke="#B82020" stroke-width="1.8" fill="none" />

                <circle cx="225" cy="510" r="4.5" fill="#B82020" />
                <circle cx="311" cy="510" r="4.5" fill="#B82020" />

                <g class="danger-nodes">
                    <g class="danger-node" transform="translate(232, 385)">
                        <circle r="9" class="danger-pulse" />
                        <circle r="4" class="danger-center" />
                    </g>
                    <g class="danger-node" transform="translate(304, 385)">
                        <circle r="9" class="danger-pulse" />
                        <circle r="4" class="danger-center" />
                    </g>

                    <g class="danger-node" transform="translate(205, 450)">
                        <circle r="8" class="danger-pulse" />
                        <circle r="4" class="danger-center" />
                    </g>
                    <g class="danger-node" transform="translate(331, 450)">
                        <circle r="8" class="danger-pulse" />
                        <circle r="4" class="danger-center" />
                    </g>

                    <g class="danger-node" transform="translate(218, 335)">
                        <circle r="8" class="danger-pulse" />
                        <circle r="4" class="danger-center" />
                    </g>
                    <g class="danger-node" transform="translate(318, 335)">
                        <circle r="8" class="danger-pulse" />
                        <circle r="4" class="danger-center" />
                    </g>

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

            <!-- 5. طبقة محاكاة الامتلاء والتأثير التجميلي الصحيح (Correct Aesthetic Outcomes Layer) -->
            <g id="filler-effects-layer" pointer-events="none">
                <ellipse id="volLipsUpper" cx="268" cy="442" rx="36" ry="10" fill="url(#lipPlumpGradient)" opacity="0" filter="url(#softGlow)" />
                <ellipse id="volLipsLower" cx="268" cy="462" rx="34" ry="13" fill="url(#lipPlumpGradient)" opacity="0" filter="url(#softGlow)" />
                <ellipse id="volLipGloss" cx="268" cy="460" rx="14" ry="4" fill="#FFFFFF" opacity="0" />

                <ellipse id="volCheekLeft" cx="190" cy="355" rx="36" ry="24" fill="url(#cheekLiftGradient)" opacity="0" filter="url(#softGlow)" />
                <ellipse id="volCheekRight" cx="346" cy="355" rx="36" ry="24" fill="url(#cheekLiftGradient)" opacity="0" filter="url(#softGlow)" />

                <path id="volNlfLeft" d="M 226 385 C 220 405, 214 430, 206 448" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" opacity="0" filter="url(#softGlow)" />
                <path id="volNlfRight" d="M 310 385 C 316 405, 322 430, 330 448" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" opacity="0" filter="url(#softGlow)" />

                <ellipse id="volTearLeft" cx="235" cy="305" rx="22" ry="10" fill="url(#tearBrightGradient)" opacity="0" filter="url(#softGlow)" />
                <ellipse id="volTearRight" cx="301" cy="305" rx="22" ry="10" fill="url(#tearBrightGradient)" opacity="0" filter="url(#softGlow)" />

                <ellipse id="volChin" cx="268" cy="542" rx="26" ry="16" fill="url(#chinProjectGradient)" opacity="0" filter="url(#softGlow)" />

                <ellipse id="volTempleLeft" cx="125" cy="245" rx="18" ry="28" fill="#FFFFFF" opacity="0" filter="url(#softGlow)" />
                <ellipse id="volTempleRight" cx="411" cy="245" rx="18" ry="28" fill="#FFFFFF" opacity="0" filter="url(#softGlow)" />
            </g>

            <!-- 6. طبقة المضاعفات والأخطاء السريرية البصرية (Visual Complications Layer) -->
            <g id="complications-layer" pointer-events="none">
                <!-- أ. نخر إقفاري وابيضاض على جناح الأنف (Alar Necrosis) -->
                <g id="compNecrosisAlar" class="comp-element" opacity="0">
                    <ellipse cx="232" cy="385" rx="24" ry="32" fill="url(#necrosisGradient)" />
                    <!-- شبكة أوعية متشنجة متخثرة (Livedo Reticularis) -->
                    <path d="M 220 375 Q 232 385 240 395 M 225 390 Q 235 382 242 388" stroke="#4A1E2B" stroke-width="1.4" opacity="0.8" />
                </g>

                <!-- ب. نخر شاحب وابيضاض على الشفة (Labial Necrosis) -->
                <g id="compNecrosisLip" class="comp-element" opacity="0">
                    <ellipse cx="250" cy="442" rx="28" ry="16" fill="url(#necrosisGradient)" />
                </g>

                <!-- ج. نخر وانسداد الصدغ وفروة الرأس (Temporal Necrosis) -->
                <g id="compNecrosisTemple" class="comp-element" opacity="0">
                    <ellipse cx="125" cy="235" rx="30" ry="42" fill="url(#necrosisGradient)" />
                </g>

                <!-- د. ظاهرة تيندال وتكتل مزرق تحت العين (Tear Trough Tyndall) -->
                <g id="compTyndallTear" class="comp-element" opacity="0">
                    <ellipse cx="235" cy="308" rx="25" ry="12" fill="url(#tyndallGradient)" filter="url(#softGlow)" />
                    <ellipse cx="235" cy="306" rx="9" ry="5" fill="#FFFFFF" opacity="0.35" />
                </g>

                <!-- هـ. ورم دموي عميق وكدمة بالخد (Malar Hematoma) -->
                <g id="compHematomaCheek" class="comp-element" opacity="0">
                    <ellipse cx="190" cy="355" rx="32" ry="24" fill="url(#hematomaGradient)" />
                </g>

                <!-- و. ورم دموي عند زاوية الفم (Commissure Hematoma) -->
                <g id="compHematomaMouth" class="comp-element" opacity="0">
                    <ellipse cx="205" cy="455" rx="22" ry="18" fill="url(#hematomaGradient)" />
                </g>

                <!-- ز. تشوه المنقار وبروز الشفاه الشاذ (Duck Lips Deformity) -->
                <g id="compOverfillLip" class="comp-element" opacity="0">
                    <ellipse cx="268" cy="440" rx="42" ry="16" fill="url(#overfillGradient)" />
                    <ellipse cx="268" cy="464" rx="40" ry="18" fill="url(#overfillGradient)" />
                </g>

                <!-- ح. انتفاخ وسادة الخد الشاذ (Pillow Face Overfill) -->
                <g id="compOverfillCheek" class="comp-element" opacity="0">
                    <ellipse cx="190" cy="355" rx="48" ry="36" fill="url(#overfillGradient)" opacity="0.75" />
                    <ellipse cx="346" cy="355" rx="48" ry="36" fill="url(#overfillGradient)" opacity="0.75" />
                </g>
            </g>

            <!-- 7. نقاط الحقن التفاعلية المتطابقة مع الوجه (Interactive Hotspots) -->
            <g id="hotspots-layer">
                <g class="injection-spot" data-zone="lips" transform="translate(268, 452)" tabindex="0" role="button" aria-label="منطقة حقن الشفاه">
                    <circle r="26" class="spot-hit-area" />
                    <circle r="14" class="spot-outer-ring" />
                    <circle r="6" class="spot-center" />
                    <text y="30" class="spot-badge-text">الشفاه L1-L3</text>
                </g>

                <g class="injection-spot" data-zone="nasolabial" transform="translate(225, 395)" tabindex="0" role="button" aria-label="منطقة طية الابتسامة اليسرى">
                    <circle r="24" class="spot-hit-area" />
                    <circle r="13" class="spot-outer-ring" />
                    <circle r="5" class="spot-center" />
                    <text x="-20" y="4" class="spot-badge-text" text-anchor="end">طية NL1</text>
                </g>
                <g class="injection-spot" data-zone="nasolabial" transform="translate(311, 395)" tabindex="0" role="button" aria-label="منطقة طية الابتسامة اليمنى">
                    <circle r="24" class="spot-hit-area" />
                    <circle r="13" class="spot-outer-ring" />
                    <circle r="5" class="spot-center" />
                    <text x="20" y="4" class="spot-badge-text" text-anchor="start">طية NL1</text>
                </g>

                <g class="injection-spot" data-zone="cheeks" transform="translate(190, 355)" tabindex="0" role="button" aria-label="منطقة تفاحة الخد والوجنة اليسرى">
                    <circle r="26" class="spot-hit-area" />
                    <circle r="13" class="spot-outer-ring" />
                    <circle r="5" class="spot-center" />
                    <text x="-20" y="4" class="spot-badge-text" text-anchor="end">الوجنة Ck1-3</text>
                </g>
                <g class="injection-spot" data-zone="cheeks" transform="translate(346, 355)" tabindex="0" role="button" aria-label="منطقة تفاحة الخد والوجنة اليمنى">
                    <circle r="26" class="spot-hit-area" />
                    <circle r="13" class="spot-outer-ring" />
                    <circle r="5" class="spot-center" />
                    <text x="20" y="4" class="spot-badge-text" text-anchor="start">الوجنة Ck1-3</text>
                </g>

                <g class="injection-spot" data-zone="tear_trough" transform="translate(235, 305)" tabindex="0" role="button" aria-label="منطقة ميزاب الدموع الأيسر">
                    <circle r="22" class="spot-hit-area" />
                    <circle r="12" class="spot-outer-ring spot-critical" />
                    <circle r="5" class="spot-center spot-critical-center" />
                    <text x="-16" y="-12" class="spot-badge-text" text-anchor="end">الدموع Tt1</text>
                </g>
                <g class="injection-spot" data-zone="tear_trough" transform="translate(301, 305)" tabindex="0" role="button" aria-label="منطقة ميزاب الدموع الأيمن">
                    <circle r="22" class="spot-hit-area" />
                    <circle r="12" class="spot-outer-ring spot-critical" />
                    <circle r="5" class="spot-center spot-critical-center" />
                    <text x="16" y="-12" class="spot-badge-text" text-anchor="start">الدموع Tt1</text>
                </g>

                <g class="injection-spot" data-zone="marionette" transform="translate(210, 480)" tabindex="0" role="button" aria-label="منطقة خط الماريونيت الأيسر">
                    <circle r="20" class="spot-hit-area" />
                    <circle r="11" class="spot-outer-ring" />
                    <circle r="4.5" class="spot-center" />
                    <text x="-16" y="4" class="spot-badge-text" text-anchor="end">M1</text>
                </g>
                <g class="injection-spot" data-zone="marionette" transform="translate(326, 480)" tabindex="0" role="button" aria-label="منطقة خط الماريونيت الأيمن">
                    <circle r="20" class="spot-hit-area" />
                    <circle r="11" class="spot-outer-ring" />
                    <circle r="4.5" class="spot-center" />
                    <text x="16" y="4" class="spot-badge-text" text-anchor="start">M1</text>
                </g>

                <g class="injection-spot" data-zone="chin_jaw" transform="translate(268, 542)" tabindex="0" role="button" aria-label="منطقة نحت الذقن والفك">
                    <circle r="26" class="spot-hit-area" />
                    <circle r="14" class="spot-outer-ring" />
                    <circle r="6" class="spot-center" />
                    <text y="28" class="spot-badge-text">الذقن C1-C2</text>
                </g>

                <g class="injection-spot" data-zone="temple" transform="translate(125, 245)" tabindex="0" role="button" aria-label="منطقة الصدغ الأيسر">
                    <circle r="24" class="spot-hit-area" />
                    <circle r="12" class="spot-outer-ring spot-critical" />
                    <circle r="5" class="spot-center spot-critical-center" />
                    <text x="-16" y="4" class="spot-badge-text" text-anchor="end">الصدغ T1</text>
                </g>
                <g class="injection-spot" data-zone="temple" transform="translate(411, 245)" tabindex="0" role="button" aria-label="منطقة الصدغ الأيمن">
                    <circle r="24" class="spot-hit-area" />
                    <circle r="12" class="spot-outer-ring spot-critical" />
                    <circle r="5" class="spot-center spot-critical-center" />
                    <text x="16" y="4" class="spot-badge-text" text-anchor="start">الصدغ T1</text>
                </g>
            </g>
        </svg>
        `;

        this.container.innerHTML = svgMarkup;
    }

    // تحديث التأثير البصري لحجم الفيلر الصحيح
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

    // إظهار المضاعفة السريرية البصرية الحقيقية على الوجه
    showVisualComplication(compType, zoneId) {
        this.clearVisualComplications();
        this.activeComplication = { type: compType, zoneId: zoneId };

        let elementId = null;
        if (compType === 'necrosis') {
            if (zoneId === 'nasolabial') elementId = 'compNecrosisAlar';
            else if (zoneId === 'lips') elementId = 'compNecrosisLip';
            else if (zoneId === 'temple') elementId = 'compNecrosisTemple';
            else elementId = 'compNecrosisAlar';
        } else if (compType === 'tyndall') {
            elementId = 'compTyndallTear';
        } else if (compType === 'hematoma') {
            if (zoneId === 'cheeks') elementId = 'compHematomaCheek';
            else elementId = 'compHematomaMouth';
        } else if (compType === 'overfill') {
            if (zoneId === 'lips') elementId = 'compOverfillLip';
            else if (zoneId === 'cheeks') elementId = 'compOverfillCheek';
            else elementId = 'compOverfillLip';
        }

        if (elementId) {
            const el = document.getElementById(elementId);
            if (el) {
                el.style.opacity = '1';
                el.classList.add('active-complication');
            }
        }
    }

    // تنظيف المضاعفات البصرية عند تصحيح الإجراء
    clearVisualComplications() {
        this.activeComplication = null;
        document.querySelectorAll('.comp-element').forEach(el => {
            el.style.opacity = '0';
            el.classList.remove('active-complication');
        });
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
        this.clearVisualComplications();
        Object.keys(this.fillerLevels).forEach(z => {
            this.updateVolumeEffect(z, 0);
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FaceSVGGenerator;
}
