/* =========================================================
   SCHOOLS

   One entry per ticket on the Tickets page. Clicking a ticket
   opens /events/<slug>, a carnival field with one tent per
   department.

   departments: the tent names, in order. Use "\n" to split a
   long name over two lines on the tent's banner.

   spots: where each tent stands, per screen shape
     wide  - laptops, desktops, landscape tablets
     tall  - phones and portrait tablets
     short - phones held sideways
   Each spot is [x, bottom, size]: x is the tent's centre and
   bottom its base, both in % of the screen; size 1 is the
   normal tent width. Farther tents (higher bottom) are smaller
   and drawn behind nearer ones. Spots are placed so no two
   tents overlap at any screen size; give every department a
   spot in all three lists.

   shades (optional): which tent colour each department uses,
   as indexes into TENT_SHADES in EventsPage.tsx (0 violet,
   1 maroon, 2 indigo, 3 plum, 4 amethyst, 5 wine, 6 royal
   blue). Without it, tent i uses colour i.
========================================================= */

export type Layout = "wide" | "tall" | "short";

export type TentSpot = [x: number, bottom: number, size: number];

export interface School {
    slug: string;
    name: string;
    departments: string[];
    spots: Record<Layout, TentSpot[]>;
    shades?: number[];
}

// one big tent in the middle of the field
const ONE_TENT: School["spots"] = {
    wide: [[50, 17, 1.9]],
    tall: [[50, 18, 2.2]],
    short: [[50, 22, 1.5]],
};

export const SCHOOLS: School[] = [
    /* ==========================================================================
       SCHOOL 1: SCHOOL OF ENGINEERING (engineering)
       Departments: AI, CE, CSE, ECE, EEE, EIE, ME
       ========================================================================== */
    {
        slug: "engineering",
        name: "School of Engineering",
        departments: ["AI", "CE", "CSE", "ECE", "EEE", "EIE", "ME"],
        spots: {
            wide: [
                [19, 43, 0.8], // AI  (upper-left clearing)
                [29, 31, 0.8], // CE  (mid-left)
                [52, 27, 0.8], // CSE (back-center)
                [77, 31, 0.8], // ECE (mid-right)
                [41, 43, 0.8], // EEE (upper clearing between CE & CSE)
                [68, 14, 0.8], // EIE (foreground right-center)
                [64, 43, 0.8], // ME  (upper clearing between CSE & ECE)
            ],
            tall: [
                [25, 50, 0.78], // AI  (upper-left)
                [72, 54, 0.7],  // CE  (upper-right)
                [70, 40, 0.88], // CSE (mid-right)
                [28, 34, 0.94], // ECE (mid-left)
                [72, 24, 1.02], // EEE (lower-right)
                [25, 15, 1.1],  // EIE (lower-left)
                [68, 7.5, 1.12], // ME  (bottom-right, fully visible)
            ],
            // a loose front line, with the farther tents kept to the
            // right of the hanging sign
            short: [
                [12, 1, 0.9],
                [64, 25, 0.7],
                [37, 1, 0.9],
                [79, 25, 0.7],
                [62, 1, 0.9],
                [93, 25, 0.7],
                [87, 1, 0.9],
            ],
        },
    },

    /* ==========================================================================
       SCHOOL 2: SCHOOL OF SCIENCE (science)
       Departments: MCA, BSC
       ========================================================================== */
    {
        slug: "science",
        name: "School of Science",
        departments: ["MCA", "BSC"],
        spots: {
            wide: [
                [29, 14, 1.45],
                [71, 14, 1.45],
            ],
            tall: [
                [50, 47, 1.45],
                [50, 8, 1.7],
            ],
            short: [
                [30, 20, 1],
                [70, 20, 1],
            ],
        },
        shades: [1, 6],
    },

    /* ==========================================================================
       SCHOOL 3: SCHOOL OF MANAGEMENT (management)
       Department: BUSINESS ADMINISTRATION
       ========================================================================== */
    {
        slug: "management",
        name: "School of Management",
        departments: ["BUSINESS\nADMINISTRATION"],
        spots: ONE_TENT,
        shades: [1],
    },

    /* ==========================================================================
       SCHOOL 4: SCHOOL OF ARTS & COMMERCE (arts-commerce)
       Department: ARTS AND COMMERCE
       ========================================================================== */
    {
        slug: "arts-commerce",
        name: "School of Arts & Commerce",
        departments: ["ARTS AND\nCOMMERCE"],
        spots: ONE_TENT,
        shades: [5],
    },

    /* ==========================================================================
       SCHOOL 5: SCHOOL OF LAW (law)
       Department: LAW
       ========================================================================== */
    {
        slug: "law",
        name: "School of Law",
        departments: ["LAW"],
        spots: ONE_TENT,
        shades: [1],
    },
];

export function schoolBySlug(slug: string | undefined) {
    return SCHOOLS.find((school) => school.slug === slug);
}

export function schoolForDepartment(deptOrSlug: string | undefined): School | undefined {
    if (!deptOrSlug) return undefined;
    const clean = deptOrSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
    return SCHOOLS.find((school) =>
        school.departments.some((d) => {
            const dClean = d.toLowerCase().replace(/[^a-z0-9]/g, '');
            return dClean === clean || clean.startsWith(dClean) || dClean.startsWith(clean);
        })
    );
}

