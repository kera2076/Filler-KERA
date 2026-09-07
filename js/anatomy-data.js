/**
 * KERA - قاعدة بيانات التشريح السريري وخريطة الأمان لحقن الفيلر
 * مخصصة لطلاب التجميل والممارسين السريريين
 */

const ANATOMY_DATA = {
    // 1. مناطق الحقن التجميلية الرئيسية
    zones: [
        {
            id: 'lips',
            nameAr: 'الشفاه وتحديد الحواف',
            nameEn: 'Lips & Vermilion Border',
            region: 'lower-face',
            defaultDosage: 0.5,
            maxSafeDosage: 1.2,
            recommendedGPrime: 'soft', // soft, medium, firm
            recommendedDepth: 'submucosal', // superficial, subdermal, deep
            recommendedTool: 'needle_or_cannula',
            dangerVessels: ['الشريان الشفوي العلوي (Superior Labial A.)', 'الشريان الشفوي السفلي (Inferior Labial A.)'],
            dangerLevel: 'moderate', // low, moderate, high, critical
            anatomicalLandmark: 'يمر الشريان الشفوي غالباً على عمق 2 إلى 4 مم بين الشفة الرطبة والجافة، تحت العضلة الدويرية الفموية.',
            clinicalGuideline: 'يُفضل الحقن في الحافة السطحية (Vermilion) أو بالاتجاه العكسي البطيء (Retrograde)، وتجنب الدخول العميق نحو الغشاء المخاطي.',
            dangerRisk: 'احتمال حدوق انسداد شرياني يؤدي لنقص التروية والنخر (Tissue Necrosis) إذا تم الحقن داخل الشريان مباشرة.'
        },
        {
            id: 'nasolabial',
            nameAr: 'طيات خط الابتسامة',
            nameEn: 'Nasolabial Folds (NLF)',
            region: 'mid-face',
            defaultDosage: 0.6,
            maxSafeDosage: 1.5,
            recommendedGPrime: 'medium',
            recommendedDepth: 'deep_or_superficial',
            recommendedTool: 'cannula',
            dangerVessels: ['الشريان الوجهي (Facial Artery)', 'الشريان الزاوي (Angular Artery)'],
            dangerLevel: 'high',
            anatomicalLandmark: 'يمر الشريان الوجهي بمحاذاة خط الابتسامة ويتحول للشريان الزاوي قرب زاوية الأنف (Pyriform Aperture).',
            clinicalGuideline: 'القاعدة الذهبية: احقن إما سطحياً جداً (Superficial Subdermal) أو عميقاً جداً فوق السمحاق العظمي، وتجنب الطبقة تحت الجلد المتوسطة حيث يسير الشريان. استخدام الكانيولا 25G يقلل الخطر بنسبة 90%.',
            dangerRisk: 'أشهر موقع لحدوث نخر جناح الأنف (Alar necrosis) والعمى التراجعي (Retrograde Embolism).'
        },
        {
            id: 'cheeks',
            nameAr: 'تفاحة الخد والوجنة',
            nameEn: 'Cheek / Malar & Zygomatic Arch',
            region: 'mid-face',
            defaultDosage: 0.8,
            maxSafeDosage: 2.0,
            recommendedGPrime: 'firm',
            recommendedDepth: 'deep',
            recommendedTool: 'needle_bone',
            dangerVessels: ['الشريان الوجهي المستعرض (Transverse Facial A.)', 'شريان تحت الحجاج (Infraorbital A.)'],
            dangerLevel: 'low',
            anatomicalLandmark: 'عظام الوجنة تشكل الدعامة العظمية الرئيسية لمنتصف الوجه.',
            clinicalGuideline: 'الحقن العميق المباشر على العظم (Supra-periosteal Bolus) مع الشفط العكسي (Aspiration) الإلزامي لمدة 5 ثوانٍ قبل الضغط على المكبس.',
            dangerRisk: 'آمن نسبياً إذا تم التثبيت العظمي الدقيق، والخطورة تزداد كلما اتجهنا إنسياً (Medially) نحو الثقبة تحت الحجاج.'
        },
        {
            id: 'tear_trough',
            nameAr: 'ميزاب الدموع وتحت العين',
            nameEn: 'Tear Trough / Infraorbital Hollow',
            region: 'upper-mid-face',
            defaultDosage: 0.3,
            maxSafeDosage: 0.6,
            recommendedGPrime: 'soft',
            recommendedDepth: 'deep',
            recommendedTool: 'cannula',
            dangerVessels: ['شريان وفروع تحت الحجاج (Infraorbital Artery Branches)', 'الشريان الزاوي (Angular A.)'],
            dangerLevel: 'critical',
            anatomicalLandmark: 'جلد رقيق جداً يعلو الحافة العظمية للحجاج السفلي (Infraorbital Rim).',
            clinicalGuideline: 'يُحظر الإفراط في الحقن (Under-correction is mandatory). استخدام كانيولا غير حادة (27G Blunt Cannula) وفيلر قليل الامتصاص للماء لتفادي الانتفاخ اللمفاوي وظاهرة تيندال (Tyndall Effect).',
            dangerRisk: 'مخاطر حادة: وذمة لمفاوية مزمنة، تكتل أزرق سطحي، وخطر الانسداد الشرياني المؤدي لاضطراب الرؤية.'
        },
        {
            id: 'marionette',
            nameAr: 'خطوط زوايا الفم الحزينة',
            nameEn: 'Marionette Lines (Oral Commissure)',
            region: 'lower-face',
            defaultDosage: 0.4,
            maxSafeDosage: 1.0,
            recommendedGPrime: 'medium',
            recommendedDepth: 'subdermal',
            recommendedTool: 'cannula',
            dangerVessels: ['الفرع الشفوي السفلي (Inferior Labial Branch)', 'فروع الشريان الوجهي'],
            dangerLevel: 'moderate',
            anatomicalLandmark: 'منطقة ارتكاز العضلة الخافضة لزاوية الفم (DAO) والأنسجة الداعمة.',
            clinicalGuideline: 'دعم زاوية الشفة الخارجية بتقنية الخطوط المروحية السطحية (Fanning technique) لرفع زاوية الفم وتخفيف المظهر الحزين.',
            dangerRisk: 'احتمال حدوث ورم دموي (Hematoma) أو عدم تناسق عند التوزيع غير المتساوي.'
        },
        {
            id: 'chin_jaw',
            nameAr: 'نحت الذقن وتحديد الفك',
            nameEn: 'Chin Projection & Jawline Contour',
            region: 'lower-face',
            defaultDosage: 1.0,
            maxSafeDosage: 2.5,
            recommendedGPrime: 'firm',
            recommendedDepth: 'deep',
            recommendedTool: 'needle_bone',
            dangerVessels: ['الشريان الذقني عند الثقبة (Mental Artery)', 'الشريان الوجهي عند الثلمة الفكية (Facial Notch)'],
            dangerLevel: 'moderate',
            anatomicalLandmark: 'عظم الفك السفلي (Mandible) مع الحذر من الثقبة الذقنية بين الضاحكين الأول والثاني.',
            clinicalGuideline: 'الحقن في الذقن عمودي ومباشر على منتصف العظم (Gnathion / Pogonion). لتحديد خط الفك، تفضل الكانيولا لتقليل رض الشريان الوجهي عند حافة الفك.',
            dangerRisk: 'إصابة الشريان الذقني أو الوجهي عند الحافة، وتأثر العصب الذقني بالتنميل المؤقت.'
        },
        {
            id: 'temple',
            nameAr: 'تجويف الصدغ',
            nameEn: 'Temporal Hollow',
            region: 'upper-face',
            defaultDosage: 0.5,
            maxSafeDosage: 1.2,
            recommendedGPrime: 'firm',
            recommendedDepth: 'deep',
            recommendedTool: 'needle_bone',
            dangerVessels: ['الشريان الصدغي السطحي (Superficial Temporal Artery)', 'الوريد الصدغي الأوسط'],
            dangerLevel: 'critical',
            anatomicalLandmark: 'حفرة الصدغ المغطاة بعدة طبقات لفائفية (Fascial layers).',
            clinicalGuideline: 'تقنية النقطة الواحدة (One-point periosteal bolus): الدخول على مسافة 1 سم أعلى الحافة الوحشية للحجاج و1 سم للأعلى، ملامسة العظم الصدغي تماماً، وسحب عكسي طويل (Aspiration 5s).',
            dangerRisk: 'منطقة خطرة جداً بسبب تفرعات الشرايين التي تتصل مباشرة بالتروية المخية والعينية.'
        }
    ],

    // 2. الشرايين ومناطق الخطر
    arteries: [
        {
            id: 'facial_artery',
            nameAr: 'الشريان الوجهي',
            nameEn: 'Facial Artery',
            color: '#D64545',
            description: 'يمتد من زاوية الفك متعرجاً نحو زاوية الفم ثم محاذاة الأنف.'
        },
        {
            id: 'labial_arteries',
            nameAr: 'الشرايين الشفوية (العلوية والسفلية)',
            nameEn: 'Superior & Inferior Labial Arteries',
            color: '#E05D5D',
            description: 'تغذي الشفاه وتمر غالباً في الثلث الخلفي من سماكة الشفة.'
        },
        {
            id: 'angular_artery',
            nameAr: 'الشريان الزاوي',
            nameEn: 'Angular Artery',
            color: '#C93030',
            description: 'امتداد الشريان الوجهي على جانب الأنف، يتصل بشرايين العين مباشرة.'
        },
        {
            id: 'infraorbital_artery',
            nameAr: 'شريان تحت الحجاج',
            nameEn: 'Infraorbital Artery',
            color: '#B82828',
            description: 'يخرج من الثقبة تحت الحجاج أسفل العين بحوالي 1 سم.'
        },
        {
            id: 'temporal_artery',
            nameAr: 'الشريان الصدغي السطحي',
            nameEn: 'Superficial Temporal Artery',
            color: '#E04A4A',
            description: 'يمر أمام الأذن ويتفرع فوق الصدغ وفروة الرأس.'
        }
    ],

    // 3. العضلات الرئيسية
    muscles: [
        { id: 'frontalis', nameAr: 'العضلة الجبهية', nameEn: 'Frontalis' },
        { id: 'orbicularis_oculi', nameAr: 'العضلة الدويرية العينية', nameEn: 'Orbicularis Oculi' },
        { id: 'zygomaticus', nameAr: 'العضلة الوجنية الكبيرة والصغيرة', nameEn: 'Zygomaticus Major & Minor' },
        { id: 'orbicularis_oris', nameAr: 'العضلة الدويرية الفموية', nameEn: 'Orbicularis Oris' },
        { id: 'dao', nameAr: 'العضلة الخافضة لزاوية الفم', nameEn: 'Depressor Anguli Oris (DAO)' },
        { id: 'mentalis', nameAr: 'العضلة الذقنية', nameEn: 'Mentalis' },
        { id: 'masseter', nameAr: 'العضلة الماضغة', nameEn: 'Masseter' }
    ],

    // 4. معايير أدوات وتقنيات الحقن
    tools: {
        needle: {
            nameAr: 'إبرة حادة دقيقة (Sharp Needle 27G - 30G)',
            nameEn: 'Sharp Needle',
            features: 'دقة عالية، ممتازة للحقن العظمي العميق (Bolus) وتحديد خطوط الحافة الدقيقة. عيبها: احتمالية ثقب الشرايين أعلى إذا استُخدمت بعمق خاطئ.'
        },
        cannula: {
            nameAr: 'كانيولا غير حادة كليلة (Blunt Microcannula 22G - 25G)',
            nameEn: 'Blunt Cannula',
            features: 'طرف كليل يدفع الأوعية الدموية بدلاً من ثقبها. تقلل الكدمات بشكل كبير وتقلل خطر الحقن داخل الشريان بنسبة تزيد عن 85% في المناطق الخطرة كخط الابتسامة وميزاب الدموع.'
        }
    },

    // 5. بروتوكول الطوارئ في حال الاشتباه بانسداد شرياني (Emergency Protocol)
    emergencyProtocol: {
        titleAr: 'بروتوكول إسعاف الانسداد الوعائي (Vascular Occlusion Protocol)',
        steps: [
            'إيقاف الحقن فوراً بمجرد ملاحظة ابيضاض الجلد (Blanching) أو ألم شديد ومفاجئ.',
            'تطبيق كمادات دافئة وتدليك لطيف لتنشيط التروية الدموية.',
            'حقن إنزيم الهيالورونيداز (High-Dose Hyaluronidase Protocol) بجرعات مركزة في كامل منطقة التروية المشتبه بها دون تأخير.',
            'إعطاء أسبرين فموي (إذا لم يوجد مانع طبي) لتحسين الجريان والحد من تخثر الصفيحات.',
            'المتابعة والمراقبة اللصيقة كل 60 دقيقة حتى عودة التروية الدموية والشعيرات الطبيعية (Capillary Refill < 2s).'
        ]
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ANATOMY_DATA;
}
