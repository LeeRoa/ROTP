import { Group, Text, Button, Box, Avatar } from "@mantine/core";
import LanguageSelector from "../common/LanguageSelector";
import { useTranslation } from "react-i18next";
import { IconLogout } from "@tabler/icons-react";
import { layoutColors } from "../../theme/colors";

export default function Header() {
  const { t } = useTranslation("common");

  // TODO: 나중에 실제 로그인 정보로 대체
  const currentUserNickname = "홍길동"; // 하드코딩 닉네임

  return (
    <Box
      px="md"
      style={{
        height: "100%",
        backgroundColor: "#0f172a",
        borderBottom: "1px solid #1e293b",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Group justify="space-between" w="100%">
        {/* 왼쪽 타이틀 */}
        <Text fw={600} c={layoutColors.textLight}>
          {t("layout.title")}
        </Text>

        {/* 오른쪽 영역 */}
        <Group>
          {/* 로그인된 사용자 표시 영역 */}
          <Group gap="xs">
            <Avatar radius="xl" size={24}>
              {currentUserNickname.charAt(0)}
            </Avatar>
            <Box>
              {/* 위쪽 작은 글자: 단순 "환영합니다" / "Welcome" */}
              <Text size="xs" c={layoutColors.textMuted}>
                {t("layout.welcome")}
              </Text>

              {/* 아래쪽 굵은 글자: 홍길동님 / HongGilDong */}
              <Text size="sm" fw={600} c={layoutColors.textLight}>
                {t("layout.nicknameFormat", { name: currentUserNickname })}
              </Text>
            </Box>
          </Group>

          <LanguageSelector />

          <Button
            variant="light"
            color="red"
            size="xs"
            leftSection={<IconLogout size={14} />}
          >
            {t("layout.logout")}
          </Button>
        </Group>
      </Group>
    </Box>
  );
}
