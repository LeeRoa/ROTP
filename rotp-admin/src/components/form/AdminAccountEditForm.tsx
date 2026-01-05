import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Button,
    Card,
    Group,
    Select,
    Stack,
    TextInput,
    Switch,
    PasswordInput,
} from "@mantine/core";
import type {
    AdminAccountResponse,
    AdminAccountRole,
    AdminAccountUpdateRequest,
} from "../../types/adminAccount";

export type AdminAccountUpdateFormState =
    Omit<AdminAccountUpdateRequest, "password"> & {
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
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
        id: account.id,
        username: account.username,
        nickname: account.nickname,
        email: account.email ?? "",
        callNumber: account.callNumber ?? "",
        role: account.role,
        enabled: account.enabled,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [saving, setSaving] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    const handleChange = <K extends keyof AdminAccountUpdateFormState>(
        key: K,
        value: AdminAccountUpdateFormState[K]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const req = {
                ...form,
                currentPassword:
                    changePassword && form.currentPassword?.trim().length
                        ? form.currentPassword
                        : undefined,
                newPassword:
                    changePassword && form.newPassword?.trim().length
                        ? form.newPassword
                        : undefined,
                confirmNewPassword:
                    changePassword && form.confirmNewPassword?.trim().length
                        ? form.confirmNewPassword
                        : undefined,
            };

            await onSubmit(req);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card withBorder shadow="sm" mt="md">
            <Stack gap="sm">
                <TextInput
                    label={t("adminAccount:edit.fields.username")}
                    value={form.username}
                    disabled
                />

                <Switch
                    label={t("adminAccount:edit.changePassword.title")}
                    checked={changePassword}
                    onChange={(e) => {
                        const checked = e.currentTarget.checked;
                        setChangePassword(checked);

                        if (!checked) {
                            handleChange("currentPassword", "");
                            handleChange("newPassword", "");
                            handleChange("confirmNewPassword", "");
                        }
                    }}
                />

                {changePassword && (
                    <>
                        <PasswordInput
                            label={t("adminAccount:edit.changePassword.fields.currentPassword")}
                            value={form.currentPassword ?? ""}
                            onChange={(e) =>
                                handleChange("currentPassword", e.currentTarget.value)
                            }
                        />
                        <PasswordInput
                            label={t("adminAccount:edit.changePassword.fields.newPassword")}
                            value={form.newPassword ?? ""}
                            onChange={(e) =>
                                handleChange("newPassword", e.currentTarget.value)
                            }
                        />
                        <PasswordInput
                            label={t("adminAccount:edit.changePassword.fields.confirmNewPassword")}
                            value={form.confirmNewPassword ?? ""}
                            onChange={(e) =>
                                handleChange("confirmNewPassword", e.currentTarget.value)
                            }
                        />
                    </>
                )}

                <TextInput
                    label={t("adminAccount:edit.fields.nickname")}
                    value={form.nickname}
                    onChange={(e) => handleChange("nickname", e.currentTarget.value)}
                />

                <TextInput
                    label={t("adminAccount:edit.fields.callNumber")}
                    value={form.callNumber ?? ""}
                    onChange={(e) => handleChange("callNumber", e.currentTarget.value)}
                />

                <Select
                    label={t("adminAccount:edit.fields.role")}
                    value={form.role}
                    data={[
                        { value: "SUPER", label: t("adminAccount:adminAccountRole.super") },
                        { value: "ADMIN", label: t("adminAccount:adminAccountRole.admin") },
                    ]}
                    onChange={(v) => v && handleChange("role", v as AdminAccountRole)}
                />

                <Select
                    label={t("adminAccount:edit.fields.enabled")}
                    value={String(form.enabled)}
                    data={[
                        {
                            value: "true",
                            label: t("adminAccount:edit.toggleEnabled.enabled"),
                        },
                        {
                            value: "false",
                            label: t("adminAccount:edit.toggleEnabled.disabled"),
                        },
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