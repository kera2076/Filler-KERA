/**
 * KERA - محرك المحاكاة السريرية والتحقق الطبي الدقيق
 * فحص تقنيات الحقن المتخصصة (الزاوية، الأداة، السحب العكسي، السرعة، والعمق)
 * وعرض النتائج السريرية التفصيلية للمضاعفات أو النجاح الجمالي
 */

class FillerSimulator {
    constructor(svgGenerator) {
        this.svgGen = svgGenerator;
        this.currentZone = ANATOMY_DATA.zones[0]; // الشفاه
        this.currentLayer = 'safety';
        this.injectedHistory = {};

        // الحالة السريرية الكاملة للإجراء
        this.state = {
            tool: 'needle', // needle, cannula
            depth: 'submucosal', // superficial, subdermal, deep
            gPrime: 'soft', // soft, medium, firm
            dosage: 0.5,
            angle: '15-30', // 15-30, 45, 90
            technique: 'retrograde', // bolus, retrograde, fanning, microdroplet
            aspiration: 'negative_5s', // negative_5s, not_performed, positive
            speed: 'slow' // slow, fast
        };

        this.audioCtx = null;
        this.isMuted = false;
    }

    init() {
        this.bindEvents();
        this.switchLayer('safety');
        this.selectZone('lips');
    }

