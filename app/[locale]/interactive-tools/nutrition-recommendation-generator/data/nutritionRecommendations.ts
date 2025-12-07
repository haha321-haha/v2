/**
 * 营养推荐数据
 * 基于ziV1d3d项目的recommendations.json数据迁移
 * 完全保持ziV1d3d的原始数据结构
 */

// 基于ziV1d3d的原始数据结构
export interface ZIV1D3DRecommendation {
  en: string;
  zh: string;
}

export interface ZIV1D3DRecommendations {
  recommendedFoods: ZIV1D3DRecommendation[];
  foodsToAvoid: ZIV1D3DRecommendation[];
  lifestyleTips: ZIV1D3DRecommendation[];
}

export interface ZIV1D3DItem {
  label: {
    en: string;
    zh: string;
  };
  recommendations: ZIV1D3DRecommendations;
}

export interface ZIV1D3DData {
  menstrualPhase: Record<string, ZIV1D3DItem>;
  healthGoals: Record<string, ZIV1D3DItem>;
  holisticHealthConstitution: Record<string, ZIV1D3DItem>;
}

// 完全基于ziV1d3d的recommendations.json数据
export const nutritionData: ZIV1D3DData = {
  menstrualPhase: {
    menstrual: {
      label: {
        en: "Menstrual Phase",
        zh: "月经期",
      },
      recommendations: {
        recommendedFoods: [
          {
            en: "Iron-rich foods: lean red meat, poultry, spinach, lentils, beans",
            zh: "富含铁的食物：瘦红肉、禽肉、菠菜、扁豆、豆类",
          },
          {
            en: "Vitamin C-rich foods to enhance iron absorption: citrus fruits, bell peppers, broccoli",
            zh: "富含维生素C的食物以促进铁吸收：柑橘类水果、甜椒、西兰花",
          },
          {
            en: "Omega-3 fatty acids for anti-inflammatory effects: salmon, walnuts, flaxseeds",
            zh: "富含Omega-3脂肪酸以抗炎：三文鱼、核桃、亚麻籽",
          },
          {
            en: "Magnesium-rich foods to ease cramps: dark leafy greens, nuts, seeds",
            zh: "富含镁的食物以缓解痉挛：深色绿叶蔬菜、坚果、种子",
          },
          {
            en: "Warm, easy-to-digest foods: ginger tea, soups, congee",
            zh: "温热、易消化的食物：姜茶、汤、粥",
          },
        ],
        foodsToAvoid: [
          {
            en: "Cold and raw foods, which may worsen cramps",
            zh: "生冷食物，可能加重痉挛",
          },
          {
            en: "Spicy and greasy foods that can cause digestive upset",
            zh: "辛辣油腻食物，可能引起消化不适",
          },
          {
            en: "Excessive salt, sugar, caffeine, and alcohol",
            zh: "过量的盐、糖、咖啡因和酒精",
          },
        ],
        lifestyleTips: [
          {
            en: "Stay hydrated by drinking plenty of warm water.",
            zh: "喝足量的温水以保持水分。",
          },
          {
            en: "Keep your body, especially the abdominal area, warm.",
            zh: "保持身体温暖，特别是腹部。",
          },
          {
            en: "Engage in light activities like walking or gentle stretching.",
            zh: "进行散步或轻柔伸展等轻度活动。",
          },
        ],
      },
    },
    follicular: {
      label: {
        en: "Follicular Phase",
        zh: "卵泡期",
      },
      recommendations: {
        recommendedFoods: [
          {
            en: "Lean proteins to support egg development: chicken, fish, tofu, beans",
            zh: "支持卵泡发育的瘦蛋白：鸡肉、鱼肉、豆腐、豆类",
          },
          {
            en: "Cruciferous vegetables to help metabolize estrogen: broccoli, cauliflower, kale",
            zh: "帮助雌激素代谢的十字花科蔬菜：西兰花、菜花、羽衣甘蓝",
          },
          {
            en: "Healthy fats for hormone production: avocado, nuts, seeds (flax, pumpkin)",
            zh: "支持激素生成的健康脂肪：牛油果、坚果、种子（亚麻籽、南瓜籽）",
          },
          {
            en: "Complex carbohydrates for sustained energy: oats, quinoa, brown rice",
            zh: "提供持续能量的复合碳水化合物：燕麦、藜麦、糙米",
          },
          {
            en: "Fermented foods for gut health: yogurt, kimchi, kombucha",
            zh: "有益肠道健康的发酵食品：酸奶、泡菜、康普茶",
          },
        ],
        foodsToAvoid: [
          {
            en: "Excessive alcohol, which can disrupt hormonal balance",
            zh: "过量饮酒，可能扰乱荷尔蒙平衡",
          },
          {
            en: "Highly processed foods and refined sugars",
            zh: "高度加工食品和精制糖",
          },
        ],
        lifestyleTips: [
          {
            en: "This is a great time for more energetic workouts.",
            zh: "这是进行更有活力锻炼的好时机。",
          },
          {
            en: "Focus on nutrient-dense foods to build up your body's resources.",
            zh: "专注于营养密集的食物，以补充身体资源。",
          },
        ],
      },
    },
    ovulation: {
      label: {
        en: "Ovulation Phase",
        zh: "排卵期",
      },
      recommendations: {
        recommendedFoods: [
          {
            en: "Antioxidant-rich foods: berries, dark chocolate, green tea",
            zh: "富含抗氧化剂的食物：浆果、黑巧克力、绿茶",
          },
          {
            en: "Zinc-rich foods for reproductive health: oysters, pumpkin seeds, cashews",
            zh: "富含锌的食物有益生殖健康：牡蛎、南瓜籽、腰果",
          },
          {
            en: "Folate-rich foods: leafy greens, citrus fruits, legumes",
            zh: "富含叶酸的食物：绿叶蔬菜、柑橘类水果、豆类",
          },
          {
            en: "Vitamin E for hormonal balance: almonds, sunflower seeds, spinach",
            zh: "有益荷尔蒙平衡的维生素E：杏仁、葵花籽、菠菜",
          },
        ],
        foodsToAvoid: [
          {
            en: "Excessive caffeine, which can affect hormone levels",
            zh: "过量咖啡因，可能影响荷尔蒙水平",
          },
          {
            en: "Processed foods with artificial additives",
            zh: "含人工添加剂的加工食品",
          },
        ],
        lifestyleTips: [
          {
            en: "Maintain regular sleep patterns for optimal hormone production.",
            zh: "保持规律睡眠以优化荷尔蒙生成。",
          },
          {
            en: "Practice stress-reduction techniques like meditation or yoga.",
            zh: "练习减压技巧，如冥想或瑜伽。",
          },
        ],
      },
    },
    luteal: {
      label: {
        en: "Luteal Phase",
        zh: "黄体期",
      },
      recommendations: {
        recommendedFoods: [
          {
            en: "Complex carbohydrates to stabilize mood: sweet potatoes, quinoa, brown rice",
            zh: "稳定情绪的复合碳水化合物：红薯、藜麦、糙米",
          },
          {
            en: "Magnesium-rich foods to reduce PMS symptoms: dark chocolate, almonds, spinach",
            zh: "减少经前综合症症状的镁：黑巧克力、杏仁、菠菜",
          },
          {
            en: "B-vitamins for energy and mood: whole grains, eggs, leafy greens",
            zh: "提供能量和改善情绪的B族维生素：全谷物、鸡蛋、绿叶蔬菜",
          },
          {
            en: "Calcium-rich foods for bone health: dairy, sardines, leafy greens",
            zh: "有益骨骼健康的钙：乳制品、沙丁鱼、绿叶蔬菜",
          },
        ],
        foodsToAvoid: [
          {
            en: "High-sodium foods that can cause bloating",
            zh: "可能导致腹胀的高钠食物",
          },
          {
            en: "Excessive sugar and refined carbohydrates",
            zh: "过量的糖和精制碳水化合物",
          },
          {
            en: "Alcohol, which can worsen PMS symptoms",
            zh: "可能加重经前综合症症状的酒精",
          },
        ],
        lifestyleTips: [
          {
            en: "Focus on gentle exercise like walking or swimming.",
            zh: "专注于散步或游泳等温和运动。",
          },
          {
            en: "Practice relaxation techniques to manage stress.",
            zh: "练习放松技巧来管理压力。",
          },
          {
            en: "Ensure adequate sleep to support hormonal balance.",
            zh: "确保充足睡眠以支持荷尔蒙平衡。",
          },
        ],
      },
    },
  },
  healthGoals: {
    anemiaPrevention: {
      label: {
        en: "Prevent Iron-Deficiency Anemia",
        zh: "预防缺铁性贫血",
      },
      recommendations: {
        recommendedFoods: [
          {
            en: "Heme iron sources: lean red meat, poultry, fish",
            zh: "血红素铁来源：瘦红肉、禽肉、鱼肉",
          },
          {
            en: "Non-heme iron sources: spinach, lentils, fortified cereals",
            zh: "非血红素铁来源：菠菜、扁豆、强化谷物",
          },
          {
            en: "Vitamin C-rich foods to enhance iron absorption: citrus fruits, bell peppers",
            zh: "促进铁吸收的维生素C：柑橘类水果、甜椒",
          },
          {
            en: "Folate-rich foods: leafy greens, beans, citrus fruits",
            zh: "富含叶酸的食物：绿叶蔬菜、豆类、柑橘类水果",
          },
        ],
        foodsToAvoid: [
          {
            en: "Tea and coffee with meals (inhibit iron absorption)",
            zh: "餐时饮茶和咖啡（抑制铁吸收）",
          },
          {
            en: "Calcium supplements with iron-rich meals",
            zh: "与富含铁的食物同时服用钙补充剂",
          },
          {
            en: "Phytate-rich foods: whole grains, legumes (soak before cooking)",
            zh: "富含植酸的食物：全谷物、豆类（烹饪前浸泡）",
          },
        ],
        lifestyleTips: [
          {
            en: "Pair iron-rich foods with vitamin C sources.",
            zh: "将富含铁的食物与维生素C来源搭配。",
          },
          {
            en: "Cook in cast iron cookware when possible.",
            zh: "尽可能使用铸铁炊具烹饪。",
          },
          {
            en: "Consider iron supplements if recommended by a healthcare provider.",
            zh: "如果医疗保健提供者建议，考虑铁补充剂。",
          },
        ],
      },
    },
    pmsRelief: {
      label: {
        en: "Alleviate PMS Symptoms",
        zh: "缓解经前综合症",
      },
      recommendations: {
        recommendedFoods: [
          {
            en: "Magnesium-rich foods: dark chocolate, almonds, spinach, pumpkin seeds",
            zh: "富含镁的食物：黑巧克力、杏仁、菠菜、南瓜籽",
          },
          {
            en: "Omega-3 fatty acids: fatty fish, walnuts, flaxseeds",
            zh: "Omega-3脂肪酸：肥鱼、核桃、亚麻籽",
          },
          {
            en: "Complex carbohydrates: sweet potatoes, quinoa, oats",
            zh: "复合碳水化合物：红薯、藜麦、燕麦",
          },
          {
            en: "Calcium-rich foods: dairy, leafy greens, sardines",
            zh: "富含钙的食物：乳制品、绿叶蔬菜、沙丁鱼",
          },
        ],
        foodsToAvoid: [
          {
            en: "Excessive salt, which can cause bloating",
            zh: "过量盐分，可能导致腹胀",
          },
          { en: "Refined sugars and processed foods", zh: "精制糖和加工食品" },
          { en: "Excessive caffeine and alcohol", zh: "过量咖啡因和酒精" },
        ],
        lifestyleTips: [
          {
            en: "Maintain regular meal times to stabilize blood sugar.",
            zh: "保持规律进餐时间以稳定血糖。",
          },
          {
            en: "Practice stress-reduction techniques like meditation.",
            zh: "练习减压技巧，如冥想。",
          },
          {
            en: "Engage in regular, moderate exercise.",
            zh: "进行规律、适度的运动。",
          },
        ],
      },
    },
  },
  holisticHealthConstitution: {
    qiDeficiency: {
      label: {
        en: "Low Energy Pattern",
        zh: "气虚",
      },
      recommendations: {
        recommendedFoods: [
          {
            en: "Tonifying foods: Chinese yam, sweet potatoes, brown rice",
            zh: "提升铁水平食物：菠菜、黑巧克力、瘦肉",
          },
          {
            en: "Warm, cooked foods: soups, stews, congee",
            zh: "温热熟食：汤、炖菜、粥",
          },
          {
            en: "Protein-rich foods: lean meats, eggs, beans",
            zh: "富含蛋白质的食物：瘦肉、鸡蛋、豆类",
          },
          { en: "Ginger and warming spices", zh: "生姜和温热香料" },
        ],
        foodsToAvoid: [
          { en: "Raw and cold foods", zh: "生冷食物" },
          { en: "Excessive bitter and cooling foods", zh: "过量的苦寒食物" },
          { en: "Overeating or skipping meals", zh: "暴饮暴食或跳餐" },
        ],
        lifestyleTips: [
          {
            en: "Eat regular meals at consistent times.",
            zh: "在固定时间规律进餐。",
          },
          {
            en: "Avoid overexertion and get adequate rest.",
            zh: "避免过度劳累，充分休息。",
          },
          {
            en: "Practice gentle exercises like tai chi or walking.",
            zh: "练习太极拳或散步等温和运动。",
          },
        ],
      },
    },
    yangDeficiency: {
      label: {
        en: "Cold Sensitivity Pattern",
        zh: "阳虚",
      },
      recommendations: {
        recommendedFoods: [
          {
            en: "Warming foods: lamb, ginger, cinnamon, black pepper",
            zh: "温热食物：羊肉、生姜、肉桂、黑胡椒",
          },
          { en: "Cooked vegetables and warm soups", zh: "熟蔬菜和热汤" },
          {
            en: "Root vegetables: carrots, turnips, sweet potatoes",
            zh: "根茎蔬菜：胡萝卜、萝卜、红薯",
          },
          {
            en: "Warm beverages: ginger tea, cinnamon tea",
            zh: "温热饮品：姜茶、肉桂茶",
          },
        ],
        foodsToAvoid: [
          { en: "Cold and raw foods", zh: "生冷食物" },
          {
            en: "Excessive cooling fruits and vegetables",
            zh: "过量的寒凉水果和蔬菜",
          },
          { en: "Ice-cold beverages", zh: "冰镇饮品" },
        ],
        lifestyleTips: [
          {
            en: "Keep warm, especially the lower back and feet.",
            zh: "保持温暖，特别是腰部和脚部。",
          },
          {
            en: "Engage in moderate exercise to generate internal heat.",
            zh: "进行适度运动以产生内热。",
          },
          { en: "Get adequate sunlight exposure.", zh: "获得充足的阳光照射。" },
        ],
      },
    },
    yinDeficiency: {
      label: {
        en: "Overheated Pattern",
        zh: "阴虚",
      },
      recommendations: {
        recommendedFoods: [
          {
            en: "Moistening foods: white fungus, pears, lotus root",
            zh: "润燥食物：银耳、梨、莲藕",
          },
          {
            en: "Cooling foods: cucumber, watermelon, mung beans",
            zh: "清热食物：黄瓜、西瓜、绿豆",
          },
          { en: "Nourishing soups and congee", zh: "滋补汤和粥" },
          {
            en: "Healthy fats: avocado, nuts, seeds",
            zh: "健康脂肪：牛油果、坚果、种子",
          },
        ],
        foodsToAvoid: [
          { en: "Spicy and heating foods", zh: "辛辣和燥热食物" },
          { en: "Excessive alcohol and caffeine", zh: "过量酒精和咖啡因" },
          { en: "Overcooked or fried foods", zh: "过度烹饪或油炸食物" },
        ],
        lifestyleTips: [
          { en: "Ensure adequate sleep and rest.", zh: "确保充足睡眠和休息。" },
          {
            en: "Practice calming activities like meditation.",
            zh: "练习冥想等平静活动。",
          },
          {
            en: "Avoid staying up late and overexertion.",
            zh: "避免熬夜和过度劳累。",
          },
        ],
      },
    },
    phlegmDampness: {
      label: {
        en: "Sluggish Metabolism",
        zh: "痰湿",
      },
      recommendations: {
        recommendedFoods: [
          {
            en: "Dampness-resolving foods: barley, job's tears, radish",
            zh: "祛湿食物：大麦、薏米、萝卜",
          },
          { en: "Light, easily digestible foods", zh: "清淡易消化食物" },
          { en: "Cooked vegetables and lean proteins", zh: "熟蔬菜和瘦蛋白" },
          {
            en: "Warm, aromatic spices: ginger, garlic, pepper",
            zh: "温热芳香香料：生姜、大蒜、胡椒",
          },
        ],
        foodsToAvoid: [
          { en: "Greasy and heavy foods", zh: "油腻厚重食物" },
          { en: "Excessive dairy products", zh: "过量乳制品" },
          { en: "Raw and cold foods", zh: "生冷食物" },
          { en: "Sweet and sticky foods", zh: "甜腻食物" },
        ],
        lifestyleTips: [
          { en: "Eat smaller, more frequent meals.", zh: "少食多餐。" },
          {
            en: "Engage in regular exercise to promote circulation.",
            zh: "进行规律运动以促进循环。",
          },
          {
            en: "Avoid overeating and late-night eating.",
            zh: "避免暴饮暴食和深夜进食。",
          },
        ],
      },
    },
    dampHeat: {
      label: {
        en: "Internal Heat Pattern",
        zh: "湿热",
      },
      recommendations: {
        recommendedFoods: [
          {
            en: "Heat-clearing foods: mung beans, lotus root, cucumber",
            zh: "清热食物：绿豆、莲藕、黄瓜",
          },
          {
            en: "Dampness-draining foods: barley, job's tears, winter melon",
            zh: "利湿食物：大麦、薏米、冬瓜",
          },
          { en: "Light, cooling vegetables", zh: "清淡凉性蔬菜" },
          {
            en: "Bitter greens: bitter melon, dandelion greens",
            zh: "苦味蔬菜：苦瓜、蒲公英叶",
          },
        ],
        foodsToAvoid: [
          { en: "Spicy and greasy foods", zh: "辛辣油腻食物" },
          { en: "Excessive alcohol and caffeine", zh: "过量酒精和咖啡因" },
          { en: "Heavy, rich foods", zh: "厚重油腻食物" },
          { en: "Hot and humid environments", zh: "湿热环境" },
        ],
        lifestyleTips: [
          {
            en: "Stay hydrated with room-temperature water.",
            zh: "饮用室温水保持水分。",
          },
          {
            en: "Practice stress management techniques.",
            zh: "练习压力管理技巧。",
          },
          {
            en: "Avoid excessive heat and humidity exposure.",
            zh: "避免过度暴露于湿热环境。",
          },
        ],
      },
    },
  },
};

// 为了兼容性，保留原有的数据结构（简化版本）
export const menstrualPhaseData = nutritionData.menstrualPhase;
export const healthGoalData = nutritionData.healthGoals;
export const holisticHealthConstitutionData =
  nutritionData.holisticHealthConstitution;
