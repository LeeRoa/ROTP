// src/pages/admin/AdminAccountsList.tsx
import { useMemo, useState } from "react";
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

  const handleAccountCreated = (newAccountData: any) => {
    console.log("New account created, refreshing list:", newAccountData);
    
    // TODO: 실제로는 API 재호출 또는 목록에 새 계정 추가 로직 필요
    // 이 임시 로직은 'adminAccounts' 상태에 접근하기 위해 컴포넌트 내부에 있어야 합니다.
    const newId = Math.max(...adminAccounts.map(a => a.id)) + 1;
    setAdminAccounts(prev => [...prev, {
        id: newId,
        loginId: "newuser",
        name: "새 사용자",
        email: "new@example.com",
        adminAccountType: "U"
    }]);
  };
  
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

  const handleCreateAdminAccount = () => {
    setIsCreateModalOpened(true);
  };

  const handleEditAdminAccount = (adminAccount: AdminAccount) => {
    console.log("edit admin account", adminAccount);
  };

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

  // 테이블 Row 렌더링
  const rows = filteredAccounts.map((account) => (
    <Table.Tr
      key={account.id}
    >
      <Table.Td>
        {/* 🔥 텍스트 색상 수동 지정 제거: Mantine 기본 색상(밝은 테마에서는 theme.black) 사용 */}
        <Text fw={500} size="sm">
          {account.loginId}
        </Text>
        <Text size="xs" c="dimmed">
          {account.email}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">
          {account.name}
        </Text>
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
        {/* 상단 타이틀 영역 */}
        <Group justify="space-between">
          <div>
            {/* 🔥 텍스트 색상 수동 지정 제거 */}
            <Text fw={600} size="lg"> 
              {t("adminAccount:list.title")}
            </Text>
            {/* Mantine의 'dimmed' 색상을 사용하여 보조 텍스트 처리 */}
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

        {/* 카드 안에 검색/필터 + 테이블 */}
        <Card
          shadow="sm"
          radius="md"
          p="md"
          withBorder
        >
          <Stack gap="sm">
            {/* 검색 + 필터 */}
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

            {/* 테이블 / 빈 상태 */}
            {hasData ? (
              <Table
                highlightOnHover
                striped
                verticalSpacing="xs"
                horizontalSpacing="md"
              >
                <Table.Thead>
                  <Table.Tr>
                    {/* 🔥 <Table.Th> 내부에 추가했던 <Text> 컴포넌트 제거 */}
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