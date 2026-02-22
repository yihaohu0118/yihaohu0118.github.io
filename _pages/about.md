---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

 

### **About Me** 

Hello! I'm **Yihao HU (胡益豪)**, a third-year undergraduate student majoring in Computer Science at **Hainan University** (GPA: 3.93/4.0, Top 1%, Rank 2/207), expected to graduate in 2026. My research focuses on **Multimodal AI**, **Reasoning LLM/VLM**, **AI Agent**, and **Computer Vision**.

I am currently an Algorithm Intern at **Meituan** (Core R&D Platform, Native Multimodal LLM - LongCat) and an AI Agent & LLM Alignment Intern at **Alibaba Group, Amap (高德)**. Previously, I was a Research Assistant at the **Digital Media Computing & Design Lab, Zhejiang University** (Prof. Juncheng LI).

I have published/submitted papers at **NeurIPS 2025**, **ACL 2026**, **ICML 2026**, and top journals (Q1), and have received **7+ national/international competition awards** including the National Scholarship.

# 🎓 Education {#education}

- *2022.09 - Present*, B.Eng. in Computer Science, **Hainan University (海南大学)**, Hainan, China.
  - GPA: 3.93/4.0 (Top 1%, Rank 2/207)
  - Key Courses: Data Structures (97), Data Mining (97), Machine Learning (95), Introduction to AI (95), Operating Systems (95), OOP (98), Database Design (96)

# 💼 Research & Internship Experience {#research-experience}

- *2025.10 - Present*, Algorithm Intern (Native Multimodal LLM - LongCat), **Meituan (美团)**, Core R&D Platform, Shenzhen, China.
- *Ongoing*, AI Agent & LLM Alignment Intern, **Alibaba Group, Amap (高德)**, Shenzhen, China.
- *2025.02 - 2025.06*, Research Assistant, **Digital Media Computing & Design Lab, Zhejiang University** (Prof. Juncheng LI).
- *2023.06 - Present*, Undergraduate Research Team Member (Group Leader), **Prof. Xiaodong BAI's Lab, Hainan University**.
- *2024.10 - 2025.10*, Group Leader, **National-Level College Student Innovation & Entrepreneurship Training Program**.

# 📜 Publications {#publications}

