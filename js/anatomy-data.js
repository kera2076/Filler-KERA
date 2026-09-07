/**
 * KERA - قاعدة بيانات التشريح السريري وخريطة الأمان لحقن الفيلر
 * مخصصة لطلاب التجميل والممارسين السريريين - معايير طبية تخصصية بحتة (MD Codes & Rheology)
 */

const ANATOMY_DATA = {
    // 1. مناطق الحقن التجميلية الرئيسية مع الشفرات العالمية (MD Codes) والتقنيات الدقيقة
    zones: [
        {
            id: 'lips',
            mdCode: 'L1, L2, L3 (Lips Aesthetic Code)',
            nameAr: 'الشفاه وتحديد الحواف وقوس كيوبيد',
            nameEn: 'Lips & Vermilion Border',
            region: 'lower-face',
            defaultDosage: 0.5,
            maxSafeDosage: 1.0,
            recommendedGPrime: 'soft', // soft, medium, firm
            recommendedDepth: 'submucosal', // superficial, subdermal, deep
            recommendedTool: 'needle', // or cannula
            recommendedAngle: '15-30', // 15-30, 45, 90
            recommendedTechnique: 'retrograde', // bolus, retrograde, fanning, microdroplet
            recommendedAspiration: true,
            dangerVessels: ['الشريان الشفوي العلوي (Superior Labial A.)', 'الشريان الشفوي السفلي (Inferior Labial A.)'],
            dangerLevel: 'moderate',
            anatomicalLandmark: 'يمر الشريان الشفوي غالباً على عمق 2 إلى 4 مم بين الشفة الرطبة والجافة، تحت العضلة الدويرية الفموية (Orbicularis Oris).',
            clinicalGuideline: 'يُفضل الحقن السطحي في الحافة القرمزية (Vermilion Border) بزاوية مماسية 15°-30° بتقنية خطية تراجعية بطيئة (Linear Retrograde). تجنب الدخول بعمق يتجاوز 3 مم لتفادي مسار الشريان.',
            
            // نتائج الحقن الصحيح
            correctOutcome: {
                title: 'تحديد جمالي متناسق واستعادة الامتلاء الطبيعي',
                anatomicalResult: 'تحسين نسبة الشفة العلوية للسفلية (1:1.618 - النسبة الذهبية للشفاه) مع إبراز قوس كيوبيد دون تسطيح أو قلب الحافة.',
                safetyChecklist: [
                    'الحقن في الطبقة تحت المخاطية السطحية (Superficial Submucosal plane).',
                    'استخدام فيلر منخفض الصلابة (Low G\' / Soft HA) متناغم مع حركة الفم.',
                    'معدل حقن بطيء (< 0.1 ml/دقيقة) مع تفادي الضغط المفرط.',
                    'سحب عكسي سلبي قبل الحقن (Negative Aspiration).'
                ],
                postCare: [
                    'تطبيق كمادات ثلج لطيفة لمدة 10 دقائق لتخفيف الوذمة المؤقتة.',
                    'تجنب المشروبات الساخنة والتدخين واستخدام الماصة لمدة 24 ساعة لمنع الضغط الحركي.',
                    'تجنب تقبيل أو تدليك الشفاه العنيف لمدة 48 ساعة.'
                ]
            },

            // سيناريوهات الأخطاء والمضاعفات السريرية
            complicationScenarios: {
                vascular_occlusion: {
                    type: 'occlusion',
                    title: 'انسداد حاد في الشريان الشفوي (Acute Labial Artery Occlusion)',
                    trigger: 'الحقن العميق (>3mm) بإبرة حادة بدون سحب عكسي.',
                    pathophysiology: 'دخول جزيئات حمض الهيالورونيك داخل تجويف الشريان الشفوي، مما يؤدي لانقطاع التروية الدموية عن حافة الشفة وحدوث إقفار ونخر نسيجي سريع (Ischemic Necrosis).',
                    symptoms: 'ابيضاض فوري شاحب للشفة (Immediate Blanching)، ألم حارق نابض شديد يفوق ألم الوخز العادي، وزمن امتلاء شعيري بطيء جداً (> 3 ثوانٍ).',
                    rescueProtocol: [
                        'إيقاف الحقن فوراً وعدم سحب الإبرة إذا كانت في نفس الموقع.',
                        'حقن فوري لإنزيم الهيالورونيداز (Hyaluronidase) بجرعة 300 - 500 وحدة دولية في موقع الحقن ومسار الشريان.',
                        'تطبيق كمادات ساخنة لتعزيز التوسع الوعائي (Vasodilation).',
                        'إعطاء 2 حبة أسبرين فموي (600 ملغ) لمنع تشكل الخثرات الصفيحية.',
                        'المراقبة اللصيقة كل 30 دقيقة حتى استعادة اللون الوردي الطبيعي والامتلاء الشعيري السريع.'
                    ]
                },
                overfill: {
                    type: 'overfill',
                    title: 'تشوه الشفاه المفرطة / مظهر منقار البطة (Duck Lips Deformity)',
                    trigger: 'حقن جرعة مفرطة (> 1.2 ml) أو استخدام فيلر عالي الصلابة (Firm G\').',
                    pathophysiology: 'تجاوز السعة المطاطية للنسيج الشفوي الرخو، مما يؤدي إلى بروز أمامي شاذ وتسطيح الحواف الطبيعية وتثاقل حركة الشفاه التعبيرية.',
                    symptoms: 'شفة متصلبة، بروز أمامي غير متناسق، وظهور كتل واضحة عند الابتسام.',
                    rescueProtocol: [
                        'تدليك خفيف متكرر إذا كان الفيلر حديثاً (أول 48 ساعة).',
                        'في حال استمرار التشوه بعد أسبوعين: حقن موضعي دقيق بجرعات صغيرة من الهيالورونيداز (15-30 وحدة) لتذويب الفائض واستعادة التناسق.'
                    ]
                }
            }
        },

        {
            id: 'nasolabial',
            mdCode: 'NL1, NL2, NL3 (Nasolabial Fold Codes)',
            nameAr: 'طيات خط الابتسامة ومثلث بيرامي',
            nameEn: 'Nasolabial Folds (NLF)',
            region: 'mid-face',
            defaultDosage: 0.6,
            maxSafeDosage: 1.2,
            recommendedGPrime: 'medium',
            recommendedDepth: 'deep_periosteal_or_cannula',
            recommendedTool: 'cannula',
            recommendedAngle: '45',
            recommendedTechnique: 'fanning',
            recommendedAspiration: true,
            dangerVessels: ['الشريان الوجهي (Facial Artery)', 'الشريان الزاوي (Angular Artery)'],
            dangerLevel: 'high',
            anatomicalLandmark: 'يمر الشريان الوجهي محاذياً لخط الابتسامة على عمق الأنسجة تحت الجلدية، ويتحول للشريان الزاوي قرب قاعدة جناح الأنف (Pyriform Aperture).',
            clinicalGuideline: 'القاعدة الذهبية: احقن إما فوق السمحاق العظمي تماماً (Supra-periosteal في النقطة NL1) أو سطحياً جداً بالكانيولا 25G. يُحظر الحقن في العمق المتوسط بالإبرة الحادة.',
            
            correctOutcome: {
                title: 'تخفيف عمق الطية ودعم وسادة دهون الخد الإنسية',
                anatomicalResult: 'رفع قاعدة الطية وتنعيم الظل الأنفي الفموي مع المحافظة على التعبير الطبيعي للابتسامة دون نفخ زائد.',
                safetyChecklist: [
                    'استخدام كانيولا كليلة 25G بطول 50 مم عبر مدخل وحشي آمن.',
                    'الحقن في الطبقة تحت الجلد السطحية أو تثبيت بولس عظمي في حفرة بيرامي.',
                    'الابتعاد عن الشريان الزاوي عند قمة الطية.',
                    'سحب عكسي مستمر وحقن متدرج بطيء.'
                ],
                postCare: [
                    'تجنب الضحك المبالغ فيه أو فتح الفم بحركات واسعة لمدة 24 ساعة.',
                    'عدم الخضوع لجلسات تنظيف بشرة أو تقشير عميق لمدة أسبوعين.',
                    'النوم على الظهر لتفادي الضغط غير المتناظر على الوجه.'
                ]
            },

            complicationScenarios: {
                vascular_occlusion: {
                    type: 'necrosis',
                    title: 'نخر إقفاري حاد في جناح الأنف (Alar Necrosis & Angular Artery Embolism)',
                    trigger: 'الحقن بالإبرة الحادة في عمق الطية المتوسط بدون سحب عكسي وبجرعة سريعة.',
                    pathophysiology: 'دخول الفيلر في الشريان الزاوي أو انضغاطه الخارجي الحاد، مما يقطع الدم عن جناح الأنف (Nasal Ala). هذا هو أخطر موقع تجميلي قد يؤدي أيضاً لعمى تراجعي (Retrograde Ophthalmic Occlusion).',
                    symptoms: 'ابيضاض الجلد فوراً على جناح الأنف وجانب الأنف، يعقبه تلون بنفسجي شبكي (Livedo Reticularis) بعد ساعات، وألم مبرح يمتد لجذر الأنف.',
                    rescueProtocol: [
                        'طوارئ قصوى: إيقاف الحقن مباشرة واستدعاء فريق الإنقاذ.',
                        'حقن مكثف (High-Dose Protocol) للهيالورونيداز: 1000 - 1500 وحدة دولية في كامل المثلث الأنفي الفموي وحول جناح الأنف، وتكرار الحقن كل ساعة إذا لم تعد التروية.',
                        'كمادات ماء دافئ وتدليك قوي لتفتيت التخثر.',
                        'مرهم نيتروجليسرين موضعي (Nitroglycerin paste) لتوسيع الأوعية المتشنجة.',
                        'أسبرين فموي 300 ملغ ومراقبة دقيقة للأكسجة والتنفس الشعيري.'
                    ]
                },
                overfill: {
                    type: 'overfill',
                    title: 'انتفاخ وتكتل خط الابتسامة (Sausage-like Bulge)',
                    trigger: 'حقن سطحي جداً لفيلر كثيف أو حقن كمية تتجاوز 1.5 ml.',
                    pathophysiology: 'تجمع الفيلر ككتلة صلبة مستطيلة تقلد شكل السجق فوق حركة العضلات التعبيرية، مما يبرز الخط بدلاً من إخفائه.',
                    symptoms: 'بروز واضح وملمس صلب متكتل يزداد قبحاً أثناء الابتسام.',
                    rescueProtocol: [
                        'تذويب جزئي بجرعة خفيفة من الهيالورونيداز (30-50 وحدة دولية) لإعادة التجانس.'
                    ]
                }
            }
        },

        {
            id: 'cheeks',
            mdCode: 'Ck1 (Zygomatic Arch), Ck2 (Malar), Ck3 (Anteromedial)',
            nameAr: 'تفاحة الخد وقوس الوجنة الجمالي',
            nameEn: 'Cheek / Malar & Zygomatic Arch',
            region: 'mid-face',
            defaultDosage: 0.8,
            maxSafeDosage: 1.5,
            recommendedGPrime: 'firm',
            recommendedDepth: 'deep',
            recommendedTool: 'needle_bone',
            recommendedAngle: '90',
            recommendedTechnique: 'bolus',
            recommendedAspiration: true,
            dangerVessels: ['الشريان الوجهي المستعرض (Transverse Facial A.)', 'شريان تحت الحجاج (Infraorbital A.)'],
            dangerLevel: 'low',
            anatomicalLandmark: 'العظم الوجني (Zygomatic Bone) والوسادات الدهنية العميقة لمنتصف الوجه.',
            clinicalGuideline: 'تقنية الحقن العظمي العمودي بزاوية 90° مباشرة على العظم (Supra-periosteal Bolus) مع تثبيت محكم لليد، وسحب عكسي إلزامي لمدة 5 ثوانٍ كاملة.',
            
            correctOutcome: {
                title: 'رفع بنيوي لمنتصف الوجه وإبراز النحت الجمالي للوجنة',
                anatomicalResult: 'استعادة المثلث الشبابي المقلوب (Triangle of Youth) ورفع طبيعي للأنسجة الرخوة المتدلية دون تكبير غير متناسق.',
                safetyChecklist: [
                    'ملامسة السمحاق العظمي بثبات تام لتفادي الطبقات السطحية.',
                    'استخدام فيلر عالي اللزوجة والصلابة (High G\' / High Cohesivity) لمحاكاة العظم.',
                    'سحب عكسي سلبي مؤكد لمدة 5 ثوانٍ.',
                    'جرعات مقسمة (Ck1: 0.2ml, Ck2: 0.2ml, Ck3: 0.3ml).'
                ],
                postCare: [
                    'تجنب النوم على الجانبين لمدة 3 ليالٍ لتجنب انزياح الفيلر قبل استقراره.',
                    'عدم ارتداء نظارات ثقيلة تضغط على عظمة الخد لمدة أسبوع.',
                    'تطبيق كمادات باردة عند الشعور بثقل خفيف.'
                ]
            },

            complicationScenarios: {
                vascular_occlusion: {
                    type: 'hematoma',
                    title: 'ورم دموي عميق وإصابة الشريان المستعرض (Deep Malar Hematoma)',
                    trigger: 'تحريك الإبرة الحادة بعنف فوق العظم أو عدم السحب العكسي.',
                    pathophysiology: 'تمزق الشريان الوجهي المستعرض أو فروعه، مما يؤدي لنزف سريع وتجمع دموي عميق يرفع الأنسجة ويسبب ألماً ضاغطاً.',
                    symptoms: 'تورم مفاجئ متزايد في الخد، تغير اللون للأزرق الداكن المسود، وإيلام شديد عند اللمس.',
                    rescueProtocol: [
                        'ضغط يدوي مباشر ومستمر بقوة على المنطقة لمدة 5 إلى 10 دقائق دون انقطاع لإيقاف النزف.',
                        'تطبيق كمادات ثلج فورية لتقليص الأوعية الدموية.',
                        'في حال استمرار التجمع: تصريف الورم الدموي تحت تعقيم كامل وتجنب مضادات التخثر.'
                    ]
                },
                overfill: {
                    type: 'overfill',
                    title: 'متلازمة الوجه المنتفخ الشبيه بالوسادة (Pillow Face Syndrome)',
                    trigger: 'حقن جرعات ضخمة (> 2.5 ml) أو الحقن في الطبقات الدهنية السطحية بدلاً من العظم.',
                    pathophysiology: 'تراكم حمض الهيالورونيك في الوسادات السطحية يمتص كميات كبيرة من الماء، مما يلغي الملامح الطبيعية ويضيق العينين أثناء الابتسام.',
                    symptoms: 'خدود منتفخة كروية تشبه الدمية، مع صغر ملحوظ في فتحة العين عند الضحك.',
                    rescueProtocol: [
                        'إعادة هيكلة عبر تذويب الفيلر السطحي بالهيالورونيداز وإعادة الحقن الصحيح على العظم بعد شهر.'
                    ]
                }
            }
        },

        {
            id: 'tear_trough',
            mdCode: 'Tt1, Tt2, Tt3 (Infraorbital Trough Codes)',
            nameAr: 'ميزاب الدموع وتجويف تحت العين الحساس',
            nameEn: 'Tear Trough / Infraorbital Hollow',
            region: 'upper-mid-face',
            defaultDosage: 0.3,
            maxSafeDosage: 0.5,
            recommendedGPrime: 'soft',
            recommendedDepth: 'deep_periosteal_cannula',
            recommendedTool: 'cannula',
            recommendedAngle: '45',
            recommendedTechnique: 'microdroplet',
            recommendedAspiration: true,
            dangerVessels: ['شريان وفروع تحت الحجاج (Infraorbital Artery Branches)', 'الشريان الزاوي (Angular A.)'],
            dangerLevel: 'critical',
            anatomicalLandmark: 'جلد تحت العين هو الأرق في كامل الجسم (0.5 مم) ويعلو مباشرة الحافة العظمية للحجاج السفلي (Infraorbital Rim).',
            clinicalGuideline: 'يُشترط استخدام كانيولا 27G بمدخل وحشي. القاعدة السريرية الإلزامية: (Under-correction is mandatory) لا تصحح أكثر من 70-80% في الجلسة الأولى.',
            
            correctOutcome: {
                title: 'محو الهالات التجويفية واستعادة النظرة المشرقة الشابة',
                anatomicalResult: 'امتلاء سلس ومستوٍ بين الجفن السفلي والخد دون أي انتفاخ أو تكتل مائي وبمظهر نضر وطبيعي.',
                safetyChecklist: [
                    'استخدام كانيولا كليلة 27G لتفادي ثقب الشرايين الدقيقة تحت الحجاج.',
                    'اختيار فيلر قليل الامتصاص للماء (Low Hygroscopic HA) لمنع الوذمات.',
                    'الحقن العميق المباشر فوق حافة الحجاج العظمية.',
                    'جرعة دقيقة جداً لا تتجاوز 0.2 - 0.3 مل لكل عين.'
                ],
                postCare: [
                    'النوم برأس مرفوع على وسادتين لتجنب تجمع السوائل الصباحية.',
                    'تجنب فرك العينين أو استخدام مساحيق التجميل لمدة 24 ساعة.',
                    'تجنب الأطعمة الغنية بالصوديوم والأملاح لمنع احتباس السوائل تحت العين.'
                ]
            },

            complicationScenarios: {
                vascular_occlusion: {
                    type: 'tyndall',
                    title: 'تأثير تيندال والتكتل اللمفاوي المزمن (Tyndall Effect & Chronic Malar Edema)',
                    trigger: 'الحقن السطحي بالإبرة الحادة أو استخدام فيلر صلب (Firm G\') عالي الامتصاص للماء.',
                    pathophysiology: 'توضع الفيلر في الأدمة السطحية الرقيقة، مما يشتت موجات الضوء الزرقاء فتظهر هالات زرقاء رمادية مستديمة، مع انسداد التصريف اللمفاوي تحت الحجاج.',
                    symptoms: 'انتفاخ مزرق مائي شبيه بأكياس تحت العين، لا يزول بمرور الوقت ويزداد سوءاً عند الاستيقاظ.',
                    rescueProtocol: [
                        'العلاج الوحيد هو التذويب السريع بحقن دقيق جداً للهيالورونيداز (10 - 20 وحدة دولية لكل تكتل).',
                        'تجنب إعادة الحقن في هذه المنطقة لمدة 3 أشهر على الأقل حتى يتعافى التصريف اللمفاوي.'
                    ]
                },
                severe_occlusion: {
                    type: 'necrosis',
                    title: 'انسداد شريان تحت الحجاج وخطر فقدان الرؤية (Infraorbital Occlusion)',
                    trigger: 'حقن عنيف بإبرة حادة موجهة داخل الثقبة تحت الحجاج بدون سحب.',
                    pathophysiology: 'انتقال الفيلر تراجعياً نحو الشريان العيني (Ophthalmic Artery) مما يهدد بنقص تروية شبكية العين.',
                    symptoms: 'ألم حاد في العين، عدم وضوح الرؤية (Blurry vision) أو عتمة بصرية فورية، وابيضاض جلد الخد العلوي.',
                    rescueProtocol: [
                        'طوارئ قصوى وعاجلة: استدعاء طبيب العيون فوراً خلال الـ 90 دقيقة الأولى.',
                        'حقن فوري لجرعات مكثفة من الهيالورونيداز فوق الثقبة ومحيط الحجاج.',
                        'تخفيض ضغط العين الدواءي (Timolol drops / Acetazolamide).'
                    ]
                }
            }
        },

        {
            id: 'marionette',
            mdCode: 'M1, M2 (Oral Commissure & Marionette Codes)',
            nameAr: 'خطوط زوايا الفم ورفع التعبير الحزين',
            nameEn: 'Marionette Lines (Oral Commissure)',
            region: 'lower-face',
            defaultDosage: 0.4,
            maxSafeDosage: 0.8,
            recommendedGPrime: 'medium',
            recommendedDepth: 'subdermal',
            recommendedTool: 'cannula',
            recommendedAngle: '45',
            recommendedTechnique: 'fanning',
            recommendedAspiration: true,
            dangerVessels: ['الفرع الشفوي السفلي (Inferior Labial Branch)', 'فروع الشريان الوجهي'],
            dangerLevel: 'moderate',
            anatomicalLandmark: 'منطقة ارتكاز العضلة الخافضة لزاوية الفم (DAO) والأنسجة الرخوة الداعمة لحاشية الشفة السفلية.',
            clinicalGuideline: 'الحقن بتقنية شبكة متقاطعة مروحية (Cross-hatching / Fanning) في الطبقة تحت الجلد السطحية لتشكيل دعامة ترفع زاوية الفم للأعلى.',
            
            correctOutcome: {
                title: 'رفع زوايا الفم المتدلية وإلغاء التعبير العابس',
                anatomicalResult: 'دعامة هيكلية ترفع زاوية الفم وتخفي الظل الهابط نحو الذقن مع استعادة الابتسامة المريحة.',
                safetyChecklist: [
                    'استخدام كانيولا 25G لتجنب الكدمات الوريدية والشريانية المتكررة في هذه المنطقة.',
                    'فيلر متوسط المرونة (Medium G\') يدمج مع النسيج المتحرك.',
                    'حقن بطيء مع توزيع مروحي ناعم.'
                ],
                postCare: [
                    'تجنب التدليك العنيف لمنطقة أسفل الشفاه.',
                    'تجنب الأنشطة الرياضية الشاقة لمدة 48 ساعة.'
                ]
            },

            complicationScenarios: {
                vascular_occlusion: {
                    type: 'hematoma',
                    title: 'كدمة ورمية شريانية واسعة (Ecchymosis & Hematoma)',
                    trigger: 'استخدام إبرة حادة وثقب فروع الشريان الشفوي السفلي.',
                    pathophysiology: 'نزف مستمر في الفضاء تحت الجلدي الرخو حول زاوية الفم مسبباً تلوناً وتورماً يعيق حركة الفم.',
                    symptoms: 'تلون أرجواني متسع بسرعة، شعور بالحرارة والتيبس الموضعي.',
                    rescueProtocol: [
                        'ضغط مباشر مستمر بقطعة شاش معقمة لمدة 5 دقائق.',
                        'تطبيق كريمات موضعية تحتوي على فيتامين K أو الأرنيكا لتسريع امتصاص الدم المسكوب.'
                    ]
                }
            }
        },

        {
            id: 'chin_jaw',
            mdCode: 'C1 (Gnathion), C2 (Pogonion), J1-J3 (Jawline)',
            nameAr: 'نحت الذقن وتحديد زاوية خط الفك',
            nameEn: 'Chin Projection & Jawline Contour',
            region: 'lower-face',
            defaultDosage: 1.0,
            maxSafeDosage: 2.0,
            recommendedGPrime: 'firm',
            recommendedDepth: 'deep',
            recommendedTool: 'needle_bone',
            recommendedAngle: '90',
            recommendedTechnique: 'bolus',
            recommendedAspiration: true,
            dangerVessels: ['الشريان الذقني عند الثقبة (Mental Artery)', 'الشريان الوجهي عند الثلمة الفكية (Facial Notch)'],
            dangerLevel: 'moderate',
            anatomicalLandmark: 'عظم الفك السفلي (Mandible) مع الانتباه لموقع الثقبة الذقنية بين جذور الضواحك.',
            clinicalGuideline: 'الحقن في منتصف الذقن (Pogonion) عمودي بزاوية 90° على العظم مباشرة. لتحديد خط الفك، يفضل استخدام الكانيولا بموازاة الحافة السفلية للفك.',
            
            correctOutcome: {
                title: 'إسقاط وتحديد الذقن والفك مع موازنة بروفايل الوجه',
                anatomicalResult: 'إبراز تناسق الثلث السفلي للوجه وفق خط ريكتس الجمالي (Ricketts\' E-line) وإخفاء الترهل الطفيف أسفل الذقن.',
                safetyChecklist: [
                    'الحقن فوق السمحاق العظمي تماماً بمكبس ثابت.',
                    'استخدام فيلر شديد التماسك والصلابة (High G\' / Structural HA).',
                    'سحب عكسي سلبي إلزامي 5 ثوانٍ لتفادي الثقبة الذقنية.',
                    'حقن محدد على نقطتين رئيسيتين لدعم البروز والارتفاع.'
                ],
                postCare: [
                    'تجنب إسناد الذقن على اليدين أو ارتداء خوذات ضاغطة لمدة أسبوعين.',
                    'الامتناع عن علاج الأسنان العنيف لمدة 3 أسابيع لمنع الضغط على الفك.'
                ]
            },

            complicationScenarios: {
                vascular_occlusion: {
                    type: 'occlusion',
                    title: 'انضغاط أو إصابة الشريان والعصب الذقني (Mental Neurovascular Injury)',
                    trigger: 'الحقن الوحشي الخاطئ بالقرب من الثقبة الذقنية بالإبرة الحادة.',
                    pathophysiology: 'ثقب أو انضغاط الحزمة الوعائية العصبية الذقنية الخارجة من الثقبة، مما يؤدي لنقص التروية وتنميل الشفة السفلية.',
                    symptoms: 'خدر وتنميل فوري في نصف الشفة السفلية والذقن (Paresthesia)، وتغير بلون الجلد نحو الشحوب.',
                    rescueProtocol: [
                        'إيقاف الإجراء فوراً وحقن الهيالورونيداز لتخفيف الضغط الوعائي العصبي.',
                        'إعطاء مضادات التهاب غير ستيرويدية (NSAIDs) وكورتيكوستيرويد لتخفيف التورم حول العصب.'
                    ]
                }
            }
        },

        {
            id: 'temple',
            mdCode: 'T1, T2 (Temporal Fossa Codes)',
            nameAr: 'تجويف الصدغ واستعادة الاستدارة الهيكلية',
            nameEn: 'Temporal Hollow',
            region: 'upper-face',
            defaultDosage: 0.5,
            maxSafeDosage: 1.0,
            recommendedGPrime: 'firm',
            recommendedDepth: 'deep',
            recommendedTool: 'needle_bone',
            recommendedAngle: '90',
            recommendedTechnique: 'bolus',
            recommendedAspiration: true,
            dangerVessels: ['الشريan الصدغي السطحي (Superficial Temporal Artery)', 'الوريد الصدغي الأوسط العميق'],
            dangerLevel: 'critical',
            anatomicalLandmark: 'حفرة الصدغ المغطاة بعدة طبقات لفائفية معقدة (Superficial & Deep Temporal Fascia).',
            clinicalGuideline: 'قاعدة النقطة الواحدة (One-point Periosteal Bolus): نقطة تبعد 1 سم للأعلى و1 سم للخلف من الحافة العظمية للحجاج، ملامسة عظم الصدغ تماماً بزاوية 90°، وسحب عكسي طويل (Aspiration 5-7s). يُحظر الحقن في الطبقات المتوسطة!',
            
            correctOutcome: {
                title: 'امتلاء سلس للصدغ ورفع طفيف لذيل الحاجب',
                anatomicalResult: 'استعادة المحيط البيضاوي السلس للوجه العلوي وإلغاء المظهر الهزيل والغائر للصدغين دون أي نتوءات.',
                safetyChecklist: [
                    'الالتزام الصارم بالحقن فوق السمحاق العظمي المباشر.',
                    'سحب عكسي طويل (7 ثوانٍ) لتفادي الفروع الشريانية الصدغية.',
                    'حقن بولس بطيء جداً وثابت.',
                    'عدم تدليك الصدغ بعنف بعد الحقن لمنع انتشار الفيلر للطبقات السطحية.'
                ],
                postCare: [
                    'تجنب ارتداء النظارات الضيقة أو عصبات الرأس لمدة أسبوع.',
                    'قد يشعر المريض بصداع خفيف أو ألم عند المضغ في أول 48 ساعة وهو أمر طبيعي يزول بمسكن بسيط.'
                ]
            },

            complicationScenarios: {
                vascular_occlusion: {
                    type: 'necrosis',
                    title: 'انسداد الشريان الصدغي السطحي وخطر نخر الفروة والعمى (Temporal Artery Embolism)',
                    trigger: 'الحقن في الطبقة المتوسطة للصدغ بالإبرة أو بدون تثبيت عظمي وبدون سحب عكسي.',
                    pathophysiology: 'دخول الفيلر في فروع الشريان الصدغي المتصلة بشرايين فروة الرأس والشريان العيني، مسبباً نخر فروة الرأس وفقدان البصر.',
                    symptoms: 'صداع حاد ومفاجئ، ابيضاض الجلد في منطقة الصدغ وفروة الرأس، وتدهور بصري طارئ.',
                    rescueProtocol: [
                        'حالة طوارئ سريرية حرجة: تطبيق بروتوكول الجرعات العالية للهيالورونيداز فوراً (1500 وحدة).',
                        'إحالة فورية لطب العيون في حال أي أعراض بصرية.',
                        'كمادات دافئة وأسبرين ومراقبة العلامات الحيوية.'
                    ]
                }
            }
        }
    ],

    // 2. الشرايين ومناطق الخطر
    arteries: [
        {
            id: 'facial_artery',
            nameAr: 'الشريان الوجهي',
            nameEn: 'Facial Artery',
            color: '#D63030',
            description: 'يمتد من زاوية الفك متعرجاً نحو زاوية الفم ثم محاذاة الأنف.'
        },
        {
            id: 'labial_arteries',
            nameAr: 'الشرايين الشفوية (العلوية والسفلية)',
            nameEn: 'Superior & Inferior Labial Arteries',
            color: '#E54545',
            description: 'تغذي الشفاه وتمر غالباً في الثلث الخلفي من سماكة الشفة.'
        },
        {
            id: 'angular_artery',
            nameAr: 'الشريان الزاوي',
            nameEn: 'Angular Artery',
            color: '#C92525',
            description: 'امتداد الشريان الوجهي على جانب الأنف، يتصل بشرايين العين مباشرة.'
        },
        {
            id: 'infraorbital_artery',
            nameAr: 'شريان تحت الحجاج',
            nameEn: 'Infraorbital Artery',
            color: '#B82020',
            description: 'يخرج من الثقبة تحت الحجاج أسفل العين بحوالي 1 سم.'
        },
        {
            id: 'temporal_artery',
            nameAr: 'الشريان الصدغي السطحي',
            nameEn: 'Superficial Temporal Artery',
            color: '#D63030',
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
