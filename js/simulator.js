/**
 * KERA - محرك المحاكاة السريرية والتحقق من الأمان
 * معالجة التفاعل، فحص الأمان، الجرعات، والأصوات التفاعلية
 */

class FillerSimulator {
    constructor(svgGenerator) {
        this.svgGen = svgGenerator;
        this.currentZone = ANATOMY_DATA.zones[0]; // الافتراضي: الشفاه
        this.currentLayer = 'safety'; // aesthetic, safety, muscles, xray
        this.injectedHistory = {}; // تخزين ما تم حقنه في كل منطقة

        this.state = {
            tool: 'needle', // needle, cannula
            depth: 'submucosal', // superficial, subdermal, deep
            gPrime: 'soft', // soft, medium, firm
            dosage: 0.5
        };

        // تهيئة محرك الصوت التفاعلي الهادئ (Web Audio API)
        this.audioCtx = null;
        this.isMuted = false;
    }

    init() {
        this.bindEvents();
        this.switchLayer('safety');
        this.selectZone('lips');
    }

    // تبديل كتم الصوت
    toggleSound() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    // تشغيل نغمة نقر طبية لطيفة وغير مزعجة (Audio Feedback)
    playTone(type = 'click') {
        if (this.isMuted) return;
        try {
            if (!this.audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) this.audioCtx = new AudioContext();
            }
            if (!this.audioCtx || this.audioCtx.state === 'suspended') {
                this.audioCtx?.resume();
            }
            const ctx = this.audioCtx;
            if (!ctx) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;
            if (type === 'click') {
                osc.frequency.setValueAtTime(480, now);
                osc.frequency.exponentialRampToValueAtTime(240, now + 0.05);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'warning') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(280, now);
                osc.frequency.setValueAtTime(220, now + 0.08);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            } else if (type === 'success') {
                osc.frequency.setValueAtTime(520, now);
                osc.frequency.exponentialRampToValueAtTime(780, now + 0.09);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            }
        } catch (e) {
            // صامت في حال عدم دعم الصوت
        }
    }

    // ربط الأحداث وعناصر التحكم
    bindEvents() {
        // 1. أزرار تبديل الطبقات التشريحية
        document.querySelectorAll('.layer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const layer = btn.getAttribute('data-layer');
                this.switchLayer(layer);
                this.playTone('click');
            });
        });

        // 2. النقر على نقاط الحقن في الـ SVG
        const svgElem = document.getElementById('faceSvg');
        if (svgElem) {
            svgElem.addEventListener('click', (e) => {
                const spot = e.target.closest('.injection-spot');
                if (spot) {
                    const zoneId = spot.getAttribute('data-zone');
                    this.selectZone(zoneId);
                    this.playTone('click');
                }
            });
        }

        // 3. أشرطة وخيارات التحكم في اللوحة
        const dosageSlider = document.getElementById('dosageSlider');
        if (dosageSlider) {
            dosageSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                this.state.dosage = val;
                const dosageValEl = document.getElementById('dosageValue');
                if (dosageValEl) dosageValEl.textContent = `${val.toFixed(2)} ml`;
                this.svgGen.updateVolumeEffect(this.currentZone.id, val);
                this.evaluateSafety();
            });
        }

        // اختيار الأداة (Needle / Cannula)
        document.querySelectorAll('input[name="toolType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.state.tool = e.target.value;
                this.playTone('click');
                this.evaluateSafety();
            });
        });

        // اختيار عمق الحقن
        document.querySelectorAll('input[name="depthType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.state.depth = e.target.value;
                this.playTone('click');
                this.evaluateSafety();
            });
        });

        // اختيار قوام الفيلر (G-Prime)
        document.querySelectorAll('input[name="gPrimeType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.state.gPrime = e.target.value;
                this.playTone('click');
                this.evaluateSafety();
            });
        });

        // زر اعتماد الحقن في السجل السريري
        const applyBtn = document.getElementById('applyInjectBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.recordInjection();
                this.playTone('success');
            });
        }

        // زر إعادة تعيين الجلسة بالكامل
        const resetBtn = document.getElementById('resetSessionBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSession();
                this.playTone('click');
            });
        }
    }

    // تبديل الطبقات التشريحية
    switchLayer(layerName) {
        this.currentLayer = layerName;

        // تحديث الأزرار
        document.querySelectorAll('.layer-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-layer') === layerName);
        });

        const backdrop = document.getElementById('anatomyBackdrop');
        const musclesLayer = document.getElementById('muscles-layer');
        const arteriesLayer = document.getElementById('arteries-layer');

        if (!musclesLayer || !arteriesLayer) return;

        // تطبيق الرؤية والشفافية المناسبة لكل نمط فوق الوجه الحقيقي
        switch (layerName) {
            case 'aesthetic':
                if (backdrop) backdrop.style.opacity = '0';
                musclesLayer.classList.add('hidden-layer');
                arteriesLayer.style.opacity = '0';
                arteriesLayer.classList.add('hidden-layer');
                break;
            case 'safety':
                if (backdrop) backdrop.style.opacity = '0.22';
                musclesLayer.classList.add('hidden-layer');
                arteriesLayer.classList.remove('hidden-layer');
                arteriesLayer.style.opacity = '1';
                break;
            case 'muscles':
                if (backdrop) backdrop.style.opacity = '0.38';
                musclesLayer.classList.remove('hidden-layer');
                arteriesLayer.classList.add('hidden-layer');
                arteriesLayer.style.opacity = '0';
                break;
            case 'xray':
                if (backdrop) backdrop.style.opacity = '0.32';
                musclesLayer.classList.remove('hidden-layer');
                arteriesLayer.classList.remove('hidden-layer');
                arteriesLayer.style.opacity = '0.9';
                break;
        }
    }

    // اختيار منطقة حقن محددة
    selectZone(zoneId) {
        const zone = ANATOMY_DATA.zones.find(z => z.id === zoneId);
        if (!zone) return;
        this.currentZone = zone;

        // تحديث التحديد على الـ SVG
        document.querySelectorAll('.injection-spot').forEach(spot => {
            const isMatch = spot.getAttribute('data-zone') === zoneId;
            spot.classList.toggle('selected-spot', isMatch);
        });

        // استعادة الحالة إذا كانت مسجلة مسبقاً أو تطبيق التوصيات النموذجية
        if (this.injectedHistory[zoneId]) {
            const hist = this.injectedHistory[zoneId];
            this.state.dosage = hist.dosage;
            this.state.tool = hist.tool === 'إبرة حادة' ? 'needle' : 'cannula';
            this.state.depth = hist.depth;
            this.state.gPrime = hist.gPrime;
        } else {
            this.state.dosage = zone.defaultDosage;
            this.state.gPrime = zone.recommendedGPrime || 'soft';
            this.state.tool = (zone.recommendedTool === 'cannula') ? 'cannula' : 'needle';
            this.state.depth = (zone.recommendedDepth === 'deep') ? 'deep' : 'subdermal';
        }

        // تحديث عناصر الإدخال في واجهة المستخدم (Sync UI inputs)
        const toolRadio = document.querySelector(`input[name="toolType"][value="${this.state.tool}"]`);
        if (toolRadio) toolRadio.checked = true;

        const depthRadio = document.querySelector(`input[name="depthType"][value="${this.state.depth}"]`);
        if (depthRadio) depthRadio.checked = true;

        const gPrimeRadio = document.querySelector(`input[name="gPrimeType"][value="${this.state.gPrime}"]`);
        if (gPrimeRadio) gPrimeRadio.checked = true;

        const slider = document.getElementById('dosageSlider');
        if (slider) {
            slider.max = (zone.maxSafeDosage * 1.5).toFixed(1);
            slider.value = this.state.dosage;
            const dosageValEl = document.getElementById('dosageValue');
            if (dosageValEl) dosageValEl.textContent = `${this.state.dosage.toFixed(2)} ml`;
        }

        // تحديث بطاقة تفاصيل المنطقة في الواجهة
        const titleEl = document.getElementById('zoneTitle');
        const subtitleEl = document.getElementById('zoneSubtitle');
        const landmarkEl = document.getElementById('zoneLandmark');
        const vesselsEl = document.getElementById('zoneVessels');

        if (titleEl) titleEl.textContent = zone.nameAr;
        if (subtitleEl) subtitleEl.textContent = zone.nameEn;
        if (landmarkEl) landmarkEl.textContent = zone.anatomicalLandmark;
        if (vesselsEl) {
            vesselsEl.innerHTML = zone.dangerVessels.map(v => `<span class="vessel-tag">${v}</span>`).join('');
        }

        // تحديث التأثير البصري المباشر
        this.svgGen.updateVolumeEffect(zone.id, this.state.dosage);

        this.evaluateSafety();
    }

    // محرك الفحص والتقييم السريري الذكي للأمان (Clinical Safety Engine)
    evaluateSafety() {
        const zone = this.currentZone;
        const { tool, depth, gPrime, dosage } = this.state;
        const alertBox = document.getElementById('safetyAlertBox');
        if (!alertBox) return;

        let status = 'safe'; // safe, caution, danger
        let title = 'إجراء آمن ومطابق للمعايير السريرية';
        let message = zone.clinicalGuideline;
        let recommendation = '';

        // 1. تقييم خط الابتسامة (Nasolabial)
        if (zone.id === 'nasolabial') {
            if (tool === 'needle' && depth === 'subdermal') {
                status = 'danger';
                title = 'تحذير عالي الخطورة: خطر إصابة الشريان الوجهي والزاوي';
                message = 'الحقن بالإبرة الحادة في العمق المتوسط لطيات الابتسامة يهدد بثقب الشريان الوجهي أو الزاوي، مسبباً نخر جناح الأنف (Alar necrosis).';
                recommendation = 'الحل السريري: استخدم كانيولا كليلة 25G، أو إذا استخدمت إبرة فاحقن على العظم تماماً (Supra-periosteal) مع شفط عكسي 5 ثوانٍ.';
            } else if (tool === 'cannula') {
                status = 'safe';
                title = 'اختيار مثالي: الكانيولا تحمي الأوعية الدموية';
                recommendation = 'الكانيولا الكليلة 25G تنزلق بجانب الشرايين دون تمزيقها، مما يجعل الإجراء في غاية الأمان.';
            }
        }

        // 2. تقييم ميزاب الدموع (Tear Trough)
        else if (zone.id === 'tear_trough') {
            if (gPrime === 'firm') {
                status = 'danger';
                title = 'خطأ فيزيائي: فيلر عالي الكثافة في منطقة رقيقة';
                message = 'حقن فيلر كثيف (High G\') تحت العين يسبب تكتلاً صلباً دائماً، وتورماً لمفاوياً مزمناً، وزرقة ظاهرة تيندال (Tyndall).';
                recommendation = 'الحل: استخدم فقط فيلر فائق النعومة (Low G\' / Soft) قليل الامتصاص للماء، ويُشترط استخدام الكانيولا.';
            } else if (tool === 'needle') {
                status = 'caution';
                title = 'تنبيه سريري: خطر الكدمات وإصابة الحجاج';
                message = 'الحقن بالإبرة في ميزاب الدموع يرفع احتمالية الكدمات الشديدة وإصابة الفروع الشريانية تحت الحجاج.';
                recommendation = 'يُفضل بشدة الانتقال إلى كانيولا 27G بمدخل وحشي (Lateral Entry Point).';
            }
        }

        // 3. تقييم الشفاه (Lips)
        else if (zone.id === 'lips') {
            if (depth === 'deep') {
                status = 'caution';
                title = 'تنبيه: العمق الزائد يقترب من الشرايين الشفوية';
                message = 'تقع الشرايين الشفوية في الثلث الخلفي من سماكة الشفة على عمق 2-4 مم.';
                recommendation = 'التوجيه السريري: حافظ على عمق الحقن سطحي في النسيج المخاطي (Submucosal) أو داخل حافة الشفة (Vermilion Border).';
            } else if (gPrime === 'firm') {
                status = 'caution';
                title = 'ملاحظة: فيلر صلب في الشفاه يسبب تكتلاً';
                message = 'الشفاه نسيج متحرك وديناميكي دائم الحركة، الفيلر عالي التماسك يؤدي إلى عقد مرئية أثناء الابتسام.';
                recommendation = 'يُنصح باستخدام فيلر ناعم ومرن (Soft to Medium Elasticity).';
            }
        }

        // 4. تقييم الصدغ (Temple)
        else if (zone.id === 'temple') {
            if (depth !== 'deep') {
                status = 'danger';
                title = 'خطر شديد: منطقة الشريان الصدغي السطحي';
                message = 'الحقن في الطبقات المتوسطة للصدغ يحمل خطورة بالغة لإصابة الشريان الصدغي السطحي المتصل بالتروية الدماغية والعينية.';
                recommendation = 'القاعدة الذهبية: تقنية الحقن العظمي العميق على السمحاق (Periosteal Bolus) أو سطحي جداً بالكانيولا، ولا تحقن في الطبقات المتوسطة إطلاقاً.';
            }
        }

        // 5. تقييم عظام الخد والوجنة (Cheeks)
        else if (zone.id === 'cheeks') {
            if (depth !== 'deep') {
                status = 'caution';
                title = 'تنبيه تقني: الحقن السطحي في الخد يقلل الرفع';
                message = 'رفع الوجنة وإبراز تفاحة الخد يتطلب دعامة بنيوية صلبة ترتكز مباشرة على عظم الوجنة (Zygoma).';
                recommendation = 'اختر العمق العظمي (Deep Supra-periosteal) مع فيلر عالي الكثافة (Firm) لنتائج طبيعية ومستدامة.';
            } else if (gPrime === 'soft') {
                status = 'caution';
                title = 'ملاحظة: الفيلر الناعم لا يوفر دعماً كافياً للعظم';
                recommendation = 'يُفضل استخدام فيلر كثيف (High G\') لنحت وتحديد الوجنة.';
            }
        }

        // 6. تقييم الذقن وتحديد الفك (Chin & Jawline)
        else if (zone.id === 'chin_jaw') {
            if (depth !== 'deep') {
                status = 'caution';
                title = 'تنبيه: نحت الذقن يستوجب الارتكاز العظمي';
                message = 'حقن الفيلر في الطبقة السطحية للذقن يعطي مظهراً رخواً وقد يتدلى مع الجاذبية، بينما الحقن العظمي يحاكي البنية الطبيعية للفك.';
                recommendation = 'الحقن العمودي المباشر على منتصف عظم الذقن مع فيلر بنيوي صلب (Firm G\').';
            }
        }

        // 7. تقييم خطوط الماريونيت (Marionette)
        else if (zone.id === 'marionette') {
            if (depth === 'deep') {
                status = 'caution';
                title = 'ملاحظة: خطوط الماريونيت تستجيب للحقن السطحي';
                recommendation = 'يُفضل الحقن السطحي المروحي (Subdermal Fanning) لرفع زاوية الفم ودعم الجلد الرخو.';
            }
        }

        // 8. فحص تجاوز الجرعة الآمنة (Overdose Check)
        if (dosage > zone.maxSafeDosage) {
            status = 'caution';
            title = 'تنبيه: الجرعة تفوق الحد الموصى به للجلسة الأولى';
            message = `الجرعة المحددة (${dosage.toFixed(2)} ml) تفوق الحد الموصى به لهذه المنطقة (${zone.maxSafeDosage} ml)، مما قد يؤدي لمظهر غير طبيعي وتضاغط الأنسجة.`;
            recommendation = 'يُنصح باتباع مبدأ التدرج (Under-correction and touch-up after 2 weeks).';
        }

        // تحديث صندوق التحذير في الصفحة
        alertBox.className = `safety-alert-box alert-${status}`;
        alertBox.innerHTML = `
            <div class="alert-header">
                <span class="alert-icon">${status === 'danger' ? '⚠️' : (status === 'caution' ? '⚡' : '🛡️')}</span>
                <strong class="alert-title">${title}</strong>
            </div>
            <p class="alert-text">${message}</p>
            ${recommendation ? `<div class="alert-rec"><strong>التوجيه السريري:</strong> ${recommendation}</div>` : ''}
        `;

        if (status === 'danger') {
            this.playTone('warning');
        }
    }

    // تسجيل الحقن في ملخص الجلسة السريرية
    recordInjection() {
        const zone = this.currentZone;
        this.injectedHistory[zone.id] = {
            nameAr: zone.nameAr,
            nameEn: zone.nameEn,
            dosage: this.state.dosage,
            tool: this.state.tool === 'needle' ? 'إبرة حادة' : 'كانيولا',
            depth: this.state.depth,
            gPrime: this.state.gPrime
        };

        this.updateHistoryTable();
    }

    // تحديث جدول الجلسة
    updateHistoryTable() {
        const tableBody = document.getElementById('historyTableBody');
        const totalVolumeEl = document.getElementById('totalVolumeValue');
        if (!tableBody) return;

        const keys = Object.keys(this.injectedHistory);
        if (keys.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" class="empty-table-msg">لم يتم تسجيل أي حقن حتى الآن. اختر منطقة واضغط على "اعتماد في الجلسة".</td></tr>`;
            if (totalVolumeEl) totalVolumeEl.textContent = '0.00 ml';
            return;
        }

        let total = 0;
        let html = '';

        keys.forEach(k => {
            const item = this.injectedHistory[k];
            total += item.dosage;
            html += `
                <tr>
                    <td><strong>${item.nameAr}</strong><br><small class="text-muted">${item.nameEn}</small></td>
                    <td><span class="badge-dosage">${item.dosage.toFixed(2)} ml</span></td>
                    <td>${item.tool}</td>
                    <td><button class="remove-item-btn" data-zone="${k}" title="حذف">✕</button></td>
                </tr>
            `;
        });

        tableBody.innerHTML = html;
        if (totalVolumeEl) totalVolumeEl.textContent = `${total.toFixed(2)} ml`;

        // ربط أزرار الحذف الفردية
        tableBody.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const zId = btn.getAttribute('data-zone');
                delete this.injectedHistory[zId];
                this.svgGen.updateVolumeEffect(zId, 0);
                this.updateHistoryTable();
                this.playTone('click');
            });
        });
    }

    // إعادة تعيين الجلسة بالكامل
    resetSession() {
        this.injectedHistory = {};
        this.svgGen.resetAllVolumes();
        this.selectZone('lips');
        this.updateHistoryTable();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FillerSimulator;
}
