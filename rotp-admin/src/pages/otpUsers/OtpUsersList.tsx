import { useState, useEffect, useCallback } from "react";
import {
    Box, Group, Text, Table, Badge, ActionIcon, Stack,
    Card, TextInput, Select, Divider, Pagination, Loader, Tooltip
} from "@mantine/core";
import { IconPencil, IconSearch, IconFilter, IconBan, IconCheck } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { apiPost, apiPatch } from "../../utils/api";
import { createOptions } from "../../utils/selectOptions";
import type { OtpUserResponse, OtpUserSearchRequest } from "../../types/otpUser";
import type { PageResponse } from "../../types/PageResponse.ts";

// 필터 타입 정의
type EnabledFilter = "ALL" | "ENABLED" | "DISABLED";

export default function OtpUserList() {
    const navigate = useNavigate();
    const { t } = useTranslation(["common", "otpUser"]);

    const [otpUsers, setOtpUsers] = useState<OtpUserResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // Filters & Pagination
    const [statusFilter, setStatusFilter] = useState<EnabledFilter>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [field, setField] = useState<string>("all");
    const [keyword, setKeyword] = useState("");

    // Options 초기화
    const searchFieldOptions = createOptions(
        ["all", "userId", "email", "phoneNumber"],
        t,
        "otpUser:list.search.field"
    );

    const statusFilterOptions = createOptions(
        ["ALL", "ENABLED", "DISABLED"],
        t,
        "otpUser:list.filter.status"
    );

    // 검색 파라미터 빌더
    const buildSearchParams = useCallback((): OtpUserSearchRequest => {
        return {
            page: currentPage - 1,
            size: pageSize,
            disabled: statusFilter === "ALL" ? undefined : statusFilter === "DISABLED",
            search: keyword.trim()
                ? {
                    fields: field === "all" ? ["userId", "email", "phoneNumber"] : [field],
                    keyword: keyword.trim(),
                }
                : undefined,
        };
    }, [currentPage, pageSize, statusFilter, field, keyword]);

    // 데이터 로드
    const loadOtpUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = buildSearchParams();
            const data = await apiPost<PageResponse<OtpUserResponse>>("/admin/otp-user/search", params);

            setOtpUsers(data.content);
            setTotalPages(data.totalPages);
        } finally {
            setLoading(false);
        }
    }, [buildSearchParams]);

    // 필터 변경 시 첫 페이지로 이동
    useEffect(() => {
        setCurrentPage(1);
    }, [field, keyword, statusFilter]);

    // 페이지 및 필터 변경 시 데이터 로드
    useEffect(() => {
        void loadOtpUsers();
    }, [loadOtpUsers]);

    // 상태 변경 핸들러
    const toggleUserStatus = async (user: OtpUserResponse) => {
        try {
            await apiPatch(`/admin/otp-user/info`, {
                userId: user.userId,
                disabled: !user.disabled
            });
            await loadOtpUsers();
        } catch (error) {
            console.error("Status toggle failed:", error);
        }
    };

    const renderRows = () =>
        otpUsers.map((user) => (
            <Table.Tr key={user.userId}>
                <Table.Td>
                    <Text fw={500}>{user.userId}</Text>
                    <Text size="xs" c="dimmed">{user.email || "-"}</Text>
                </Table.Td>

                <Table.Td>
                    <Text size="sm">{user.phoneNumber || "-"}</Text>
                </Table.Td>

                <Table.Td>
                    <Group gap="xs">
                        <Badge size="xs" variant="outline">{user.algorithm}</Badge>
                        <Text size="xs" c="dimmed">{user.period}s / {user.digits}자리</Text>
                    </Group>
                </Table.Td>

                <Table.Td>
                    <Badge color={user.disabled ? "red" : "green"} variant="light">
                        {t(user.disabled ? "otpUser:status.disabled" : "otpUser:status.enabled")}
                    </Badge>
                    {user.otpBypassUntil && new Date(user.otpBypassUntil) > new Date() && (
                        <Badge color="grape" variant="filled" ml="xs" size="xs">BYPASS</Badge>
                    )}
                </Table.Td>

                <Table.Td>
                    <Text size="xs">
                        {user.lastUsedAt ? new Date(user.lastUsedAt).toLocaleString() : "-"}
                    </Text>
                </Table.Td>

                <Table.Td>
                    <Group gap="xs" justify="flex-end">
                        <Tooltip label={t("common:edit")}>
                            <ActionIcon variant="subtle" onClick={() => navigate(`/otp-users/${user.userId}`)}>
                                <IconPencil size={18} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label={user.disabled ? t("common:enable") : t("common:disable")}>
                            <ActionIcon
                                variant="subtle"
                                color={user.disabled ? "green" : "red"}
                                onClick={() => toggleUserStatus(user)}
                            >
                                {user.disabled ? <IconCheck size={18} /> : <IconBan size={18} />}
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Table.Td>
            </Table.Tr>
        ));

    return (
        <Box p="md">
            <Stack gap="md">
                <Group justify="space-between">
                    <div>
                        <Text fw={600} size="lg">{t("otpUser:list.title")}</Text>
                        <Text size="sm" c="dimmed">
                            {t("otpUser:list.subtitle", { count: otpUsers.length })}
                        </Text>
                    </div>
                </Group>

                <Card shadow="sm" radius="md" p="md" withBorder>
                    <Stack gap="sm">
                        <Group align="flex-end">
                            <Select
                                size="xs"
                                data={searchFieldOptions}
                                value={field}
                                onChange={(v) => setField(v || "all")}
                                w={140}
                            />
                            <TextInput
                                size="xs"
                                placeholder={t("otpUser:list.search.placeholder")}
                                leftSection={<IconSearch size={14} />}
                                value={keyword}
                                onChange={(e) => setKeyword(e.currentTarget.value)}
                                w={220}
                            />
                            <Select
                                size="xs"
                                leftSection={<IconFilter size={14} />}
                                data={statusFilterOptions}
                                value={statusFilter}
                                onChange={(v) => setStatusFilter(v as EnabledFilter)}
                                w={160}
                            />
                        </Group>

                        <Divider my="xs" />

                        {loading ? (
                            <Box py="xl" ta="center"><Loader size="sm" /></Box>
                        ) : otpUsers.length > 0 ? (
                            <>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>{t("otpUser:list.columns.user")}</Table.Th>
                                            <Table.Th>{t("otpUser:list.columns.phone")}</Table.Th>
                                            <Table.Th>{t("otpUser:list.columns.config")}</Table.Th>
                                            <Table.Th>{t("otpUser:list.columns.status")}</Table.Th>
                                            <Table.Th>{t("otpUser:list.columns.lastUsed")}</Table.Th>
                                            <Table.Th style={{ textAlign: "right" }}>{t("common:actions")}</Table.Th>
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
                                <Text size="sm" c="dimmed">{t("otpUser:list.empty")}</Text>
                            </Box>
                        )}
                    </Stack>
                </Card>
            </Stack>
        </Box>
    );
}