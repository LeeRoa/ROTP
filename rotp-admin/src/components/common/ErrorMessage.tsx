import { useTranslation } from "react-i18next";

interface Props {
  message?: string;
}

export default function ErrorMessage({ message }: Props) {
  const { t } = useTranslation();
  return <div style={{ color: "red" }}>{message ?? t("commonError")}</div>;
}