    toggleSound() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

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
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180, now);
                osc.frequency.setValueAtTime(140, now + 0.12);
                gain.gain.setValueAtTime(0.09, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            } else if (type === 'success') {
                osc.frequency.setValueAtTime(520, now);
                osc.frequency.exponentialRampToValueAtTime(840, now + 0.1);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            }
        } catch (e) {
            // صامت
        }
    }

    bindEvents() {
        // أزرار الطبقات
        document.querySelectorAll('.layer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const layer = btn.getAttribute('data-layer');
                this.switchLayer(layer);
                this.playTone('click');
            });
        });

        // النقر على نقاط الحقن في الـ SVG
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

        // شريط الجرعة
        const dosageSlider = document.getElementById('dosageSlider');
        if (dosageSlider) {
            dosageSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                this.state.dosage = val;
                const dosageValEl = document.getElementById('dosageValue');
                if (dosageValEl) dosageValEl.textContent = `${val.toFixed(2)} ml`;
                this.svgGen.updateVolumeEffect(this.currentZone.id, val);
                this.evaluateClinicalOutcome();
            });
        }

        // الأداة
        document.querySelectorAll('input[name="toolType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.state.tool = e.target.value;
                this.playTone('click');
                this.evaluateClinicalOutcome();
            });
        });

        // العمق
        document.querySelectorAll('input[name="depthType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.state.depth = e.target.value;
                this.playTone('click');
                this.evaluateClinicalOutcome();
            });
        });

        // القوام G-Prime
        document.querySelectorAll('input[name="gPrimeType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.state.gPrime = e.target.value;
                this.playTone('click');
                this.evaluateClinicalOutcome();
            });
        });

        // زاوية الدخول
        document.querySelectorAll('input[name="angleType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.state.angle = e.target.value;
                this.playTone('click');
                this.evaluateClinicalOutcome();
            });
        });

        // التقنية
        document.querySelectorAll('input[name="techType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.state.technique = e.target.value;
                this.playTone('click');
                this.evaluateClinicalOutcome();
            });
        });

        // اختبار السحب العكسي Aspiration
        document.querySelectorAll('input[name="aspirationType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.state.aspiration = e.target.value;
                this.playTone('click');
                this.evaluateClinicalOutcome();
            });
        });

        // سرعة الحقن
        document.querySelectorAll('input[name="speedType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.state.speed = e.target.value;
                this.playTone('click');
                this.evaluateClinicalOutcome();
            });
        });

        // زر اعتماد الحقن
        const applyBtn = document.getElementById('applyInjectBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.recordInjection();
                this.playTone('success');
            });
        }

        // زر إعادة التعيين
        const resetBtn = document.getElementById('resetSessionBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSession();
                this.playTone('click');
            });
        }
    }

    switchLayer(layerName) {
        this.currentLayer = layerName;
        document.querySelectorAll('.layer-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-layer') === layerName);
        });

        const backdrop = document.getElementById('anatomyBackdrop');
        const musclesLayer = document.getElementById('muscles-layer');
        const arteriesLayer = document.getElementById('arteries-layer');

        if (!musclesLayer || !arteriesLayer) return;

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

    selectZone(zoneId) {
        const zone = ANATOMY_DATA.zones.find(z => z.id === zoneId);
        if (!zone) return;
        this.currentZone = zone;

        document.querySelectorAll('.injection-spot').forEach(spot => {
            const isMatch = spot.getAttribute('data-zone') === zoneId;
            spot.classList.toggle('selected-spot', isMatch);
        });

        // استعادة الحالة أو تطبيق إعدادات المنطقة النموذجية
        if (this.injectedHistory[zoneId]) {
            const h = this.injectedHistory[zoneId];
            this.state = { ...this.state, ...h.savedState };
        } else {
            this.state.dosage = zone.defaultDosage;
            this.state.gPrime = zone.recommendedGPrime || 'soft';
            this.state.tool = (zone.recommendedTool === 'cannula') ? 'cannula' : 'needle';
            this.state.depth = (zone.recommendedDepth.includes('deep')) ? 'deep' : 'subdermal';
            this.state.angle = zone.recommendedAngle || '90';
            this.state.technique = zone.recommendedTechnique || 'bolus';
            this.state.aspiration = 'negative_5s';
            this.state.speed = 'slow';
        }

        // مزامنة أزرار الواجهة
        this.syncInputsToState();

        const slider = document.getElementById('dosageSlider');
        if (slider) {
            slider.max = (zone.maxSafeDosage * 1.5).toFixed(1);
            slider.value = this.state.dosage;
            const dosageValEl = document.getElementById('dosageValue');
            if (dosageValEl) dosageValEl.textContent = `${this.state.dosage.toFixed(2)} ml`;
        }

        // تحديث بطاقة المنطقة والشفرة التجميلية
        const titleEl = document.getElementById('zoneTitle');
        const subtitleEl = document.getElementById('zoneSubtitle');
        const mdCodeEl = document.getElementById('zoneMdCode');
        const landmarkEl = document.getElementById('zoneLandmark');
        const vesselsEl = document.getElementById('zoneVessels');

        if (titleEl) titleEl.textContent = zone.nameAr;
        if (subtitleEl) subtitleEl.textContent = zone.nameEn;
        if (mdCodeEl) mdCodeEl.textContent = zone.mdCode;
        if (landmarkEl) landmarkEl.textContent = zone.anatomicalLandmark;
        if (vesselsEl) {
            vesselsEl.innerHTML = zone.dangerVessels.map(v => `<span class="vessel-tag">${v}</span>`).join('');
        }

        this.svgGen.updateVolumeEffect(zone.id, this.state.dosage);
        this.evaluateClinicalOutcome();
    }

    syncInputsToState() {
        const setRadio = (name, val) => {
            const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
            if (el) el.checked = true;
        };

        setRadio('toolType', this.state.tool);
        setRadio('depthType', this.state.depth);
        setRadio('gPrimeType', this.state.gPrime);
        setRadio('angleType', this.state.angle);
        setRadio('techType', this.state.technique);
        setRadio('aspirationType', this.state.aspiration);
        setRadio('speedType', this.state.speed);
    }

    // المحرك السريري الشامل: حساب مؤشر الأمان وتشخيص الأخطاء والمضاعفات بدقة
    evaluateClinicalOutcome() {
        const zone = this.currentZone;
        const { tool, depth, gPrime, dosage, angle, technique, aspiration, speed } = this.state;
        const resultsContainer = document.getElementById('clinicalResultsContainer');
        if (!resultsContainer) return;

        let safetyScore = 100;
        let errors = [];
        let complicationType = null;
        let activeComplicationData = null;

        // 1. فحص السحب العكسي (Aspiration Test)
        if (aspiration === 'positive') {
            safetyScore -= 70;
            errors.push('سحب دم إيجابي (Flash of Blood): رأس الإبرة داخل تجويف وعاء دموي مباشرة! يحظر الحقن بتاتاً.');
            complicationType = 'vascular_occlusion';
        } else if (aspiration === 'not_performed' && tool === 'needle') {
            safetyScore -= 30;
            errors.push('إهمال السحب العكسي: عدم التأكد من خلو التجويف الوعائي قبل الحقن بالإبرة الحادة.');
        }

        // 2. فحص سرعة الحقن
        if (speed === 'fast') {
            safetyScore -= 20;
            errors.push('سرعة حقن عالية: التدفق السريع يزيد الضغط الهيدروليكي ويمنع تحرك الفيلر التكيفي.');
        }

        // 3. فحص الأخطاء التخصصية لكل منطقة
        if (zone.id === 'nasolabial') {
            // خط الابتسامة
            if (tool === 'needle' && depth === 'subdermal') {
                safetyScore -= 50;
                errors.push('حقن بإبرة حادة في العمق المتوسط لطية الابتسامة حيث يمر الشريان الوجهي والزاوي.');
                complicationType = 'vascular_occlusion';
            }
            if (dosage > 1.2) {
                safetyScore -= 25;
                errors.push('جرعة زائدة تتجاوز سعة الطية وتؤدي لانتفاخ طولي شاذ يشبه السجق.');
                if (!complicationType) complicationType = 'overfill';
            }
        } else if (zone.id === 'tear_trough') {
            // ميزاب الدموع
            if (gPrime === 'firm') {
                safetyScore -= 50;
                errors.push('استخدام فيلر عالي الصلابة (Firm G\') تحت جلد الحجاج الرقيق جداً.');
                complicationType = 'vascular_occlusion'; // will map to tyndall
            }
            if (tool === 'needle') {
                safetyScore -= 30;
                errors.push('استخدام إبرة حادة تحت العين يعرض الأوردة والشرايين الدقيقة للتمزق والكدمات.');
            }
            if (dosage > 0.5) {
                safetyScore -= 25;
                errors.push('تجاوز قاعدة التصحيح التحفظي (Over-correction) تحت العين.');
            }
        } else if (zone.id === 'lips') {
            // الشفاه
            if (depth === 'deep') {
                safetyScore -= 35;
                errors.push('عمق حقن مفرط (>3mm) يقترب مباشرة من مسار الشريان الشفوي.');
                if (tool === 'needle' && aspiration !== 'negative_5s') complicationType = 'vascular_occlusion';
            }
            if (gPrime === 'firm') {
                safetyScore -= 25;
                errors.push('فيلر صلب في الشفاه يسبب عقداً وتكتلاً مرئياً أثناء حركة الفم.');
                if (!complicationType) complicationType = 'overfill';
            }
            if (dosage > 1.0) {
                safetyScore -= 30;
                errors.push('جرعة مفرطة تسبب انقلاب وبروز حافة الشفة الأمامي (تشوه منقار البطة).');
                complicationType = 'overfill';
            }
        } else if (zone.id === 'cheeks') {
            // الخدود
            if (depth !== 'deep') {
                safetyScore -= 30;
                errors.push('حقن سطحي في الخد يفتقر للدعامة العظمية ويثقل الأنسجة المترهلة.');
            }
            if (angle !== '90') {
                safetyScore -= 20;
                errors.push('زاوية الحقن غير عمودية، مما يفقد الحقن ملامسته الدقيقة للسمحاق.');
            }
            if (dosage > 1.8) {
                safetyScore -= 25;
                errors.push('إفراط في الحجم يؤدي لمظهر متلازمة الوجه المنتفخ (Pillow Face).');
                complicationType = 'overfill';
            }
        } else if (zone.id === 'temple') {
            // الصدغ
            if (depth !== 'deep') {
                safetyScore -= 60;
                errors.push('حقن في الطبقة اللفائفية المتوسطة للصدغ، وهي منطقة الشريان الصدغي السطحي.');
                complicationType = 'vascular_occlusion';
            }
        } else if (zone.id === 'chin_jaw') {
            // الذقن
            if (depth !== 'deep') {
                safetyScore -= 30;
                errors.push('حقن رخو سطحي يفشل في محاكاة بروز العظم الذقني.');
            }
        }

        safetyScore = Math.max(0, Math.min(100, safetyScore));

        // ربط بيانات المضاعفة المحددة
        if (complicationType && zone.complicationScenarios) {
            activeComplicationData = zone.complicationScenarios[complicationType] || Object.values(zone.complicationScenarios)[0];
        }

        // تحديث البصر في الـ SVG
        if (safetyScore < 60 && activeComplicationData) {
            this.svgGen.showVisualComplication(activeComplicationData.type, zone.id);
            this.playTone('warning');
        } else {
            this.svgGen.clearVisualComplications();
            if (safetyScore >= 85) this.playTone('success');
        }

        // توليد واجهة النتائج السريرية التفصيلية
        this.renderClinicalResultsHTML(resultsContainer, safetyScore, errors, activeComplicationData, zone.correctOutcome);
    }

    // بناء بطاقة النتائج السريرية التفصيلية
    renderClinicalResultsHTML(container, score, errors, compData, correctData) {
        const isSuccess = score >= 80;
        const isHazard = score < 60;

        let scoreBadgeClass = isSuccess ? 'score-optimal' : (isHazard ? 'score-critical' : 'score-caution');
        let statusTitle = isSuccess ? '✅ النتيجة: إجراء سريري ناجح ومطابق للأصول التجميلية' : (isHazard ? '⚠️ النتيجة: خطأ سريري حاد ومضاعفة وشيكة' : '⚡ النتيجة: إجراء غير مثالي يستوجب التحسين');

        let html = `
            <div class="clinical-outcome-card ${isSuccess ? 'outcome-success' : 'outcome-danger'}">
                <div class="outcome-header">
                    <div>
                        <h3 class="outcome-title">${statusTitle}</h3>
                        <div class="outcome-zone-sub">${this.currentZone.nameAr} - ${this.currentZone.mdCode}</div>
                    </div>
                    <div class="safety-score-meter ${scoreBadgeClass}">
                        <div class="score-number">${score}%</div>
                        <div class="score-label">مؤشر الأمان</div>
                    </div>
                </div>
        `;

        if (!isSuccess && compData) {
            // عرض تفاصيل الخطأ والمضاعفة السريرية
            html += `
                <div class="complication-detail-box">
                    <div class="comp-banner">
                        <span class="comp-icon">🚨</span>
                        <strong>التشخيص السريري: ${compData.title}</strong>
                    </div>

                    <div class="comp-section">
                        <div class="comp-label">🔬 الفيزيولوجيا المرضية (Pathophysiology):</div>
                        <p class="comp-text">${compData.pathophysiology}</p>
                    </div>

                    <div class="comp-section">
                        <div class="comp-label">🩺 العلامات والأعراض السريرية الفورية:</div>
                        <p class="comp-text">${compData.symptoms}</p>
                    </div>

                    <div class="comp-section">
                        <div class="comp-label">⚡ أخطاء التقنية المرتكبة:</div>
                        <ul class="comp-errors-list">
                            ${errors.map(err => `<li>✕ ${err}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="comp-rescue-box">
                        <div class="comp-rescue-title">💉 بروتوكول التدبير والإنقاذ الفوري (Emergency Management):</div>
                        <ol class="rescue-steps-list">
                            ${compData.rescueProtocol.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            `;
        } else {
            // عرض تفاصيل النجاح السريري والنتائج الصحيحة
            html += `
                <div class="success-detail-box">
                    <div class="success-banner">
                        <span class="success-icon">✨</span>
                        <strong>${correctData.title}</strong>
                    </div>

                    <div class="comp-section">
                        <div class="comp-label">🎯 الإنجاز التشريحي والجمالي (Anatomical Target):</div>
                        <p class="comp-text">${correctData.anatomicalResult}</p>
                    </div>

                    <div class="comp-section">
                        <div class="comp-label">🛡️ معايير الأمان المكتملة (Safety Checklist):</div>
                        <ul class="success-checklist">
                            ${correctData.safetyChecklist.map(chk => `<li>✓ ${chk}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="comp-section">
                        <div class="comp-label">📋 تعليمات وتوصيات ما بعد الإجراء (Post-Care Pearls):</div>
                        <ul class="post-care-list">
                            ${correctData.postCare.map(p => `<li>• ${p}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }

        html += `</div>`;
        container.innerHTML = html;
    }

    recordInjection() {
        const zone = this.currentZone;
        this.injectedHistory[zone.id] = {
            nameAr: zone.nameAr,
            nameEn: zone.nameEn,
            mdCode: zone.mdCode,
            dosage: this.state.dosage,
            tool: this.state.tool === 'needle' ? 'إبرة حادة' : 'كانيولا',
            depth: this.state.depth,
            gPrime: this.state.gPrime,
            savedState: { ...this.state }
        };

        this.updateHistoryTable();
    }

    updateHistoryTable() {
        const tableBody = document.getElementById('historyTableBody');
        const totalVolumeEl = document.getElementById('totalVolumeValue');
        if (!tableBody) return;

        const keys = Object.keys(this.injectedHistory);
        if (keys.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" class="empty-table-msg">لم يتم تسجيل أي حقن حتى الآن. اضغط على "اعتماد الحقن" لحفظ الإجراء.</td></tr>`;
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
                    <td><strong>${item.nameAr}</strong><br><small class="text-muted">${item.mdCode}</small></td>
                    <td><span class="badge-dosage">${item.dosage.toFixed(2)} ml</span></td>
                    <td>${item.tool}</td>
                    <td><button class="remove-item-btn" data-zone="${k}" title="حذف">✕</button></td>
                </tr>
            `;
        });

        tableBody.innerHTML = html;
        if (totalVolumeEl) totalVolumeEl.textContent = `${total.toFixed(2)} ml`;

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
