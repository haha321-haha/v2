import { Locale } from "../types/common";

// 训练营天任务接口
export interface TrainingDay {
  day: number;
  name: string;
  description: string;
}

// 训练营周接口
export interface TrainingWeek {
  week: number;
  title: string;
  goal: string;
  days: TrainingDay[];
}

// 训练营配置接口
export interface TrainingCampConfig {
  title: string;
  intro: string;
  weeks: TrainingWeek[];
  footerText: string;
}

// 获取训练营配置的工具函数 - 支持国际化
export const getTrainingCampConfig = (locale: Locale): TrainingCampConfig => {
  const configs = {
    zh: {
      title: "30天暖心伴侣训练营",
      intro: "每天只需5分钟，和她一起完成一个小任务，见证你们关系的奇妙变化。",
      weeks: [
        {
          week: 1,
          title: "第一周: 知识周 - 破冰与认知",
          goal: "目标：建立关于痛经的科学认知，破除误解。",
          days: [
            {
              day: 1,
              name: "知识卡片：什么是前列腺素？",
              description:
                "(他读) 阅读一篇300字的图文卡片，了解前列腺素如何引起子宫收缩和疼痛。然后用自己的话向她复述一遍。",
            },
            {
              day: 2,
              name: '误解辨析：痛经是"正常"的吗？',
              description:
                "(一起看) 共同观看一个3分钟短视频，了解原发性痛经和继发性痛经的区别，知道何时需要警惕并就医。",
            },
            {
              day: 3,
              name: "数字的力量：痛经有多普遍？",
              description:
                '(他读) 阅读数据：全球高达80%-90%的女性经历过痛经。然后问她："你知道这个比例有这么高吗？"',
            },
            {
              day: 4,
              name: "症状清单：不止是肚子疼",
              description:
                '(一起讨论) 阅读一份常见的痛经伴随症状清单（头痛、腹泻、腰痛等）。他问她："这些里面，你经历过哪些？"',
            },
            {
              day: 5,
              name: "药物真相：止痛药会上瘾吗？",
              description:
                '(一起读) 阅读一篇关于布洛芬等非处方止痛药的科普文，了解其作用原理和安全性，破除"上瘾"迷思。',
            },
            {
              day: 6,
              name: "饮食迷思：真的不能吃冰吗？",
              description:
                "(一起讨论) 讨论经期饮食，了解为何温热食物能让部分人感觉舒适，并问她：\"对你来说，什么食物是'禁区'，什么又是'安慰剂'？\"",
            },
            {
              day: 7,
              name: "复盘与提问",
              description:
                '(他提问) 他问她："这周学到的知识里，你最希望我记住哪一点？"',
            },
          ],
        },
        {
          week: 2,
          title: "第二周: 同理心周 - 情感连接",
          goal: "目标：学习换位思考，理解疼痛对身心的具体影响。",
          days: [
            {
              day: 8,
              name: "疼痛模拟器（想象版）",
              description:
                "(他想象) 闭上眼5分钟，想象自己的小腹里有个拳头在用力紧握、拧转，同时还要正常工作或学习。之后分享感受。",
            },
            {
              day: 9,
              name: "同理心练习：疼痛类比",
              description:
                '(她分享，他倾听) 邀请她用一个最贴切的比喻来描述她的疼痛感（如"像被小刀持续刮着"）。他需要认真倾听，不打断，并记住这个比喻。',
            },
            {
              day: 10,
              name: '"我"陈述练习',
              description:
                '(一起练习) 回想一次因痛经产生的小摩擦。尝试用"我"陈述句式重新表达。例如，把"你总是不关心我"换成"当我痛的时候，我感到很孤单，希望你能陪陪我"。',
            },
            {
              day: 11,
              name: "非语言信号观察",
              description:
                '(他观察) 今天，他需要特别留意她的一个非语言信号（如皱眉、叹气），并温柔地询问："我看到你……，是哪里不舒服吗？"',
            },
            {
              day: 12,
              name: "情感对话：分享脆弱",
              description:
                '(他提问) 他问她："疼痛时，除了身体不适，你最大的情绪困扰是什么？"（例如：烦躁、内疚、无助）。他只需倾听和验证："原来你还会感到内疚，这一定很难熬。"',
            },
            {
              day: 13,
              name: "积极倾听练习",
              description:
                '(角色扮演) 她花2分钟讲述一件烦心事（不限于痛经）。他听完后，用"我听到你说的是……"来复述，看自己是否理解正确。',
            },
            {
              day: 14,
              name: "复盘与感谢",
              description:
                '(她分享) 她告诉他，这周哪一次的沟通或关怀让她感觉"最被理解"。',
            },
          ],
        },
        {
          week: 3,
          title: "第三周: 行动周 - 实践支持",
          goal: "目标：将理论转化为具体、实用的支持行动。",
          days: [
            {
              day: 15,
              name: '创建"暖心菜单"',
              description:
                "(一起制定) 一起列出她经期最想吃/喝的东西清单（如姜茶、巧克力、汤）。他把清单拍照保存。",
            },
            {
              day: 16,
              name: "实用技能：学习穴位按摩",
              description:
                '(一起学习) 跟随一个1分钟的视频，他学习按压"三阴交"和"合谷穴"这两个缓解痛经的穴位，并在她手臂上试一试。',
            },
            {
              day: 17,
              name: "主动分担一件家务",
              description:
                '(他行动) 他今天需要主动承担一件平时可能由她做的家务（如洗碗、倒垃圾），并告诉她："今天这个我来，你多休息。"',
            },
            {
              day: 18,
              name: '制作"经期娱乐清单"',
              description:
                "(一起制定) 列出一些她疼痛时可以用来分散注意力的低耗能活动（如一起看的电影、轻松的播客、舒服的音乐）。",
            },
            {
              day: 19,
              name: "热敷工具大盘点",
              description:
                "(他检查) 他检查家里的热敷工具（热水袋、暖宝宝、电热毯），确保它们状态良好、随时可用。没有的话，可以和她商量买一个。",
            },
            {
              day: 20,
              name: '主动关怀：准备"暖心包"',
              description:
                '(他行动) 不用等她开口，他主动为她准备一份"暖心包"：一杯热饮 + 一个热水袋，送到她面前。',
            },
            {
              day: 21,
              name: "复盘与反馈",
              description:
                '(她反馈) 她告诉他，这周他做的哪一件"小事"对她帮助最大。',
            },
          ],
        },
        {
          week: 4,
          title: "第四周: 团队周 - 巩固与未来",
          goal: "目标：巩固学习成果，将临时支持转变为长期习惯。",
          days: [
            {
              day: 22,
              name: "爱语探索",
              description:
                '(一起测试) 一起完成"五种爱情语言"测试。讨论如何在经期用她偏好的爱语（如服务的行动、肯定的言词）来表达关爱。',
            },
            {
              day: 23,
              name: "设定清晰的边界",
              description:
                '(一起讨论) 讨论如何在经期时坦诚沟通需求。她可以练习说："今天我痛得厉害，没办法……可以……吗？"',
            },
            {
              day: 24,
              name: '设计"求助信号"',
              description:
                '(一起创造) 共同设计一个简单、非语言的"求助信号"（如一个特定的表情包、一个手势），当她痛得不想说话时，可以用它来表达"我需要帮助"。',
            },
            {
              day: 25,
              name: "团队协作：制定应急计划",
              description:
                '(一起制定) 共同列出一个"痛经SOS清单"，包括：她偏好的止痛药品牌、剂量，想吃的零食，以及最有效的安慰方式。',
            },
            {
              day: 26,
              name: "感恩日记（口头版）",
              description:
                '(轮流分享) 轮流说一件今天欣赏对方的小事。例如，他可以说："我欣赏你在不舒服时依然很坚强。"她可以说："我感谢你今天为我倒了热水。"',
            },
            {
              day: 27,
              name: '定义"支持"',
              description:
                "(他提问) 他问她：\"对我来说，'支持你'意味着____。对你来说，'被支持'感觉像____？\"填空并对比答案。",
            },
            {
              day: 28,
              name: "未来的计划",
              description:
                "(一起展望) 讨论如何将这些练习融入日常生活。例如，约定每月经期第一天，他主动负责晚餐。",
            },
            {
              day: 29,
              name: '写一张"盟友卡"',
              description:
                '(他写，她收) 他在一张卡片上写下他对未来继续作为"暖心盟友"的承诺。可以很简单，如："我承诺，会永远记得你的疼痛比喻，并在你需要时给你一个拥抱。"',
            },
            {
              day: 30,
              name: "毕业典礼：复盘与庆祝",
              description:
                '(一起庆祝) 回顾这30天的旅程。他问："我做的哪些事对你帮助最大？" 她分享感受。最后，用一个拥抱或她喜欢的方式，庆祝你们成为了更强大的"我们"。',
            },
          ],
        },
      ],
      footerText: "用心制作，旨在促进理解与连接。",
    },
    en: {
      title: "The 30-Day Caring Partner Training Camp",
      intro:
        "Just 5 minutes a day. Complete a small task with her and witness the wonderful transformation in your relationship.",
      weeks: [
        {
          week: 1,
          title:
            "Week 1: Knowledge Week - Breaking the Ice & Building Awareness",
          goal: "Goal: Establish a scientific understanding of dysmenorrhea and debunk myths.",
          days: [
            {
              day: 1,
              name: "Knowledge Card: What Are Prostaglandins?",
              description:
                "(He reads) Read a 300-word illustrated card about how prostaglandins cause uterine contractions and pain. Then, explain it to her in your own words.",
            },
            {
              day: 2,
              name: "Myth Debunking: Is Period Pain 'Normal'?",
              description:
                "(Watch together) Watch a 3-minute video explaining the difference between primary and secondary dysmenorrhea, and when to be alert and see a doctor.",
            },
            {
              day: 3,
              name: "Power of Numbers: How Common Is It?",
              description:
                "(He reads) Read the data: Up to 80-90% of women worldwide experience dysmenorrhea. Then ask her, 'Did you know the percentage was this high?'",
            },
            {
              day: 4,
              name: "Symptom Checklist: More Than a Stomachache",
              description:
                "(Discuss together) Read a list of common accompanying symptoms (headache, diarrhea, back pain, etc.). He asks her, 'Which of these have you experienced?'",
            },
            {
              day: 5,
              name: "Pill Truth: Are Painkillers Addictive?",
              description:
                "(Read together) Read a short article about NSAIDs like ibuprofen, understanding their mechanism and safety to debunk the 'addiction' myth.",
            },
            {
              day: 6,
              name: "Diet Myths: Is Ice Cream Really Forbidden?",
              description:
                "(Discuss together) Discuss period diets. Understand why warm foods make some people feel better, and ask her, 'For you, what foods are off-limits, and what are your comfort foods?'",
            },
            {
              day: 7,
              name: "Review & Ask",
              description:
                "(He asks) He asks her, 'Of all the things we learned this week, which one point is most important for me to remember?'",
            },
          ],
        },
        {
          week: 2,
          title: "Week 2: Empathy Week - Emotional Connection",
          goal: "Goal: Learn perspective-taking and understand the specific physical and mental impacts of pain.",
          days: [
            {
              day: 8,
              name: "Pain Simulator (Imagination Ver.)",
              description:
                "(He imagines) Close your eyes for 5 minutes. Imagine a fist inside your lower abdomen, clenching and twisting forcefully, while you try to work or study. Share how it felt afterward.",
            },
            {
              day: 9,
              name: "Empathy Practice: The Pain Analogy",
              description:
                "(She shares, He listens) Invite her to describe her pain with a specific analogy (e.g., 'like being constantly scraped by a small knife'). He must listen attentively without interruption and remember this analogy.",
            },
            {
              day: 10,
              name: "'I' Statement Practice",
              description:
                "(Practice together) Recall a small conflict caused by period pain. Try to rephrase it using 'I' statements. For example, change 'You never care about me' to 'When I'm in pain, I feel very lonely and I wish you could be with me.'",
            },
            {
              day: 11,
              name: "Observing Non-Verbal Cues",
              description:
                "(He observes) Today, he needs to pay special attention to one of her non-verbal cues (like a furrowed brow or a sigh) and gently ask, 'I noticed you were..., are you feeling unwell?'",
            },
            {
              day: 12,
              name: "Emotional Dialogue: Sharing Vulnerability",
              description:
                "(He asks) He asks her, 'Besides the physical discomfort, what is your biggest emotional struggle when you're in pain?' (e.g., frustration, guilt, helplessness). He just needs to listen and validate: 'I didn't realize you also feel guilty. That must be really tough.'",
            },
            {
              day: 13,
              name: "Active Listening Practice",
              description:
                "(Role-play) She spends 2 minutes talking about something that's bothering her (not limited to period pain). After she finishes, he paraphrases it by starting with, 'What I'm hearing is...' to check his understanding.",
            },
            {
              day: 14,
              name: "Review & Thank",
              description:
                "(She shares) She tells him which conversation or act of care from this week made her feel the 'most understood.'",
            },
          ],
        },
        {
          week: 3,
          title: "Week 3: Action Week - Practical Support",
          goal: "Goal: Translate theory into concrete, practical actions of support.",
          days: [
            {
              day: 15,
              name: "Create a 'Comfort Menu'",
              description:
                "(Create together) Together, list the foods and drinks she craves most during her period (e.g., ginger tea, chocolate, soup). He takes a photo of the list to save it.",
            },
            {
              day: 16,
              name: "Practical Skill: Acupressure Massage",
              description:
                "(Learn together) Follow a 1-minute video for him to learn how to apply pressure to two acupressure points for pain relief: Sanyinjiao (SP6) and Hegu (LI4). He can practice on her arm.",
            },
            {
              day: 17,
              name: "Proactively Share a Chore",
              description:
                "(He acts) Today, he needs to proactively take on one chore that she might usually do (e.g., washing dishes, taking out the trash) and tell her, 'I'll handle this today. You get more rest.'",
            },
            {
              day: 18,
              name: "Make a 'Period Entertainment List'",
              description:
                "(Create together) List some low-energy activities that can distract her from the pain (e.g., movies to watch together, lighthearted podcasts, soothing music).",
            },
            {
              day: 19,
              name: "Heating Tool Inventory",
              description:
                "(He checks) He checks the home's heating tools (hot water bottle, heating pads, electric blanket) to ensure they are in good condition and ready to use. If there are none, they can discuss buying one.",
            },
            {
              day: 20,
              name: "Proactive Care: Prepare a 'Comfort Kit'",
              description:
                "(He acts) Without being asked, he proactively prepares a 'comfort kit' for her: a hot drink + a hot water bottle, and brings it to her.",
            },
            {
              day: 21,
              name: "Review & Feedback",
              description:
                "(She gives feedback) She tells him which 'small thing' he did this week was the most helpful for her.",
            },
          ],
        },
        {
          week: 4,
          title: "Week 4: Teamwork Week - Consolidation & The Future",
          goal: "Goal: Consolidate learning and transform temporary support into long-term habits.",
          days: [
            {
              day: 22,
              name: "Love Language Exploration",
              description:
                "(Test together) Take the '5 Love Languages' quiz together. Discuss how to show care during her period using her preferred love language (e.g., Acts of Service, Words of Affirmation).",
            },
            {
              day: 23,
              name: "Setting Clear Boundaries",
              description:
                "(Discuss together) Discuss how to honestly communicate needs during her period. She can practice saying, 'I'm in too much pain today to..., could we... instead?'",
            },
            {
              day: 24,
              name: "Design a 'Help Signal'",
              description:
                "(Create together) Co-design a simple, non-verbal 'help signal' (like a specific emoji or hand gesture) that she can use to say 'I need help' when she's in too much pain to talk.",
            },
            {
              day: 25,
              name: "Teamwork: Create an Emergency Plan",
              description:
                "(Create together) Co-create a 'Period Pain SOS List,' including her preferred painkiller brand and dosage, favorite snacks, and most effective comfort methods.",
            },
            {
              day: 26,
              name: "Gratitude Journal (Spoken Ver.)",
              description:
                "(Share in turns) Take turns stating one small thing you appreciated about the other person today. He might say, 'I admire how strong you are even when you're uncomfortable.' She might say, 'I'm grateful you poured me hot water today.'",
            },
            {
              day: 27,
              name: "Defining 'Support'",
              description:
                "(He asks) He asks her, 'To me, 'supporting you' means ____. To you, what does 'being supported' feel like ____?' Fill in the blanks and compare your answers.",
            },
            {
              day: 28,
              name: "Planning for the Future",
              description:
                "(Look ahead together) Discuss how to integrate these practices into daily life. For example, agree that on the first day of her period each month, he will be in charge of dinner.",
            },
            {
              day: 29,
              name: "Write an 'Ally Card'",
              description:
                "(He writes, she receives) He writes his commitment to being a 'caring ally' on a card. It can be simple, like, 'I promise to always remember your pain analogy and to be there with a hug when you need it.'",
            },
            {
              day: 30,
              name: "Graduation: Review & Celebrate",
              description:
                "(Celebrate together) Review the 30-day journey. He asks, 'What did I do that was most helpful?' She shares her feelings. Finally, celebrate becoming a stronger 'we' with a hug or in a way she loves.",
            },
          ],
        },
      ],
      footerText: "Crafted with ❤️ to foster understanding and connection.",
    },
  };

  return configs[locale];
};

