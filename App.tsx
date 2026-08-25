import { useState, useEffect, useRef } from "react";
import {
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  GraduationCap,
  Phone,
  ChevronDown,
  Menu,
  X,
  Star,
  Code2,
  Database,
  Brain,
  BarChart3,
  Layers,
  BookOpen,
  Award,
  Globe,
  Filter,
  FolderOpen,
  Presentation,
} from "lucide-react";

// Inline GitHub SVG since lucide-react v1.x renamed it
function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.021C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
];

// Static JPG files are stored beside App.tsx in the repository root.
// Vite bundles these through import.meta.glob so they also work on GitHub Pages.
const IMAGE_ASSETS = import.meta.glob("./*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const getImageAsset = (fileName: string) =>
  IMAGE_ASSETS[`./${fileName}`] ?? `${import.meta.env.BASE_URL}${fileName}`;

const STATS = [
  { value: "2028", label: "Expected Graduation" },
  { value: "3.24", label: "Latest Semester GPA" },
  { value: "15+", label: "Certifications" },
  { value: "5", label: "Showcased Projects" },
];

const SKILLS_GROUPS = [
  {
    icon: <Code2 className="w-5 h-5" />,
    title: "Programming Languages",
    color: "from-cyan-500 to-blue-600",
    tags: ["Python", "C++", "Java", "SQL", "HTML", "CSS"],
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "ML & Data Science",
    color: "from-violet-500 to-purple-600",
    tags: [
      "Machine Learning",
      "Data Science",
      "EDA",
      "Data Cleaning",
      "Data Visualization",
      "Predictive Analytics",
    ],
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: "Libraries & Frameworks",
    color: "from-emerald-500 to-teal-600",
    tags: ["Pandas", "NumPy", "Matplotlib", "Scikit-learn", "XGBoost", "Streamlit"],
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: "Software Engineering",
    color: "from-pink-500 to-rose-600",
    tags: ["OOP", "Data Structures", "Algorithms", "SDLC", "UML", "SRS", "System Analysis"],
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Tools & Platforms",
    color: "from-orange-500 to-amber-600",
    tags: ["Microsoft Excel", "Power BI", "VS Code", "Visual Studio", "Ubuntu Linux", "SQL Server", "MATLAB"],
  },
];

const SOFT_SKILLS = [
  "Problem Solving",
  "Analytical Thinking",
  "Teamwork",
  "Communication",
  "Adaptability",
  "Continuous Learning",
  "Attention to Detail",
  "Time Management",
];

// ─────────────────────────────────────────────────────────────
//  PROJECTS  (post-audit, verified, consolidated)
// ─────────────────────────────────────────────────────────────
//
//  AUDIT FINDINGS SUMMARY
//  ────────────────────────────────────────────────────────────
//  1. House Price Prediction  →  VERIFIED (Ames-Housing repo)
//       • R² ≈ 0.91 confirmed (Gradient Boosting, NOT XGBoost directly)
//       • Live Streamlit demo confirmed
//       • README says "Individual Project" (author = Antton Mikhael)
//       • Current portfolio claims "Team Project · 3 Members | IEEE Shrouq Academy"
//         → NO evidence of team or IEEE association in repo.  CORRECTED to Individual.
//
//  2. Adidas Sales Dashboard  →  VERIFIED (adidas-sales-dashboard repo)
//       • Excel-based, Google Sheets live link confirmed
//       • Individual Project | ERU — CONFIRMED
//
//  3. Job Employment System  →  VERIFIED (job-employment-system repo)
//       • SRS + full UML suite confirmed
//       • Team Project · 2 Members | ERU — CONFIRMED
//       • SRS Google Docs link available
//
//  4. Student Attendance & Grade System  →  VERIFIED (student-attendance-grade-system repo)
//       • PDF presentation confirmed
//       • Team Project · 5 Members | ERU — CONFIRMED
//       • Current card only said "Gantt Chart" & "Functional Requirements" — VERY weak
//       • Actual material: full UML suite + complete system design → UPGRADED description
//
//  5. C++ Applications Collection  → VERIFIED (cpp-projects repo)
//       • Contains: fundamentals, mini-apps, data structures, algorithms
//       • "Java & C++ OOP Applications" card was a DUPLICATE of the same work
//         → MERGED into one strong "C++ Programming & Data Structures Collection" card
//
//  6. Java & C++ OOP Applications  → DUPLICATE — REMOVED
//       • No separate Java repository found; Java claims are unverifiable
//       • C++ content overlaps entirely with cpp-projects repo
//
//  7. Power Supply Design  → WEAK — kept as Academic Work
//       • No repo, no code, no demo — coursework circuit design only
//       • Grouped into compact Academic Work section
//
//  8. Digital Logic Applications  → WEAK — kept as Academic Work
//       • No repo, no code — coursework only
//       • Grouped into compact Academic Work section
// ─────────────────────────────────────────────────────────────

type ProjectCategory = "all" | "ml" | "data" | "se" | "prog";

interface Project {
  id: string;
  category: ProjectCategory;
  categoryLabel: string;
  categoryColor: string;
  title: string;
  tech: string[];
  bullets: string[];
  type: string;
  institution?: string;
  tier: 1 | 2 | 3;
  github?: string;
  demo?: string;
  docs?: string;
  featured?: boolean;
  auditNote?: string; // internal — not shown in UI
}

const PROJECTS: Project[] = [
  // ── TIER 1 ─────────────────────────────────────────────────
  {
    id: "ames-housing",
    category: "ml",
    categoryLabel: "Machine Learning",
    categoryColor: "from-cyan-500 to-blue-500",
    title: "Ames Housing — Price Prediction ML Pipeline",
    tech: ["Python", "Pandas", "NumPy", "Scikit-learn", "XGBoost", "Streamlit", "Matplotlib", "Seaborn"],
    bullets: [
      "Built an end-to-end ML pipeline on the Ames Housing dataset (2,930 rows × 82 columns) covering EDA, preprocessing, feature encoding, and model evaluation.",
      "Trained and compared 5 regression models (Linear, Ridge, Decision Tree, Random Forest, Gradient Boosting); best model achieved R² ≈ 0.91 with Gradient Boosting.",
      "Applied median/mode imputation, Ordinal + One-Hot Encoding, StandardScaler, and Joblib model persistence across a structured pipeline.",
      "Deployed an interactive real-time price prediction web app using Streamlit — live and publicly accessible.",
    ],
    type: "Individual Project",
    institution: "Personal Project",
    tier: 1,
    featured: true,
    github: "https://github.com/Toni-11/Ames-Housing",
    demo: "https://my-projects-ames-housing.streamlit.app/",
    auditNote: "Verified: R² ≈ 0.91 Gradient Boosting confirmed in README. Individual project confirmed. IEEE/team claim removed.",
  },

  // ── TIER 2 ─────────────────────────────────────────────────
  {
    id: "adidas-dashboard",
    category: "data",
    categoryLabel: "Data Analytics",
    categoryColor: "from-violet-500 to-purple-600",
    title: "Adidas Sales Analytics Dashboard",
    tech: ["Microsoft Excel", "Pivot Tables", "Pivot Charts", "Slicers", "Data Analytics"],
    bullets: [
      "Designed an interactive Excel dashboard analyzing Adidas product performance across regions (Egypt, KSA, Oman, Iraq, Lebanon), categories, and store types.",
      "Built dynamic Pivot Tables and Charts with Slicers & Timelines for real-time filtering of revenue, profit, units sold, and discount metrics.",
      "Analyzed customer demographics (age, gender) and payment method preferences to support data-driven business decisions.",
      "Published as a live interactive dashboard accessible via Google Sheets.",
    ],
    type: "Individual Project",
    institution: "Egyptian Russian University — Data Analytics Course",
    tier: 2,
    github: "https://github.com/Toni-11/adidas-sales-dashboard",
    demo: "https://docs.google.com/spreadsheets/d/1S7HZ4f6358SSu8wH3IQGijvZb490PprI/edit?usp=sharing",
    auditNote: "Verified: Google Sheets live link confirmed. Individual project at ERU confirmed.",
  },
  {
    id: "job-employment",
    category: "se",
    categoryLabel: "Software Engineering",
    categoryColor: "from-emerald-500 to-teal-600",
    title: "Online Job Employment System — SRS",
    tech: ["SRS Documentation", "UML", "Use Case Diagrams", "Sequence Diagrams", "Class Diagram", "DFD", "System Analysis"],
    bullets: [
      "Produced a complete Software Requirements Specification (SRS) for a web-based employment platform connecting job seekers, employers, and administrators.",
      "Designed a full UML suite: Use Case, Activity, Sequence, Class Diagrams, and Data Flow Diagram (DFD) covering all system actors and workflows.",
      "Documented functional and non-functional requirements including performance, security, and scalability constraints.",
      "Specified an intelligent job-suggestion engine as a core system feature, bridging AI concepts with Software Engineering practice.",
    ],
    type: "Team Project · 2 Members",
    institution: "Egyptian Russian University — Software Engineering Course",
    tier: 2,
    github: "https://github.com/Toni-11/job-employment-system",
    docs: "https://docs.google.com/document/d/1e41oTh7z9e-npZKAgJdzM-p6x_EY3WeV/edit?usp=sharing",
    auditNote: "Verified: SRS + full UML suite confirmed. 2-member team confirmed.",
  },

  // ── TIER 3 ─────────────────────────────────────────────────
  {
    id: "cpp-collection",
    category: "prog",
    categoryLabel: "Programming",
    categoryColor: "from-orange-500 to-amber-500",
    title: "C++ Programming & Data Structures Collection",
    tech: ["C++", "OOP", "Data Structures", "Algorithms", "STL", "File Handling"],
    bullets: [
      "Curated academic collection covering C++ fundamentals, mini-applications (ATM, Cashier, GPA Calculator, Calories Calculator, Number Guessing Game), and standalone data structure implementations.",
      "Implements all major data structures from scratch: Linked Lists (singly, doubly, circular), Stacks, Queues (circular, deque, priority), Binary Trees, BST, Graphs (adjacency list), and Hash Tables.",
      "Covers searching (Linear, Binary) and sorting algorithms (Bubble, Selection, Insertion, Heap Sort) with standalone, compilable C++ source files.",
      "Demonstrates key C++ concepts including STL containers (map), dynamic memory, pointers, recursion, input validation, and structured console I/O.",
    ],
    type: "Academic Collection",
    institution: "Egyptian Russian University — Faculty of Artificial Intelligence",
    tier: 3,
    github: "https://github.com/Toni-11/cpp-projects",
    auditNote: "Verified via cpp-projects repo README. Merged 'C++ Applications Collection' and 'Java & C++ OOP Applications' (Java claims unverifiable, C++ content fully overlaps).",
  },
  {
    id: "attendance-grade",
    category: "se",
    categoryLabel: "Software Engineering",
    categoryColor: "from-pink-500 to-rose-500",
    title: "Student Attendance & Grade Management System",
    tech: ["System Analysis", "UML", "Use Case Diagram", "Activity Diagram", "Class Diagram", "Sequence Diagram", "DFD", "Context Diagram", "Database Design"],
    bullets: [
      "Analyzed and designed a centralized system managing student attendance, grades, GPA calculation, and academic reporting for Admin, Teacher, and Student roles.",
      "Produced a full system design covering Use Case, Activity, Sequence, Class Diagrams, Context Diagram, and a multi-level DFD with separate data stores (StudentDB, CourseDB, GradeDB, AttendanceDB).",
      "Defined role-based access control, authentication workflows, attendance tracking, grade management, and automated GPA calculation logic.",
      "Included a project Gantt Chart covering Analysis & Design, Implementation, and Testing & Deployment phases.",
    ],
    type: "Team Project · 5 Members",
    institution: "Egyptian Russian University — Software Engineering Course",
    tier: 3,
    github: "https://github.com/Toni-11/student-attendance-grade-system",
    docs: "https://github.com/Toni-11/student-attendance-grade-system/blob/main/Student-Attendance-and-Grade-System.pdf",
    auditNote: "Verified: PDF presentation confirmed. Current card was severely under-described. Full UML suite confirmed.",
  },
];

type CppDocument = {
  title: string;
  type: "PDF" | "Slides";
  url: string;
};

const CPP_DOCUMENTS: CppDocument[] = [
  {
    title: "C++ Programming Project — Cashier System",
    type: "PDF",
    url: "https://drive.google.com/file/d/1O1jNFkUqcgkDqgngGAC1rkmVyBG936gZ/view?usp=sharing",
  },
  {
    title: "ATM Machine Simulation Using C++",
    type: "PDF",
    url: "https://drive.google.com/file/d/1QdsI4xPcmKTuGfZ814gw6QGUeshkolRT/view?usp=drive_link",
  },
  {
    title: "Number Guessing Game in C++",
    type: "PDF",
    url: "https://drive.google.com/file/d/1O92O54Hxxn2vW3ch7k4mbxetXSLenywi/view?usp=drive_link",
  },
  {
    title: "C++ Presentation — Part 1",
    type: "Slides",
    url: "https://docs.google.com/presentation/d/1_keNszEJPv7JLGxq2cWZROUodYAulYrJ/edit?usp=sharing&ouid=111256448287748413415&rtpof=true&sd=true",
  },
  {
    title: "C++ Presentation — Part 2",
    type: "Slides",
    url: "https://docs.google.com/presentation/d/10o19_L6-HlmIYXUH14GZz6eU5CLoPf2g/edit?usp=sharing&ouid=111256448287748413415&rtpof=true&sd=true",
  },
];

// Academic work (no dedicated card — shown in compact strip)
const ACADEMIC_WORK = [
  {
    title: "Power Supply Circuit Design",
    area: "Electronics · Circuit Design",
    course: "Electronics Course",
  },
  {
    title: "Digital Logic Applications",
    area: "Logic Gates · Digital Design",
    course: "Logic Design Course",
  },
];

const CERTIFICATIONS = [
  // AI & Data Science
  { issuer: "HP Life", name: "HP Life Certificate",  file: "cert-hplife-1.jpg", specialty: "AI & Data Science" },
  { issuer: "IBM",     name: "IBM Certificate",       file: "cert-ibm-1.jpg",   specialty: "AI & Data Science" },
  { issuer: "IEEE",    name: "IEEE Certificate",      file: "cert-ieee.jpg",    specialty: "AI & Data Science" },
  // Cyber Security
  { issuer: "HP Life", name: "HP Life Certificate",  file: "cert-hplife-2.jpg", specialty: "Cyber Security" },
  { issuer: "ITI",     name: "ITI Certificate",       file: "cert-iti-2.jpg",   specialty: "Cyber Security" },
  // Programming
  { issuer: "ITI",       name: "ITI Certificate",        file: "cert-iti-1.jpg",       specialty: "Programming" },
  { issuer: "IT Legend", name: "IT Legend Certificate",  file: "cert-itlegend.jpg",    specialty: "Programming" },
  { issuer: "SoloLearn", name: "SoloLearn Certificate",  file: "cert-sololearn-1.jpg", specialty: "Programming" },
  { issuer: "SoloLearn", name: "SoloLearn Certificate",  file: "cert-sololearn-2.jpg", specialty: "Programming" },
  { issuer: "SoloLearn", name: "SoloLearn Certificate",  file: "cert-sololearn-3.jpg", specialty: "Programming" },
  { issuer: "Tuwaiq",    name: "Tuwaiq Certificate",     file: "cert-tuwaiq.jpg",      specialty: "Programming" },
  // Digital Marketing
  { issuer: "ITI", name: "ITI Certificate", file: "cert-iti-3.jpg", specialty: "Digital Marketing" },
  { issuer: "NTI", name: "NTI Certificate", file: "cert-nti.jpg",   specialty: "Digital Marketing" },
];

const CERT_SPECIALTY_ORDER = ["AI & Data Science", "Cyber Security", "Programming", "Digital Marketing"];

const CERT_SPECIALTY_CONFIG: Record<string, { gradient: string; badge: string; borderColor: string }> = {
  "AI & Data Science": { gradient: "from-violet-500 to-purple-600",  badge: "text-violet-300 bg-violet-500/15 border-violet-500/30", borderColor: "border-violet-500/20" },
  "Cyber Security":    { gradient: "from-red-500 to-rose-600",        badge: "text-rose-300 bg-rose-500/15 border-rose-500/30",       borderColor: "border-rose-500/20" },
  "Programming":       { gradient: "from-cyan-500 to-blue-600",       badge: "text-cyan-300 bg-cyan-500/15 border-cyan-500/30",       borderColor: "border-cyan-500/20" },
  "Digital Marketing": { gradient: "from-amber-500 to-orange-500",    badge: "text-amber-300 bg-amber-500/15 border-amber-500/30",    borderColor: "border-amber-500/20" },
};

const FILTER_TABS = [
  { key: "all" as const, label: "All Projects" },
  { key: "ml" as const, label: "Machine Learning" },
  { key: "data" as const, label: "Data Analytics" },
  { key: "se" as const, label: "Software Engineering" },
  { key: "prog" as const, label: "Programming" },
];

// Issuer colors map
const ISSUER_COLORS: Record<string, string> = {
  "HP Life":   "from-indigo-500 to-blue-600",
  "IBM":       "from-blue-600 to-blue-800",
  "IEEE":      "from-sky-500 to-blue-600",
  "ITI":       "from-green-600 to-emerald-700",
  "IT Legend": "from-amber-500 to-orange-600",
  "SoloLearn": "from-violet-500 to-purple-600",
  "Tuwaiq":    "from-teal-500 to-cyan-600",
  "NTI":       "from-pink-500 to-rose-600",
};

// ─────────────────────────────────────────────────────────────
//  HOOKS
// ─────────────────────────────────────────────────────────────

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + 80;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.offsetTop <= scrollY) {
          setActive(ids[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [ids]);
  return active;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─────────────────────────────────────────────────────────────
//  SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────

function GlassCard({
  children,
  className = "",
  featured = false,
}: {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`
        relative rounded-2xl border backdrop-blur-md transition-all duration-300
        ${featured
          ? "border-cyan-500/40 bg-white/5 shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:-translate-y-1"
          : "border-white/10 bg-white/5 shadow-lg hover:shadow-xl hover:border-white/20 hover:-translate-y-1"
        }
        ${className}
      `}
    >
      {featured && (
        <div className="absolute -top-3 left-5">
          <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-0.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/30">
            <Star className="w-3 h-3 fill-white" /> Featured
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

function TierBadge({ tier }: { tier: 1 | 2 | 3 }) {
  if (tier === 1) return null; // featured badge handles it
  if (tier === 2)
    return (
      <span className="text-[10px] font-semibold tracking-widest uppercase text-violet-400 border border-violet-500/30 rounded-full px-2 py-0.5">
        Supporting
      </span>
    );
  return (
    <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 border border-slate-600/50 rounded-full px-2 py-0.5">
      Academic
    </span>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{title}</h2>
      {subtitle && <p className="text-slate-400 max-w-xl mx-auto text-sm">{subtitle}</p>}
      <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" />
    </div>
  );
}

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  PROJECT CARD
// ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  delay = 0,
  onViewPresentations,
}: {
  project: Project;
  delay?: number;
  onViewPresentations?: () => void;
}) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <GlassCard featured={project.featured} className="h-full flex flex-col p-6">
        {/* Category badge + tier */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${project.categoryColor} px-3 py-1 text-xs font-semibold text-white shadow-sm`}
          >
            {project.categoryLabel}
          </span>
          <TierBadge tier={project.tier} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-3 leading-snug">{project.title}</h3>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-md bg-white/8 border border-white/10 px-2 py-0.5 text-[11px] text-slate-300 font-medium"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Bullets */}
        <ul className="space-y-2 mb-5 flex-1">
          {project.bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-300 leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400" />
              {b}
            </li>
          ))}
        </ul>

        {/* Footer: type / institution */}
        <div className="mb-4">
          <p className="text-xs text-slate-500">
            <span className="text-slate-400 font-medium">{project.type}</span>
            {project.institution && (
              <> &nbsp;·&nbsp; {project.institution}</>
            )}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-white/8 border border-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15 hover:border-white/30 transition-all duration-200"
            >
              <GithubIcon className="w-3.5 h-3.5" /> GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-200"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Live Demo
            </a>
          )}
          {project.docs && (
            <a
              href={project.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-violet-500/15 border border-violet-500/30 px-3 py-1.5 text-xs font-semibold text-violet-300 hover:bg-violet-500/25 transition-all duration-200"
            >
              <FileText className="w-3.5 h-3.5" /> Documentation
            </a>
          )}
          {project.id === "cpp-collection" && onViewPresentations && (
            <button
              type="button"
              onClick={onViewPresentations}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500/15 to-pink-500/15 border border-orange-500/30 px-3 py-1.5 text-xs font-semibold text-orange-200 hover:from-orange-500/25 hover:to-pink-500/25 transition-all duration-200"
            >
              <FolderOpen className="w-3.5 h-3.5" /> View Presentations
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

function CppDocumentsModal({ onClose }: { onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleAnimatedClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const handleAnimatedClose = () => {
    setIsVisible(false);
    closeTimer.current = setTimeout(onClose, 180);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-[#020817]/75 px-4 py-6 backdrop-blur-sm transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleAnimatedClose();
      }}
    >
      <div
        className={`relative w-full max-w-3xl max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl border border-cyan-400/20 bg-[#071426]/95 p-5 shadow-2xl shadow-cyan-950/50 transition-all duration-200 sm:p-7 ${
          isVisible ? "translate-y-0 scale-100" : "translate-y-2 scale-95"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cpp-documents-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleAnimatedClose}
          aria-label="Close C++ project documents"
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 pr-10">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-300 ring-1 ring-cyan-400/20">
              <FolderOpen className="h-5 w-5" />
            </div>
            <h2 id="cpp-documents-title" className="text-xl font-bold text-white sm:text-2xl">
              C++ Project Documents
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Academic presentations and project reports — click any file to open it directly.
          </p>
        </div>

        <div className="space-y-3">
          {CPP_DOCUMENTS.map((document) => {
            const isPdf = document.type === "PDF";
            return (
              <a
                key={document.title}
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${document.title} (${document.type}) in a new tab`}
                className="group flex w-full min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-cyan-950/20 sm:gap-4 sm:p-4"
              >
                <span
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                    isPdf
                      ? "bg-gradient-to-br from-rose-500/20 to-pink-500/20 text-rose-300 ring-1 ring-rose-400/20"
                      : "bg-gradient-to-br from-orange-500/20 to-pink-500/20 text-orange-300 ring-1 ring-orange-400/20"
                  }`}
                >
                  {isPdf ? <FileText className="h-5 w-5" /> : <Presentation className="h-5 w-5" />}
                </span>
                <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-slate-200 transition-colors group-hover:text-white sm:text-base">
                  {document.title}
                </span>
                <span className="flex-shrink-0 rounded-md border border-white/10 bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  {document.type}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────────────────────

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("all");
  const [scrolled, setScrolled] = useState(false);
  const [cppDocumentsOpen, setCppDocumentsOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<
    (typeof CERTIFICATIONS)[number] | null
  >(null);

  const sectionIds = NAV_LINKS.map((n) => n.id);
  const activeSection = useScrollSpy(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedCertificate(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedCertificate ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedCertificate]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const filteredProjects =
    activeFilter === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-[#050d1a] text-white antialiased">
      {/* ─── Background grid ─── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(6,182,212,0.12), transparent), " +
            "radial-gradient(ellipse 60% 40% at 80% 80%, rgba(139,92,246,0.10), transparent)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ══════════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#050d1a]/90 backdrop-blur-md border-b border-white/10 shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <button
              onClick={() => scrollTo("home")}
              className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent"
            >
              Antton Mikhael
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === link.id
                      ? "text-cyan-400 bg-cyan-500/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-slate-300 hover:text-white p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#050d1a]/95 backdrop-blur-md border-b border-white/10">
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeSection === link.id
                      ? "text-cyan-400 bg-cyan-500/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section id="home" className="relative min-h-screen flex items-center pt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            {/* Left content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                Available for Internship Opportunities
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                Hi, I'm{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                  Antton Mikhael
                </span>
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                AI Undergraduate at the Egyptian Russian University, passionate about{" "}
                <span className="text-cyan-400 font-medium">Machine Learning</span>,{" "}
                <span className="text-violet-400 font-medium">Data Science</span>, and{" "}
                <span className="text-pink-400 font-medium">Software Engineering</span>.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => scrollTo("projects")}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-200"
                >
                  View Projects
                </button>
                <a
                  href="https://drive.google.com/file/d/13CkD_XDlckSysJYG7MNTjtiZi4hB28MI/view?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Download CV
                </a>
                <button
                  onClick={() => scrollTo("contact")}
                  className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-6 py-3 text-sm font-semibold text-violet-300 hover:bg-violet-500/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Contact Me
                </button>
              </div>

              {/* Skill pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {["Python", "Machine Learning", "Data Analytics", "C++", "Software Engineering"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: profile + stats */}
            <div className="flex flex-col gap-4">
              {/* Profile Picture */}
              <div className="relative flex items-center justify-center mb-4">
                <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] flex items-center justify-center">
                  {/* Soft ambient glow */}
                  <div className="absolute inset-8 rounded-full bg-cyan-500/10 blur-3xl" />

                  {/* Decorative rotating rings */}
                  <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-[spin_20s_linear_infinite]" />
                  <div className="absolute inset-4 rounded-full border border-violet-400/20 animate-[spin_15s_linear_infinite_reverse]" />
                  <div className="absolute inset-9 rounded-full border border-pink-400/20 animate-[spin_10s_linear_infinite]" />

                  {/* Accent dots */}
                  <span className="absolute top-8 right-16 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.8)]" />
                  <span className="absolute bottom-10 left-14 w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />

                  {/* Profile Picture */}
                  <div className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 rounded-full p-1.5 bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 shadow-[0_0_45px_rgba(6,182,212,0.25)]">
                    <div
                      className="w-full h-full rounded-full overflow-hidden border border-white/10 bg-[#050d1a]"
                      aria-label="Antton Mikhael profile picture"
                    >
                      <img
                        src={getImageAsset("profile.jpg")}
                        alt="Antton Mikhael"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {STATS.map((s) => (
                  <GlassCard key={s.label} className="p-4 text-center">
                    <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                      {s.value}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500 animate-bounce">
            <span className="text-xs">Scroll</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════════════════ */}
      <section id="about" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="About Me"
            subtitle="AI undergraduate driven by curiosity, data, and the desire to build systems that matter."
          />

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Bio */}
            <AnimatedSection>
              <GlassCard className="p-8 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Who I Am</h3>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  Motivated Artificial Intelligence undergraduate at the{" "}
                  <span className="text-cyan-400 font-medium">Egyptian Russian University</span> with a strong
                  academic foundation in AI, Machine Learning, Data Science, and Software Engineering.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Passionate about building intelligent systems and solving real-world problems through data-driven
                  solutions, with hands-on experience in Python, Excel analytics, and UML-based system design.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { icon: <MapPin className="w-4 h-4" />, label: "Location", value: "El Zaytoun, Cairo" },
                    { icon: <GraduationCap className="w-4 h-4" />, label: "Degree", value: "B.Sc. Artificial Intelligence" },
                    { icon: <Phone className="w-4 h-4" />, label: "Phone", value: "+20 155 650 8837" },
                    { icon: <Mail className="w-4 h-4" />, label: "Email", value: "anttonmikhail5@gmail.com" },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2">
                      <span className="mt-0.5 text-cyan-400">{icon}</span>
                      <div>
                        <p className="text-[11px] text-slate-500 uppercase tracking-wide">{label}</p>
                        <p className="text-sm text-slate-200 break-all">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* Strengths */}
            <div className="space-y-4">
              {[
                {
                  color: "from-cyan-500 to-blue-600",
                  icon: <Code2 className="w-5 h-5" />,
                  title: "Strong Programming Foundation",
                  desc: "Proficient in Python, C++, Java, SQL, HTML & CSS with hands-on OOP, data structures, and algorithms experience.",
                },
                {
                  color: "from-violet-500 to-purple-600",
                  icon: <Brain className="w-5 h-5" />,
                  title: "Data-Driven Mindset",
                  desc: "Experienced in EDA, data cleaning, visualization, and building predictive ML models on real-world datasets.",
                },
                {
                  color: "from-emerald-500 to-teal-600",
                  icon: <Layers className="w-5 h-5" />,
                  title: "Software Engineering Principles",
                  desc: "Skilled in SDLC, UML modeling, SRS documentation, and system analysis applied in real academic projects.",
                },
                {
                  color: "from-pink-500 to-rose-600",
                  icon: <BookOpen className="w-5 h-5" />,
                  title: "Continuous Learner",
                  desc: "Constantly upgrading skills through 15+ certifications from IBM, IEEE, ITI, HP LIFE, and more.",
                },
              ].map((item, i) => (
                <AnimatedSection key={item.title} delay={i * 100}>
                  <GlassCard className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                        <span className="text-white">{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </GlassCard>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          EDUCATION
      ══════════════════════════════════════════════════════ */}
      <section id="education" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Education" />

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Degree card */}
            <AnimatedSection>
              <GlassCard className="p-8 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">B.Sc. Artificial Intelligence</h3>
                    <p className="text-sm text-slate-400">Egyptian Russian University (ERU)</p>
                  </div>
                </div>

                <div className="flex gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      3.24
                    </div>
                    <div className="text-xs text-slate-400">Latest Semester GPA</div>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div className="text-center">
                    <div className="text-2xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                      2.95
                    </div>
                    <div className="text-xs text-slate-400">Cumulative GPA (CGPA)</div>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div className="text-center">
                    <div className="text-2xl font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                      2028
                    </div>
                    <div className="text-xs text-slate-400">Expected Graduation</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Relevant Coursework</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Linear Algebra","Mathematics I & II","Computer Science","Physics","Discrete Mathematics",
                      "Electronics","Probability & Statistics","Database Systems","Programming","Logic Design",
                      "Signals & Systems","OOP","System Analysis","Operating Systems","Data Structures",
                      "Algorithms","Intro to AI","Software Engineering","Information Systems",
                    ].map((c) => (
                      <span
                        key={c}
                        className="rounded-md bg-white/5 border border-white/8 px-2 py-0.5 text-[11px] text-slate-400"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* Academic highlights */}
            <div className="space-y-3">
              {[
                "Developed an end-to-end Machine Learning regression pipeline using Python and real-world housing data.",
                "Designed an interactive Adidas Sales Dashboard using Microsoft Excel with pivot analysis.",
                "Produced a complete SRS document with UML diagrams for a web-based employment platform.",
                "Designed full system analysis documentation including UML and DFDs for a Student Management System.",
                "Built a curated C++ collection covering data structures, algorithms, and mini-applications.",
                "Applied Software Engineering principles including SDLC, SRS documentation, and system modeling.",
              ].map((item, i) => (
                <AnimatedSection key={i} delay={i * 60}>
                  <div className="flex gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" />
                    <p className="text-sm text-slate-300 leading-relaxed">{item}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SKILLS
      ══════════════════════════════════════════════════════ */}
      <section id="skills" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Skills" subtitle="Technical and professional competencies built through academic study and real projects." />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {SKILLS_GROUPS.map((group, i) => (
              <AnimatedSection key={group.title} delay={i * 80}>
                <GlassCard className="p-5 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${group.color} flex items-center justify-center shadow-md`}>
                      <span className="text-white">{group.icon}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white">{group.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>

          {/* Soft skills */}
          <AnimatedSection>
            <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">Professional & Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {SOFT_SKILLS.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROJECTS
      ══════════════════════════════════════════════════════ */}
      <section id="projects" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Projects"
            subtitle="Evidence-backed projects — audited, consolidated, and accurately described."
          />

          {/* Audit transparency notice */}
          <AnimatedSection>
            <div className="mb-8 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 flex gap-3">
              <Filter className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-cyan-300 mb-1">Portfolio Integrity Notice</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All projects have been audited against their GitHub repositories and supporting documentation.
                  Duplicate entries have been consolidated, inaccurate claims have been corrected, and
                  descriptions reflect only verified evidence. Electronics and Logic Design coursework
                  appears in the Academic Work section below.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeFilter === tab.key
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Project legend */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>Featured — strongest technical projects</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-violet-400" />
              <span>Supporting — solid additional projects</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-slate-500" />
              <span>Academic — design/analysis projects</span>
            </div>
          </div>

          {/* Cards grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              No projects in this category.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-6">
              {filteredProjects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  delay={i * 80}
                  onViewPresentations={
                    project.id === "cpp-collection" ? () => setCppDocumentsOpen(true) : undefined
                  }
                />
              ))}
            </div>
          )}

          {/* Academic Work compact section */}
          {(activeFilter === "all" || activeFilter === "prog") && (
            <AnimatedSection delay={200}>
              <div className="mt-12">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-white/10" />
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                    Academic Coursework
                  </h3>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <p className="text-center text-xs text-slate-500 mb-5">
                  Coursework projects with no independent repositories — included for completeness.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {ACADEMIC_WORK.map((work) => (
                    <div
                      key={work.title}
                      className="rounded-xl border border-white/8 bg-white/3 p-4 flex items-start gap-3"
                    >
                      <BookOpen className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-300">{work.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{work.area}</p>
                        <p className="text-[11px] text-slate-600 mt-1">ERU — {work.course}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CERTIFICATIONS
      ══════════════════════════════════════════════════════ */}
      <section id="certifications" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Certifications"
            subtitle="13 certifications from HP Life, IBM, IEEE, ITI, IT Legend, SoloLearn, Tuwaiq, and NTI."
          />

          <div className="space-y-12">
            {CERT_SPECIALTY_ORDER.map((specialty) => {
              const specialtyCerts = CERTIFICATIONS.filter((c) => c.specialty === specialty);
              if (specialtyCerts.length === 0) return null;
              const cfg = CERT_SPECIALTY_CONFIG[specialty];
              const orgs = [...new Set(specialtyCerts.map((c) => c.issuer))];
              return (
                <AnimatedSection key={specialty}>
                  {/* Specialty header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="h-px flex-1 bg-white/10" />
                    <div className="flex flex-col items-center gap-2">
                      <span className={`px-5 py-1.5 rounded-full bg-gradient-to-r ${cfg.gradient} text-white text-sm font-bold shadow-lg`}>
                        {specialty}
                      </span>
                      <div className="flex flex-wrap justify-center gap-2">
                        {orgs.map((org) => (
                          <span key={org} className={`text-xs font-semibold px-3 py-0.5 rounded-full border ${cfg.badge}`}>
                            {org}
                          </span>
                        ))}
                        <span className="text-xs text-slate-500 px-2 py-0.5">
                          {specialtyCerts.length} cert{specialtyCerts.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  {/* Cards grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {specialtyCerts.map((cert, i) => (
                      <div
                        key={cert.file}
                        className={`rounded-xl border ${cfg.borderColor} bg-white/4 p-4 hover:bg-white/7 hover:border-white/20 transition-all duration-200`}
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedCertificate(cert)}
                          className="group w-full text-left"
                          aria-label={`View ${cert.issuer} certificate`}
                        >
                          <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-[#050d1a]">
                            <img
                              src={getImageAsset(cert.file)}
                              alt={`${cert.issuer} certificate`}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/35">
                              <span className="rounded-lg bg-black/70 px-4 py-2 text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                View Certificate
                              </span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div
                              className={`flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${
                                ISSUER_COLORS[cert.issuer] || "from-slate-600 to-slate-700"
                              } flex items-center justify-center`}
                            >
                              <Award className="w-4 h-4 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{cert.issuer}</p>
                              <p className="text-sm text-slate-200 font-medium leading-snug mt-0.5">{cert.name}</p>
                            </div>
                          </div>

                          <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-colors group-hover:bg-cyan-500/20">
                            <ExternalLink className="w-3.5 h-3.5" />
                            View Certificate
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          LANGUAGES
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-white/3 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Languages</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { lang: "Arabic", level: "Native", color: "from-green-500 to-emerald-500", width: "100%" },
                { lang: "English", level: "B2 — Upper Intermediate", color: "from-blue-500 to-cyan-500", width: "72%" },
                { lang: "Russian", level: "A2 — Elementary", color: "from-red-500 to-orange-500", width: "30%" },
              ].map(({ lang, level, color, width }) => (
                <div key={lang}>
                  <p className="text-sm font-semibold text-white mb-1">{lang}</p>
                  <p className="text-xs text-slate-400 mb-2">{level}</p>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${color}`}
                      style={{ width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════════════════ */}
      <section id="contact" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Get In Touch"
            subtitle="Open to internship opportunities, collaborations, and conversations about AI and data."
          />

          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Info */}
            <AnimatedSection>
              <GlassCard className="p-8 h-full">
                <h3 className="text-xl font-bold text-white mb-6">Let's Connect</h3>

                <div className="space-y-5">
                  {[
                    {
                      icon: <Mail className="w-5 h-5" />,
                      label: "Email",
                      value: "anttonmikhail5@gmail.com",
                      href: "mailto:anttonmikhail5@gmail.com",
                      color: "from-cyan-500 to-blue-600",
                    },
                    {
                      icon: <GithubIcon className="w-5 h-5" />,
                      label: "GitHub",
                      value: "github.com/Toni-11",
                      href: "https://github.com/Toni-11",
                      color: "from-slate-600 to-slate-700",
                    },
                    {
                      icon: <MapPin className="w-5 h-5" />,
                      label: "Location",
                      value: "El Zaytoun, Cairo, Egypt",
                      href: null,
                      color: "from-pink-500 to-rose-600",
                    },
                    {
                      icon: <Phone className="w-5 h-5" />,
                      label: "Phone",
                      value: "+20 155 650 8837",
                      href: "tel:+201556508837",
                      color: "from-emerald-500 to-teal-600",
                    },
                  ].map(({ icon, label, value, href, color }) => (
                    <div key={label} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                        <span className="text-white">{icon}</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-slate-200 hover:text-cyan-400 transition-colors"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="text-sm text-slate-200">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex gap-3">
                  <a
                    href="https://github.com/Toni-11"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-all"
                  >
                    <GithubIcon className="w-4 h-4" /> GitHub
                  </a>
                  <a
                    href="https://drive.google.com/file/d/13CkD_XDlckSysJYG7MNTjtiZi4hB28MI/view?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:shadow-cyan-500/30 transition-all"
                  >
                    <FileText className="w-4 h-4" /> Download CV
                  </a>
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* Contact form */}
            <AnimatedSection delay={100}>
              <GlassCard className="p-8">
                <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
                    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
                    const message = (form.elements.namedItem("message") as HTMLTextAreaElement)?.value;
                    window.location.href = `mailto:anttonmikhail5@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`)}`;
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Your Name</label>
                    <input
                      name="name"
                      required
                      type="text"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Email Address</label>
                    <input
                      name="email"
                      required
                      type="email"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Message</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none"
                      placeholder="Tell me about an opportunity, project, or collaboration..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Send Message
                  </button>
                </form>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2025 Antton Mikhael Sobhy · AI Undergraduate at ERU
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Toni-11"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href="mailto:anttonmikhail5@gmail.com"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      {selectedCertificate && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#020817]/90 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedCertificate.issuer} certificate`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedCertificate(null);
          }}
        >
          <div
            className="relative flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#071426] p-3 shadow-2xl shadow-cyan-950/50 sm:p-5"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCertificate(null)}
              aria-label="Close certificate"
              className="absolute right-4 top-4 z-10 rounded-lg border border-white/10 bg-black/70 p-2 text-slate-300 transition-colors hover:bg-cyan-500 hover:text-slate-950"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="min-h-0 overflow-auto rounded-xl bg-black/20">
              <img
                src={getImageAsset(selectedCertificate.file)}
                alt={`${selectedCertificate.issuer} certificate`}
                className="mx-auto max-h-[78vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="px-2 pb-1 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-400">
                {selectedCertificate.specialty}
              </p>
              <h3 className="mt-1 text-lg font-bold text-white">
                {selectedCertificate.name}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Issued by {selectedCertificate.issuer}
              </p>
            </div>
          </div>
        </div>
      )}

      {cppDocumentsOpen && <CppDocumentsModal onClose={() => setCppDocumentsOpen(false)} />}
    </div>
  );
}
