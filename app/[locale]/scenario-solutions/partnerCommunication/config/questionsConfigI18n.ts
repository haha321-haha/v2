import { QuizAnswer, QuizQuestion } from "../types/quiz";
import { QuizStage } from "../stores/partnerHandbookStore";
import { logWarn } from "@/lib/debug-logger";

// 第一阶段题目配置（5道简化题）- 支持国际化
export const getStage1Questions = (locale: "zh" | "en"): QuizQuestion[] => {
  const questions = {
    zh: [
      {
        id: "q1",
        question: '当女朋友说"我肚子疼"时，你的第一反应是？',
        options: [
          { id: 1, text: "多喝热水", score: 1 },
          { id: 2, text: "要不要去医院", score: 2 },
          { id: 3, text: "我给你揉揉肚子", score: 3 },
          { id: 4, text: "我陪着你，需要什么告诉我", score: 4 },
        ],
        correctAnswer: 4,
        explanation: "陪伴和主动关心是最重要的支持方式。",
      },
      {
        id: "q2",
        question: "你认为痛经的疼痛程度相当于？",
        options: [
          { id: 1, text: "轻微不适", score: 1 },
          { id: 2, text: "感冒头痛", score: 2 },
          { id: 3, text: "牙痛", score: 3 },
          { id: 4, text: "肾结石疼痛", score: 4 },
        ],
        correctAnswer: 4,
        explanation: "痛经的疼痛程度可以达到肾结石的水平。",
      },
      {
        id: "q3",
        question: "女朋友痛经时，你觉得最有效的缓解方法是？",
        options: [
          { id: 1, text: "让她多休息", score: 2 },
          { id: 2, text: "给她买止痛药", score: 3 },
          { id: 3, text: "准备热水袋", score: 3 },
          { id: 4, text: "综合以上所有方法", score: 4 },
        ],
        correctAnswer: 4,
        explanation: "综合多种方法才能有效缓解痛经。",
      },
      {
        id: "q4",
        question: "你认为痛经会影响女性的哪些方面？",
        options: [
          { id: 1, text: "只是身体不适", score: 1 },
          { id: 2, text: "身体和心理", score: 3 },
          { id: 3, text: "身体、心理、工作和社交", score: 4 },
          { id: 4, text: "影响不大", score: 1 },
        ],
        correctAnswer: 3,
        explanation: "痛经会影响女性生活的方方面面。",
      },
      {
        id: "q5",
        question: "当女朋友因为痛经情绪不好时，你会？",
        options: [
          { id: 1, text: "让她自己冷静", score: 1 },
          { id: 2, text: "告诉她不要发脾气", score: 1 },
          { id: 3, text: "理解她的情绪", score: 3 },
          { id: 4, text: "主动安慰和包容", score: 4 },
        ],
        correctAnswer: 4,
        explanation: "理解和包容是处理情绪问题的关键。",
      },
    ],
    en: [
      {
        id: "q1",
        question:
          'When your girlfriend says "I have stomach pain", your first reaction is?',
        options: [
          { id: 1, text: "Drink more hot water", score: 1 },
          { id: 2, text: "Should we go to the hospital", score: 2 },
          { id: 3, text: "Let me massage your stomach", score: 3 },
          { id: 4, text: "I'm here with you, tell me what you need", score: 4 },
        ],
        correctAnswer: 4,
        explanation:
          "Companionship and proactive care are the most important support methods.",
      },
      {
        id: "q2",
        question:
          "What do you think the pain level of dysmenorrhea is equivalent to?",
        options: [
          { id: 1, text: "Mild discomfort", score: 1 },
          { id: 2, text: "Cold headache", score: 2 },
          { id: 3, text: "Toothache", score: 3 },
          { id: 4, text: "Kidney stone pain", score: 4 },
        ],
        correctAnswer: 4,
        explanation:
          "The pain level of dysmenorrhea can reach the level of kidney stone pain.",
      },
      {
        id: "q3",
        question:
          "When your girlfriend has dysmenorrhea, what do you think is the most effective relief method?",
        options: [
          { id: 1, text: "Let her rest more", score: 2 },
          { id: 2, text: "Buy her painkillers", score: 3 },
          { id: 3, text: "Prepare a hot water bottle", score: 3 },
          { id: 4, text: "Combine all the above methods", score: 4 },
        ],
        correctAnswer: 4,
        explanation:
          "Combining multiple methods is the most effective way to relieve dysmenorrhea.",
      },
      {
        id: "q4",
        question:
          "What aspects of women's lives do you think dysmenorrhea affects?",
        options: [
          { id: 1, text: "Just physical discomfort", score: 1 },
          { id: 2, text: "Physical and psychological", score: 3 },
          { id: 3, text: "Physical, psychological, work and social", score: 4 },
          { id: 4, text: "Not much impact", score: 1 },
        ],
        correctAnswer: 3,
        explanation: "Dysmenorrhea affects all aspects of women's lives.",
      },
      {
        id: "q5",
        question:
          "When your girlfriend is in a bad mood due to dysmenorrhea, you will?",
        options: [
          { id: 1, text: "Let her calm down by herself", score: 1 },
          { id: 2, text: "Tell her not to lose her temper", score: 1 },
          { id: 3, text: "Understand her emotions", score: 3 },
          { id: 4, text: "Actively comfort and be tolerant", score: 4 },
        ],
        correctAnswer: 4,
        explanation:
          "Understanding and tolerance are key to handling emotional issues.",
      },
    ],
  };

  return questions[locale];
};