// 获取特定周配置的工具函数
export const getWeekConfig = (
  weekNumber: number,
  locale: Locale,
): TrainingWeek | null => {
  const config = getTrainingCampConfig(locale);
  return config.weeks.find((week) => week.week === weekNumber) || null;
};

// 获取特定天配置的工具函数
export const getDayConfig = (
  weekNumber: number,
  dayNumber: number,
  locale: Locale,
): TrainingDay | null => {
  const weekConfig = getWeekConfig(weekNumber, locale);
  if (!weekConfig) return null;
  return weekConfig.days.find((day) => day.day === dayNumber) || null;
};

// 计算训练营进度的工具函数
export const calculateTrainingProgress = (
  completedDays: number[],
): { completed: number; total: number; percentage: number } => {
  const total = 30;
  const completed = completedDays.length;
  const percentage = Math.round((completed / total) * 100);
  return { completed, total, percentage };
};

// 获取下一未完成任务的工具函数
export const getNextTask = (
  completedDays: number[],
): { week: number; day: number } | null => {
  for (let day = 1; day <= 30; day++) {
    if (!completedDays.includes(day)) {
      // 计算属于第几周
      let week = 1;
      if (day > 7) week = 2;
      if (day > 14) week = 3;
      if (day > 21) week = 4;
      return { week, day };
    }
  }
  return null; // 所有任务都完成了
};
