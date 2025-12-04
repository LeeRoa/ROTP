import { useTranslation } from "react-i18next";

interface Props {
  page: number;          // 1-based
  size: number;
  totalCount: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, size, totalCount, onChange }: Props) {
    const { t } = useTranslation();
    const totalPage = Math.max(1, Math.ceil(totalCount / size));

  const handlePrev = () => {
    if (page > 1) onChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPage) onChange(page + 1);
  };

  return (
    <div style={{ marginTop: 16 }}>
      <button onClick={handlePrev} disabled={page <= 1}>
        {t("commonPrev")}
      </button>
      <span style={{ margin: "0 8px" }}>
        {page} / {totalPage}
      </span>
      <button onClick={handleNext} disabled={page >= totalPage}>
        {t("commonNext")}
      </button>
    </div>
  );
}