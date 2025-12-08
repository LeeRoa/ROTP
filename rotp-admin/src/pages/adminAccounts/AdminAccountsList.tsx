import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Group,
  Text,
  Button,
  Table,
  Badge,
  ActionIcon,
  Stack,
  Card,
  TextInput,
  Select,
  Divider,
  Pagination,
} from "@mantine/core";
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconSearch,
  IconFilter,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import type { AdminAccount } from "../../types/adminAccount";
import { AdminAccountCreateModal } from "../../components/adminAccounts/AdminAccountCreateModal";

export default function AdminAccountListPage() {
  const { t } = useTranslation(["common", "adminAccount"]);

  const [isCreateModalOpened, setIsCreateModalOpened] = useState(false);

  // 더미 데이터 – 나중에 API 연동으로 교체
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([
    {
      id: 1,
      loginId: "admin",
      name: "홍길동",
      email: "admin@example.com",
      adminAccountType: "S",
    },
    {
      id: 2,
      loginId: "user01",
      name: "김철수",
      email: "user01@example.com",
      adminAccountType: "U",
    },
    {
      id: 3,
      loginId: "tester",
      name: "이영희",
      email: "tester@example.com",
      adminAccountType: "U",
    },
    {
      id: 4,
      loginId: "manager",
      name: "박민준",
      email: "manager@example.com",
      adminAccountType: "S",
    },
  ]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "S" | "U">("ALL");

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 한 페이지당 아이템 수 (원하면 UI로 변경 가능)

  const handleCreateAdminAccount = () => {
    setIsCreateModalOpened(true);
  };

  const handleAccountCreated = (newAccountData: unknown) => {
    console.log("New account created, refreshing list:", newAccountData);
    const newId = Math.max(...adminAccounts.map((a) => a.id)) + 1;
    setAdminAccounts((prev) => [
      ...prev,
      {
        id: newId,
        loginId: "newuser",
        name: "새 사용자",
        email: "new@example.com",
        adminAccountType: "U",
      },
    ]);
  };

  // Admin 수정 핸들러
  const handleEditAdminAccount = (adminAccount: AdminAccount) => {
    console.log("edit admin account", adminAccount);
  };

  // Admin 삭제 핸들러
  const handleDeleteAdminAccount = (adminAccount: AdminAccount) => {
    setAdminAccounts((prev) => prev.filter((a) => a.id !== adminAccount.id));
  };

  // 검색 + 필터 적용된 리스트
  const filteredAccounts = useMemo(() => {
    return adminAccounts.filter((account) => {
      const matchSearch =
          !search ||
          account.loginId.toLowerCase().includes(search.toLowerCase()) ||
          account.name.toLowerCase().includes(search.toLowerCase()) ||
          account.email.toLowerCase().includes(search.toLowerCase());

      const matchType =
          typeFilter === "ALL" || account.adminAccountType === typeFilter;

      return matchSearch && matchType;
    });
  }, [adminAccounts, search, typeFilter]);

  // 필터/검색 변경 시 페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, adminAccounts]);

  // 페이지 단위로 자른 데이터
  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / pageSize));
  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAccounts.slice(start, start + pageSize);
  }, [filteredAccounts, currentPage]);

  // 테이블 Row 렌더링 (페이지네이션 적용)
  const rows = paginatedAccounts.map((account) => (
      <Table.Tr key={account.id}>
        <Table.Td>
          <Text fw={500} size="sm">
            {account.loginId}
          </Text>
          <Text size="xs" c="dimmed">
            {account.email}
          </Text>
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
            <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => handleEditAdminAccount(account)}
                aria-label={t("common:action.edit")}
            >
              <IconPencil size={18} />
            </ActionIcon>
            <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => handleDeleteAdminAccount(account)}
                aria-label={t("common:action.delete")}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
  ));

  const hasData = filteredAccounts.length > 0;

  return (
      <Box p="md" mih="100vh">
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text fw={600} size="lg">
                {t("adminAccount:list.title")}
              </Text>
              <Text size="sm" c="dimmed">
                {t("adminAccount:list.subtitle", {
                  count: adminAccounts.length,
                })}
              </Text>
            </div>

            <Button
                size="xs"
                leftSection={<IconPlus size={14} />}
                onClick={handleCreateAdminAccount}
            >
              {t("adminAccount:list.addButton")}
            </Button>
          </Group>

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
                        {
                          value: "ALL",
                          label: t("adminAccount:list.filter.all"),
                        },
                        {
                          value: "S",
                          label: t("adminAccount:list.filter.super"),
                        },
                        {
                          value: "U",
                          label: t("adminAccount:list.filter.user"),
                        },
                      ]}
                      value={typeFilter}
                      onChange={(value) =>
                          setTypeFilter((value as "ALL" | "S" | "U") ?? "ALL")
                      }
                      w={160}
                  />
                </Group>
              </Group>

              <Divider my="xs" />

              {hasData ? (
                  <>
                    <Table
                        highlightOnHover
                        striped
                        verticalSpacing="xs"
                        horizontalSpacing="md"
                    >
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>
                            {t("adminAccount:list.columns.loginId")}
                          </Table.Th>
                          <Table.Th>
                            {t("adminAccount:list.columns.name")}
                          </Table.Th>
                          <Table.Th>
                            {t("adminAccount:list.columns.type")}
                          </Table.Th>
                          <Table.Th style={{ width: 120, textAlign: "right" }}>
                            {t("adminAccount:list.columns.actions")}
                          </Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>{rows}</Table.Tbody>
                    </Table>

                    <Group position="center" mt="sm">
                      <Pagination
                          total={totalPages}
                          page={currentPage}
                          onChange={setCurrentPage}
                          size="sm"
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
            onCreate={handleAccountCreated}
        />
      </Box>
  );
}