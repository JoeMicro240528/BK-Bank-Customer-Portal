"use client";

import {
  AlertCircle,
  BadgeCheck,
  Baby,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Globe2,
  Home as HomeIcon,
  Loader2,
  LogOut,
  Save,
  Search,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { ApiClientError, frontendApi } from "@/lib/api";
import type {
  AUFRequestCreate,
  AUFRequestRead,
  AUFRequestUpdate,
  InfoType,
  MasterDataBank,
  MasterDataCity,
  MasterDataCountry,
  MasterDataState,
} from "@/lib/swagger-types";

type Language = "en" | "ar";
type BusyAction = "save" | "verify" | "submit" | "lookup" | null;

type Option = {
  value: string;
  label: string;
};

type IdentityFormLine = {
  id_type: string;
  id_number: string;
  id_type_other: string;
  issuance_date: string;
  expiry_date: string;
  nationality_id: string;
  is_primary: boolean;
};

type IncomeSourceFormLine = {
  source_type: string;
  source_type_other: string;
  description: string;
  amount: string;
};

type MinorFormLine = {
  minor_name: string;
  minor_dob: string;
  minor_id_type: string;
  minor_id_number: string;
  guardian_cif: string;
  guardian_account_no: string;
  annual_income_amount: string;
};

type FormState = {
  external_ref: string;
  info_type: InfoType;
  name_arabic: string;
  name_english: string;
  mother_maiden_name: string;
  gender: string;
  date_of_birth: string;
  birth_country_id: string;
  nationality_id: string;
  marital_status: string;
  spouse_name: string;
  mobile_personal: string;
  mobile_additional: string;
  education_level: string;
  education_other: string;
  email: string;
  res_country_state_id: string;
  city_id: string;
  area: string;
  district: string;
  street: string;
  block: string;
  house_no: string;
  residency_no: string;
  residency_issue_date: string;
  residency_expiry_date: string;
  sponsor_name: string;
  sponsor_business_sector: string;
  selected_bank_id: string;
  bank_account_id: string;
  cif_number: string;
  business_sector: string;
  business_sector_other: string;
  employment_status: string;
  employment_type_specify: string;
  employer_name: string;
  employer_activity: string;
  employer_address: string;
  job_title: string;
  employment_date: string;
  primary_income_source: string;
  primary_income_other: string;
  income_other_sources: string;
  monthly_income_range: string;
  annual_income_range: string;
  annual_income_amount: string;
  source_funds_open_account: string;
  source_funds_fund_account: string;
  expected_txn_deposits: boolean;
  expected_txn_cheques: boolean;
  expected_txn_inward: boolean;
  expected_txn_outward: boolean;
  pep_is_pep: boolean;
  pep_position: string;
  pep_relative_pep: boolean;
  pep_relative_details: string;
  fatca_us_citizen: boolean;
  fatca_born_usa: boolean;
  fatca_dual_citizenship: boolean;
  fatca_other_citizenship: boolean;
  fatca_other_citizenship_specify: string;
  fatca_us_green_card: boolean;
  fatca_us_passport: boolean;
  fatca_us_mailing_address: boolean;
  fatca_us_proxy_authorized: boolean;
  fatca_us_standing_order_out: boolean;
  fatca_us_standing_order_in: boolean;
  fatca_us_stay_183days: boolean;
  fatca_stay_reason: string;
  fatca_stay_reason_specify: string;
  declaration_accepted: boolean;
  identity_lines: IdentityFormLine[];
  income_source_lines: IncomeSourceFormLine[];
  minor_lines: MinorFormLine[];
};

type Step = {
  id: string;
  icon: LucideIcon;
};

const STORAGE_OWNER_KEY = "cbos_customer_portal_owner_id";
const STORAGE_REF_KEY = "cbos_customer_portal_external_ref";

const steps: Step[] = [
  { id: "applicant", icon: UserRound },
  { id: "identity", icon: BadgeCheck },
  { id: "residence", icon: HomeIcon },
  { id: "account", icon: Building2 },
  { id: "work", icon: BriefcaseBusiness },
  { id: "income", icon: WalletCards },
  { id: "compliance", icon: ShieldCheck },
  { id: "minors", icon: Baby },
  { id: "review", icon: FileCheck2 },
];

const copy = {
  en: {
    appName: "CBOS Customer Information Update",
    appSubtitle: "Public AUF portal",
    language: "Language",
    english: "English",
    arabic: "Arabic",
    sudapassProvider: "SudaPass",
    sudapassTitle: "Sign in with SudaPass",
    sudapassSubtitle: "Enter your national number to start the customer information form.",
    sudapassId: "National number",
    sudapassLogin: "Continue",
    sudapassDemoUsers: "Mock users",
    sudapassInvalid: "This national number is not registered in SudaPass.",
    sudapassLoaded: "Identity information loaded from SudaPass.",
    sudapassAuthenticatedAs: "Signed in as",
    sudapassUseDemo: "Use this user",
    signOut: "Sign out",
    requestStatus: "Request status",
    requestReference: "Request code",
    lookup: "Find",
    saveDraft: "Save draft",
    verifyAccount: "Verify account",
    submitRequest: "Submit request",
    previous: "Back",
    next: "Next",
    addIdentity: "Add identity",
    addIncome: "Add income source",
    addMinor: "Add minor",
    remove: "Remove",
    shared: "Shared",
    required: "Required",
    saved: "Draft saved",
    loaded: "Request loaded",
    verified: "Verification requested",
    submitted: "Request submitted",
    backendOffline: "Backend data is not available right now.",
    saveFirst: "Save the request before verification or submission.",
    namesRequired: "Arabic name and English name are required.",
    identityRequired: "At least one identity document is required before submission.",
    declarationRequired: "The declaration must be accepted before submission.",
    bankHint: "Enter the bank account reference provided by your bank.",
    existingLookup: "Existing request",
    formSection: "Form",
    reviewTitle: "Review before submitting",
    noResponse: "No request has been saved yet.",
    statusDraft: "Draft",
    statusSubmitted: "Submitted",
    statusVerified: "Verified",
    statusDone: "Done",
    statusRejected: "Rejected",
    statusCancelled: "Cancelled",
    statusUnknown: "Status",
    verification: "Verification",
    created: "Created",
    step_applicant: "Applicant",
    step_identity: "Identity",
    step_residence: "Residence",
    step_account: "Account",
    step_work: "Work",
    step_income: "Income",
    step_compliance: "PEP / FATCA",
    step_minors: "Minors",
    step_review: "Review",
    external_ref: "Request code",
    info_type: "Request type",
    name_arabic: "Full name in Arabic",
    name_english: "Full name in English",
    mother_maiden_name: "Mother's maiden name",
    gender: "Gender",
    date_of_birth: "Date of birth",
    birth_country_id: "Country of birth",
    nationality_id: "Nationality",
    marital_status: "Marital status",
    spouse_name: "Spouse name",
    mobile_personal: "Personal mobile",
    mobile_additional: "Additional mobile",
    education_level: "Education level",
    education_other: "Education, other",
    email: "Email",
    id_type: "ID type",
    id_number: "ID number",
    id_type_other: "ID type, other",
    issuance_date: "Issue date",
    expiry_date: "Expiry date",
    is_primary: "Primary document",
    res_country_state_id: "State / Wilaya",
    city_id: "City",
    area: "Area",
    district: "District",
    street: "Street",
    block: "Block",
    house_no: "House no.",
    sponsor_name: "Financial supporter name, if any",
    sponsor_business_sector: "Financial supporter work sector, if any",
    selected_bank_id: "Bank",
    bank_account_id: "Bank-account record ID",
    cif_number: "CIF number",
    business_sector: "Business sector",
    business_sector_other: "Business sector, other",
    employment_status: "Employment status",
    employment_type_specify: "Employment type, specify",
    employer_name: "Employer name",
    employer_activity: "Employer activity",
    employer_address: "Work address",
    job_title: "Job title",
    employment_date: "Employment date",
    primary_income_source: "Primary income source",
    primary_income_other: "Income source, other",
    income_other_sources: "Other income sources",
    monthly_income_range: "Monthly income range",
    annual_income_range: "Annual income range",
    annual_income_amount: "Annual income amount",
    source_funds_open_account: "Funds used to open account",
    source_funds_fund_account: "Funds used to fund account",
    expectedTransactions: "Expected transactions",
    expected_txn_deposits: "Deposits",
    expected_txn_cheques: "Cheques",
    expected_txn_inward: "Inward transfers",
    expected_txn_outward: "Outward transfers",
    source_type: "Source type",
    source_type_other: "Source type, other",
    description: "Description",
    amount: "Amount",
    pep_is_pep: "Politically exposed person",
    pep_position: "PEP position / role",
    pep_relative_pep: "Relative of a PEP",
    pep_relative_details: "PEP relative details",
    fatca_us_citizen: "US citizen",
    fatca_born_usa: "Born in the USA",
    fatca_dual_citizenship: "Dual citizenship including US",
    fatca_other_citizenship: "Other citizenship",
    fatca_other_citizenship_specify: "Other citizenship, specify",
    fatca_us_green_card: "US Green Card",
    fatca_us_passport: "US passport",
    fatca_us_mailing_address: "US mailing address / PO box",
    fatca_us_proxy_authorized: "US proxy authorized on account",
    fatca_us_standing_order_out: "Standing order to the USA",
    fatca_us_standing_order_in: "Standing order from the USA",
    fatca_us_stay_183days: "Stayed in USA over 183 days",
    fatca_stay_reason: "US stay reason",
    fatca_stay_reason_specify: "US stay reason, specify",
    declaration_accepted: "I confirm the information is accurate and I accept the declaration.",
    minor_name: "Minor name",
    minor_dob: "Minor date of birth",
    minor_id_type: "Minor ID type",
    minor_id_number: "Minor ID number",
    guardian_cif: "Guardian CIF",
    guardian_account_no: "Guardian account no.",
    selectPlaceholder: "Select",
    optional: "Optional",
  },
  ar: {
    appName: "تحديث بيانات العملاء - بنك السودان المركزي",
    appSubtitle: "بوابة عامة لنموذج AUF",
    language: "اللغة",
    english: "English",
    arabic: "العربية",
    sudapassProvider: "سوداباس",
    sudapassTitle: "تسجيل الدخول عبر سوداباس",
    sudapassSubtitle: "أدخل الرقم الوطني لبدء نموذج تحديث بيانات العميل.",
    sudapassId: "الرقم الوطني",
    sudapassLogin: "متابعة",
    sudapassDemoUsers: "مستخدمون تجريبيون",
    sudapassInvalid: "الرقم الوطني غير مسجل في سوداباس.",
    sudapassLoaded: "تم تحميل بيانات الهوية من سوداباس.",
    sudapassAuthenticatedAs: "تم تسجيل الدخول باسم",
    sudapassUseDemo: "استخدم هذا المستخدم",
    signOut: "تسجيل الخروج",
    requestStatus: "حالة الطلب",
    requestReference: "رمز الطلب",
    lookup: "بحث",
    saveDraft: "حفظ مسودة",
    verifyAccount: "تحقق من الحساب",
    submitRequest: "إرسال الطلب",
    previous: "رجوع",
    next: "التالي",
    addIdentity: "إضافة هوية",
    addIncome: "إضافة مصدر دخل",
    addMinor: "إضافة قاصر",
    remove: "حذف",
    shared: "مشترك",
    required: "مطلوب",
    saved: "تم حفظ المسودة",
    loaded: "تم تحميل الطلب",
    verified: "تم طلب التحقق",
    submitted: "تم إرسال الطلب",
    backendOffline: "بيانات الخادم غير متاحة الآن.",
    saveFirst: "احفظ الطلب قبل التحقق أو الإرسال.",
    namesRequired: "الاسم بالعربية والاسم بالإنجليزية مطلوبان.",
    identityRequired: "يجب إدخال مستند هوية واحد على الأقل قبل الإرسال.",
    declarationRequired: "يجب قبول الإقرار قبل الإرسال.",
    bankHint: "أدخل مرجع الحساب الذي زودك به البنك.",
    existingLookup: "طلب سابق",
    formSection: "النموذج",
    reviewTitle: "مراجعة قبل الإرسال",
    noResponse: "لم يتم حفظ طلب حتى الآن.",
    statusDraft: "مسودة",
    statusSubmitted: "مرسل",
    statusVerified: "تم التحقق",
    statusDone: "مكتمل",
    statusRejected: "مرفوض",
    statusCancelled: "ملغي",
    statusUnknown: "الحالة",
    verification: "التحقق",
    created: "تاريخ الإنشاء",
    step_applicant: "مقدم الطلب",
    step_identity: "الهوية",
    step_residence: "السكن",
    step_account: "الحساب",
    step_work: "العمل",
    step_income: "الدخل",
    step_compliance: "PEP / FATCA",
    step_minors: "القصر",
    step_review: "المراجعة",
    external_ref: "رمز الطلب",
    info_type: "نوع الطلب",
    name_arabic: "الاسم الكامل بالعربية",
    name_english: "الاسم الكامل بالإنجليزية",
    mother_maiden_name: "اسم الأم",
    gender: "الجنس",
    date_of_birth: "تاريخ الميلاد",
    birth_country_id: "بلد الميلاد",
    nationality_id: "الجنسية",
    marital_status: "الحالة الاجتماعية",
    spouse_name: "اسم الزوج/الزوجة",
    mobile_personal: "رقم الهاتف الشخصي",
    mobile_additional: "رقم هاتف إضافي",
    education_level: "المستوى التعليمي",
    education_other: "تعليم آخر",
    email: "البريد الإلكتروني",
    id_type: "نوع الهوية",
    id_number: "رقم الهوية",
    id_type_other: "نوع هوية آخر",
    issuance_date: "تاريخ الإصدار",
    expiry_date: "تاريخ الانتهاء",
    is_primary: "مستند أساسي",
    res_country_state_id: "الولاية",
    city_id: "المدينة",
    area: "المنطقة",
    district: "المحلية / الحي",
    street: "الشارع",
    block: "المربع",
    house_no: "رقم المنزل",
    sponsor_name: "اسم المعيل إن وجد",
    sponsor_business_sector: "قطاع عمل المعيل إن وجد",
    selected_bank_id: "البنك",
    bank_account_id: "رقم سجل الحساب البنكي",
    cif_number: "رقم CIF",
    business_sector: "قطاع العمل",
    business_sector_other: "قطاع عمل آخر",
    employment_status: "حالة العمل",
    employment_type_specify: "تفاصيل حالة العمل",
    employer_name: "اسم جهة العمل",
    employer_activity: "نشاط جهة العمل",
    employer_address: "عنوان العمل",
    job_title: "المسمى الوظيفي",
    employment_date: "تاريخ التوظيف",
    primary_income_source: "مصدر الدخل الرئيسي",
    primary_income_other: "مصدر دخل آخر",
    income_other_sources: "مصادر دخل إضافية",
    monthly_income_range: "نطاق الدخل الشهري",
    annual_income_range: "نطاق الدخل السنوي",
    annual_income_amount: "مبلغ الدخل السنوي",
    source_funds_open_account: "مصدر أموال فتح الحساب",
    source_funds_fund_account: "مصدر تمويل الحساب",
    expectedTransactions: "المعاملات المتوقعة",
    expected_txn_deposits: "إيداعات",
    expected_txn_cheques: "شيكات",
    expected_txn_inward: "تحويلات واردة",
    expected_txn_outward: "تحويلات صادرة",
    source_type: "نوع المصدر",
    source_type_other: "نوع مصدر آخر",
    description: "الوصف",
    amount: "المبلغ",
    pep_is_pep: "شخصية سياسية ممثلة للمخاطر",
    pep_position: "المنصب / الدور",
    pep_relative_pep: "قريب لشخصية سياسية",
    pep_relative_details: "تفاصيل القرابة",
    fatca_us_citizen: "مواطن أمريكي",
    fatca_born_usa: "مولود في الولايات المتحدة",
    fatca_dual_citizenship: "جنسية مزدوجة تشمل الأمريكية",
    fatca_other_citizenship: "جنسية أخرى",
    fatca_other_citizenship_specify: "تحديد الجنسية الأخرى",
    fatca_us_green_card: "بطاقة خضراء أمريكية",
    fatca_us_passport: "جواز سفر أمريكي",
    fatca_us_mailing_address: "عنوان بريدي أمريكي",
    fatca_us_proxy_authorized: "وكيل أمريكي مفوض على الحساب",
    fatca_us_standing_order_out: "أمر تحويل دائم إلى الولايات المتحدة",
    fatca_us_standing_order_in: "أمر تحويل دائم من الولايات المتحدة",
    fatca_us_stay_183days: "الإقامة في أمريكا أكثر من 183 يوما",
    fatca_stay_reason: "سبب الإقامة في أمريكا",
    fatca_stay_reason_specify: "تحديد سبب الإقامة",
    declaration_accepted: "أؤكد صحة البيانات وأوافق على الإقرار.",
    minor_name: "اسم القاصر",
    minor_dob: "تاريخ ميلاد القاصر",
    minor_id_type: "نوع هوية القاصر",
    minor_id_number: "رقم هوية القاصر",
    guardian_cif: "رقم CIF للولي",
    guardian_account_no: "رقم حساب الولي",
    selectPlaceholder: "اختر",
    optional: "اختياري",
  },
} as const;

const optionSets = {
  infoType: [
    { value: "new", label: "New" },
    { value: "update", label: "Update" },
  ],
  gender: [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ],
  maritalStatus: [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
    { value: "other", label: "Other" },
  ],
  educationLevel: [
    { value: "elementary", label: "Elementary" },
    { value: "secondary", label: "Secondary" },
    { value: "diploma", label: "Diploma" },
    { value: "graduate", label: "Graduate" },
    { value: "post_graduate", label: "Post graduate" },
    { value: "other", label: "Other" },
  ],
  identityType: [
    { value: "national_id", label: "National ID" },
    { value: "passport", label: "Passport" },
    { value: "other", label: "Other" },
  ],
  businessSector: [
    { value: "government", label: "Government" },
    { value: "private", label: "Private" },
    { value: "other", label: "Other" },
  ],
  employmentStatus: [
    { value: "self_employed", label: "Self-employed" },
    { value: "salaried", label: "Salaried" },
    { value: "student", label: "Student" },
    { value: "retired", label: "Retired" },
    { value: "housewife", label: "Housewife" },
    { value: "other", label: "Other" },
  ],
  primaryIncomeSource: [
    { value: "salary", label: "Salary" },
    { value: "self_employed", label: "Self-employed / business" },
    { value: "pension", label: "Pension" },
    { value: "other", label: "Other" },
  ],
  incomeSourceType: [
    { value: "salary", label: "Salary" },
    { value: "business", label: "Business" },
    { value: "pension", label: "Pension" },
    { value: "rental", label: "Rental income" },
    { value: "investment", label: "Investment" },
    { value: "other", label: "Other" },
  ],
  monthlyIncomeRange: [
    { value: "lt_2m", label: "Less than SDG 2,000,000" },
    { value: "2m_5m", label: "SDG 2,000,000 - 5,000,000" },
    { value: "5m_10m", label: "SDG 5,000,000 - 10,000,000" },
    { value: "over_10m", label: "Over SDG 10,000,000" },
  ],
  annualIncomeRange: [
    { value: "lt_25m", label: "Less than SDG 25,000,000" },
    { value: "25m_50m", label: "SDG 25,000,000 - 50,000,000" },
    { value: "over_50m", label: "Over SDG 50,000,000" },
  ],
  fatcaStayReason: [
    { value: "athlete", label: "Athlete" },
    { value: "student", label: "Student" },
    { value: "teacher", label: "Teacher" },
    { value: "diplomat", label: "Diplomat" },
    { value: "other", label: "Other" },
  ],
  minorIdType: [
    { value: "national_id", label: "National ID" },
    { value: "birth_cert", label: "Birth certificate" },
  ],
};

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const { data: session, status: sessionStatus } = useSession();
  const [ownerId, setOwnerId] = useState("");
  const [loginError, setLoginError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [lookupRef, setLookupRef] = useState("");
  const [request, setRequest] = useState<AUFRequestRead | null>(null);
  const [savedExternalRef, setSavedExternalRef] = useState("");
  const [busyAction, setBusyAction] = useState<BusyAction>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [masterError, setMasterError] = useState("");
  const [countries, setCountries] = useState<MasterDataCountry[]>([]);
  const [states, setStates] = useState<MasterDataState[]>([]);
  const [cities, setCities] = useState<MasterDataCity[]>([]);
  const [banks, setBanks] = useState<MasterDataBank[]>([]);
  const stepperRef = useRef<HTMLElement | null>(null);

  const t = copy[language];
  const dir = language === "ar" ? "rtl" : "ltr";
  const current = steps[currentStep];
  const StepIcon = current.icon;
  const requestOptions = useMemo(
    () => ({ language, ownerId: ownerId || undefined }),
    [language, ownerId],
  );

  useEffect(() => {
    window.localStorage.removeItem(STORAGE_REF_KEY);
    setLookupRef("");
    setSavedExternalRef("");
  }, []);

  useEffect(() => {
    if (session?.user && !ownerId) {
      const nextOwnerId = `sudapass:${session.user.sub || session.user.national_id}`;
      const nextExternalRef = generateExternalRef();
      
      window.localStorage.setItem(STORAGE_OWNER_KEY, nextOwnerId);
      window.localStorage.removeItem(STORAGE_REF_KEY);
      
      setOwnerId(nextOwnerId);
      setForm(buildFormFromSudaPass(session.user, countries, nextExternalRef));
      setLookupRef("");
      setSavedExternalRef("");
      setRequest(null);
      setCurrentStep(0);
      setNotice(t.sudapassLoaded);
      setError("");
      setLoginError("");
    }
  }, [session, ownerId, countries, t.sudapassLoaded]);

  useEffect(() => {
    setNotice("");
    setError("");
    setLoginError("");
  }, [language]);

  useEffect(() => {
    function scrollActiveStep() {
      const stepper = stepperRef.current;
      if (!stepper || stepper.scrollWidth <= stepper.clientWidth) {
        return;
      }

      stepper
        .querySelector<HTMLElement>(".step-button.active")
        ?.scrollIntoView({ block: "nearest", inline: "center" });
    }

    scrollActiveStep();
    window.addEventListener("resize", scrollActiveStep);

    return () => {
      window.removeEventListener("resize", scrollActiveStep);
    };
  }, [currentStep, language]);

  useEffect(() => {
    let cancelled = false;

    async function loadCountries() {
      setMasterError("");
      try {
        const countryData = await frontendApi.getCountries(requestOptions);

        if (!cancelled) {
          setCountries(normalizeCountries(countryData));
        }
      } catch {
        if (!cancelled) {
          setMasterError(t.backendOffline);
        }
      }
    }

    void loadCountries();

    return () => {
      cancelled = true;
    };
  }, [requestOptions, t.backendOffline]);

  useEffect(() => {
    if (current.id !== "residence") {
      return;
    }

    let cancelled = false;

    async function loadStates() {
      setMasterError("");
      try {
        const stateData = await frontendApi.getStates("SD", requestOptions);
        if (!cancelled) {
          setStates(normalizeStates(stateData));
        }
      } catch {
        if (!cancelled) {
          setMasterError(t.backendOffline);
        }
      }
    }

    void loadStates();

    return () => {
      cancelled = true;
    };
  }, [current.id, requestOptions, t.backendOffline]);

  useEffect(() => {
    if (current.id !== "account") {
      return;
    }

    let cancelled = false;

    async function loadBanks() {
      setMasterError("");
      try {
        const bankData = await frontendApi.getBanks(requestOptions);
        if (!cancelled) {
          setBanks(normalizeBanks(bankData));
        }
      } catch {
        if (!cancelled) {
          setMasterError(t.backendOffline);
        }
      }
    }

    void loadBanks();

    return () => {
      cancelled = true;
    };
  }, [current.id, requestOptions, t.backendOffline]);

  useEffect(() => {
    let cancelled = false;
    const stateId = parseOptionalInt(form.res_country_state_id);

    if (!stateId) {
      setCities([]);
      return;
    }

    async function loadCities() {
      try {
        const cityData = await frontendApi.getCities(stateId, requestOptions);
        if (!cancelled) {
          setCities(normalizeCities(cityData));
        }
      } catch {
        if (!cancelled) {
          setCities([]);
        }
      }
    }

    void loadCities();

    return () => {
      cancelled = true;
    };
  }, [form.res_country_state_id, requestOptions]);

  function setField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function addIdentityLine() {
    setForm((previous) => ({
      ...previous,
      identity_lines: [...previous.identity_lines, emptyIdentityLine()],
    }));
  }

  function updateIdentityLine(index: number, patch: Partial<IdentityFormLine>) {
    setForm((previous) => ({
      ...previous,
      identity_lines: previous.identity_lines.map((line, lineIndex) =>
        lineIndex === index ? { ...line, ...patch } : line,
      ),
    }));
  }

  function removeIdentityLine(index: number) {
    setForm((previous) => ({
      ...previous,
      identity_lines: previous.identity_lines.filter((_, lineIndex) => lineIndex !== index),
    }));
  }

  function addIncomeLine() {
    setForm((previous) => ({
      ...previous,
      income_source_lines: [...previous.income_source_lines, emptyIncomeSourceLine()],
    }));
  }

  function updateIncomeLine(index: number, patch: Partial<IncomeSourceFormLine>) {
    setForm((previous) => ({
      ...previous,
      income_source_lines: previous.income_source_lines.map((line, lineIndex) =>
        lineIndex === index ? { ...line, ...patch } : line,
      ),
    }));
  }

  function removeIncomeLine(index: number) {
    setForm((previous) => ({
      ...previous,
      income_source_lines: previous.income_source_lines.filter((_, lineIndex) => lineIndex !== index),
    }));
  }

  function addMinorLine() {
    setForm((previous) => ({
      ...previous,
      minor_lines: [...previous.minor_lines, emptyMinorLine()],
    }));
  }

  function updateMinorLine(index: number, patch: Partial<MinorFormLine>) {
    setForm((previous) => ({
      ...previous,
      minor_lines: previous.minor_lines.map((line, lineIndex) =>
        lineIndex === index ? { ...line, ...patch } : line,
      ),
    }));
  }

  function removeMinorLine(index: number) {
    setForm((previous) => ({
      ...previous,
      minor_lines: previous.minor_lines.filter((_, lineIndex) => lineIndex !== index),
    }));
  }

  function loginWithSudaPass() {
    setLoginError("");
    signIn("sudapass");
  }

  function handleSignOut() {
    window.localStorage.removeItem(STORAGE_OWNER_KEY);
    window.localStorage.removeItem(STORAGE_REF_KEY);

    setOwnerId("");
    setForm(initialForm());
    setLookupRef("");
    setRequest(null);
    setSavedExternalRef("");
    setCurrentStep(0);
    setNotice("");
    setError("");
    setLoginError("");
    signOut({ redirect: false });
  }

  async function saveDraft(): Promise<AUFRequestRead | null> {
    setError("");
    setNotice("");

    const validationError = validateDraft(form, t);
    if (validationError) {
      setError(validationError);
      return null;
    }

    const externalRef = form.external_ref.trim() || generateExternalRef();
    if (externalRef !== form.external_ref) {
      setField("external_ref", externalRef);
    }

    setBusyAction("save");
    try {
      let result: AUFRequestRead;
      if (savedExternalRef === externalRef) {
        result = await frontendApi.updateRequest(externalRef, buildUpdatePayload(form, externalRef), requestOptions);
      } else {
        result = await frontendApi.createRequest(buildCreatePayload(form, externalRef), requestOptions);
        const resultRef = result.external_ref || externalRef;
        result = await frontendApi.updateRequest(resultRef, buildUpdatePayload(form, resultRef), requestOptions);
      }

      const resultRef = result.external_ref || externalRef;
      window.localStorage.setItem(STORAGE_REF_KEY, resultRef);
      setSavedExternalRef(resultRef);
      setLookupRef(resultRef);
      setRequest(result);
      setNotice(t.saved);
      return result;
    } catch (caught) {
      setError(readError(caught));
      return null;
    } finally {
      setBusyAction(null);
    }
  }

  async function lookupRequest() {
    const externalRef = lookupRef.trim();
    if (!externalRef) {
      setError(t.saveFirst);
      return;
    }

    setBusyAction("lookup");
    setError("");
    setNotice("");
    try {
      const result = await frontendApi.getRequest(externalRef, requestOptions);
      setRequest(result);
      setSavedExternalRef(result.external_ref || externalRef);
      setForm((previous) => ({
        ...previous,
        external_ref: result.external_ref || externalRef,
        info_type: result.info_type === "new" ? "new" : "update",
        name_arabic: result.name_arabic || previous.name_arabic,
        name_english: result.name_english || previous.name_english,
        cif_number: result.cif_number || previous.cif_number,
      }));
      window.localStorage.setItem(STORAGE_REF_KEY, result.external_ref || externalRef);
      setNotice(t.loaded);
    } catch (caught) {
      setError(readError(caught));
    } finally {
      setBusyAction(null);
    }
  }

  async function verifyAccount() {
    setError("");
    setNotice("");
    const saved = await saveDraft();
    const externalRef = saved?.external_ref || form.external_ref.trim();

    if (!externalRef) {
      setError(t.saveFirst);
      return;
    }

    setBusyAction("verify");
    try {
      const result = await frontendApi.verifyAccount(externalRef, requestOptions);
      setRequest(result);
      setNotice(t.verified);
    } catch (caught) {
      setError(readError(caught));
    } finally {
      setBusyAction(null);
    }
  }

  async function submitRequest() {
    setError("");
    setNotice("");

    const validationError = validateSubmit(form, t);
    if (validationError) {
      setError(validationError);
      return;
    }

    const saved = await saveDraft();
    const externalRef = saved?.external_ref || form.external_ref.trim();

    if (!externalRef) {
      setError(t.saveFirst);
      return;
    }

    setBusyAction("submit");
    try {
      const result = await frontendApi.submitRequest(externalRef, requestOptions);
      setRequest(result);
      setNotice(t.submitted);
      setCurrentStep(steps.length - 1);
    } catch (caught) {
      setError(readError(caught));
    } finally {
      setBusyAction(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void saveDraft();
  }

  const countryOptions = useMemo(() => masterOptions(countries), [countries]);
  const stateOptions = useMemo(() => masterOptions(states), [states]);
  const cityOptions = useMemo(() => masterOptions(cities), [cities]);
  const bankOptions = useMemo(
    () => banks.map((bank) => ({ value: String(bank.id), label: bank.bic ? `${bank.name} (${bank.bic})` : bank.name })),
    [banks],
  );
  if (sessionStatus === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <main className="portal auth-portal" dir={dir}>
        <header className="portal-header">
          <div>
            <div className="brand-row">
              <Building2 aria-hidden="true" size={24} />
              <p>{t.appSubtitle}</p>
            </div>
            <h1>{t.appName}</h1>
          </div>

          <div className="header-actions">
            <label className="language-control">
              <Globe2 aria-hidden="true" size={16} />
              <span>{t.language}</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value as Language)}>
                <option value="en">{t.english}</option>
                <option value="ar">{t.arabic}</option>
              </select>
            </label>
          </div>
        </header>

        <section className="login-shell">
          <div className="login-panel login-intro">
            <span className="login-provider">
              <ShieldCheck aria-hidden="true" size={18} />
              {t.sudapassProvider}
            </span>
            <h2>{t.sudapassTitle}</h2>
            <p>{t.sudapassSubtitle}</p>
          </div>

          <div className="login-panel login-form">
            {loginError && <Banner tone="danger" icon={AlertCircle} text={loginError} />}
            <button type="button" className="sudapass-image-button" aria-label={t.sudapassLogin} onClick={loginWithSudaPass}>
              <Image src="/signin-light-ar.svg" alt={t.sudapassTitle} width={200} height={44} priority />
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="portal" dir={dir}>
      <header className="portal-header">
        <div>
          <div className="brand-row">
            <Building2 aria-hidden="true" size={24} />
            <p>{t.appSubtitle}</p>
          </div>
          <h1>{t.appName}</h1>
        </div>

        <div className="header-actions">
          <span className="user-chip">
            <UserRound aria-hidden="true" size={16} />
            <span>
              {t.sudapassAuthenticatedAs}{" "}
              {session?.user?.name || ""}
            </span>
          </span>
          <label className="language-control">
            <Globe2 aria-hidden="true" size={16} />
            <span>{t.language}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value as Language)}>
              <option value="en">{t.english}</option>
              <option value="ar">{t.arabic}</option>
            </select>
          </label>
          <button type="button" className="button secondary compact-button" onClick={handleSignOut}>
            <LogOut aria-hidden="true" size={16} />
            <span>{t.signOut}</span>
          </button>
        </div>
      </header>

      <section className="request-strip" aria-label={t.requestStatus}>
        <div className="lookup-control">
          <TextInput
            label={t.existingLookup}
            value={lookupRef}
            onChange={setLookupRef}
            autoComplete="off"
          />
          <button
            type="button"
            className="button secondary icon-button"
            onClick={() => void lookupRequest()}
            disabled={busyAction !== null}
          >
            {busyAction === "lookup" ? <Loader2 className="spin" size={18} /> : <Search size={18} />}
            <span>{t.lookup}</span>
          </button>
        </div>

        <RequestStatus request={request} labels={t} />
      </section>

      {(notice || error || masterError) && (
        <div className="message-stack" role="status" aria-live="polite">
          {notice && <Banner tone="success" icon={CheckCircle2} text={notice} />}
          {error && <Banner tone="danger" icon={AlertCircle} text={error} />}
          {masterError && <Banner tone="warning" icon={AlertCircle} text={masterError} />}
        </div>
      )}

      <div className="workspace">
        <aside ref={stepperRef} className="stepper" aria-label={t.formSection}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === index;
            const isComplete = currentStep > index;

            return (
              <button
                type="button"
                className={`step-button ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`}
                key={step.id}
                onClick={() => setCurrentStep(index)}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="step-index">
                  {isComplete ? <CheckCircle2 aria-hidden="true" size={16} /> : index + 1}
                </span>
                <Icon aria-hidden="true" className="step-nav-icon" size={18} />
                <span>{t[`step_${step.id}` as keyof typeof t]}</span>
              </button>
            );
          })}
        </aside>

        <form className="form-surface" onSubmit={handleSubmit}>
          <div className="form-title">
            <div>
              <h2>
                <StepIcon aria-hidden="true" size={22} />
                <span>{t[`step_${current.id}` as keyof typeof t]}</span>
              </h2>
            </div>
            <span className="step-count">
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          {current.id === "applicant" && (
            <FieldSection>
              <SelectInput
                label={t.info_type}
                value={form.info_type}
                onChange={(value) => setField("info_type", value as InfoType)}
                options={optionSets.infoType}
                required
              />
              <TextInput
                label={t.external_ref}
                value={form.external_ref}
                onChange={(value) => setField("external_ref", value)}
                required
                autoComplete="off"
              />
              <TextInput
                label={t.name_arabic}
                value={form.name_arabic}
                onChange={(value) => setField("name_arabic", value)}
                required
                autoComplete="name"
              />
              <TextInput
                label={t.name_english}
                value={form.name_english}
                onChange={(value) => setField("name_english", value)}
                required
                autoComplete="name"
              />
              <TextInput
                label={t.mother_maiden_name}
                value={form.mother_maiden_name}
                onChange={(value) => setField("mother_maiden_name", value)}
              />
              <SelectInput
                label={t.gender}
                value={form.gender}
                onChange={(value) => setField("gender", value)}
                options={optionSets.gender}
              />
              <TextInput
                label={t.date_of_birth}
                type="date"
                value={form.date_of_birth}
                onChange={(value) => setField("date_of_birth", value)}
              />
              <SelectInput
                label={t.birth_country_id}
                value={form.birth_country_id}
                onChange={(value) => setField("birth_country_id", value)}
                options={countryOptions}
              />
              <SelectInput
                label={t.nationality_id}
                value={form.nationality_id}
                onChange={(value) => setField("nationality_id", value)}
                options={countryOptions}
              />
              <SelectInput
                label={t.marital_status}
                value={form.marital_status}
                onChange={(value) => setField("marital_status", value)}
                options={optionSets.maritalStatus}
              />
              <TextInput
                label={t.spouse_name}
                value={form.spouse_name}
                onChange={(value) => setField("spouse_name", value)}
              />
              <TextInput
                label={t.mobile_personal}
                value={form.mobile_personal}
                onChange={(value) => setField("mobile_personal", value)}
                inputMode="tel"
                autoComplete="tel"
              />
              <TextInput
                label={t.mobile_additional}
                value={form.mobile_additional}
                onChange={(value) => setField("mobile_additional", value)}
                inputMode="tel"
              />
              <TextInput
                label={t.email}
                type="email"
                value={form.email}
                onChange={(value) => setField("email", value)}
                autoComplete="email"
              />
              <SelectInput
                label={t.education_level}
                value={form.education_level}
                onChange={(value) => setField("education_level", value)}
                options={optionSets.educationLevel}
              />
              <TextInput
                label={t.education_other}
                value={form.education_other}
                onChange={(value) => setField("education_other", value)}
              />
            </FieldSection>
          )}

          {current.id === "identity" && (
            <div className="stack">
              {form.identity_lines.map((line, index) => (
                <RepeatedGroup
                  key={index}
                  title={`${t.id_type} ${index + 1}`}
                  removeLabel={t.remove}
                  onRemove={() => removeIdentityLine(index)}
                  canRemove={form.identity_lines.length > 1}
                >
                  <SelectInput
                    label={t.id_type}
                    value={line.id_type}
                    onChange={(value) => updateIdentityLine(index, { id_type: value })}
                    options={optionSets.identityType}
                    required
                  />
                  <TextInput
                    label={t.id_number}
                    value={line.id_number}
                    onChange={(value) => updateIdentityLine(index, { id_number: value })}
                    required
                  />
                  <TextInput
                    label={t.id_type_other}
                    value={line.id_type_other}
                    onChange={(value) => updateIdentityLine(index, { id_type_other: value })}
                  />
                  <TextInput
                    label={t.issuance_date}
                    type="date"
                    value={line.issuance_date}
                    onChange={(value) => updateIdentityLine(index, { issuance_date: value })}
                  />
                  <TextInput
                    label={t.expiry_date}
                    type="date"
                    value={line.expiry_date}
                    onChange={(value) => updateIdentityLine(index, { expiry_date: value })}
                  />
                  <SelectInput
                    label={t.nationality_id}
                    value={line.nationality_id}
                    onChange={(value) => updateIdentityLine(index, { nationality_id: value })}
                    options={countryOptions}
                  />
                  <CheckboxInput
                    label={t.is_primary}
                    checked={line.is_primary}
                    onChange={(value) => updateIdentityLine(index, { is_primary: value })}
                  />
                </RepeatedGroup>
              ))}
              <button type="button" className="button secondary fit" onClick={addIdentityLine}>
                <BadgeCheck size={18} />
                <span>{t.addIdentity}</span>
              </button>
            </div>
          )}

          {current.id === "residence" && (
            <FieldSection>
              <SelectInput
                label={t.res_country_state_id}
                value={form.res_country_state_id}
                onChange={(value) => {
                  setForm((previous) => ({ ...previous, res_country_state_id: value, city_id: "" }));
                }}
                options={stateOptions}
              />
              <SelectInput
                label={t.city_id}
                value={form.city_id}
                onChange={(value) => setField("city_id", value)}
                options={cityOptions}
              />
              <TextInput label={t.area} value={form.area} onChange={(value) => setField("area", value)} />
              <TextInput
                label={t.district}
                value={form.district}
                onChange={(value) => setField("district", value)}
              />
              <TextInput label={t.street} value={form.street} onChange={(value) => setField("street", value)} />
              <TextInput label={t.block} value={form.block} onChange={(value) => setField("block", value)} />
              <TextInput
                label={t.house_no}
                value={form.house_no}
                onChange={(value) => setField("house_no", value)}
              />
              <TextInput
                label={t.sponsor_name}
                value={form.sponsor_name}
                onChange={(value) => setField("sponsor_name", value)}
              />
              <TextInput
                label={t.sponsor_business_sector}
                value={form.sponsor_business_sector}
                onChange={(value) => setField("sponsor_business_sector", value)}
              />
            </FieldSection>
          )}

          {current.id === "account" && (
            <FieldSection>
              <SelectInput
                label={t.selected_bank_id}
                value={form.selected_bank_id}
                onChange={(value) => setField("selected_bank_id", value)}
                options={bankOptions}
              />
              <TextInput
                label={t.bank_account_id}
                value={form.bank_account_id}
                onChange={(value) => setField("bank_account_id", value)}
                inputMode="numeric"
                hint={t.bankHint}
              />
              <TextInput
                label={t.cif_number}
                value={form.cif_number}
                onChange={(value) => setField("cif_number", value)}
              />
            </FieldSection>
          )}

          {current.id === "work" && (
            <FieldSection>
              <SelectInput
                label={t.business_sector}
                value={form.business_sector}
                onChange={(value) => setField("business_sector", value)}
                options={optionSets.businessSector}
              />
              <TextInput
                label={t.business_sector_other}
                value={form.business_sector_other}
                onChange={(value) => setField("business_sector_other", value)}
              />
              <SelectInput
                label={t.employment_status}
                value={form.employment_status}
                onChange={(value) => setField("employment_status", value)}
                options={optionSets.employmentStatus}
              />
              <TextInput
                label={t.employment_type_specify}
                value={form.employment_type_specify}
                onChange={(value) => setField("employment_type_specify", value)}
              />
              <TextInput
                label={t.employer_name}
                value={form.employer_name}
                onChange={(value) => setField("employer_name", value)}
              />
              <TextInput
                label={t.employer_activity}
                value={form.employer_activity}
                onChange={(value) => setField("employer_activity", value)}
              />
              <TextInput
                label={t.employer_address}
                value={form.employer_address}
                onChange={(value) => setField("employer_address", value)}
              />
              <TextInput
                label={t.job_title}
                value={form.job_title}
                onChange={(value) => setField("job_title", value)}
              />
              <TextInput
                label={t.employment_date}
                type="date"
                value={form.employment_date}
                onChange={(value) => setField("employment_date", value)}
              />
            </FieldSection>
          )}

          {current.id === "income" && (
            <div className="stack">
              <FieldSection>
                <SelectInput
                  label={t.primary_income_source}
                  value={form.primary_income_source}
                  onChange={(value) => setField("primary_income_source", value)}
                  options={optionSets.primaryIncomeSource}
                />
                <TextInput
                  label={t.primary_income_other}
                  value={form.primary_income_other}
                  onChange={(value) => setField("primary_income_other", value)}
                />
                <TextInput
                  label={t.income_other_sources}
                  value={form.income_other_sources}
                  onChange={(value) => setField("income_other_sources", value)}
                />
                <SelectInput
                  label={t.monthly_income_range}
                  value={form.monthly_income_range}
                  onChange={(value) => setField("monthly_income_range", value)}
                  options={optionSets.monthlyIncomeRange}
                />
                <SelectInput
                  label={t.annual_income_range}
                  value={form.annual_income_range}
                  onChange={(value) => setField("annual_income_range", value)}
                  options={optionSets.annualIncomeRange}
                />
                <TextInput
                  label={t.annual_income_amount}
                  value={form.annual_income_amount}
                  onChange={(value) => setField("annual_income_amount", value)}
                  inputMode="decimal"
                />
                <TextInput
                  label={t.source_funds_open_account}
                  value={form.source_funds_open_account}
                  onChange={(value) => setField("source_funds_open_account", value)}
                />
                <TextInput
                  label={t.source_funds_fund_account}
                  value={form.source_funds_fund_account}
                  onChange={(value) => setField("source_funds_fund_account", value)}
                />
              </FieldSection>

              <FieldBlock title={t.expectedTransactions}>
                <div className="checkbox-grid">
                  <CheckboxInput
                    label={t.expected_txn_deposits}
                    checked={form.expected_txn_deposits}
                    onChange={(value) => setField("expected_txn_deposits", value)}
                  />
                  <CheckboxInput
                    label={t.expected_txn_cheques}
                    checked={form.expected_txn_cheques}
                    onChange={(value) => setField("expected_txn_cheques", value)}
                  />
                  <CheckboxInput
                    label={t.expected_txn_inward}
                    checked={form.expected_txn_inward}
                    onChange={(value) => setField("expected_txn_inward", value)}
                  />
                  <CheckboxInput
                    label={t.expected_txn_outward}
                    checked={form.expected_txn_outward}
                    onChange={(value) => setField("expected_txn_outward", value)}
                  />
                </div>
              </FieldBlock>

              {form.income_source_lines.map((line, index) => (
                <RepeatedGroup
                  key={index}
                  title={`${t.source_type} ${index + 1}`}
                  removeLabel={t.remove}
                  onRemove={() => removeIncomeLine(index)}
                  canRemove
                >
                  <SelectInput
                    label={t.source_type}
                    value={line.source_type}
                    onChange={(value) => updateIncomeLine(index, { source_type: value })}
                    options={optionSets.incomeSourceType}
                    required
                  />
                  <TextInput
                    label={t.source_type_other}
                    value={line.source_type_other}
                    onChange={(value) => updateIncomeLine(index, { source_type_other: value })}
                  />
                  <TextInput
                    label={t.description}
                    value={line.description}
                    onChange={(value) => updateIncomeLine(index, { description: value })}
                  />
                  <TextInput
                    label={t.amount}
                    value={line.amount}
                    inputMode="decimal"
                    onChange={(value) => updateIncomeLine(index, { amount: value })}
                  />
                </RepeatedGroup>
              ))}

              <button type="button" className="button secondary fit" onClick={addIncomeLine}>
                <WalletCards size={18} />
                <span>{t.addIncome}</span>
              </button>
            </div>
          )}

          {current.id === "compliance" && (
            <div className="stack">
              <FieldBlock title="PEP">
                <div className="checkbox-grid">
                  <CheckboxInput
                    label={t.pep_is_pep}
                    checked={form.pep_is_pep}
                    onChange={(value) => setField("pep_is_pep", value)}
                  />
                  <CheckboxInput
                    label={t.pep_relative_pep}
                    checked={form.pep_relative_pep}
                    onChange={(value) => setField("pep_relative_pep", value)}
                  />
                </div>
                <FieldSection compact>
                  <TextInput
                    label={t.pep_position}
                    value={form.pep_position}
                    onChange={(value) => setField("pep_position", value)}
                  />
                  <TextInput
                    label={t.pep_relative_details}
                    value={form.pep_relative_details}
                    onChange={(value) => setField("pep_relative_details", value)}
                  />
                </FieldSection>
              </FieldBlock>

              <FieldBlock title="FATCA">
                <div className="checkbox-grid">
                  <CheckboxInput
                    label={t.fatca_us_citizen}
                    checked={form.fatca_us_citizen}
                    onChange={(value) => setField("fatca_us_citizen", value)}
                  />
                  <CheckboxInput
                    label={t.fatca_born_usa}
                    checked={form.fatca_born_usa}
                    onChange={(value) => setField("fatca_born_usa", value)}
                  />
                  <CheckboxInput
                    label={t.fatca_dual_citizenship}
                    checked={form.fatca_dual_citizenship}
                    onChange={(value) => setField("fatca_dual_citizenship", value)}
                  />
                  <CheckboxInput
                    label={t.fatca_other_citizenship}
                    checked={form.fatca_other_citizenship}
                    onChange={(value) => setField("fatca_other_citizenship", value)}
                  />
                  <CheckboxInput
                    label={t.fatca_us_green_card}
                    checked={form.fatca_us_green_card}
                    onChange={(value) => setField("fatca_us_green_card", value)}
                  />
                  <CheckboxInput
                    label={t.fatca_us_passport}
                    checked={form.fatca_us_passport}
                    onChange={(value) => setField("fatca_us_passport", value)}
                  />
                  <CheckboxInput
                    label={t.fatca_us_mailing_address}
                    checked={form.fatca_us_mailing_address}
                    onChange={(value) => setField("fatca_us_mailing_address", value)}
                  />
                  <CheckboxInput
                    label={t.fatca_us_proxy_authorized}
                    checked={form.fatca_us_proxy_authorized}
                    onChange={(value) => setField("fatca_us_proxy_authorized", value)}
                  />
                  <CheckboxInput
                    label={t.fatca_us_standing_order_out}
                    checked={form.fatca_us_standing_order_out}
                    onChange={(value) => setField("fatca_us_standing_order_out", value)}
                  />
                  <CheckboxInput
                    label={t.fatca_us_standing_order_in}
                    checked={form.fatca_us_standing_order_in}
                    onChange={(value) => setField("fatca_us_standing_order_in", value)}
                  />
                  <CheckboxInput
                    label={t.fatca_us_stay_183days}
                    checked={form.fatca_us_stay_183days}
                    onChange={(value) => setField("fatca_us_stay_183days", value)}
                  />
                </div>
                <FieldSection compact>
                  <TextInput
                    label={t.fatca_other_citizenship_specify}
                    value={form.fatca_other_citizenship_specify}
                    onChange={(value) => setField("fatca_other_citizenship_specify", value)}
                  />
                  <SelectInput
                    label={t.fatca_stay_reason}
                    value={form.fatca_stay_reason}
                    onChange={(value) => setField("fatca_stay_reason", value)}
                    options={optionSets.fatcaStayReason}
                  />
                  <TextInput
                    label={t.fatca_stay_reason_specify}
                    value={form.fatca_stay_reason_specify}
                    onChange={(value) => setField("fatca_stay_reason_specify", value)}
                  />
                </FieldSection>
              </FieldBlock>
            </div>
          )}

          {current.id === "minors" && (
            <div className="stack">
              {form.minor_lines.map((line, index) => (
                <RepeatedGroup
                  key={index}
                  title={`${t.minor_name} ${index + 1}`}
                  removeLabel={t.remove}
                  onRemove={() => removeMinorLine(index)}
                  canRemove
                >
                  <TextInput
                    label={t.minor_name}
                    value={line.minor_name}
                    onChange={(value) => updateMinorLine(index, { minor_name: value })}
                    required
                  />
                  <TextInput
                    label={t.minor_dob}
                    type="date"
                    value={line.minor_dob}
                    onChange={(value) => updateMinorLine(index, { minor_dob: value })}
                  />
                  <SelectInput
                    label={t.minor_id_type}
                    value={line.minor_id_type}
                    onChange={(value) => updateMinorLine(index, { minor_id_type: value })}
                    options={optionSets.minorIdType}
                  />
                  <TextInput
                    label={t.minor_id_number}
                    value={line.minor_id_number}
                    onChange={(value) => updateMinorLine(index, { minor_id_number: value })}
                  />
                  <TextInput
                    label={t.guardian_cif}
                    value={line.guardian_cif}
                    onChange={(value) => updateMinorLine(index, { guardian_cif: value })}
                  />
                  <TextInput
                    label={t.guardian_account_no}
                    value={line.guardian_account_no}
                    onChange={(value) => updateMinorLine(index, { guardian_account_no: value })}
                  />
                  <TextInput
                    label={t.annual_income_amount}
                    value={line.annual_income_amount}
                    inputMode="decimal"
                    onChange={(value) => updateMinorLine(index, { annual_income_amount: value })}
                  />
                </RepeatedGroup>
              ))}
              <button type="button" className="button secondary fit" onClick={addMinorLine}>
                <Baby size={18} />
                <span>{t.addMinor}</span>
              </button>
            </div>
          )}

          {current.id === "review" && (
            <div className="review-grid">
              <div className="review-panel">
                <h3>{t.reviewTitle}</h3>
                <dl>
                  <ReviewRow label={t.requestReference} value={form.external_ref} />
                  <ReviewRow label={t.name_arabic} value={form.name_arabic} />
                  <ReviewRow label={t.name_english} value={form.name_english} />
                  <ReviewRow label={t.mobile_personal} value={form.mobile_personal} />
                  <ReviewRow label={t.cif_number} value={form.cif_number} />
                  <ReviewRow label={t.bank_account_id} value={form.bank_account_id} />
                  <ReviewRow label={t.id_type} value={form.identity_lines.filter(isCompleteIdentity).length} />
                </dl>
              </div>

              <div className="review-panel">
                <h3>{t.requestStatus}</h3>
                {request ? (
                  <dl>
                    <ReviewRow label={t.requestReference} value={request.reference} />
                    <ReviewRow label={t.statusUnknown} value={statusLabel(request.state, t)} />
                    <ReviewRow label={t.verification} value={request.verification_state} />
                    <ReviewRow label={t.created} value={formatDateTime(request.created)} />
                  </dl>
                ) : (
                  <p className="empty-state">{t.noResponse}</p>
                )}
              </div>

              <div className="declaration-box">
                <CheckboxInput
                  label={t.declaration_accepted}
                  checked={form.declaration_accepted}
                  onChange={(value) => setField("declaration_accepted", value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="button secondary"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0 || busyAction !== null}
            >
              {dir === "rtl" ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              <span>{t.previous}</span>
            </button>

            <div className="primary-actions">
              <button type="submit" className="button tertiary" disabled={busyAction !== null}>
                {busyAction === "save" ? <Loader2 className="spin" size={18} /> : <Save size={18} />}
                <span>{t.saveDraft}</span>
              </button>

              {current.id === "account" && (
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => void verifyAccount()}
                  disabled={busyAction !== null}
                >
                  {busyAction === "verify" ? <Loader2 className="spin" size={18} /> : <ShieldCheck size={18} />}
                  <span>{t.verifyAccount}</span>
                </button>
              )}

              {current.id === "review" ? (
                <button
                  type="button"
                  className="button primary"
                  onClick={() => void submitRequest()}
                  disabled={busyAction !== null}
                >
                  {busyAction === "submit" ? <Loader2 className="spin" size={18} /> : <FileCheck2 size={18} />}
                  <span>{t.submitRequest}</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="button primary"
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={busyAction !== null}
                >
                  <span>{t.next}</span>
                  {dir === "rtl" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

function FieldSection({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return <div className={compact ? "field-grid compact" : "field-grid"}>{children}</div>;
}

function FieldBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="field-block">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function RepeatedGroup({
  title,
  children,
  removeLabel,
  onRemove,
  canRemove,
}: {
  title: string;
  children: React.ReactNode;
  removeLabel: string;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <section className="repeated-group">
      <div className="repeated-title">
        <h3>{title}</h3>
        {canRemove && (
          <button type="button" className="text-button" onClick={onRemove}>
            {removeLabel}
          </button>
        )}
      </div>
      <FieldSection compact>{children}</FieldSection>
    </section>
  );
}

function TextInput({
  label,
  value,
  onChange,
  required = false,
  type = "text",
  hint,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  hint?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type">) {
  const id = useId();

  return (
    <label className="field" htmlFor={id}>
      <span>
        {label}
        {required && <b aria-label="required">*</b>}
      </span>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        {...rest}
      />
      {hint && <small>{hint}</small>}
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
}) {
  const id = useId();
  const placeholder = hasArabicText(label) ? copy.ar.selectPlaceholder : copy.en.selectPlaceholder;

  return (
    <label className="field" htmlFor={id}>
      <span>
        {label}
        {required && <b aria-label="required">*</b>}
      </span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} required={required}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxInput({
  label,
  checked,
  onChange,
  required = false,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}) {
  return (
    <label className="checkbox-field">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        required={required}
      />
      <span>
        {label}
        {required && <b aria-label="required">*</b>}
      </span>
    </label>
  );
}

function RequestStatus({
  request,
  labels,
}: {
  request: AUFRequestRead | null;
  labels: (typeof copy)[Language];
}) {
  return (
    <div className="status-panel">
      <p>{labels.requestStatus}</p>
      {request ? (
        <div className="status-values">
          <span className={`state-dot state-${request.state}`} />
          <strong>{statusLabel(request.state, labels)}</strong>
          <span>{request.reference}</span>
          <span>{request.verification_state}</span>
        </div>
      ) : (
        <span className="muted">{labels.noResponse}</span>
      )}
    </div>
  );
}

function Banner({
  tone,
  icon: Icon,
  text,
}: {
  tone: "success" | "danger" | "warning";
  icon: LucideIcon;
  text: string;
}) {
  return (
    <div className={`banner ${tone}`}>
      <Icon aria-hidden="true" size={18} />
      <span>{text}</span>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value || "-"}</dd>
    </>
  );
}

function initialForm(): FormState {
  return {
    external_ref: "",
    info_type: "update",
    name_arabic: "",
    name_english: "",
    mother_maiden_name: "",
    gender: "",
    date_of_birth: "",
    birth_country_id: "",
    nationality_id: "",
    marital_status: "",
    spouse_name: "",
    mobile_personal: "",
    mobile_additional: "",
    education_level: "",
    education_other: "",
    email: "",
    res_country_state_id: "",
    city_id: "",
    area: "",
    district: "",
    street: "",
    block: "",
    house_no: "",
    residency_no: "",
    residency_issue_date: "",
    residency_expiry_date: "",
    sponsor_name: "",
    sponsor_business_sector: "",
    selected_bank_id: "",
    bank_account_id: "",
    cif_number: "",
    business_sector: "",
    business_sector_other: "",
    employment_status: "",
    employment_type_specify: "",
    employer_name: "",
    employer_activity: "",
    employer_address: "",
    job_title: "",
    employment_date: "",
    primary_income_source: "",
    primary_income_other: "",
    income_other_sources: "",
    monthly_income_range: "",
    annual_income_range: "",
    annual_income_amount: "",
    source_funds_open_account: "",
    source_funds_fund_account: "",
    expected_txn_deposits: false,
    expected_txn_cheques: false,
    expected_txn_inward: false,
    expected_txn_outward: false,
    pep_is_pep: false,
    pep_position: "",
    pep_relative_pep: false,
    pep_relative_details: "",
    fatca_us_citizen: false,
    fatca_born_usa: false,
    fatca_dual_citizenship: false,
    fatca_other_citizenship: false,
    fatca_other_citizenship_specify: "",
    fatca_us_green_card: false,
    fatca_us_passport: false,
    fatca_us_mailing_address: false,
    fatca_us_proxy_authorized: false,
    fatca_us_standing_order_out: false,
    fatca_us_standing_order_in: false,
    fatca_us_stay_183days: false,
    fatca_stay_reason: "",
    fatca_stay_reason_specify: "",
    declaration_accepted: false,
    identity_lines: [emptyIdentityLine()],
    income_source_lines: [],
    minor_lines: [],
  };
}

import { Session } from "next-auth";

function buildFormFromSudaPass(
  user: Session["user"],
  countries: MasterDataCountry[],
  externalRef: string,
): FormState {
  const nationalityId = user.nationality
    ? countryIdForCode(countries, user.nationality, undefined)
    : "";

  return {
    ...initialForm(),
    external_ref: externalRef,
    info_type: "update",
    name_arabic: user.name || "",
    name_english: user.name || "",
    mother_maiden_name: "",
    gender: user.gender || "",
    date_of_birth: user.birthDate || "",
    birth_country_id: "",
    nationality_id: nationalityId,
    marital_status: "",
    mobile_personal: user.phone || "",
    education_level: "",
    email: user.email || "",
    identity_lines: [
      {
        ...emptyIdentityLine(),
        id_type: "national_id",
        id_number: user.national_id || "",
        issuance_date: "",
        expiry_date: "",
        nationality_id: nationalityId,
        is_primary: true,
      },
    ],
  };
}

function countryIdForCode(countries: MasterDataCountry[], code: string, fallbackId?: number): string {
  const country = countries.find((item) => item.code?.toUpperCase() === code.toUpperCase());
  const id = country?.id ?? fallbackId;
  return id ? String(id) : "";
}

function emptyIdentityLine(): IdentityFormLine {
  return {
    id_type: "national_id",
    id_number: "",
    id_type_other: "",
    issuance_date: "",
    expiry_date: "",
    nationality_id: "",
    is_primary: true,
  };
}

function emptyIncomeSourceLine(): IncomeSourceFormLine {
  return {
    source_type: "salary",
    source_type_other: "",
    description: "",
    amount: "",
  };
}

function emptyMinorLine(): MinorFormLine {
  return {
    minor_name: "",
    minor_dob: "",
    minor_id_type: "",
    minor_id_number: "",
    guardian_cif: "",
    guardian_account_no: "",
    annual_income_amount: "",
  };
}

function buildCreatePayload(form: FormState, externalRef: string): AUFRequestCreate {
  return {
    external_ref: optionalText(externalRef),
    info_type: form.info_type,
    name_arabic: form.name_arabic.trim(),
    name_english: form.name_english.trim(),
    mother_maiden_name: optionalText(form.mother_maiden_name),
    gender: optionalText(form.gender),
    date_of_birth: optionalText(form.date_of_birth),
    birth_country_id: parseOptionalInt(form.birth_country_id),
    nationality_id: parseOptionalInt(form.nationality_id),
    marital_status: optionalText(form.marital_status),
    spouse_name: optionalText(form.spouse_name),
    mobile_personal: optionalText(form.mobile_personal),
    mobile_additional: optionalText(form.mobile_additional),
    education_level: optionalText(form.education_level),
    email: optionalText(form.email),
    res_country_state_id: parseOptionalInt(form.res_country_state_id),
    city_id: parseOptionalInt(form.city_id),
    area: optionalText(form.area),
    district: optionalText(form.district),
    street: optionalText(form.street),
    block: optionalText(form.block),
    house_no: optionalText(form.house_no),
    bank_account_id: parseOptionalInt(form.bank_account_id),
    cif_number: optionalText(form.cif_number),
    business_sector: optionalText(form.business_sector),
    business_sector_other: optionalText(form.business_sector_other),
    employment_status: optionalText(form.employment_status),
    employment_type_specify: optionalText(form.employment_type_specify),
    employer_name: optionalText(form.employer_name),
    employer_activity: optionalText(form.employer_activity),
    employer_address: optionalText(form.employer_address),
    job_title: optionalText(form.job_title),
    employment_date: optionalText(form.employment_date),
    primary_income_source: optionalText(form.primary_income_source),
    primary_income_other: optionalText(form.primary_income_other),
    income_other_sources: optionalText(form.income_other_sources),
    monthly_income_range: optionalText(form.monthly_income_range),
    annual_income_range: optionalText(form.annual_income_range),
    annual_income_amount: parseOptionalFloat(form.annual_income_amount),
    source_funds_open_account: optionalText(form.source_funds_open_account),
    source_funds_fund_account: optionalText(form.source_funds_fund_account),
    expected_txn_deposits: form.expected_txn_deposits,
    expected_txn_cheques: form.expected_txn_cheques,
    expected_txn_inward: form.expected_txn_inward,
    expected_txn_outward: form.expected_txn_outward,
    pep_is_pep: form.pep_is_pep,
    pep_position: optionalText(form.pep_position),
    pep_relative_pep: form.pep_relative_pep,
    pep_relative_details: optionalText(form.pep_relative_details),
    fatca_us_citizen: form.fatca_us_citizen,
    fatca_born_usa: form.fatca_born_usa,
    fatca_dual_citizenship: form.fatca_dual_citizenship,
    fatca_other_citizenship: form.fatca_other_citizenship,
    fatca_other_citizenship_specify: optionalText(form.fatca_other_citizenship_specify),
    fatca_us_green_card: form.fatca_us_green_card,
    fatca_us_passport: form.fatca_us_passport,
    fatca_us_mailing_address: form.fatca_us_mailing_address,
    fatca_us_proxy_authorized: form.fatca_us_proxy_authorized,
    fatca_us_standing_order_out: form.fatca_us_standing_order_out,
    fatca_us_standing_order_in: form.fatca_us_standing_order_in,
    fatca_us_stay_183days: form.fatca_us_stay_183days,
    fatca_stay_reason: optionalText(form.fatca_stay_reason),
    fatca_stay_reason_specify: optionalText(form.fatca_stay_reason_specify),
    declaration_accepted: form.declaration_accepted,
    identity_lines: buildIdentityLines(form),
    income_source_lines: buildIncomeSourceLines(form),
    minor_lines: buildMinorLines(form),
  };
}

function buildUpdatePayload(form: FormState, externalRef: string): AUFRequestUpdate {
  return {
    ...buildCreatePayload(form, externalRef),
    education_other: optionalText(form.education_other),
    residency_no: optionalText(form.residency_no),
    residency_issue_date: optionalText(form.residency_issue_date),
    residency_expiry_date: optionalText(form.residency_expiry_date),
    sponsor_name: optionalText(form.sponsor_name),
    sponsor_business_sector: optionalText(form.sponsor_business_sector),
  };
}

function buildIdentityLines(form: FormState) {
  return form.identity_lines.filter(isCompleteIdentity).map((line) => ({
    id_type: line.id_type,
    id_number: line.id_number.trim(),
    id_type_other: optionalText(line.id_type_other),
    issuance_date: optionalText(line.issuance_date),
    expiry_date: optionalText(line.expiry_date),
    nationality_id: parseOptionalInt(line.nationality_id),
    is_primary: line.is_primary,
  }));
}

function buildIncomeSourceLines(form: FormState) {
  return form.income_source_lines
    .filter((line) => line.source_type || line.description.trim() || line.amount.trim())
    .map((line) => ({
      source_type: line.source_type || "other",
      source_type_other: optionalText(line.source_type_other),
      description: optionalText(line.description),
      amount: parseOptionalFloat(line.amount),
    }));
}

function buildMinorLines(form: FormState) {
  return form.minor_lines
    .filter((line) => line.minor_name.trim())
    .map((line) => ({
      minor_name: line.minor_name.trim(),
      minor_dob: optionalText(line.minor_dob),
      minor_id_type: optionalText(line.minor_id_type),
      minor_id_number: optionalText(line.minor_id_number),
      guardian_cif: optionalText(line.guardian_cif),
      guardian_account_no: optionalText(line.guardian_account_no),
      annual_income_amount: parseOptionalFloat(line.annual_income_amount),
    }));
}

function isCompleteIdentity(line: IdentityFormLine): boolean {
  return Boolean(line.id_type && line.id_number.trim());
}

function validateDraft(form: FormState, labels: (typeof copy)[Language]): string {
  if (!form.name_arabic.trim() || !form.name_english.trim()) {
    return labels.namesRequired;
  }
  return "";
}

function validateSubmit(form: FormState, labels: (typeof copy)[Language]): string {
  const draftError = validateDraft(form, labels);
  if (draftError) {
    return draftError;
  }
  if (!form.identity_lines.some(isCompleteIdentity)) {
    return labels.identityRequired;
  }
  if (!form.declaration_accepted) {
    return labels.declarationRequired;
  }
  return "";
}

function optionalText(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function parseOptionalInt(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseOptionalFloat(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeCountries(input: MasterDataCountry[]): MasterDataCountry[] {
  return input
    .map((item) => ({
      id: Number(item.id),
      name: String(item.name),
      code: item.code ? String(item.code) : null,
    }))
    .filter((item) => Number.isFinite(item.id) && item.name);
}

function normalizeStates(input: MasterDataState[]): MasterDataState[] {
  return input
    .map((item) => ({
      id: Number(item.id),
      name: String(item.name),
      code: item.code ? String(item.code) : null,
      country_id: relationId(item.country_id),
    }))
    .filter((item) => Number.isFinite(item.id) && item.name);
}

function normalizeCities(input: MasterDataCity[]): MasterDataCity[] {
  return input
    .map((item) => ({
      id: Number(item.id),
      name: String(item.name),
      state_id: relationId(item.state_id),
    }))
    .filter((item) => Number.isFinite(item.id) && item.name);
}

function normalizeBanks(input: MasterDataBank[]): MasterDataBank[] {
  return input
    .map((item) => ({
      id: Number(item.id),
      name: String(item.name),
      bic: item.bic ? String(item.bic) : null,
    }))
    .filter((item) => Number.isFinite(item.id) && item.name);
}

function relationId(value: unknown): number {
  if (Array.isArray(value)) {
    return Number(value[0]);
  }
  return Number(value);
}

function masterOptions(items: Array<{ id: number; name: string }>): Option[] {
  return items.map((item) => ({ value: String(item.id), label: item.name }));
}

function statusLabel(state: string, labels: (typeof copy)[Language]): string {
  const statusMap: Record<string, string> = {
    draft: labels.statusDraft,
    submitted: labels.statusSubmitted,
    verified: labels.statusVerified,
    done: labels.statusDone,
    rejected: labels.statusRejected,
    cancelled: labels.statusCancelled,
  };

  return statusMap[state] || state || labels.statusUnknown;
}

function readError(caught: unknown): string {
  if (caught instanceof ApiClientError) {
    return caught.message;
  }
  if (caught instanceof Error) {
    return caught.message;
  }
  return "Unexpected error.";
}

function generateExternalRef(): string {
  return `auf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString();
}

function hasArabicText(value: string): boolean {
  return /[\u0600-\u06ff]/.test(value);
}
