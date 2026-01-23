import { Box, Title, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <Box p="md">
      <Title order={2}>{t("dashboard.title")}</Title>
      <Text c="dimmed" mt="sm">{t("dashboard.welcome")}</Text>
    </Box>
  );
}
