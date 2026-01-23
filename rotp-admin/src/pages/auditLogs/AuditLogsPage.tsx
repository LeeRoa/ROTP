import { useState, useEffect, useCallback } from "react";
import {
    Box, Group, Text, Table, Badge, ActionIcon, Stack,
    Card, Select, Divider, Pagination, Loader, Tooltip, Modal, Code, ScrollArea
} from "@mantine/core";
import { IconFilter, IconEye } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { apiPost, apiGet } from "../../utils/api";
import { createOptions } from "../../utils/selectOptions";
import type { AuditLogResponse, AuditLogSearchRequest } from "../../types/auditLog";
import type { PageResponse } from "../../types/PageResponse";

type ResultFilter = "ALL" | "SUCCESS" | "FAILURE";
type HttpMethodFilter = "ALL" | "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export default function AuditLogsPage() {
    const { t } = useTranslation(["common", "auditLog"]);

    const [auditLogs, setAuditLogs] = useState<AuditLogResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // Filters & Pagination
    const [resultFilter, setResultFilter] = useState<ResultFilter>("ALL");
    const [httpMethodFilter, setHttpMethodFilter] = useState<HttpMethodFilter>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    // Detail Modal
    const [selectedLog, setSelectedLog] = useState<AuditLogResponse | null>(null);
    const [detailModalOpened, setDetailModalOpened] = useState(false);

    // Options 초기화
    const resultFilterOptions = createOptions(
        ["ALL", "SUCCESS", "FAILURE"],
        t,
        "auditLog:list.filter.result"
    );

    const httpMethodFilterOptions = createOptions(
        ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"],
        t,
        "auditLog:list.filter.httpMethod"
    );

    // 검색 파라미터 빌더
    const buildSearchParams = useCallback((): AuditLogSearchRequest => {
        return {
            page: currentPage - 1,
            size: pageSize,
            result: resultFilter === "ALL" ? undefined : resultFilter,
            httpMethod: httpMethodFilter === "ALL" ? undefined : httpMethodFilter,
        };
    }, [currentPage, pageSize, resultFilter, httpMethodFilter]);

    // 데이터 로드
    const loadAuditLogs = useCallback(async () => {
        setLoading(true);
        try {
            const params = buildSearchParams();
            const data = await apiPost<PageResponse<AuditLogResponse>>("/admin/audit/search", params);

            setAuditLogs(data.content);
            setTotalPages(data.totalPages);
        } finally {
            setLoading(false);
        }
    }, [buildSearchParams]);

    // 필터 변경 시 첫 페이지로 이동
    useEffect(() => {
        setCurrentPage(1);
    }, [resultFilter, httpMethodFilter]);

    // 페이지 및 필터 변경 시 데이터 로드
    useEffect(() => {
        void loadAuditLogs();
    }, [loadAuditLogs]);

    // 상세 보기
    const handleViewDetail = async (log: AuditLogResponse) => {
        try {
            const detail = await apiGet<AuditLogResponse>(`/admin/audit/${log.id}`);
            setSelectedLog(detail);
            setDetailModalOpened(true);
        } catch (error) {
            console.error("Failed to load audit log detail:", error);
        }
    };

    const getResultBadgeColor = (result: string) => {
        switch (result) {
            case "SUCCESS": return "green";
            case "FAILURE": return "red";
            default: return "gray";
        }
    };

    const getHttpMethodBadgeColor = (method: string | null) => {
        switch (method) {
            case "GET": return "blue";
            case "POST": return "green";
            case "PUT": return "orange";
            case "PATCH": return "yellow";
            case "DELETE": return "red";
            default: return "gray";
        }
    };

    const renderRows = () =>
        auditLogs.map((log) => (
            <Table.Tr key={log.id}>
                <Table.Td>
                    <Text size="sm">{log.id}</Text>
                </Table.Td>

                <Table.Td>
                    <Text size="sm" fw={500}>{log.action || "-"}</Text>
                </Table.Td>

                <Table.Td>
                    <Badge color={getResultBadgeColor(log.result)} variant="light">
                        {t(`auditLog:result.${log.result}`)}
                    </Badge>
                </Table.Td>

                <Table.Td>
                    <Badge color={getHttpMethodBadgeColor(log.httpMethod)} variant="outline" size="xs">
                        {log.httpMethod || "-"}
                    </Badge>
                </Table.Td>

                <Table.Td>
                    <Text size="xs" lineClamp={1} style={{ maxWidth: 200 }}>
                        {log.requestUri || "-"}
                    </Text>
                </Table.Td>

                <Table.Td>
                    <Text size="xs">{log.ipAddress || "-"}</Text>
                </Table.Td>

                <Table.Td>
                    <Text size="xs">
                        {new Date(log.createdAt).toLocaleString()}
                    </Text>
                </Table.Td>

                <Table.Td>
                    <Group gap="xs" justify="flex-end">
                        <Tooltip label={t("common:view")}>
                            <ActionIcon variant="subtle" onClick={() => handleViewDetail(log)}>
                                <IconEye size={18} />
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
                        <Text fw={600} size="lg">{t("auditLog:list.title")}</Text>
                        <Text size="sm" c="dimmed">{t("auditLog:list.subtitle")}</Text>
                    </div>
                </Group>

                <Card shadow="sm" radius="md" p="md" withBorder>
                    <Stack gap="sm">
                        <Group align="flex-end">
                            <Select
                                size="xs"
                                leftSection={<IconFilter size={14} />}
                                data={resultFilterOptions}
                                value={resultFilter}
                                onChange={(v) => setResultFilter(v as ResultFilter)}
                                w={140}
                            />
                            <Select
                                size="xs"
                                leftSection={<IconFilter size={14} />}
                                data={httpMethodFilterOptions}
                                value={httpMethodFilter}
                                onChange={(v) => setHttpMethodFilter(v as HttpMethodFilter)}
                                w={160}
                            />
                        </Group>

                        <Divider my="xs" />

                        {loading ? (
                            <Box py="xl" ta="center"><Loader size="sm" /></Box>
                        ) : auditLogs.length > 0 ? (
                            <>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>{t("auditLog:list.columns.id")}</Table.Th>
                                            <Table.Th>{t("auditLog:list.columns.action")}</Table.Th>
                                            <Table.Th>{t("auditLog:list.columns.result")}</Table.Th>
                                            <Table.Th>{t("auditLog:list.columns.httpMethod")}</Table.Th>
                                            <Table.Th>{t("auditLog:list.columns.requestUri")}</Table.Th>
                                            <Table.Th>{t("auditLog:list.columns.ipAddress")}</Table.Th>
                                            <Table.Th>{t("auditLog:list.columns.createdAt")}</Table.Th>
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
                                <Text size="sm" c="dimmed">{t("auditLog:list.empty")}</Text>
                            </Box>
                        )}
                    </Stack>
                </Card>
            </Stack>

            {/* Detail Modal */}
            <Modal
                opened={detailModalOpened}
                onClose={() => setDetailModalOpened(false)}
                title={t("auditLog:detail.title")}
                size="lg"
            >
                {selectedLog && (
                    <Stack gap="md">
                        <Text fw={500} size="sm" c="dimmed">{t("auditLog:detail.sections.basicInfo")}</Text>
                        
                        <Group grow>
                            <div>
                                <Text size="xs" c="dimmed">{t("auditLog:detail.fields.id")}</Text>
                                <Text size="sm">{selectedLog.id}</Text>
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">{t("auditLog:detail.fields.action")}</Text>
                                <Text size="sm">{selectedLog.action || "-"}</Text>
                            </div>
                        </Group>

                        <Group grow>
                            <div>
                                <Text size="xs" c="dimmed">{t("auditLog:detail.fields.result")}</Text>
                                <Badge color={getResultBadgeColor(selectedLog.result)} variant="light">
                                    {t(`auditLog:result.${selectedLog.result}`)}
                                </Badge>
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">{t("auditLog:detail.fields.message")}</Text>
                                <Text size="sm">{selectedLog.message || "-"}</Text>
                            </div>
                        </Group>

                        <Divider />

                        <Text fw={500} size="sm" c="dimmed">{t("auditLog:detail.sections.requestInfo")}</Text>

                        <Group grow>
                            <div>
                                <Text size="xs" c="dimmed">{t("auditLog:detail.fields.httpMethod")}</Text>
                                <Badge color={getHttpMethodBadgeColor(selectedLog.httpMethod)} variant="outline" size="sm">
                                    {selectedLog.httpMethod || "-"}
                                </Badge>
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">{t("auditLog:detail.fields.ipAddress")}</Text>
                                <Text size="sm">{selectedLog.ipAddress || "-"}</Text>
                            </div>
                        </Group>

                        <div>
                            <Text size="xs" c="dimmed">{t("auditLog:detail.fields.requestUri")}</Text>
                            <Text size="sm">{selectedLog.requestUri || "-"}</Text>
                        </div>

                        <div>
                            <Text size="xs" c="dimmed">{t("auditLog:detail.fields.userAgent")}</Text>
                            <Text size="xs" style={{ wordBreak: "break-all" }}>{selectedLog.userAgent || "-"}</Text>
                        </div>

                        <Group grow>
                            <div>
                                <Text size="xs" c="dimmed">{t("auditLog:detail.fields.createdAt")}</Text>
                                <Text size="sm">{new Date(selectedLog.createdAt).toLocaleString()}</Text>
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">{t("auditLog:detail.fields.createdBy")}</Text>
                                <Text size="sm">{selectedLog.createdBy || "-"}</Text>
                            </div>
                        </Group>

                        {selectedLog.requestPayload && (
                            <>
                                <Divider />
                                <Text fw={500} size="sm" c="dimmed">{t("auditLog:detail.sections.payload")}</Text>
                                <ScrollArea h={200}>
                                    <Code block>
                                        {(() => {
                                            try {
                                                return JSON.stringify(JSON.parse(selectedLog.requestPayload), null, 2);
                                            } catch {
                                                return selectedLog.requestPayload;
                                            }
                                        })()}
                                    </Code>
                                </ScrollArea>
                            </>
                        )}
                    </Stack>
                )}
            </Modal>
        </Box>
    );
}
