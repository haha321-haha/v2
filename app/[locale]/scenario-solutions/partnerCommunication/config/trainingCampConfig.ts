import { logWarn } from "@/lib/debug-logger";

export interface TrainingDay {
  day: number;
  name: string;
  description: string;
  completed?: boolean;
}

export interface TrainingWeek {
  week: number;
  title: string;
  goal: string;
  days: TrainingDay[];
  expanded?: boolean;
}

export const trainingCampConfig: TrainingWeek[] = [
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
        description: '(她反馈) 她告诉他，这周他做的哪一件"小事"对她帮助最大。',
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
];

// 本地存储键名
export const TRAINING_PROGRESS_KEY = "partner-training-progress";

// 进度管理工具函数
export const getTrainingProgress = (): Set<number> => {
  if (typeof window === "undefined") return new Set();

  try {
    const stored = localStorage.getItem(TRAINING_PROGRESS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch (error) {
    logWarn(
      "Failed to load training progress",
      error,
      "trainingCampConfig/getTrainingProgress",
    );
    return new Set();
  }
};

export const saveTrainingProgress = (completedDays: Set<number>): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      TRAINING_PROGRESS_KEY,
      JSON.stringify([...completedDays]),
    );
  } catch (error) {
    logWarn(
      "Failed to save training progress",
      error,
      "trainingCampConfig/saveTrainingProgress",
    );
  }
};

export const markDayComplete = (
  day: number,
  completedDays: Set<number>,
): Set<number> => {
  const newCompletedDays = new Set(completedDays);
  if (newCompletedDays.has(day)) {
    newCompletedDays.delete(day);
  } else {
    newCompletedDays.add(day);
  }
  saveTrainingProgress(newCompletedDays);
  return newCompletedDays;
};

export const getWeekProgress = (
  week: TrainingWeek,
  completedDays: Set<number>,
): { completed: number; total: number; percentage: number } => {
  const weekDays = week.days.map((day) => day.day);
  const completed = weekDays.filter((day) => completedDays.has(day)).length;
  const total = weekDays.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
};
