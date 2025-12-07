// PDF预览内容配置
export interface PreviewContent {
  title: {
    zh: string;
    en: string;
  };
  keyPoints: {
    zh: string[];
    en: string[];
  };
  useCase: {
    zh: string;
    en: string;
  };
  estimatedTime: {
    zh: string;
    en: string;
  };
  previewSections: {
    zh: Array<{
      title: string;
      content: string[];
      isHighlight?: boolean;
    }>;
    en: Array<{
      title: string;
      content: string[];
      isHighlight?: boolean;
    }>;
  };
  fullVersionIncludes: {
    zh: string[];
    en: string[];
  };
}

export const previewContentMap: Record<string, PreviewContent> = {
  "campus-emergency-checklist": {
    title: {
      zh: "校园应急清单",
      en: "Campus Emergency Checklist",
    },
    keyPoints: {
      zh: [
        "校园经期应急处理指南",
        "宿舍和教室应急措施",
        "校医和心理咨询师服务",
        "家长沟通指导",
      ],
      en: [
        "Campus menstrual emergency handling guide",
        "Emergency measures for dormitories and classrooms",
        "School doctor and psychological counselor services",
        "Parent communication guidance",
      ],
    },
    useCase: {
      zh: "校园环境下的经期应急处理",
      en: "Menstrual emergency handling in campus environment",
    },
    estimatedTime: {
      zh: "5-10分钟",
      en: "5-10 minutes",
    },
    previewSections: {
      zh: [
        {
          title: "应急物品准备",
          content: [
            "卫生用品和应急药品",
            "无声暖贴和防漏警报内裤",
            "经期知识漫画手册",
            "舒缓运动视频课程",
          ],
          isHighlight: true,
        },
        {
          title: "校园支持措施",
          content: [
            "健康咨询室和心理辅导室",
            "专业校医服务",
            "教师协作支持",
            "同学互助网络",
          ],
        },
      ],
      en: [
        {
          title: "Emergency Supplies Preparation",
          content: [
            "Sanitary supplies and emergency medications",
            "Silent warm patches and leak-proof alarm underwear",
            "Menstrual knowledge comic handbook",
            "Soothing exercise video courses",
          ],
          isHighlight: true,
        },
        {
          title: "Campus Support Measures",
          content: [
            "Health consultation room and psychological counseling room",
            "Professional school doctor services",
            "Teacher collaboration support",
            "Peer support network",
          ],
        },
      ],
    },
    fullVersionIncludes: {
      zh: [
        "详细的应急处理流程图",
        "校医联系方式和服务时间",
        "家长沟通模板和话术",
        "教师培训指南",
        "学生互助小组建立方法",
        "应急事件记录表格",
      ],
      en: [
        "Detailed emergency handling flow chart",
        "School doctor contact information and service hours",
        "Parent communication templates and scripts",
        "Teacher training guide",
        "Student mutual aid group establishment methods",
        "Emergency incident recording forms",
      ],
    },
  },
  "parent-communication-guide": {
    title: {
      zh: "家长沟通指导手册",
      en: "Parent Communication Guide",
    },
    keyPoints: {
      zh: [
        "帮助家长与青春期女儿沟通",
        "消除经期羞耻感",
        "建立正确的健康观念",
        "提供专业支持资源",
      ],
      en: [
        "Help parents communicate with adolescent daughters",
        "Eliminate menstrual shame",
        "Establish correct health concepts",
        "Provide professional support resources",
      ],
    },
    useCase: {
      zh: "家长与青春期女儿的经期健康沟通",
      en: "Menstrual health communication between parents and adolescent daughters",
    },
    estimatedTime: {
      zh: "10-15分钟",
      en: "10-15 minutes",
    },
    previewSections: {
      zh: [
        {
          title: "沟通技巧",
          content: [
            "如何开启经期话题",
            "消除羞耻感的对话方式",
            "建立信任关系的方法",
            "处理尴尬情况的策略",
          ],
          isHighlight: true,
        },
        {
          title: "教育内容",
          content: [
            "经期生理知识科普",
            "疼痛管理方法介绍",
            "健康生活方式指导",
            "专业医疗资源推荐",
          ],
        },
      ],
      en: [
        {
          title: "Communication Skills",
          content: [
            "How to start menstrual topics",
            "Conversation methods to eliminate shame",
            "Methods to build trust relationships",
            "Strategies for handling awkward situations",
          ],
          isHighlight: true,
        },
        {
          title: "Educational Content",
          content: [
            "Menstrual physiology knowledge popularization",
            "Introduction to pain management methods",
            "Healthy lifestyle guidance",
            "Professional medical resource recommendations",
          ],
        },
      ],
    },
    fullVersionIncludes: {
      zh: [
        "详细对话示例和话术",
        "不同年龄段的沟通策略",
        "常见问题解答手册",
        "专业医疗资源清单",
        "家庭支持系统建立指南",
        "紧急情况处理预案",
      ],
      en: [
        "Detailed conversation examples and scripts",
        "Communication strategies for different age groups",
        "FAQ manual",
        "Professional medical resource list",
        "Family support system establishment guide",
        "Emergency situation handling plan",
      ],
    },
  },
  "teacher-collaboration-handbook": {
    title: {
      zh: "教师协作手册",
      en: "Teacher Collaboration Handbook",
    },
    keyPoints: {
      zh: [
        "理解与支持经期不适的青少年学生",
        "教师团队协作机制",
        "跨学科支持方案",
        "持续关怀体系",
      ],
      en: [
        "Understanding and supporting adolescent students with menstrual discomfort",
        "Teacher team collaboration mechanism",
        "Interdisciplinary support plan",
        "Continuous care system",
      ],
    },
    useCase: {
      zh: "教师团队协作支持经期不适学生",
      en: "Teacher team collaboration to support students with menstrual discomfort",
    },
    estimatedTime: {
      zh: "12-15分钟",
      en: "12-15 minutes",
    },
    previewSections: {
      zh: [
        {
          title: "协作机制",
          content: [
            "教师团队分工协作",
            "信息共享和沟通渠道",
            "责任分工和协调机制",
            "定期评估和改进流程",
          ],
          isHighlight: true,
        },
        {
          title: "支持策略",
          content: [
            "个性化支持方案制定",
            "学习调整和考试安排",
            "心理支持和情绪疏导",
            "家庭沟通和协调",
          ],
        },
      ],
      en: [
        {
          title: "Collaboration Mechanism",
          content: [
            "Teacher team division of labor and collaboration",
            "Information sharing and communication channels",
            "Responsibility division and coordination mechanism",
            "Regular evaluation and improvement process",
          ],
          isHighlight: true,
        },
        {
          title: "Support Strategies",
          content: [
            "Development of personalized support plans",
            "Learning adjustments and exam arrangements",
            "Psychological support and emotional counseling",
            "Family communication and coordination",
          ],
        },
      ],
    },
    fullVersionIncludes: {
      zh: [
        "详细协作流程图",
        "教师培训课程大纲",
        "学生支持计划模板",
        "家长沟通协调指南",
        "学校政策制定框架",
        "效果评估和改进方法",
      ],
      en: [
        "Detailed collaboration flow chart",
        "Teacher training course outline",
        "Student support plan template",
        "Parent communication coordination guide",
        "School policy development framework",
        "Effect evaluation and improvement methods",
      ],
    },
  },
};

/**
 * 根据资源ID获取预览内容
 */
export function getPreviewContentById(
  resourceId: string,
): PreviewContent | undefined {
  return previewContentMap[resourceId];
}

/**
 * 获取所有支持预览的资源ID
 */
export function getAllPreviewableResourceIds(): string[] {
  return Object.keys(previewContentMap);
}
