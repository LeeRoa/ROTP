import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, Group, Select, Stack, TextInput } from "@mantine/core";
import type {
    AdminAccountResponse,
    AdminAccountRole,
    AdminAccountUpdateRequest,
} from "../../types/adminAccount";

export type AdminAccountUpdateFormState =
    Omit<AdminAccountUpdateRequest, "password"> & {
    password?: string;
    enabled: boolean;
};

export type AdminAccountEditFormProps = {
    account: AdminAccountResponse;
    onSubmit: (data: AdminAccountUpdateFormState) => Promise<void>;
    onCancel: () => void;
};

export function AdminAccountEditForm({
                                         account,
                                         onSubmit,
                                         onCancel,
                                     }: AdminAccountEditFormProps) {
    const { t } = useTranslation(["common", "adminAccount"]);

    const [form, setForm] = useState<AdminAccountUpdateFormState>({
        username: account.username,
        email: account.email ?? "",
        nickname: account.nickname,
        role: account.role,
        callNumber: account.callNumber,
        enabled: account.enabled,
    });

    const [saving, setSaving] = useState(false);

    const handleChange = <K extends keyof AdminAccountUpdateFormState>(
        key: K,
        value: AdminAccountUpdateFormState[K]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await onSubmit(form);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card withBorder shadow="sm" mt="md">
            <Stack gap="sm">
                <TextInput
                    label={t("adminAccount:fields.username")}
                    value={form.username}
                    disabled
                />

                <TextInput
                    label={t("adminAccount:fields.nickname")}
                    value={form.nickname}
                    onChange={(e) => handleChange("nickname", e.currentTarget.value)}
                />

                <Select
                    label={t("adminAccount:fields.role")}
                    value={form.role}
                    data={[
                        { value: "SUPER", label: t("adminAccount:adminAccountRole.super") },
                        { value: "ADMIN", label: t("adminAccount:adminAccountRole.admin") },
                    ]}
                    onChange={(v) =>
                        v && handleChange("role", v as AdminAccountRole)
                    }
                />

                <Select
                    label={t("adminAccount:fields.enabled")}
                    value={String(form.enabled)}
                    data={[
                        { value: "true", label: t("common:enabled") },
                        { value: "false", label: t("common:disabled") },
                    ]}
                    onChange={(v) => handleChange("enabled", v === "true")}
                />

                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={onCancel}>
                        {t("common:cancel")}
                    </Button>
                    <Button loading={saving} onClick={handleSubmit}>
                        {t("common:save")}
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
}