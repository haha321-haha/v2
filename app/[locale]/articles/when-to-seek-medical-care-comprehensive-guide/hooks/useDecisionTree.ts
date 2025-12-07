import { useState, useCallback, useEffect } from "react";
import type { DecisionTreeNode } from "../types/medical-care-guide";

// 决策路径记录
interface DecisionStep {
  nodeId: string;
  question: string;
  choice: "yes" | "no";
  timestamp: string;
}

// 基于souW1e2的决策树逻辑
export function useDecisionTree(
  treeData: DecisionTreeNode,
  startNodeId: string = "start",
) {
  const [currentNode, setCurrentNode] = useState<DecisionTreeNode>(treeData);
  const [decisionPath, setDecisionPath] = useState<DecisionStep[]>([]);
  const [finalResult, setFinalResult] = useState<
    DecisionTreeNode["result"] | null
  >(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // 初始化决策树
  useEffect(() => {
    const startNode = findNodeById(treeData, startNodeId);
    if (startNode) {
      setCurrentNode(startNode);
      setDecisionPath([]);
      setFinalResult(null);
      setIsCompleted(false);
    }
  }, [treeData, startNodeId]);

  // 导航到指定节点
  const navigateToNode = useCallback(
    (nodeId: string) => {
      const node = findNodeById(treeData, nodeId);
      if (node) {
        setCurrentNode(node);

        // 如果是结果节点，设置最终结果
        if (node.result) {
          setFinalResult(node.result);
          setIsCompleted(true);
        }
      }
    },
    [treeData],
  );

  // 做出决策
  const makeDecision = useCallback(
    (choice: "yes" | "no") => {
      if (!currentNode.children || !currentNode.question) {
        // Cannot make decision on a result node or node without children
        return null;
      }

      const nextNode = currentNode.children[choice];
      if (!nextNode) {
        // No ${choice} path found for current node
        return null;
      }

      // 记录决策步骤
      const step: DecisionStep = {
        nodeId: currentNode.id,
        question: currentNode.question,
        choice,
        timestamp: new Date().toISOString(),
      };

      setDecisionPath((prev) => [...prev, step]);
      setCurrentNode(nextNode);

      // 检查是否到达最终结果
      if (nextNode.result) {
        setFinalResult(nextNode.result);
        setIsCompleted(true);
        return nextNode.result;
      }

      return null;
    },
    [currentNode],
  );

  // 重置决策树
  const resetTree = useCallback(() => {
    const startNode = findNodeById(treeData, startNodeId);
    if (startNode) {
      setCurrentNode(startNode);
      setDecisionPath([]);
      setFinalResult(null);
      setIsCompleted(false);
    }
  }, [treeData, startNodeId]);

  // 回退到上一步
  const goBack = useCallback(() => {
    if (decisionPath.length === 0) {
      return false; // 无法回退
    }

    const newPath = decisionPath.slice(0, -1);
    setDecisionPath(newPath);
    setFinalResult(null);
    setIsCompleted(false);

    // 重新导航到上一个节点
    if (newPath.length === 0) {
      // 回到起始节点
      const startNode = findNodeById(treeData, startNodeId);
      if (startNode) {
        setCurrentNode(startNode);
      }
    } else {
      // 回到路径中的上一个节点
      const lastStep = newPath[newPath.length - 1];
      const lastNode = findNodeById(treeData, lastStep.nodeId);
      if (lastNode && lastNode.children) {
        const targetNode = lastNode.children[lastStep.choice];
        if (targetNode) {
          setCurrentNode(targetNode);
        }
      }
    }

    return true;
  }, [decisionPath, treeData, startNodeId]);

  // 获取决策摘要
  const getDecisionSummary = useCallback(() => {
    return {
      totalSteps: decisionPath.length,
      isCompleted,
      finalResult,
      decisionPath: decisionPath.map((step) => ({
        question: step.question,
        choice: step.choice,
        timestamp: step.timestamp,
      })),
      canGoBack: decisionPath.length > 0,
    };
  }, [decisionPath, isCompleted, finalResult]);

  // 获取可能的路径预览
  const getPathPreview = useCallback(() => {
    if (!currentNode.children) {
      return null;
    }

    const yesPath = currentNode.children.yes;
    const noPath = currentNode.children.no;

    return {
      yesPreview: yesPath?.result
        ? {
            isResult: true,
            title: yesPath.result.title,
            urgency: yesPath.result.urgency,
          }
        : {
            isResult: false,
            nextQuestion: yesPath?.question,
          },
      noPreview: noPath?.result
        ? {
            isResult: true,
            title: noPath.result.title,
            urgency: noPath.result.urgency,
          }
        : {
            isResult: false,
            nextQuestion: noPath?.question,
          },
    };
  }, [currentNode]);

  // 导出决策历史
  const exportDecisionHistory = useCallback(() => {
    const history = {
      startTime: decisionPath[0]?.timestamp || new Date().toISOString(),
      endTime:
        decisionPath[decisionPath.length - 1]?.timestamp ||
        new Date().toISOString(),
      totalSteps: decisionPath.length,
      decisions: decisionPath,
      finalResult,
      isCompleted,
    };

    return JSON.stringify(history, null, 2);
  }, [decisionPath, finalResult, isCompleted]);

  return {
    currentNode,
    decisionPath,
    finalResult,
    isCompleted,
    navigateToNode,
    makeDecision,
    resetTree,
    goBack,
    getDecisionSummary,
    getPathPreview,
    exportDecisionHistory,
  };
}

// 辅助函数：根据ID查找节点
function findNodeById(
  tree: DecisionTreeNode,
  nodeId: string,
): DecisionTreeNode | null {
  if (tree.id === nodeId) {
    return tree;
  }

  if (tree.children) {
    const yesResult = tree.children.yes
      ? findNodeById(tree.children.yes, nodeId)
      : null;
    if (yesResult) return yesResult;

    const noResult = tree.children.no
      ? findNodeById(tree.children.no, nodeId)
      : null;
    if (noResult) return noResult;
  }

  return null;
}

// 辅助函数：获取所有可能的结果
export function getAllPossibleResults(
  tree: DecisionTreeNode,
): DecisionTreeNode["result"][] {
  const results: DecisionTreeNode["result"][] = [];

  function traverse(node: DecisionTreeNode) {
    if (node.result) {
      results.push(node.result);
    }

    if (node.children) {
      if (node.children.yes) traverse(node.children.yes);
      if (node.children.no) traverse(node.children.no);
    }
  }

  traverse(tree);
  return results;
}

// 辅助函数：计算决策树深度
export function calculateTreeDepth(tree: DecisionTreeNode): number {
  if (!tree.children) {
    return 0;
  }

  const yesDepth = tree.children.yes
    ? calculateTreeDepth(tree.children.yes)
    : 0;
  const noDepth = tree.children.no ? calculateTreeDepth(tree.children.no) : 0;

  return 1 + Math.max(yesDepth, noDepth);
}

// 辅助函数：验证决策树结构
export function validateDecisionTree(tree: DecisionTreeNode): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  function validate(node: DecisionTreeNode, path: string = "") {
    const currentPath = path ? `${path} -> ${node.id}` : node.id;

    // 检查节点ID
    if (!node.id) {
      errors.push(`Node at ${currentPath} is missing ID`);
    }

    // 检查结果节点
    if (node.result) {
      if (!node.result.title || !node.result.urgency) {
        errors.push(`Result node at ${currentPath} is missing required fields`);
      }
      return; // 结果节点不应该有子节点
    }

    // 检查问题节点
    if (!node.question) {
      errors.push(`Question node at ${currentPath} is missing question`);
    }

    if (!node.options || !node.options.yes || !node.options.no) {
      errors.push(`Question node at ${currentPath} is missing options`);
    }

    if (!node.children || !node.children.yes || !node.children.no) {
      errors.push(`Question node at ${currentPath} is missing children`);
    } else {
      validate(node.children.yes, currentPath);
      validate(node.children.no, currentPath);
    }
  }

  validate(tree);

  return {
    isValid: errors.length === 0,
    errors,
  };
}