**2026 (Submitted)**
- **Y. Hu** et al., "**VulThinker: Deep Reasoning for Vulnerability Detection**", *ACL 2026*, Submitted. (1st author, CCF-A)
- **Y. Hu** et al., "**OmniVideo-R1: Intention-driven Deep Fusion for Audio-Visual Reasoning**", *ICML 2026*, Submitted. (2nd author, CCF-A)
- X. Yu et al., "**Dual Latent Memory for Visual Multi-agent System**", *ICML 2026*, Submitted. [[arXiv]](https://arxiv.org/abs/2602.00471) (CCF-A)
- "**HoloRoom: Holistic and Compositional 3D Scene Generation via Global-to-Local Assembly**", *CVPR 2026*, Submitted. (CCF-A)

**2025**
- M. Gao et al., "**Counterfactual Evolution of Multimodal Datasets via Visual Programming**", **NeurIPS 2025**. (CCF-A)
- **Y. Hu** et al., "**SDE-DET: A Precision Network for Shatian Pomelo Detection in Complex Orchard Environments**", *Smart Agriculture Technology*, Minor Revision, 2025. (1st author, Q1, IF: 5.7)
- **Y. Hu** et al., "**A Multi-Strategy Framework for Enhancing Shatian Pomelo Detection in Real-World Orchards**", *Engineering Applications of Artificial Intelligence*, Second Review, 2025. (Co-1st author, Q1, IF: 7.7)

# 🔬 Research Projects {#research-projects}

**Project 1: VulThinker — Deep Reasoning for Vulnerability Detection** *(2025.06 - 2025.10)*
- Reformulated black-box binary detection into a verifiable causal reasoning framework via multi-view SFT with forward/backward counterfactual reasoning and generative repair.
- Introduced two-stage curriculum RL with GRPO and reward design based on lexical verification and soft evidence matching to suppress logical hallucination.
- Built VulReason-Bench (1850 expert-validated samples); achieved 83.5%/67.6% accuracy on BenchVul and VulReason-Bench, discovering 18 real-world 0-day vulnerabilities.

**Project 2: DeepOmni-R1 — Audio-Visual Reasoning** *(2025.10 - Present)*
- Proposed "DeepOmni-R1", a Zero-RL framework enabling reasoning without process annotation via intention-chain self-supervision and two-stage GSPO-based alignment.
- Designed DeepFusion contrastive reward to maximize multimodal gain over unimodal reasoning.
- Built an 88K audio-visual instruction dataset; achieved +7.8% on OmniVideoBench (SOTA), outperforming Gemini-3-Pro on Daily-Omni.

**Project 3: SCOPE — Counterfactual Evolution via Visual Programming** *(2025.02 - 2025.06, ZJU)*
- Proposed SCOPE, a symbolic visual programming framework that converts implicit reasoning into executable Python code via an "Abduct-Intervene-Predict" loop.
- Constructed SCOPE-Train and SCOPE-Test benchmarks; designed "Memory and Attention Path Learning" for structured difficulty progression.
- Published at **NeurIPS 2025** (CCF-A).

**Project 4: SDE-DET — Pomelo Detection** *(National Innovation Program, 2024.10 - 2025.10)*
- Proposed a lightweight SDE-DET with tar Block for high-dimensional feature mapping and fine-grained texture preservation.
- Integrated Deformable Attention and Efficient Multi-Scale Attention for discriminative representation.
- Constructed STP-AgriData dataset; achieved 83.8% accuracy with 3.29M parameters (32.4 GFLOPs), outperforming YOLOv10 and RT-DETR.

**Project 5: IMF-ITD — Interpretable Image-Text Description** *(2023.06 - Present)*
- Designed an interpretable vision-language generation framework integrating CLIP, BLIP2, and ConvNeXt-XXLarge.
- Applied LoRA-based parameter-efficient fine-tuning and attention weight re-calibration for improved modality interaction.

# 🌟 Honors & Awards {#honors-awards}

🏅 **Scholarships & Honors**
- **National Scholarship** (国家奖学金, 50th among all undergraduates in the whole school), 2025.10
- **"WuXu" Scholarship** (1/207), 2024.10
- **First-Class Academic Scholarship**, Hainan University (Top 10 in Department), 2023.10
- **Merit Student**, Hainan University (80th among all undergraduates), 2023.12

🥇 **Competition Awards**
- **International Finals – First Prize**, 5th Global Campus AI Algorithm Elite Competition (Stable Diffusion Prompt Optimization Track), 2023.12
- **National First Prize**, 15th National College Mathematics Competition, 2023.12
- **National Second Prize**, 2023 China Collegiate Computer Programming Competition, 2024.01
- **International Finals – Second Prize**, 6th Global Campus AI Algorithm Elite Competition (AI + New Discipline Track), 2024.12
- **International Finals – Third Prize**, 6th Global Campus AI Algorithm Elite Competition (AI + New Medical Track), 2024.12
- **National Finals – Second Prize**, 12th National College Digital Media Technology & Creativity Competition, 2024.12
- **National Finals – Second Prize**, 27th China Robot & AI Competition, 2025.08
- **National Finals – Third Prize**, 27th China Robot & AI Competition, 2025.08

# 🛠️ Skills {#skills}

- **Programming**: C/C++ (Proficient), Python (Proficient), Matlab (Familiar)
- **Tools**: Tableau, SPSS, AutoCAD, CATIA, Solidworks, Hyperworks
- **Writing**: LaTeX (Proficient), Microsoft Office (Familiar)
- **Research Areas**: Multimodal LLM, Reasoning VLM, AI Agent, Computer Vision, RLHF/DPO

---