// 第二阶段题目配置（10道专业题）- 支持国际化
export const getStage2Questions = (locale: "zh" | "en"): QuizQuestion[] => {
  const questions = {
    zh: [
      {
        id: "q1",
        question:
          '你的伴侣告诉你，导致她痛经的罪魁祸首是"前列腺素"。这个词最贴切的解释是？',
        options: [
          { id: 1, text: "一种只在生病时才会产生的坏激素。", score: 0 },
          {
            id: 2,
            text: "一种导致子宫剧烈收缩以排出内膜的化学物质，收缩引发疼痛。",
            score: 1,
          },
          { id: 3, text: "情绪波动的产物，心情不好时会增多。", score: 0 },
          { id: 4, text: "一种细菌感染。", score: 0 },
        ],
        correctAnswer: 2,
        explanation: "前列腺素是导致子宫收缩和疼痛的关键化学物质。",
      },
      {
        id: "q2",
        question:
          '当伴侣痛得脸色发白、蜷缩在床上时，以下哪句话是"最不该说"的？',
        options: [
          { id: 1, text: '"需要我帮你拿止痛药或者热水袋吗？"', score: 0 },
          { id: 2, text: '"看起来你真的很难受，我在这里陪你。"', score: 0 },
          { id: 3, text: '"忍一忍就过去了，每个月都这样。"', score: 1 },
          { id: 4, text: '"要不要试试别的姿势躺着，可能会舒服点？"', score: 0 },
        ],
        correctAnswer: 3,
        explanation: "否定疼痛感受是最伤害伴侣的话。",
      },
      {
        id: "q3",
        question: "除了腹痛，痛经还可能带来以下哪些症状？（可多选）",
        options: [
          { id: 1, text: "头痛和偏头痛", score: 1 },
          { id: 2, text: "腰酸背痛", score: 1 },
          { id: 3, text: "恶心、呕吐或腹泻", score: 1 },
          { id: 4, text: "极度疲劳和情绪低落", score: 1 },
        ],
        correctAnswer: [1, 2, 3, 4],
        explanation: "痛经可能伴随多种全身症状。",
        isMultipleChoice: true,
      },
      {
        id: "q4",
        question:
          "伴侣因为剧烈痛经，临时取消了你们的周末约会。你最理想的回应是？",
        options: [
          { id: 1, text: '"好吧，那你好好休息。" (然后自己出门玩)', score: 0 },
          { id: 2, text: '"又是因为这个？我们计划了好久了。"', score: 0 },
          {
            id: 3,
            text: '"没关系，身体最重要。我带点你爱吃的，回家陪你一起看电影好不好？"',
            score: 1,
          },
          { id: 4, text: '"那你下周可要补偿我。"', score: 0 },
        ],
        correctAnswer: 3,
        explanation: "理解和支持是最重要的，主动陪伴比抱怨更有意义。",
      },
      {
        id: "q5",
        question: '关于"喝热水"，以下哪种理解更准确？',
        options: [
          { id: 1, text: "它是万能解药，所有痛经问题都能解决。", score: 0 },
          { id: 2, text: "它主要提供心理安慰，生理上没什么用。", score: 0 },
          {
            id: 3,
            text: "它能促进血液循环、放松肌肉，对部分人有效，但不是对所有人都有效。",
            score: 1,
          },
          { id: 4, text: "喝热水不如喝红糖水。", score: 0 },
        ],
        correctAnswer: 3,
        explanation: "喝热水有一定科学依据，但效果因人而异。",
      },
      {
        id: "q6",
        question:
          "你的伴侣服用了止痛药，但半小时后仍在哭泣。这最有可能说明什么？",
        options: [
          { id: 1, text: "她在夸大其词，药应该已经起效了。", score: 0 },
          {
            id: 2,
            text: "止痛药需要时间起效，而且疼痛的体验包含了情绪上的痛苦，她需要的是安慰。",
            score: 1,
          },
          { id: 3, text: "她对这种药有抗药性了。", score: 0 },
          { id: 4, text: "她只是想博取你的同情。", score: 0 },
        ],
        correctAnswer: 2,
        explanation: "疼痛不仅是生理感受，也包含情感体验，需要综合支持。",
      },
      {
        id: "q7",
        question: "在伴侣没有痛经的日子里，你能为她的下一个经期做些什么准备？",
        options: [
          { id: 1, text: "什么都不用做，到时候再说。", score: 0 },
          { id: 2, text: "提醒她不要吃生冷食物。", score: 0 },
          {
            id: 3,
            text: '和她一起散步或做些温和的运动，并主动了解她的"经期应急包"里需要补充什么。',
            score: 1,
          },
          { id: 4, text: "提前帮她买好一个月的止痛药。", score: 0 },
        ],
        correctAnswer: 3,
        explanation: "主动关怀和预防性准备比事后补救更有意义。",
      },
      {
        id: "q8",
        question:
          '"验证情绪"是建立同理心的关键一步。以下哪个例子是最好的"情绪验证"？',
        options: [
          { id: 1, text: '"别想那么多了，开心点。"', score: 0 },
          {
            id: 2,
            text: '"我虽然无法体会你的痛，但看到你这么难受，我真的很心疼。"',
            score: 1,
          },
          { id: 3, text: '"你为什么总是这么情绪化？"', score: 0 },
          { id: 4, text: '"我给你讲个笑话吧。"', score: 0 },
        ],
        correctAnswer: 2,
        explanation: "承认和验证对方的情绪感受是建立同理心的基础。",
      },
      {
        id: "q9",
        question: "以下哪项关于痛经的说法是常见误解？",
        options: [
          {
            id: 1,
            text: "严重的痛经可能是一种疾病的信号，如子宫内膜异位症。",
            score: 0,
          },
          { id: 2, text: "结婚或生完孩子后，痛经就一定会消失。", score: 1 },
          { id: 3, text: "规律的体育锻炼有助于缓解原发性痛经。", score: 0 },
          {
            id: 4,
            text: "在医生指导下使用非处方止痛药是安全有效的。",
            score: 0,
          },
        ],
        correctAnswer: 2,
        explanation: "结婚生子并不能保证痛经消失，这是常见误解。",
      },
      {
        id: "q10",
        question: '将痛经视为"我们"的问题，而不是"她"的问题，这种模式被称为？',
        options: [
          { id: 1, text: "个人主义", score: 0 },
          { id: 2, text: "二元应对 (Dyadic Coping)", score: 1 },
          { id: 3, text: "问题转移", score: 0 },
          { id: 4, text: "冷处理", score: 0 },
        ],
        correctAnswer: 2,
        explanation: "二元应对是指伴侣共同面对和解决问题的模式。",
      },
    ],
    en: [
      {
        id: "q1",
        question:
          'Your partner tells you the main culprit for her period pain is "prostaglandins." What is the best explanation for this term?',
        options: [
          {
            id: 1,
            text: "A harmful hormone produced only when sick.",
            score: 0,
          },
          {
            id: 2,
            text: "A chemical that causes intense uterine contractions to shed the lining, which causes pain.",
            score: 1,
          },
          {
            id: 3,
            text: "A byproduct of mood swings that increases when she's in a bad mood.",
            score: 0,
          },
          { id: 4, text: "A type of bacterial infection.", score: 0 },
        ],
        correctAnswer: 2,
        explanation:
          "Prostaglandins are key chemicals that cause uterine contractions and pain.",
      },
      {
        id: "q2",
        question:
          'When your partner is pale and curled up in bed from pain, which of the following is the "worst thing to say"?',
        options: [
          {
            id: 1,
            text: '"Do you need me to get you painkillers or a hot water bottle?"',
            score: 0,
          },
          {
            id: 2,
            text: "\"It looks like you're in a lot of pain. I'm here with you.\"",
            score: 0,
          },
          {
            id: 3,
            text: '"Just bear with it, it\'s like this every month."',
            score: 1,
          },
          {
            id: 4,
            text: '"Do you want to try lying in a different position? It might be more comfortable."',
            score: 0,
          },
        ],
        correctAnswer: 3,
        explanation:
          "Dismissing pain feelings is the most hurtful thing to say to your partner.",
      },
      {
        id: "q3",
        question:
          "Besides abdominal pain, what other symptoms can dysmenorrhea cause? (Select all that apply)",
        options: [
          { id: 1, text: "Headache and migraines", score: 1 },
          { id: 2, text: "Lower back pain", score: 1 },
          { id: 3, text: "Nausea, vomiting, or diarrhea", score: 1 },
          { id: 4, text: "Extreme fatigue and low mood", score: 1 },
        ],
        correctAnswer: [1, 2, 3, 4],
        explanation:
          "Dysmenorrhea can be accompanied by various systemic symptoms.",
        isMultipleChoice: true,
      },
      {
        id: "q4",
        question:
          "Your partner cancels your weekend date at the last minute because of severe cramps. What is your most ideal response?",
        options: [
          {
            id: 1,
            text: '"Okay, get some rest then." (Then go out by yourself)',
            score: 0,
          },
          {
            id: 2,
            text: '"Again? We\'ve been planning this for so long."',
            score: 0,
          },
          {
            id: 3,
            text: '"No problem, your health is the most important thing. How about I bring home some of your favorite food and we watch a movie together?"',
            score: 1,
          },
          {
            id: 4,
            text: '"You\'d better make it up to me next week."',
            score: 0,
          },
        ],
        correctAnswer: 3,
        explanation:
          "Understanding and support are most important; proactive companionship is more meaningful than complaints.",
      },
      {
        id: "q5",
        question:
          'Regarding "drinking hot water," which understanding is more accurate?',
        options: [
          {
            id: 1,
            text: "It's a universal cure for all period pain problems.",
            score: 0,
          },
          {
            id: 2,
            text: "It's mainly for psychological comfort and has little physiological effect.",
            score: 0,
          },
          {
            id: 3,
            text: "It can improve blood circulation and relax muscles, making it effective for some but not all people.",
            score: 1,
          },
          {
            id: 4,
            text: "Drinking hot water is not as good as drinking brown sugar water.",
            score: 0,
          },
        ],
        correctAnswer: 3,
        explanation:
          "Drinking hot water has some scientific basis, but the effectiveness varies from person to person.",
      },
      {
        id: "q6",
        question:
          "Your partner took painkillers but is still crying half an hour later. What does this most likely indicate?",
        options: [
          {
            id: 1,
            text: "She's exaggerating; the medicine should have worked by now.",
            score: 0,
          },
          {
            id: 2,
            text: "Painkillers take time to work, and the experience of pain includes emotional distress. She needs comfort.",
            score: 1,
          },
          {
            id: 3,
            text: "She has developed a resistance to this medication.",
            score: 0,
          },
          { id: 4, text: "She's just trying to get your sympathy.", score: 0 },
        ],
        correctAnswer: 2,
        explanation:
          "Pain is not only a physical sensation but also includes emotional experience, requiring comprehensive support.",
      },
      {
        id: "q7",
        question:
          "On days when your partner isn't having cramps, what can you do to prepare for her next period?",
        options: [
          {
            id: 1,
            text: "Nothing. We'll deal with it when it comes.",
            score: 0,
          },
          { id: 2, text: "Remind her not to eat cold foods.", score: 0 },
          {
            id: 3,
            text: 'Go for walks or do gentle exercises with her, and proactively ask what needs to be restocked in her "period emergency kit."',
            score: 1,
          },
          {
            id: 4,
            text: "Buy a month's supply of painkillers for her in advance.",
            score: 0,
          },
        ],
        correctAnswer: 3,
        explanation:
          "Proactive care and preventive preparation are more meaningful than reactive remedies.",
      },
      {
        id: "q8",
        question:
          '"Validating emotions" is a key step in building empathy. Which of the following is the best example of emotional validation?',
        options: [
          { id: 1, text: '"Don\'t overthink it, be happy."', score: 0 },
          {
            id: 2,
            text: '"I can\'t feel your pain, but seeing you suffer like this really hurts me too."',
            score: 1,
          },
          { id: 3, text: '"Why are you always so emotional?"', score: 0 },
          { id: 4, text: '"Let me tell you a joke."', score: 0 },
        ],
        correctAnswer: 2,
        explanation:
          "Acknowledging and validating the other person's emotional feelings is the foundation of building empathy.",
      },
      {
        id: "q9",
        question:
          "Which of the following statements about dysmenorrhea is a common misconception?",
        options: [
          {
            id: 1,
            text: "Severe dysmenorrhea can be a sign of a medical condition, like endometriosis.",
            score: 0,
          },
          {
            id: 2,
            text: "Period pain will definitely disappear after getting married or having a baby.",
            score: 1,
          },
          {
            id: 3,
            text: "Regular physical exercise can help alleviate primary dysmenorrhea.",
            score: 0,
          },
          {
            id: 4,
            text: "Using over-the-counter painkillers under a doctor's guidance is safe and effective.",
            score: 0,
          },
        ],
        correctAnswer: 2,
        explanation:
          "Getting married or having children does not guarantee that dysmenorrhea will disappear; this is a common misconception.",
      },
      {
        id: "q10",
        question:
          'Viewing period pain as a "we problem" instead of just "her problem" is known as?',
        options: [
          { id: 1, text: "Individualism", score: 0 },
          { id: 2, text: "Dyadic Coping", score: 1 },
          { id: 3, text: "Problem Shifting", score: 0 },
          { id: 4, text: "Cold Shoulder", score: 0 },
        ],
        correctAnswer: 2,
        explanation:
          "Dyadic coping refers to the pattern where partners face and solve problems together.",
      },
    ],
  };

  return questions[locale];
};

