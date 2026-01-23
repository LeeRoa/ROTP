import { useState, useEffect } from "react";
import {
    Box, Text, Loader, Card, Stack, TextInput, Select,
    Group, Button, Badge, Divider, Switch
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPut, apiPost } from "../../utils/api";
import type { OtpUserResponse, UpdateOtpUserInfoRequest } from "../../types/otpUser";

export default function OtpUsersEditPage() {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const { t } = useTranslation(["common", "otpUser"]);

    const [user, setUser] = useState<OtpUserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // 수정 가능한 필드
    const [email, setEmail] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [bypassEnabled, setBypassEnabled] = useState(false);
    const [bypassUntil, setBypassUntil] = useState<Date | string | null>(null);

    useEffect(() => {
        if (!userId) return;

        apiGet<OtpUserResponse>(`/admin/otp-user/${userId}`)
            .then((data) => {
                setUser(data);
                setEmail(data.email || "");
                setDisabled(data.disabled);
                if (data.otpBypassUntil) {
                    const bypassDate = new Date(data.otpBypassUntil);
                    if (bypassDate > new Date()) {
                        setBypassEnabled(true);
                        setBypassUntil(bypassDate);
                    }
                }
            })
            .finally(() => setLoading(false));
    }, [userId]);

    const handleSubmit = async () => {
        if (!user) return;

        setSaving(true);
        try {
            const req: UpdateOtpUserInfoRequest = {
                userId: user.userId,
                email: email.trim() || undefined,
                disabled,
            };

            await apiPut("/admin/otp-user", req);

            // 바이패스 설정이 활성화된 경우
            if (bypassEnabled && bypassUntil) {
                const adminId = localStorage.getItem("adminId") || "";
                await apiPost("/admin/otp-user/bypass", {
                    userId: user.userId,
                    until: bypassUntil
                        ? (bypassUntil instanceof Date ? bypassUntil.toISOString() : new Date(bypassUntil).toISOString())
                        : null,
                    adminId,
                });
            }

            navigate("/otp-users");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box p="md" ta="center">
                <Loader size="lg" />
            </Box>
        );
    }

    if (!user) {
        return (
            <Box p="md">
                <Text c="red">{t("common:notFound")}</Text>
            </Box>
        );
    }

    return (
        <Box p="md">
            <Group justify="space-between" mb="md">
                <div>
                    <Text fw={600} size="lg">{t("otpUser:edit.title")}</Text>
                    <Text size="sm" c="dimmed">{t("otpUser:edit.subtitle")}</Text>
                </div>
                <Badge color={user.disabled ? "red" : "green"} size="lg">
                    {t(user.disabled ? "otpUser:status.disabled" : "otpUser:status.enabled")}
                </Badge>
            </Group>

            <Card withBorder shadow="sm">
                <Stack gap="md">
                    {/* 읽기 전용 정보 */}
                    <Text fw={500} size="sm" c="dimmed">{t("otpUser:edit.sections.basicInfo")}</Text>

                    <TextInput
                        label={t("otpUser:edit.fields.userId")}
                        value={user.userId}
                        disabled
                    />

                    <TextInput
                        label={t("otpUser:edit.fields.phoneNumber")}
                        value={user.phoneNumber || "-"}
                        disabled
                    />

                    <Group grow>
                        <TextInput
                            label={t("otpUser:edit.fields.algorithm")}
                            value={user.algorithm}
                            disabled
                        />
                        <TextInput
                            label={t("otpUser:edit.fields.period")}
                            value={`${user.period}s`}
                            disabled
                        />
                        <TextInput
                            label={t("otpUser:edit.fields.digits")}
                            value={`${user.digits}`}
                            disabled
                        />
                    </Group>

                    <TextInput
                        label={t("otpUser:edit.fields.createdAt")}
                        value={new Date(user.createdAt).toLocaleString()}
                        disabled
                    />

                    <TextInput
                        label={t("otpUser:edit.fields.lastUsedAt")}
                        value={user.lastUsedAt ? new Date(user.lastUsedAt).toLocaleString() : "-"}
                        disabled
                    />

                    <Divider my="sm" />

                    {/* 수정 가능한 정보 */}
                    <Text fw={500} size="sm" c="dimmed">{t("otpUser:edit.sections.editableInfo")}</Text>

                    <TextInput
                        label={t("otpUser:edit.fields.email")}
                        placeholder={t("otpUser:edit.placeholder.email")}
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                    />

                    <Select
                        label={t("otpUser:edit.fields.status")}
                        value={disabled ? "disabled" : "enabled"}
                        data={[
                            { value: "enabled", label: t("otpUser:edit.statusOptions.enabled") },
                            { value: "disabled", label: t("otpUser:edit.statusOptions.disabled") },
                        ]}
                        onChange={(v) => setDisabled(v === "disabled")}
                    />

                    <Divider my="sm" />

                    {/* 바이패스 설정 */}
                    <Text fw={500} size="sm" c="dimmed">{t("otpUser:edit.sections.bypass")}</Text>

                    <Switch
                        label={t("otpUser:edit.bypass.enable")}
                        checked={bypassEnabled}
                        onChange={(e) => setBypassEnabled(e.currentTarget.checked)}
                    />

                    {bypassEnabled && (
                        <DateTimePicker
                            label={t("otpUser:edit.bypass.until")}
                            placeholder={t("otpUser:edit.bypass.selectDate")}
                            value={bypassUntil}
                            onChange={setBypassUntil}
                            minDate={new Date()}
                        />
                    )}

                    <Divider my="sm" />

                    {/* 버튼 */}
                    <Group justify="flex-end">
                        <Button variant="default" onClick={() => navigate("/otp-users")}>
                            {t("common:action.cancel")}
                        </Button>
                        <Button loading={saving} onClick={handleSubmit}>
                            {t("common:action.save")}
                        </Button>
                    </Group>
                </Stack>
            </Card>
        </Box>
    );
}
