# Project Specifications: Shree Varaa Mangai V Portfolio

A highly polished, cinematic, "Sophisticated Dark" interactive portfolio application presenting the academic milestones, engineering credentials, and state-of-the-art ML/AI research systems of **Shree Varaa Mangai V**.

---

## 1. Overview & General Architecture

The portfolio is built as a highly responsive, modern full-stack web application implementing a single-view, single-page seamless experience. It leverages **Next.js 15+ with App Router**, utilizing React 19 Client components to drive high-performance micro-interactions, three-dimensional spatial effects, and animations.

- **URL Targets**:
  - Development App: `https://ais-dev-wupvxuhv3jbvbxoz3fnu2r-807332672384.us-east1.run.app`
  - Production/Shared: `https://ais-pre-wupvxuhv3jbvbxoz3fnu2r-807332672384.us-east1.run.app`
- **Primary Focus**: Combining clinical AI pipelines (RAG), text-to-video hallucination evaluation, high-throughput 3D Gaussian Splatting, and standard multi-modal research into a single human-centric dossier.

---

## 2. Visual & Design Philosophy

The website employs the **"Sophisticated Dark" Theme**, emphasizing deep space slate panels, rich charcoal backdrops, and amber/orange vibrant indicators to guide system metrics and structural blocks.

### Aesthetic Rules
* **Ambient Lighting & Vignettes**: Uses a robust set of gradient masking rules. Radial dark overlays, edge-vignetting, and smooth contrast structures frame high-fidelity assets without disrupting foreground text readability.
* **Negative Space representation**: Generous paddings (`py-24 px-6`), optimized column arrangements, and clean, literal spacing.
* **Zero System Clutter**: Avoids artificial telemetry log trackers, mock network indicators, or container port outputs. It adheres strictly to professional human-readable labels and pristine layout elegance.
* **Typography Pairing**:
  - **Headings**: Modern sans-serif Display fonts (`font-sans font-black uppercase tracking-tight`).
  - **Status & Indicators**: Mono-spaced tracking fonts (`font-mono text-xs uppercase tracking-widest text-orange-400`).
  - **Subtitles & Citations**: Compact editorial serif style for clinical and research organization markers.

---

## 3. Directory & File Architecture

```
/
├── .env.example              # Template for required secrets
├── metadata.json             # Core app name & telemetry descriptors
├── package.json              # Direct dependency and script configuration
├── postcss.config.mjs        # PostCSS 8 configuration for Tailwind PostCSS engine
├── tsconfig.json             # Base TypeScript parameters
├── app/
│   ├── globals.css           # Global CSS variables, Tailwind engine imports
│   ├── layout.tsx            # Main layout wrapper injecting fonts and variables
│   └── page.tsx              # Main entry layout assembling core views and navigation
├── components/
│   ├── AdminDashboard.tsx    # Secure statistics panel for checking project analytics
│   ├── ContactForm.tsx       # Message-delivery widget with responsive states
│   ├── ThreeLayer.tsx        # WebGL particle canvas for flowing background starfield
│   └── VideoIntro.tsx        # Hero splash viewport and introduction card
├── public/
│   └── images/
│       ├── cinematic_workspace.jpg
│       └── grace_hopper_2025.jpg  # Portrait photo from Grace Hopper Celebration 2025
```

---

## 4. Key Component Specifications

### A. WebGL Parallax Background (`components/ThreeLayer.tsx`)
- **Engine**: Three.js WebGL rendering context.
- **Visuals**: Spawns custom soft-glow amber and gold particles utilizing radial gradients inside pixel-buffered canvases.
- **Interactivity**: Captures direct mouse trajectory changes, applying lazy mathematical interpolation to translate coordinates into subtle, low-frequency viewport parallax shifts.
- **Dynamic Resizing**: Implements native resize observers, letting the viewport recalibrate camera matrices without frame drops or element stretching.

### B. High-Impact Intro Screen (`components/VideoIntro.tsx`)
- **Backdrop**: Configured with `grace_hopper_2025.jpg`, showcasing a crisp cartoon portrait from the Grace Hopper Celebration 2025, optimized using standard CSS object-cover filters and warm spotlight transitions.
- **Branding Headline**: Houses the unified premium token abbreviation **"SVM"** and high-contrast navigational selectors.
- **Hero Paragraph**:
  > *"MS AI Systems @ University of Florida (GPA 3.90). I build full-stack AI systems — RAG pipelines, video hallucination benchmarks, 3D reconstruction, and multimodal models. Previously at Ford Motor Company and AGIS Inc. Open to full-stack AI engineering and data science roles."*

### C. Projects Grid Section (`#projects`)
- Consists of clean card structures representing high-impact clinical, multimodal, and classification systems:
  1. **CareMind**: Clinical QA Framework grounding LLaMA via BioBERT/MIMIC-IV ($15\%$ reduction in hallucination risk).
  2. **Multi-Image Prostate Super Resolution**: Reconstructing clinical MRI slices using CNNs and SRGANs.
  3. **Multimodal Spoken Command Recognition**: Audio-text cross-attention networks powered by BERT & Wav2Vec2.
  4. **COGNITO-MAP**: Automated question classification via Blooom's Taxonomy & Gemini API.

### D. Core Stack Expertise Section (`#skills`)
- Rendered as an 8-column structured bento layout, classifying comprehensive competencies:
  - **04 / PROGRAMMING LANGUAGES**: Python, TypeScript, JavaScript, Java, C/C++.
  - **08 / DATA & VISUALIZATION**: Cleaned to house Pandas, NumPy, Matplotlib, and PowerBI (with "Tableau" cleanly excluded as per latest branding specifications).

### E. Education Dossier (`#education`)
- Presents primary academic benchmarks, clean dates, and specialized coursework cards reflecting:
  - **Master of Science in Artificial Intelligence Systems** — University of Florida (GPA: 3.90/4.00)
  - **Bachelor of Technology in Information Technology** — Anna University

---

## 5. Dependency Profile

```json
{
  "dependencies": {
    "next": "^15.4.9",
    "react": "^19.2.1",
    "motion": "^12.23.24",
    "three": "^0.184.0",
    "lucide-react": "^0.553.0",
    "tailwind-merge": "^3.3.1",
    "clsx": "^2.1.1"
  }
}
```

---

## 6. Optimization & Deploy Targets

1. **Hot Module Replacement (HMR)**: Suppressed via `DISABLE_HMR=true` block configurations inside the dev server proxy to ensure zero layout flickering.
2. **Build Optimization**: Builds statically down to optimized Next.js server targets using high-tier minification packages and fully resolved TS imports.
3. **Responsive Scaling**: Mobile breakpoints scale from small vertical screens up to $1920\text{px}$ desktop grids, adjusting flex-spacing and sizing thresholds smoothly.