// 第三阶段题目配置（30天训练营 - 无题目）
export const getStage3Questions = (): QuizQuestion[] => {
  return [];
};

// 第四阶段题目配置（个性化指导 - 无题目）
export const getStage4Questions = (): QuizQuestion[] => {
  return [];
};

// 获取阶段题目的工具函数 - 支持国际化
export const getStageQuestions = (
  stage: QuizStage,
  locale: "zh" | "en",
): QuizQuestion[] => {
  switch (stage) {
    case "stage1":
      return getStage1Questions(locale);
    case "stage2":
      return getStage2Questions(locale);
    case "stage3":
      return getStage3Questions();
    case "stage4":
      return getStage4Questions();
    default:
      logWarn(
        `No questions found for stage: ${stage}`,
        undefined,
        "questionsConfigI18n/getStageQuestions",
      );
      return [];
  }
};

// 获取特定题目的工具函数 - 支持国际化
export const getQuestion = (
  stage: QuizStage,
  questionIndex: number,
  locale: "zh" | "en",
): QuizQuestion | null => {
  const questions = getStageQuestions(stage, locale);
  return questions[questionIndex] || null;
};

// 计算阶段总分的工具函数 - 支持国际化
export const calculateStageScore = (
  stage: QuizStage,
  answers: QuizAnswer[],
  locale: "zh" | "en",
): number => {
  const questions = getStageQuestions(stage, locale);
  return answers.reduce((total, answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (question) {
      const option = question.options.find(
        (opt) => opt.id === answer.selectedOption,
      );
      return total + (option?.score || 0);
    }
    return total;
  }, 0);
};

// 计算阶段最大可能分数的工具函数 - 支持国际化
export const getMaxStageScore = (
  stage: QuizStage,
  locale: "zh" | "en",
): number => {
  const questions = getStageQuestions(stage, locale);
  return questions.reduce((total, question) => {
    const maxOptionScore = Math.max(
      ...question.options.map((opt) => opt.score),
    );
    return total + maxOptionScore;
  }, 0);
};
