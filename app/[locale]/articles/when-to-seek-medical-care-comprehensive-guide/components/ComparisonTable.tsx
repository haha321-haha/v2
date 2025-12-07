"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Table, CheckCircle, AlertTriangle } from "lucide-react";
import { COMPARISON_TABLE_DATA } from "../utils/medicalCareData";
import styles from "../styles/ComparisonTable.module.css";
import type { ComparisonTableProps } from "../types/medical-care-guide";

export default function ComparisonTable({
  className = "",
  highlightRow,
}: ComparisonTableProps) {
  const t = useTranslations("medicalCareGuide");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [focusedRowIndex, setFocusedRowIndex] = useState<number>(-1);

  // 切换行展开状态
  const toggleRowExpansion = useCallback(
    (rowIndex: number) => {
      const newExpandedRows = new Set(expandedRows);
      if (newExpandedRows.has(rowIndex)) {
        newExpandedRows.delete(rowIndex);
      } else {
        newExpandedRows.add(rowIndex);
      }
      setExpandedRows(newExpandedRows);
    },
    [expandedRows],
  );

  // 键盘导航处理
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, rowIndex: number) => {
      const totalRows = COMPARISON_TABLE_DATA.rows.length;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          const nextRow = rowIndex < totalRows - 1 ? rowIndex + 1 : 0;
          setFocusedRowIndex(nextRow);
          // 聚焦到下一行
          const nextRowElement = e.currentTarget.parentElement?.children[
            nextRow + 1
          ] as HTMLElement;
          nextRowElement?.focus();
          break;

        case "ArrowUp":
          e.preventDefault();
          const prevRow = rowIndex > 0 ? rowIndex - 1 : totalRows - 1;
          setFocusedRowIndex(prevRow);
          // 聚焦到上一行
          const prevRowElement = e.currentTarget.parentElement?.children[
            prevRow + 1
          ] as HTMLElement;
          prevRowElement?.focus();
          break;

        case "Enter":
        case " ":
          e.preventDefault();
          toggleRowExpansion(rowIndex);
          break;

        case "Home":
          e.preventDefault();
          setFocusedRowIndex(0);
          const firstRowElement = e.currentTarget.parentElement
            ?.children[1] as HTMLElement;
          firstRowElement?.focus();
          break;

        case "End":
          e.preventDefault();
          setFocusedRowIndex(totalRows - 1);
          const lastRowElement = e.currentTarget.parentElement?.children[
            totalRows
          ] as HTMLElement;
          lastRowElement?.focus();
          break;
      }
    },
    [toggleRowExpansion],
  );

  // 处理行焦点
  const handleRowFocus = useCallback((rowIndex: number) => {
    setFocusedRowIndex(rowIndex);
  }, []);

  // 处理行失焦
  const handleRowBlur = useCallback(() => {
    setFocusedRowIndex(-1);
  }, []);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Table className={styles.icon} size={24} />
          {t("comparisonTable.title")}
        </h3>
        <p className={styles.description}>{t("comparisonTable.description")}</p>

        {/* 键盘导航说明 */}
        <div className="sr-only" role="region" aria-label="键盘导航说明">
          <p>
            使用箭头键在行间导航，按回车键或空格键展开/收起行详情，Home键跳到第一行，End键跳到最后一行
          </p>
        </div>
      </div>

      {/* 表格容器 */}
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                {COMPARISON_TABLE_DATA.headers.map((header, index) => (
                  <th key={index} className={styles.tableHeader}>
                    {t(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {COMPARISON_TABLE_DATA.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${styles.tableRow} ${
                    highlightRow === rowIndex ? styles.highlighted : ""
                  } ${expandedRows.has(rowIndex) ? styles.expanded : ""} ${
                    focusedRowIndex === rowIndex ? styles.focused : ""
                  }`}
                  onClick={() => toggleRowExpansion(rowIndex)}
                  onKeyDown={(e) => handleKeyDown(e, rowIndex)}
                  onFocus={() => handleRowFocus(rowIndex)}
                  onBlur={handleRowBlur}
                  tabIndex={0}
                  role="button"
                  aria-expanded={expandedRows.has(rowIndex)}
                  aria-label={`${t(row.condition)} - ${
                    expandedRows.has(rowIndex)
                      ? t("comparisonTable.collapse")
                      : t("comparisonTable.expand")
                  }`}
                >
                  {/* 条件列 */}
                  <td className={`${styles.tableCell} ${styles.conditionCell}`}>
                    <div className={styles.conditionContent}>
                      <span className={styles.conditionText}>
                        {t(row.condition)}
                      </span>
                      <button
                        className={styles.expandButton}
                        aria-label={
                          expandedRows.has(rowIndex)
                            ? t("comparisonTable.collapse")
                            : t("comparisonTable.expand")
                        }
                      >
                        <span
                          className={`${styles.expandIcon} ${
                            expandedRows.has(rowIndex) ? styles.rotated : ""
                          }`}
                        >
                          ▼
                        </span>
                      </button>
                    </div>
                  </td>

                  {/* 正常疼痛列 */}
                  <td className={`${styles.tableCell} ${styles.normalCell}`}>
                    <div className={styles.cellContent}>
                      <div className={styles.cellIcon}>
                        <CheckCircle size={16} className={styles.normalIcon} />
                      </div>
                      <div className={styles.cellText}>
                        <div className={styles.cellTitle}>
                          {t("comparisonTable.normalTitle")}
                        </div>
                        <div className={styles.cellDescription}>
                          {t(row.normalPain)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 令人担忧的疼痛列 */}
                  <td
                    className={`${styles.tableCell} ${styles.concerningCell}`}
                  >
                    <div className={styles.cellContent}>
                      <div className={styles.cellIcon}>
                        <AlertTriangle
                          size={16}
                          className={styles.concerningIcon}
                        />
                      </div>
                      <div className={styles.cellText}>
                        <div className={styles.cellTitle}>
                          {t("comparisonTable.concerningTitle")}
                        </div>
                        <div className={styles.cellDescription}>
                          {t(row.concerningPain)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 建议行动列 */}
                  <td className={`${styles.tableCell} ${styles.actionCell}`}>
                    <div className={styles.actionContent}>
                      <div className={styles.actionText}>{t(row.action)}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 表格说明 */}
      <div className={styles.tableNotes}>
        <div className={styles.noteItem}>
          <CheckCircle size={16} className={styles.normalIcon} />
          <span>{t("comparisonTable.normalNote")}</span>
        </div>
        <div className={styles.noteItem}>
          <AlertTriangle size={16} className={styles.concerningIcon} />
          <span>{t("comparisonTable.concerningNote")}</span>
        </div>
      </div>

      {/* 移动端友好提示 */}
      <div className={styles.mobileHint}>
        <p>{t("comparisonTable.mobileHint")}</p>
      </div>

      {/* 重要提醒 */}
      <div className={styles.importantReminder}>
        <div className={styles.reminderIcon}>⚠️</div>
        <div className={styles.reminderContent}>
          <h4 className={styles.reminderTitle}>
            {t("comparisonTable.reminder.title")}
          </h4>
          <p className={styles.reminderText}>
            {t("comparisonTable.reminder.text")}
          </p>
        </div>
      </div>
    </div>
  );
}
