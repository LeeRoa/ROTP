import {
  Modal,
  Button,
  Stack,
  TextInput,
  Select,
  Group,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {useState} from "react";
import type {AdminAccountCreateModalProps, AdminAccountRole} from "../../types/adminAccount.ts";

export function AdminAccountCreateModal({
  opened,
  onClose,
  onCreate,
}: AdminAccountCreateModalProps) {
  const { t } = useTranslation(["common", "adminAccount"]);

  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [callNumber, setCallNumber] = useState<string | null>(null);
  const [role, setRole] = useState<AdminAccountRole | null>(null);
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 폼 제출 핸들러
  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    if (!username) {
      newErrors.username = t("adminAccount:createModal.validation.required", { field: t("adminAccount:createModal.title.username") });
    }
    if (!nickname) {
      newErrors.nickname = t("adminAccount:createModal.validation.required", { field: t("adminAccount:createModal.title.nickname") });
    }
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("adminAccount:createModal.validation.invalidEmail");
    }
    if (callNumber && !/^[0-9\-+]+$/.test(callNumber)) {
      newErrors.callNumber = t("adminAccount:createModal.validation.invalidCallNumber");
    }
    if (!role) {
      newErrors.role = t("adminAccount:createModal.validation.required", { field: t("adminAccount:createModal.title.role") });
    }
    if (!password) {
      newErrors.password = t("adminAccount:createModal.validation.required", {field: t("adminAccount:createModal.title.password")});
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        newErrors.password = t("adminAccount:createModal.validation.passwordComplexity");
    } else if (password.length < 8) {
      newErrors.password = t("adminAccount:createModal.validation.passwordLength", { min: 8 });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onCreate({ username, nickname, email, callNumber, role: role, password });
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setUsername("");
    setNickname("");
    setEmail("");
    setRole(null);
    setCallNumber(null);
    setPassword("");
    setErrors({});
  };

  const accountRoleData = [
    { value: "SUPER", label: t("adminAccount:adminAccountRole.super") },
    { value: "ADMIN", label: t("adminAccount:adminAccountRole.admin") },
  ];

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={<div style={{ fontWeight: 600 }}>{t("adminAccount:createModal.title.modalTitle")}</div>}
      centered
      size="sm"
    >
      <Stack gap="md">
        <TextInput
            label={t("adminAccount:createModal.title.username")}
            placeholder={t("adminAccount:createModal.placeholder.username")}
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            error={errors.username}
            required
        />
        <TextInput
          label={t("adminAccount:createModal.title.nickname")}
          placeholder={t("adminAccount:createModal.placeholder.nickname")}
          value={nickname}
          onChange={(e) => setNickname(e.currentTarget.value)}
          error={errors.nickname}
          required
        />
        <TextInput
            label={t("adminAccount:createModal.title.email")}
            placeholder={t("adminAccount:createModal.placeholder.email")}
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            error={errors.email}
        />
        <TextInput
            label={t("adminAccount:createModal.title.callNumber")}
            placeholder={t("adminAccount:createModal.placeholder.callNumber")}
            value={callNumber ?? ""}
            onChange={(e) => setCallNumber(e.currentTarget.value)}
            error={errors.callNumber}
        />
        <Select
            label={t("adminAccount:createModal.title.role")}
            placeholder={t("adminAccount:createModal.placeholder.role")}
            data={accountRoleData}
            value={role}
            onChange={(val) => setRole((val as AdminAccountRole) || "")}
            error={errors.role}
            required
        />
        <TextInput
          label={t("adminAccount:createModal.title.password")}
          placeholder={t("adminAccount:createModal.placeholder.password")}
          type="password"
          onChange={(e) => setPassword(e.currentTarget.value)}
          error={errors.password}
          required
        />
      </Stack>

      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={onClose}>
          {t("common:action.cancel")}
        </Button>
        <Button onClick={handleSubmit}>
          {t("common:action.create")}
        </Button>
      </Group>
    </Modal>
  );
}