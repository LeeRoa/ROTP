import { Stack, NavLink, Divider, Box, Image } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { layoutColors } from "../../theme/colors";

import {
  IconGauge,
  IconUserCog,
  IconUsers,
  IconChartBar,
  IconFileText,
} from "@tabler/icons-react";

export default function Sidebar() {
  const { pathname } = useLocation();
  const { t } = useTranslation("common");

  const menuItems = [
    { key: "dashboard", to: "/", icon: <IconGauge size={18} /> },
    { key: "adminAccounts", to: "/admin-accounts", icon: <IconUserCog size={18} /> },
    { key: "otpUsers", to: "/otp-users", icon: <IconUsers size={18} /> },
    { key: "statistics", to: "/statistics", icon: <IconChartBar size={18} /> },
    { key: "auditLogs", to: "/audit-logs", icon: <IconFileText size={18} /> },
  ];

  return (
    <Box
      p="md"
      style={{
        backgroundColor: layoutColors.bgDark,
        height: "100%",
        width: 240,
        borderRight: "1px solid #1e293b",
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* ---- 브랜드 헤더 (다국어) ---- */}
      <Box
        mb="md"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "6px 4px",
        }}
      >
        <Image
          src="/logo.png"
          alt="logo"
          w={40}
          h={40}
          fit="contain"
          style={{ display: "block" }}
        />

        <Box>
          <div
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {t("brand.title")}
          </div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: 12,
              marginTop: -2,
            }}
          >
            {t("brand.subtitle")}
          </div>
        </Box>
      </Box>

      <Divider my="sm" color="#1e293b" />

      {/* ---- 메뉴 (다국어) ---- */}
      <Stack gap={6} mt="sm">
        {menuItems.map((item) => {
          const active = pathname === item.to;

          return (
            <NavLink
              key={item.key}
              component={Link}
              to={item.to}
              label={t(`menu.${item.key}`)}
              leftSection={item.icon}
              active={active}
              styles={{
                root: {
                  borderRadius: 6,
                  padding: "8px 12px",
                  transition: "background 0.15s ease",
                  backgroundColor: active
                    ? "rgba(59, 130, 246, 0.15)"
                    : "transparent",
                },
                label: {
                  color: active ? layoutColors.primary : layoutColors.textLight,
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                },
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
