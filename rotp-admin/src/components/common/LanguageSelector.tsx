import { Select } from "@mantine/core";
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <Select
      size="xs"
      w={90}
      data={[
        { value: "ko", label: "한국어" },
        { value: "en", label: "English" }
      ]}
      value={i18n.language}
      onChange={(lng) => lng && i18n.changeLanguage(lng)}
    />
  );
}
