import React, { useState } from "react";
import { GroupedReport } from "@src/types/Reports";
import "./GroupedReportCard.scss";
import { categoryIcons } from "@src/utils/categoryIcons";
import SubCategoryCard from "../sub-category-card/SubCategoryCard";
import EmojiReactionsPopup from "../emojis-popup/EmojiReactionsPopup";

interface Props {
  report: GroupedReport;
  totalCount: number;
  activeSubCategory: string | null;
  handleToggle: (subCategory: string) => void;
}

const GroupedReportCard: React.FC<Props> = ({
  report,
  totalCount,
  activeSubCategory,
  handleToggle,
}) => {
  const [showEmojiPopup, setShowEmojiPopup] = useState(false);

  const getGroupedEmojiSummary = () => {
    const emojiCount: Record<string, number> = {};

    report.subCategories.forEach(subCat => {
      subCat.descriptions?.forEach(desc => {
        if (desc.emoji) {
          emojiCount[desc.emoji] = (emojiCount[desc.emoji] || 0) + 1;
        }
      });
    });

    const sortedEmojis = Object.entries(emojiCount).sort((a, b) => b[1] - a[1]);

    const total = sortedEmojis.reduce((acc, [, count]) => acc + count, 0);
    const displayed = sortedEmojis.slice(0, 3);
    const remaining = sortedEmojis.length - displayed.length;

    return { displayed, remaining, total, fullMap: emojiCount };
  };

  const { displayed, remaining, total, fullMap } = getGroupedEmojiSummary();

  return (
    <div className="grouped-report-card">
      <div className="header">
        <div className="left">
          <span className="icon">{categoryIcons[report.category] || "📝"}</span>
          <h2 className="title">{report.category}</h2>
        </div>
        <div className="right">
          <span className="total-count">{totalCount} signalements</span>

          {displayed.length > 0 && (
            <div className="emoji-summary" onClick={() => setShowEmojiPopup(true)}>
              {displayed.map(([emoji]) => (
                <span key={emoji} className="emoji-icon">
                  {emoji}
                </span>
              ))}
              {remaining > 0 && <span className="emoji-more">+{remaining} autres</span>}
              <span className="emoji-total">({total})</span>
            </div>
          )}
        </div>
      </div>

      <div className="subcategories">
        {report.subCategories.map((subCat, index) => {
          const [mainDescription, ...others] = subCat.descriptions || [];

          return (
            <SubCategoryCard
              key={index}
              title={subCat.subCategory}
              count={subCat.count}
              subCategory={subCat.subCategory}
              mainDescription={mainDescription}
              otherDescriptions={others}
              reportId={report.reportingId}
              brandName={report.marque}
              isOpen={activeSubCategory === subCat.subCategory}
              onToggle={() => handleToggle(subCat.subCategory)}
            />
          );
        })}
      </div>

      {showEmojiPopup && (
        <EmojiReactionsPopup
          reactionsByEmoji={Object.entries(fullMap).reduce(
            (acc, [emoji]) => {
              const users = report.subCategories
                .flatMap(sc => sc.descriptions)
                .filter(desc => desc.emoji === emoji)
                .map(desc => desc.user);
              acc[emoji] = users;
              return acc;
            },
            {} as Record<string, { pseudo: string; avatar: string | null }[]>
          )}
          onClose={() => setShowEmojiPopup(false)}
        />
      )}
    </div>
  );
};

export default GroupedReportCard;

/* import React, { useState } from "react";
import { GroupedReport } from "@src/types/Reports";
import SubCategoryCard from "../sub-category-card/SubCategoryCard";
import { categoryIcons } from "@src/utils/categoryIcons";
import "./GroupedReportCard.scss";

interface GroupedReportCardProps {
  report: GroupedReport;
}

const GroupedReportCard: React.FC<GroupedReportCardProps> = ({ report }) => {
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(
    null
  );
const totalCount = report.subCategories.reduce(
  (sum, sub) => sum + sub.count,
  0
);

  const handleToggle = (subCategoryId: string) => {
    setActiveSubCategory((prev) =>
      prev === subCategoryId ? null : subCategoryId
    );
  };

    return (
      <div className="grouped-report-card">
        <div className="header-with-icon">
          <div className="icon-wrapper">{categoryIcons[report.category]}</div>
          <div className="text-wrapper">
            <h2 className="category-title">{report.category}</h2>
            <p className="category-subtitle">
              {totalCount} signalement{totalCount > 1 ? "s" : ""} lié
              {totalCount > 1 ? "s" : ""} à {report.category.toLowerCase()} sur{" "}
              <strong>{report.marque}</strong>
            </p>
          </div>
        </div>

        <div className="subcategories">
          {report.subCategories.map((subCat, index) => {
            const [mainDescription, ...others] = subCat.descriptions || [];
            return (
              <SubCategoryCard
                key={index}
                title={subCat.subCategory}
                count={subCat.count}
                subCategory={subCat.subCategory}
                mainDescription={mainDescription}
                otherDescriptions={others}
                reportId={report.reportingId}
                brandName={report.marque}
                isOpen={activeSubCategory === subCat.subCategory}
                onToggle={() => handleToggle(subCat.subCategory)}
              />
            );
          })}
        </div>
      </div>
    );
};

export default GroupedReportCard; */
