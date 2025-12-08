import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box, Group, Text, Button, Table, Badge, ActionIcon, Stack,
  Card, TextInput, Select, Divider, Pagination, Loader
} from "@mantine/core";
import { IconPlus, IconPencil, IconTrash, IconSearch, IconFilter } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import type { AdminAccount, AdminAccountRole } from "../../types/adminAccount";
import { AdminAccountCreateModal } from "../../components/adminAccounts/AdminAccountCreateModal";
import { apiPost } from "../../utils/api";
import { createOptions } from "../../utils/selectOptions";
import { buildSearchParamsUtil } from "../../utils/search";
import { AdminAccountSearchableFields } from "../../types/search";

export default function AdminAccountListPage() {
  const { t } = useTranslation(["common", "adminAccount"]);

  const [isCreateModalOpened, setIsCreateModalOpened] = useState(false);

  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [roleFilter, setRoleFilter] = useState<"ALL" | AdminAccountRole>("ALL");
  const [enabledFilter, setEnabledFilter] = useState<"ALL" | "ENABLED" | "DISABLED">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [field, setField] = useState<string>("all");
  const [keyword, setKeyword] = useState("");

  // -------------------------------
  //  Configs (하드코딩 제거)
  // -------------------------------

  const searchFieldOptions = createOptions(
      ["all", "username", "email", "nickname"],
      t,
      "adminAccount:list.search.field"
  );

  const roleFilterOptions = createOptions(
      ["ALL", "SUPER", "ADMIN"],
      t,
      "adminAccount:list.filter.role"
  );

  const enabledFilterOptions = createOptions(
      ["ALL", "ENABLED", "DISABLED"],
      t,
      "adminAccount:list.filter.status"
  );

  const columns = [
    { key: "username", label: t("adminAccount:list.columns.username") },
    { key: "nickname", label: t("adminAccount:list.columns.nickname") },
    { key: "role", label: t("adminAccount:list.columns.role") },
    { key: "enabled", label: t("adminAccount:list.columns.enabled") },
    { key: "actions", label: t("adminAccount:list.columns.actions") },
  ];

  // -------------------------------
  //  Params Builder (중복 제거)
  // -------------------------------
  const buildSearchParams = () => {
    const params: any = {
      page: currentPage - 1,
      size: pageSize,
    };

    if (roleFilter !== "ALL") params.role = roleFilter;
    if (enabledFilter !== "ALL") params.enabled = enabledFilter === "ENABLED";

    const searchParams = buildSearchParamsUtil(field, keyword, AdminAccountSearchableFields);
    if (searchParams) {
      params.search = searchParams;
    }

    return params;
  };

  // -------------------------------
  //  API Load
  // -------------------------------
  const loadAdminAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildSearchParams();

      console.log("Loading with params:", params)
      const data = await apiPost("/admin/account/search", params);

      setAdminAccounts(data.content);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, roleFilter, enabledFilter, field, keyword]);

  useEffect(() => setCurrentPage(1), [field, keyword, roleFilter, enabledFilter]);
  useEffect(() => void loadAdminAccounts(), [loadAdminAccounts]);

  // -------------------------------
  //  Delete Handler
  // -------------------------------
  const handleDeleteAdminAccount = (adminAccount: AdminAccount) => {
    console.log("Delete request:", adminAccount);
  };

  // -------------------------------
  //  테이블 Row 렌더링
  // -------------------------------
  const renderRows = () =>
      adminAccounts.map((a) => (
          <Table.Tr key={a.id}>
            <Table.Td>
              <Text fw={500}>{a.username}</Text>
              <Text size="xs" c="dimmed">{a.email}</Text>
            </Table.Td>

            <Table.Td><Text>{a.nickname}</Text></Table.Td>

            <Table.Td>
              <Badge
                  color={a.role === "SUPER" ? "red" : "blue"}
                  size="sm"
                  variant="light"
              >
                {t(
                    a.role === "SUPER"
                        ? "adminAccount:adminAccountRole.super"
                        : "adminAccount:adminAccountRole.admin"
                )}
              </Badge>
            </Table.Td>

            <Table.Td>
              <Badge
                  color={a.enabled ? "green" : "gray"}
                  variant="light"
                  size="sm"
              >
                {a.enabled
                    ? t("adminAccount:adminAccountEnabled.true")
                    : t("adminAccount:adminAccountEnabled.false")}
              </Badge>
            </Table.Td>

            <Table.Td style={{ textAlign: "right" }}>
              <Group gap="xs" justify="flex-end">
                <ActionIcon variant="subtle" onClick={() => console.log("edit", a)}>
                  <IconPencil size={18} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteAdminAccount(a)}>
                  <IconTrash size={18} />
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
      ));

  // -------------------------------
  return (
      <Box p="md" mih="100vh">
        <Stack gap="md">

          <Group justify="space-between">
            <div>
              <Text fw={600} size="lg">{t("adminAccount:list.title")}</Text>
              <Text size="sm" c="dimmed">
                {t("adminAccount:list.subtitle", { count: adminAccounts.length })}
              </Text>
            </div>

            <Button
                size="xs"
                leftSection={<IconPlus size={14} />}
                onClick={() => setIsCreateModalOpened(true)}
            >
              {t("adminAccount:list.addButton")}
            </Button>
          </Group>

          {/* 검색/필터 */}
          <Card shadow="sm" radius="md" p="md" withBorder>
            <Stack gap="sm">
              <Group justify="space-between" align="flex-end">
                <Group gap="sm" align="flex-end">
                  <Select
                      size="xs"
                      data={searchFieldOptions}
                      value={field}
                      onChange={(v) => setField(v!)}
                      w={140}
                  />

                  <TextInput
                      size="xs"
                      placeholder={t("adminAccount:list.search.placeholder")}
                      leftSection={<IconSearch size={14} />}
                      value={keyword}
                      onChange={(e) => setKeyword(e.currentTarget.value)}
                      w={220}
                  />

                  <Select
                      size="xs"
                      leftSection={<IconFilter size={14} />}
                      data={roleFilterOptions}
                      value={roleFilter}
                      onChange={(v) => setRoleFilter(v as any)}
                      w={160}
                  />

                  <Select
                      size="xs"
                      leftSection={<IconFilter size={14} />}
                      data={enabledFilterOptions}
                      value={enabledFilter}
                      onChange={(v) => setEnabledFilter(v as any)}
                      w={160}
                  />
                </Group>
              </Group>

              <Divider my="xs" />

              {loading ? (
                  <Box py="xl" ta="center">
                    <Loader size="sm" />
                  </Box>
              ) : adminAccounts.length > 0 ? (
                  <>
                    <Table striped highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          {columns.map((col) => (
                              <Table.Th key={col.key} style={col.key === "actions" ? { textAlign: "right" } : {}}>
                                {col.label}
                              </Table.Th>
                          ))}
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>{renderRows()}</Table.Tbody>
                    </Table>

                    <Group justify="center" mt="sm">
                      <Pagination total={totalPages} value={currentPage} onChange={setCurrentPage} />
                    </Group>
                  </>
              ) : (
                  <Box py="xl" ta="center">
                    <Text size="sm" c="dimmed">{t("adminAccount:list.empty")}</Text>
                  </Box>
              )}
            </Stack>
          </Card>
        </Stack>

        <AdminAccountCreateModal
            opened={isCreateModalOpened}
            onClose={() => setIsCreateModalOpened(false)}
            onCreate={() => loadAdminAccounts()}
        />
      </Box>
  );
}
