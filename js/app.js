/**
 * KERA - التطبيق الرئيسي وربط الواجهة والتحسينات المتقدمة
 * النوافذ الإرشادية، شبكة النسبة الذهبية، كتم الصوت، وتصدير التقارير
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. تهيئة مولد الـ SVG للوجه الواقعي
    const faceGen = new FaceSVGGenerator('faceContainer');
    faceGen.render();

    // 2. تهيئة محرك المحاكاة
    const simulator = new FillerSimulator(faceGen);
    simulator.init();

    // 3. النوافذ الإرشادية (Modals)
    const emergencyModal = document.getElementById('emergencyModal');
    const openEmergencyBtn = document.getElementById('openEmergencyBtn');
    const closeEmergencyBtn = document.getElementById('closeEmergencyBtn');

    if (openEmergencyBtn && emergencyModal) {
        openEmergencyBtn.addEventListener('click', () => {
            emergencyModal.classList.add('active');
        });
    }

    if (closeEmergencyBtn && emergencyModal) {
        closeEmergencyBtn.addEventListener('click', () => {
            emergencyModal.classList.remove('active');
        });
    }

    // نافذة مسرد المصطلحات التجميلية (Glossary Modal)
    const glossaryModal = document.getElementById('glossaryModal');
    const openGlossaryBtn = document.getElementById('openGlossaryBtn');
    const closeGlossaryBtn = document.getElementById('closeGlossaryBtn');

    if (openGlossaryBtn && glossaryModal) {
        openGlossaryBtn.addEventListener('click', () => {
            glossaryModal.classList.add('active');
        });
    }

    if (closeGlossaryBtn && glossaryModal) {
        closeGlossaryBtn.addEventListener('click', () => {
            glossaryModal.classList.remove('active');
        });
    }

    // نافذة تقرير الجلسة القابل للطباعة والتصدير (Print/Export Sheet)
    const printReportBtn = document.getElementById('printReportBtn');
    if (printReportBtn) {
        printReportBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // إغلاق النوافذ بالنقر على الخلفية
    window.addEventListener('click', (e) => {
        if (e.target === emergencyModal) emergencyModal.classList.remove('active');
        if (e.target === glossaryModal) glossaryModal.classList.remove('active');
    });

    // 4. تفعيل / تعطيل شبكة النسبة الذهبية وأثلاث الوجه
    const toggleRatioBtn = document.getElementById('toggleGoldenRatioBtn');
    if (toggleRatioBtn) {
        toggleRatioBtn.addEventListener('click', () => {
            const isActive = faceGen.toggleGoldenRatio();
            toggleRatioBtn.classList.toggle('active-btn', isActive);
            toggleRatioBtn.innerHTML = isActive ? '<span>📐 إخفاء النسبة الذهبية</span>' : '<span>📐 شبكة النسبة الذهبية</span>';
            simulator.playTone('click');
        });
    }

    // 5. زر كتم / تشغيل الصوت (Mute/Unmute)
    const toggleSoundBtn = document.getElementById('toggleSoundBtn');
    if (toggleSoundBtn) {
        toggleSoundBtn.addEventListener('click', () => {
            const isMuted = simulator.toggleSound();
            toggleSoundBtn.innerHTML = isMuted ? '<span>🔇 صوت صامت</span>' : '<span>🔊 صوت نشط</span>';
            toggleSoundBtn.classList.toggle('btn-muted', isMuted);
        });
    }

    // 6. التبديل السريع على شاشات الهواتف بين خريطة الوجه ولوحة التحكم
    const mobileTabFace = document.getElementById('mobileTabFace');
    const mobileTabControls = document.getElementById('mobileTabControls');
    const faceCol = document.querySelector('.face-column');
    const controlsCol = document.querySelector('.controls-column');

    if (mobileTabFace && mobileTabControls && faceCol && controlsCol) {
        mobileTabFace.addEventListener('click', () => {
            mobileTabFace.classList.add('active');
            mobileTabControls.classList.remove('active');
            faceCol.classList.remove('mobile-hidden');
            controlsCol.classList.add('mobile-hidden');
        });

        mobileTabControls.addEventListener('click', () => {
            mobileTabControls.classList.add('active');
            mobileTabFace.classList.remove('active');
            controlsCol.classList.remove('mobile-hidden');
            faceCol.classList.add('mobile-hidden');
        });
    }

    // 7. زر المقارنة التفاعلية (قبل وبعد)
    const beforeAfterBtn = document.getElementById('toggleBeforeAfter');
    let isShowingBefore = false;
    if (beforeAfterBtn) {
        beforeAfterBtn.addEventListener('click', () => {
            isShowingBefore = !isShowingBefore;
            const effectsLayer = document.getElementById('filler-effects-layer');
            if (effectsLayer) {
                effectsLayer.style.display = isShowingBefore ? 'none' : 'block';
            }
            beforeAfterBtn.classList.toggle('btn-active-toggle', isShowingBefore);
            beforeAfterBtn.innerHTML = isShowingBefore ? '<span>👁️ عرض النتيجة بعد الحقن</span>' : '<span>🔄 مقارنة مع مظهر البداية (قبل)</span>';
            simulator.playTone('click');
        });
    }
});
