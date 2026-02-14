import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  addDoc
} from 'firebase/firestore';
import { 
  Trophy, 
  ClipboardCheck, 
  Timer, 
  CheckCircle, 
  XCircle, 
  Users, 
  Gavel, 
  Activity,
  FileText,
  Plus,
  Globe,
  ArrowRight,
  ArrowLeft,
  Trash2 
} from 'lucide-react';

/* --------------------------------------------------------------
  FIREBASE CONFIGURATION
  (إعداداتك الخاصة - تم دمجها هنا لتعمل فوراً)
  --------------------------------------------------------------
*/
const firebaseConfig = {
  apiKey: "AIzaSyCawAQX_u8lHK6QtxwwEC0P7bAUBSgIrwU",
  authDomain: "wcrc-2026.firebaseapp.com",
  projectId: "wcrc-2026",
  storageBucket: "wcrc-2026.firebasestorage.app",
  messagingSenderId: "334422074866",
  appId: "1:334422074866:web:2409457b4deac8a18d776b"
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// معرف التطبيق
const appId = 'wcrc-2026-official';

/* --------------------------------------------------------------
  TRANSLATIONS DATABASE (قاعدة بيانات الترجمة)
  --------------------------------------------------------------
*/
const TRANSLATIONS = {
  ar: {
    app_title: "WCRC 2026",
    nav_results: "النتائج",
    nav_rules: "القوانين",
    nav_referee: "التحكيم",
    footer_copy: "IEEE RAS - الجامعة الأردنية © 2026",
    footer_sub: "تحدي الروبوتات المتسلقة - الإصدار الأول",
    loading: "جاري التحميل...",
    hero_title: "تحدي الروبوتات المتسلقة 2026",
    hero_desc: "السرعة، الهندسة، والتحدي الرأسي. هل روبوتك جاهز للقمة؟",
    btn_leaderboard: "شاهد النتائج المباشرة",
    btn_rules: "دليل القوانين",
    card_speed_title: "السرعة هي الحسم",
    card_speed_desc: "الفائز هو صاحب أسرع زمن للوصول إلى خط النهاية (200 سم). لديك جولتان، وسيتم احتساب الأفضل.",
    card_specs_title: "معايير صارمة",
    card_specs_desc: "الوزن الأقصى 5 كجم. الأبعاد 30x30x30 سم. الأمان والالتزام بالقوانين شرط أساسي للمشاركة.",
    card_cats_title: "فئات متعددة",
    card_cats_desc: "اختر التحدي الخاص بك: الجدار المغناطيسي (Magnetic) أو الجدار الأكريليكي (Acrylic).",
    lb_title: "لوحة المتصدرين",
    lb_live: "تحديث تلقائي",
    lb_rank: "الترتيب",
    lb_team: "الفريق",
    lb_robot: "الروبوت",
    lb_wall: "نوع الجدار",
    lb_time: "أفضل زمن",
    lb_dist: "أقصى مسافة",
    lb_status: "الحالة",
    lb_empty: "لا توجد بيانات فرق مسجلة بعد.",
    wall_mag: "مغناطيسي",
    wall_acr: "أكريليك",
    ref_title: "نظام إدارة التحكيم",
    ref_login_title: "الدخول لمنطقة الحكام",
    ref_pass_placeholder: "رمز الدخول (تجريبي: 123)",
    ref_login_btn: "دخول",
    ref_back: "عودة للقائمة",
    ref_add_btn: "إضافة فريق جديد",
    ref_add_save: "حفظ",
    ref_add_cancel: "إلغاء",
    ref_ph_name: "اسم الفريق",
    ref_ph_robot: "اسم الروبوت",
    ref_btn_inspect: "الفحص الفني",
    ref_btn_score: "إدارة الجولات",
    ref_btn_delete: "حذف الفريق",
    ref_confirm_delete: "هل أنت متأكد من حذف هذا الفريق؟ لا يمكن التراجع عن هذا الإجراء.",
    insp_title: "استمارة الفحص الفني",
    insp_date: "التاريخ",
    insp_decision: "القرار النهائي",
    insp_notes_ph: "ملاحظات أو إصلاحات مطلوبة...",
    insp_save: "حفظ وتحديث الحالة",
    status_pass: "ناجح",
    status_fail: "راسب",
    status_cond: "مشروط",
    status_pending: "في الانتظار",
    chk_1: "1. حجم البداية: داخل مكعب 30×30×30 سم؟",
    chk_2: "2. الوزن: أقل من أو يساوي 5.0 كجم؟",
    chk_3: "3. الحواف الحادة: لا توجد أطراف خطرة؟",
    chk_4: "4. نقطة التثبيت: وجود نقطة لربط حبل الأمان؟",
    chk_5: "5. حماية الجدار: العجلات لا تخدش (مطاط/سيليكون)؟",
    chk_6: "6. المفتاح الرئيسي: مفتاح لفصل الطاقة كلياً؟",
    chk_7: "7. تثبيت البطارية: البطارية ثابتة بقوة؟",
    chk_8: "8. نوع البطارية: LiPo/Li-ion/NiMH فقط؟",
    chk_9: "9. الجهد: أقل من 24 فولت؟",
    chk_10: "10. العزل: الأسلاك معزولة جيداً؟",
    chk_11: "11. مفتاح الطوارئ (E-Stop): فعال ويقطع الطاقة؟",
    chk_12: "12. حقيبة LiPo: الفريق يملك حقيبة شحن آمنة؟",
    score_title: "تسجيل النتائج",
    score_wave1: "الجولة الأولى (Wave 1)",
    score_wave2: "الجولة الثانية (Wave 2)",
    score_status_lbl: "حالة الجولة",
    score_time_lbl: "الزمن (ثواني)",
    score_dist_lbl: "المسافة (سم)",
    score_dist_hint: "* خط النهاية عند 200 سم",
    score_notes_lbl: "ملاحظات الحكم",
    score_save: "حفظ النتيجة",
    st_completed: "Completed (أكمل)",
    st_dnf: "DNF (لم ينهِ)",
    st_dq: "DQ (إقصاء)",
    rules_title: "دليل القوانين المختصر",
    r_1_title: "1. مواصفات الروبوت",
    r_1_l1: "الوزن الأقصى: 5.0 كجم.",
    r_1_l2: "أبعاد البداية: 30x30x30 سم (يسمح بالتوسع لاحقاً).",
    r_1_l3: "البطاريات: حتى 24 فولت (يمنع Lead-Acid).",
    r_1_l4: "الأمان: مفتاح طوارئ (E-Stop) إلزامي.",
    r_2_title: "2. إجراءات البداية",
    r_2_l1: "التجهيز: 90 ثانية كحد أقصى.",
    r_2_l2: "منطقة البدء: 0-30 سم من الأرض.",
    r_2_l3: "الصفارة: تفعيل الروبوت فوراً بعد الصفارة.",
    r_2_l4: "حبل الأمان: يجب أن يكون مرتخياً (Slack).",
    r_3_title: "3. حالات الـ DNF (إيقاف الجولة)",
    r_3_l1: "لمس الروبوت بعد الصفارة.",
    r_3_l2: "سقوط الروبوت أو أجزاء منه.",
    r_3_l3: "شد حبل الأمان (Tether Tension).",
    r_3_l4: "تجاوز الوقت (150 ثانية).",
    r_4_title: "4. الفوز والترتيب",
    r_4_l1: "الأفضلية لأسرع زمن (Best of 2).",
    r_4_l2: "في حال DNF، يتم حساب أقصى مسافة.",
    r_4_l3: "خط النهاية: تجاوز الجسم الرئيسي لخط 200 سم."
  },
  en: {
    app_title: "WCRC 2026",
    nav_results: "Results",
    nav_rules: "Rules",
    nav_referee: "Referee",
    footer_copy: "IEEE RAS - University of Jordan © 2026",
    footer_sub: "Wall Climbing Robot Challenge - Inaugural Edition",
    loading: "Loading...",
    hero_title: "Wall Climbing Robot Challenge 2026",
    hero_desc: "Speed, Engineering, and Vertical Challenge. Is your robot ready for the top?",
    btn_leaderboard: "Live Leaderboard",
    btn_rules: "Rulebook",
    card_speed_title: "Speed is Key",
    card_speed_desc: "Winner is the fastest time to cross the finish line (200cm). Best of 2 runs counts.",
    card_specs_title: "Strict Standards",
    card_specs_desc: "Max weight 5.0kg. Start size 30x30x30cm. Safety compliance is mandatory.",
    card_cats_title: "Categories",
    card_cats_desc: "Choose your wall: Magnetic (Galvanized Steel) or Acrylic (Smooth).",
    lb_title: "Leaderboard",
    lb_live: "Live Update",
    lb_rank: "Rank",
    lb_team: "Team",
    lb_robot: "Robot",
    lb_wall: "Wall Type",
    lb_time: "Best Time",
    lb_dist: "Max Dist",
    lb_status: "Status",
    lb_empty: "No team data available yet.",
    wall_mag: "Magnetic",
    wall_acr: "Acrylic",
    ref_title: "Referee Management System",
    ref_login_title: "Referee Area Access",
    ref_pass_placeholder: "Passcode (Demo: 123)",
    ref_login_btn: "Login",
    ref_back: "Back to List",
    ref_add_btn: "Add New Team",
    ref_add_save: "Save",
    ref_add_cancel: "Cancel",
    ref_ph_name: "Team Name",
    ref_ph_robot: "Robot Name",
    ref_btn_inspect: "Tech Inspection",
    ref_btn_score: "Run Scoring",
    ref_btn_delete: "Delete Team",
    ref_confirm_delete: "Are you sure you want to delete this team? This action cannot be undone.",
    insp_title: "Technical Inspection Form",
    insp_date: "Date",
    insp_decision: "Final Decision",
    insp_notes_ph: "Notes or required fixes...",
    insp_save: "Save & Update Status",
    status_pass: "PASS",
    status_fail: "FAIL",
    status_cond: "CONDITIONAL",
    status_pending: "PENDING",
    chk_1: "1. Start Size: Fits in 30x30x30 cm cube?",
    chk_2: "2. Weight: Total weight <= 5.0 kg?",
    chk_3: "3. Sharp Edges: No exposed spikes/blades?",
    chk_4: "4. Tether Point: Secure hardpoint available?",
    chk_5: "5. Wall Protection: Non-marring wheels (Rubber)?",
    chk_6: "6. Master Switch: Physical switch cuts ALL power?",
    chk_7: "7. Battery Mount: Rigid? (No movement when shaken)",
    chk_8: "8. Battery Type: LiPo/Li-ion/NiMH only?",
    chk_9: "9. Voltage Check: Nominal voltage < 24V?",
    chk_10: "10. Insulation: No exposed copper/wiring?",
    chk_11: "11. E-Stop: Functionality verified (Cuts to 0V)?",
    chk_12: "12. LiPo Bag: Team possesses Safe Charging Bag?",
    score_title: "Run Scoring",
    score_wave1: "Wave 1 (First Run)",
    score_wave2: "Wave 2 (Second Run)",
    score_status_lbl: "Run Status",
    score_time_lbl: "Time (Seconds)",
    score_dist_lbl: "Distance (cm)",
    score_dist_hint: "* Finish line at 200 cm",
    score_notes_lbl: "Referee Notes",
    score_save: "Save Run Result",
    st_completed: "Completed",
    st_dnf: "DNF",
    st_dq: "DQ",
    rules_title: "Quick Referee Guide",
    r_1_title: "1. Robot Specs",
    r_1_l1: "Max Weight: 5.0 kg.",
    r_1_l2: "Start Size: 30x30x30 cm (Expansion allowed after start).",
    r_1_l3: "Batteries: Up to 24V (No Lead-Acid).",
    r_1_l4: "Safety: E-Stop is mandatory.",
    r_2_title: "2. Start Procedure",
    r_2_l1: "Setup: Max 90 seconds.",
    r_2_l2: "Start Zone: 0-30 cm from ground.",
    r_2_l3: "Whistle: Activate robot immediately after signal.",
    r_2_l4: "Tether: Must remain SLACK at all times.",
    r_3_title: "3. DNF Triggers",
    r_3_l1: "Human touch after start whistle.",
    r_3_l2: "Robot falls off the wall.",
    r_3_l3: "Tether becomes tight (tension).",
    r_3_l4: "Time limit exceeded (150s).",
    r_4_title: "4. Scoring",
    r_4_l1: "Winner determined by Fastest Time (Best of 2).",
    r_4_l2: "If DNF, ranked by Max Distance.",
    r_4_l3: "Finish: Main Chassis must cross 200cm line."
  }
};

/* --------------------------------------------------------------
  MAIN APP COMPONENT
  --------------------------------------------------------------
*/
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home'); 
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('ar');

  const t = (key) => TRANSLATIONS[lang][key] || key;
  const toggleLang = () => setLang(prev => prev === 'ar' ? 'en' : 'ar');
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // AUTHENTICATION
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Auth Error:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // DATA FETCHING
  useEffect(() => {
    if (!user) return;
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'wcrc_teams');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeams(teamsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const renderView = () => {
    switch(view) {
      case 'leaderboard': return <LeaderboardView teams={teams} t={t} lang={lang} />;
      case 'referee': return <RefereeDashboard user={user} teams={teams} t={t} lang={lang} />;
      case 'rules': return <RulesView t={t} />;
      default: return <HomeView setView={setView} t={t} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" dir={dir}>
      <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
              <Activity className="h-8 w-8 text-yellow-400 mx-2" />
              <span className="font-bold text-xl tracking-wider">{t('app_title')}</span>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <button 
                onClick={toggleLang}
                className="flex items-center bg-blue-800 hover:bg-blue-700 px-3 py-1 rounded text-xs font-bold transition-colors border border-blue-600"
              >
                <Globe size={14} className="mx-1" />
                {lang === 'ar' ? 'English' : 'العربية'}
              </button>
              <NavButton icon={<Trophy size={18} />} text={t('nav_results')} active={view === 'leaderboard'} onClick={() => setView('leaderboard')} />
              <NavButton icon={<FileText size={18} />} text={t('nav_rules')} active={view === 'rules'} onClick={() => setView('rules')} />
              <NavButton icon={<Gavel size={18} />} text={t('nav_referee')} active={view === 'referee'} onClick={() => setView('referee')} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            <span className="mx-3 text-blue-900 font-bold">{t('loading')}</span>
          </div>
        ) : (
          renderView()
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>{t('footer_copy')}</p>
          <p className="mt-1">{t('footer_sub')}</p>
        </div>
      </footer>
    </div>
  );
}

/* SUB-COMPONENTS */
const NavButton = ({ icon, text, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${active ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white'}`}>
    <span className="mx-2">{icon}</span> {text}
  </button>
);

const HomeView = ({ setView, t }) => (
  <div className="space-y-12">
    <div className="text-center py-16 bg-gradient-to-br from-blue-900 to-slate-800 rounded-3xl text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div className="relative z-10 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">{t('hero_title')}</h1>
        <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">{t('hero_desc')}</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => setView('leaderboard')} className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-full transition-transform transform hover:scale-105 shadow-lg">{t('btn_leaderboard')}</button>
          <button onClick={() => setView('rules')} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full backdrop-blur-sm transition-all border border-white/30">{t('btn_rules')}</button>
        </div>
      </div>
    </div>
    <div className="grid md:grid-cols-3 gap-8">
      <InfoCard icon={<Timer className="text-blue-600 w-10 h-10" />} title={t('card_speed_title')} desc={t('card_speed_desc')} />
      <InfoCard icon={<ClipboardCheck className="text-green-600 w-10 h-10" />} title={t('card_specs_title')} desc={t('card_specs_desc')} />
      <InfoCard icon={<Users className="text-purple-600 w-10 h-10" />} title={t('card_cats_title')} desc={t('card_cats_desc')} />
    </div>
  </div>
);

const InfoCard = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-slate-800">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

const LeaderboardView = ({ teams, t, lang }) => {
  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      const bestRunA = getBestRun(a);
      const bestRunB = getBestRun(b);
      if (bestRunA.status === 'Completed' && bestRunB.status === 'Completed') return (bestRunA.time || 999) - (bestRunB.time || 999);
      if (bestRunA.status === 'Completed') return -1;
      if (bestRunB.status === 'Completed') return 1;
      if (bestRunA.status === 'DNF' && bestRunB.status === 'DNF') return (bestRunB.distance || 0) - (bestRunA.distance || 0);
      return 0;
    });
  }, [teams]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center"><Trophy className="mx-3 text-yellow-500" />{t('lb_title')}</h2>
        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">{t('lb_live')}</span>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('lb_rank')}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('lb_team')}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('lb_robot')}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('lb_wall')}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('lb_time')}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('lb_dist')}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('lb_status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedTeams.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-500">{t('lb_empty')}</td></tr>
              ) : (
                sortedTeams.map((team, index) => {
                  const best = getBestRun(team);
                  return (
                    <tr key={team.id} className={index < 3 ? 'bg-yellow-50/50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${index === 0 ? 'bg-yellow-400 text-white' : index === 1 ? 'bg-slate-300 text-slate-600' : index === 2 ? 'bg-amber-600 text-white' : 'text-slate-500'}`}>{index + 1}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{team.name}</td>
                      <td className="px-6 py-4 text-slate-600">{team.robotName}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${team.wallType === 'Magnetic' ? 'bg-indigo-100 text-indigo-700' : 'bg-cyan-100 text-cyan-700'}`}>{team.wallType === 'Magnetic' ? t('wall_mag') : t('wall_acr')}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">{best.time ? `${best.time}s` : '-'}</td>
                      <td className="px-6 py-4 text-slate-600">{best.distance ? `${best.distance}cm` : '-'}</td>
                      <td className="px-6 py-4"><StatusBadge status={best.status} t={t} /></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RefereeDashboard = ({ user, teams, t, lang }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [mode, setMode] = useState('list');
  const [accessGranted, setAccessGranted] = useState(false);
  const [passcode, setPasscode] = useState('');

  if (!accessGranted) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
        <Gavel className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-4">{t('ref_login_title')}</h2>
        <input type="password" placeholder={t('ref_pass_placeholder')} className="w-full p-3 border rounded-lg mb-4 text-center" value={passcode} onChange={(e) => setPasscode(e.target.value)} />
        <button onClick={() => passcode === '123' ? setAccessGranted(true) : alert('Incorrect Passcode')} className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800">{t('ref_login_btn')}</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{t('ref_title')}</h2>
        {mode !== 'list' && (
          <button onClick={() => setMode('list')} className="flex items-center text-blue-600 hover:underline">
             {lang === 'ar' ? <ArrowRight className="w-4 h-4 mx-1"/> : <ArrowLeft className="w-4 h-4 mx-1"/>}
             {t('ref_back')}
          </button>
        )}
      </div>
      {mode === 'list' && <TeamList teams={teams} t={t} lang={lang} onSelect={(team) => setSelectedTeam(team)} onInspect={(team) => { setSelectedTeam(team); setMode('inspect'); }} onScore={(team) => { setSelectedTeam(team); setMode('score'); }} />}
      {mode === 'inspect' && selectedTeam && <InspectionForm team={selectedTeam} onBack={() => setMode('list')} t={t} />}
      {mode === 'score' && selectedTeam && <ScoringForm team={selectedTeam} onBack={() => setMode('list')} t={t} />}
    </div>
  );
};

const TeamList = ({ teams, onInspect, onScore, t, lang }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', robotName: '', wallType: 'Magnetic' });

  const handleAddTeam = async () => {
    if(!newTeam.name || !newTeam.robotName) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'wcrc_teams'), { ...newTeam, inspectionStatus: 'Pending', runs: [], createdAt: Date.now() });
      setIsAdding(false);
      setNewTeam({ name: '', robotName: '', wallType: 'Magnetic' });
    } catch (e) { console.error(e); }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm(t('ref_confirm_delete'))) {
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wcrc_teams', teamId));
      } catch (e) { console.error("Error deleting team:", e); alert("Error deleting team"); }
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-wrap gap-4 items-end">
        {!isAdding ? (
          <button onClick={() => setIsAdding(true)} className="flex items-center text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"><Plus className="mx-2" /> {t('ref_add_btn')}</button>
        ) : (
          <div className="flex gap-2 w-full flex-wrap">
            <input placeholder={t('ref_ph_name')} className="border p-2 rounded flex-1" value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} />
            <input placeholder={t('ref_ph_robot')} className="border p-2 rounded flex-1" value={newTeam.robotName} onChange={e => setNewTeam({...newTeam, robotName: e.target.value})} />
            <select className="border p-2 rounded" value={newTeam.wallType} onChange={e => setNewTeam({...newTeam, wallType: e.target.value})}>
              <option value="Magnetic">Magnetic</option>
              <option value="Acrylic">Acrylic</option>
            </select>
            <button onClick={handleAddTeam} className="bg-green-600 text-white px-4 py-2 rounded">{t('ref_add_save')}</button>
            <button onClick={() => setIsAdding(false)} className="bg-slate-200 px-4 py-2 rounded">{t('ref_add_cancel')}</button>
          </div>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {teams.map(team => (
          <div key={team.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all relative">
             <button onClick={() => handleDeleteTeam(team.id)} className="absolute top-4 left-4 text-slate-300 hover:text-red-500 transition-colors p-1" title={t('ref_btn_delete')} style={{ [lang === 'ar' ? 'left' : 'right']: '1rem', [lang === 'ar' ? 'right' : 'left']: 'auto' }}><Trash2 size={18} /></button>
            <div className="flex justify-between items-start mb-4 pl-8 rtl:pl-0 rtl:pr-8">
              <div><h3 className="text-lg font-bold text-slate-900">{team.name}</h3><p className="text-slate-500 text-sm">{team.robotName} • {team.wallType === 'Magnetic' ? t('wall_mag') : t('wall_acr')}</p></div>
              <InspectionBadge status={team.inspectionStatus} t={t} />
            </div>
            <div className="flex gap-2 mt-4 border-t pt-4">
              <button onClick={() => onInspect(team)} className="flex-1 bg-slate-100 text-slate-700 py-2 rounded hover:bg-slate-200 text-sm font-medium flex justify-center items-center"><ClipboardCheck className="mx-2 w-4 h-4" /> {t('ref_btn_inspect')}</button>
              <button onClick={() => onScore(team)} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-medium flex justify-center items-center"><Timer className="mx-2 w-4 h-4" /> {t('ref_btn_score')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InspectionForm = ({ team, onBack, t }) => {
  const [checklist, setChecklist] = useState(team.checklist || {});
  const [decision, setDecision] = useState(team.inspectionStatus || 'Pending');
  const [notes, setNotes] = useState(team.inspectionNotes || '');
  const items = [ { id: 'dim', label: t('chk_1') }, { id: 'weight', label: t('chk_2') }, { id: 'edges', label: t('chk_3') }, { id: 'tether', label: t('chk_4') }, { id: 'wheels', label: t('chk_5') }, { id: 'switch', label: t('chk_6') }, { id: 'batt_mount', label: t('chk_7') }, { id: 'batt_type', label: t('chk_8') }, { id: 'voltage', label: t('chk_9') }, { id: 'insulation', label: t('chk_10') }, { id: 'estop', label: t('chk_11') }, { id: 'lipo_bag', label: t('chk_12') } ];
  const handleSave = async () => { try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wcrc_teams', team.id), { checklist, inspectionStatus: decision, inspectionNotes: notes }); onBack(); } catch(e) { console.error(e); } };
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-800 text-white p-4 flex justify-between items-center"><h3 className="font-bold text-lg">{t('insp_title')}: {team.name}</h3><span className="text-slate-300 text-sm">{new Date().toLocaleDateString()}</span></div>
      <div className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">{items.map(item => (<div key={item.id} className="flex items-center p-3 border rounded hover:bg-slate-50"><input type="checkbox" checked={checklist[item.id] || false} onChange={e => setChecklist({...checklist, [item.id]: e.target.checked})} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mx-3" /><label className="text-slate-700 font-medium text-sm">{item.label}</label></div>))}</div>
        <div className="mt-6 border-t pt-6">
          <label className="block text-slate-700 font-bold mb-2">{t('insp_decision')}</label>
          <div className="flex gap-4 mb-4">{['Pass', 'Conditional', 'Fail'].map(status => (<button key={status} onClick={() => setDecision(status)} className={`flex-1 py-3 rounded-lg font-bold border ${decision === status ? (status === 'Pass' ? 'bg-green-600 text-white' : status === 'Fail' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white') : 'bg-white text-slate-600 border-slate-300'}`}>{status === 'Pass' ? t('status_pass') : status === 'Fail' ? t('status_fail') : t('status_cond')}</button>))}</div>
          <textarea placeholder={t('insp_notes_ph')} className="w-full border p-3 rounded-lg" rows="3" value={notes} onChange={e => setNotes(e.target.value)}></textarea>
          <button onClick={handleSave} className="w-full mt-4 bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800">{t('insp_save')}</button>
        </div>
      </div>
    </div>
  );
};

const ScoringForm = ({ team, onBack, t }) => {
  const [activeRun, setActiveRun] = useState(1);
  const [data, setData] = useState({ time: '', distance: '', status: 'Completed', notes: '' });
  useEffect(() => { const existingRun = team.runs?.find(r => r.runId === activeRun); if (existingRun) { setData({ time: existingRun.time || '', distance: existingRun.distance || '', status: existingRun.status || 'Completed', notes: existingRun.notes || '' }); } else { setData({ time: '', distance: '', status: 'Completed', notes: '' }); } }, [activeRun, team]);
  const handleSaveRun = async () => { try { const newRun = { runId: activeRun, time: data.status === 'Completed' ? parseFloat(data.time) : null, distance: parseFloat(data.distance), status: data.status, notes: data.notes }; const otherRuns = team.runs?.filter(r => r.runId !== activeRun) || []; const updatedRuns = [...otherRuns, newRun]; await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wcrc_teams', team.id), { runs: updatedRuns }); alert('Saved!'); } catch(e) { console.error(e); } };
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-blue-900 text-white p-4"><h3 className="font-bold text-lg">{t('score_title')}: {team.name}</h3></div>
      <div className="p-6">
        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg"><button onClick={() => setActiveRun(1)} className={`flex-1 py-2 rounded-md font-bold text-sm ${activeRun === 1 ? 'bg-white shadow text-blue-900' : 'text-slate-500'}`}>{t('score_wave1')}</button><button onClick={() => setActiveRun(2)} className={`flex-1 py-2 rounded-md font-bold text-sm ${activeRun === 2 ? 'bg-white shadow text-blue-900' : 'text-slate-500'}`}>{t('score_wave2')}</button></div>
        <div className="space-y-4">
          <div><label className="block text-sm font-bold text-slate-700 mb-1">{t('score_status_lbl')}</label><select className="w-full p-2 border rounded" value={data.status} onChange={e => setData({...data, status: e.target.value})}><option value="Completed">{t('st_completed')}</option><option value="DNF">{t('st_dnf')}</option><option value="DQ">{t('st_dq')}</option></select></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-bold text-slate-700 mb-1">{t('score_time_lbl')}</label><input type="number" className="w-full p-2 border rounded disabled:bg-slate-100" placeholder="0.00" value={data.time} onChange={e => setData({...data, time: e.target.value})} disabled={data.status !== 'Completed'} /></div><div><label className="block text-sm font-bold text-slate-700 mb-1">{t('score_dist_lbl')}</label><input type="number" className="w-full p-2 border rounded" placeholder="200" value={data.distance} onChange={e => setData({...data, distance: e.target.value})} /><p className="text-xs text-slate-500 mt-1">{t('score_dist_hint')}</p></div></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-1">{t('score_notes_lbl')}</label><input className="w-full p-2 border rounded" placeholder="..." value={data.notes} onChange={e => setData({...data, notes: e.target.value})} /></div>
          <button onClick={handleSaveRun} className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">{t('score_save')}</button>
        </div>
      </div>
    </div>
  );
};

const RulesView = ({ t }) => (<div className="max-w-4xl mx-auto space-y-8"><div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200"><h2 className="text-3xl font-bold text-slate-900 mb-6">{t('rules_title')}</h2><div className="space-y-6"><RuleSection title={t('r_1_title')} icon={<CheckCircle className="text-green-600" />}><ul className="list-disc list-inside text-slate-700 space-y-2"><li>{t('r_1_l1')}</li><li>{t('r_1_l2')}</li><li>{t('r_1_l3')}</li><li>{t('r_1_l4')}</li></ul></RuleSection><RuleSection title={t('r_2_title')} icon={<Timer className="text-blue-600" />}><ul className="list-disc list-inside text-slate-700 space-y-2"><li>{t('r_2_l1')}</li><li>{t('r_2_l2')}</li><li>{t('r_2_l3')}</li><li>{t('r_2_l4')}</li></ul></RuleSection><RuleSection title={t('r_3_title')} icon={<XCircle className="text-red-600" />}><ul className="list-disc list-inside text-slate-700 space-y-2"><li>{t('r_3_l1')}</li><li>{t('r_3_l2')}</li><li>{t('r_3_l3')}</li><li>{t('r_3_l4')}</li></ul></RuleSection><RuleSection title={t('r_4_title')} icon={<Trophy className="text-yellow-600" />}><ul className="list-disc list-inside text-slate-700 space-y-2"><li>{t('r_4_l1')}</li><li>{t('r_4_l2')}</li><li>{t('r_4_l3')}</li></ul></RuleSection></div></div></div>);
const RuleSection = ({ title, icon, children }) => (<div className="border-b border-slate-100 pb-6 last:border-0"><h3 className="flex items-center text-xl font-bold text-slate-800 mb-3"><span className="mx-2">{icon}</span> {title}</h3><div className="px-8">{children}</div></div>);
const getBestRun = (team) => { if (!team.runs || team.runs.length === 0) return { time: null, distance: 0, status: 'None' }; const completedRuns = team.runs.filter(r => r.status === 'Completed'); if (completedRuns.length > 0) { completedRuns.sort((a, b) => a.time - b.time); return completedRuns[0]; } const otherRuns = [...team.runs]; otherRuns.sort((a, b) => (b.distance || 0) - (a.distance || 0)); return otherRuns[0] || { time: null, distance: 0, status: 'None' }; };
const InspectionBadge = ({ status, t }) => { const styles = { 'Pass': 'bg-green-100 text-green-800 border-green-200', 'Fail': 'bg-red-100 text-red-800 border-red-200', 'Conditional': 'bg-orange-100 text-orange-800 border-orange-200', 'Pending': 'bg-slate-100 text-slate-600 border-slate-200' }; const labelKey = { 'Pass': 'status_pass', 'Fail': 'status_fail', 'Conditional': 'status_cond', 'Pending': 'status_pending' }; return (<span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles['Pending']}`}>{t(labelKey[status] || 'status_pending')}</span>); };
const StatusBadge = ({ status, t }) => { if (!status || status === 'None') return <span className="text-slate-400">-</span>; const styles = { 'Completed': 'bg-green-100 text-green-700', 'DNF': 'bg-red-100 text-red-700', 'DQ': 'bg-slate-900 text-white' }; return (<span className={`px-2 py-1 rounded text-xs font-bold ${styles[status]}`}>{status}</span>); };