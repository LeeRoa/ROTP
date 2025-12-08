import { useState, useEffect, useCallback } from "react";
import {
  Box, Group, Text, Button, Table, Badge, ActionIcon, Stack,
  Card, TextInput, Select, Divider, Pagination, Loader
} from "@mantine/core";
import { IconPlus, IconPencil, IconTrash, IconSearch, IconFilter } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import type { AdminAccount } from "../../types/adminAccount";
import { AdminAccountCreateModal } from "../../components/adminAccounts/AdminAccountCreateModal";
import { apiPost } from "../../utils/api";

export default function AdminAccountListPage() {
  const { t } = useTranslation(["common", "adminAccount"]);

  const [isCreateModalOpened, setIsCreateModalOpened] = useState(false);

  // 데이터 상태
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 검색/필터/페이지 상태
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "S" | "U">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // API 호출 함수
  const loadAdminAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiPost("/admin/account/search", {
        page: currentPage - 1,
        size: pageSize,
        search,
        type: typeFilter === "ALL" ? undefined : typeFilter,
      });

      setAdminAccounts(data.content);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, typeFilter]);

  // 검색/필터 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter]);

  // 요청 발생
  useEffect(() => {
    loadAdminAccounts();
  }, [loadAdminAccounts]);

  // 삭제 핸들러
  const handleDeleteAdminAccount = (adminAccount: AdminAccount) => {
    console.log("Delete request: ", adminAccount);
    // TODO: 삭제 API 호출 후 loadAdminAccounts()
  };

  // 테이블 Row 렌더링
  const renderRows = () =>
      adminAccounts.map((account) => (
          <Table.Tr key={account.id}>
            <Table.Td>
              <Text fw={500} size="sm">{account.loginId}</Text>
              <Text size="xs" c="dimmed">{account.email}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm">{account.name}</Text>
            </Table.Td>
            <Table.Td>
              <Badge
                  color={account.adminAccountType === "S" ? "red" : "blue"}
                  variant="light"
                  radius="sm"
                  size="sm"
              >
                {account.adminAccountType === "S"
                    ? t("adminAccount:adminAccountType.super")
                    : t("adminAccount:adminAccountType.user")}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Group gap="xs" justify="flex-end">
                <ActionIcon variant="subtle" color="gray" onClick={() => console.log("edit", account)}>
                  <IconPencil size={18} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteAdminAccount(account)}>
                  <IconTrash size={18} />
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
      ));

  return (
      <Box p="md" mih="100vh">
        <Stack gap="md">

          {/* 상단 제목 */}
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
                <Group align="flex-end" gap="sm">
                  <TextInput
                      size="xs"
                      placeholder={t("adminAccount:list.search.placeholder")}
                      leftSection={<IconSearch size={14} />}
                      value={search}
                      onChange={(e) => setSearch(e.currentTarget.value)}
                      w={220}
                  />

                  <Select
                      size="xs"
                      leftSection={<IconFilter size={14} />}
                      data={[
                        { value: "ALL", label: t("adminAccount:list.filter.all") },
                        { value: "S", label: t("adminAccount:list.filter.super") },
                        { value: "U", label: t("adminAccount:list.filter.user") },
                      ]}
                      value={typeFilter}
                      onChange={(value) => setTypeFilter((value as any) ?? "ALL")}
                      w={160}
                  />
                </Group>
              </Group>

              <Divider my="xs" />

              {/* 목록 */}
              {loading ? (
                  <Box py="xl" ta="center">
                    <Loader size="sm" />
                  </Box>
              ) : adminAccounts.length > 0 ? (
                  <>
                    <Table striped highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>{t("adminAccount:list.columns.loginId")}</Table.Th>
                          <Table.Th>{t("adminAccount:list.columns.name")}</Table.Th>
                          <Table.Th>{t("adminAccount:list.columns.type")}</Table.Th>
                          <Table.Th style={{ textAlign: "right" }}>
                            {t("adminAccount:list.columns.actions")}
                          </Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>{renderRows()}</Table.Tbody>
                    </Table>

                    <Group justify="center" mt="sm">
                      <Pagination
                          total={totalPages}
                          value={currentPage}
                          onChange={setCurrentPage}
                      />
                    </Group>
                  </>
              ) : (
                  <Box py="xl">
                    <Text ta="center" size="sm" c="dimmed">
                      {t("adminAccount:list.empty")}
                    </Text>
                  </Box>
              )}
            </Stack>
          </Card>
        </Stack>

        <AdminAccountCreateModal
            opened={isCreateModalOpened}
            onClose={() => setIsCreateModalOpened(false)}
            onCreate={() => loadAdminAccounts()} // 새로 만들면 자동 새로고침
        />
      </Box>
  );
}