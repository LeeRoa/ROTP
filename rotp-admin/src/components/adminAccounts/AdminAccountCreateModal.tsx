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

// 모달 Props 인터페이스 정의
interface AdminAccountCreateModalProps {
  opened: boolean;
  onClose: () => void;
  // 실제 API 연동 시 사용할 함수 (여기서는 더미)
  onCreate: (data: unknown) => void;
}

export function AdminAccountCreateModal({
  opened,
  onClose,
  onCreate,
}: AdminAccountCreateModalProps) {
  const { t } = useTranslation(["common", "adminAccount"]);

  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
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
    if (!email) {
      newErrors.email = t("adminAccount:createModal.validation.required", { field: t("adminAccount:createModal.title.email") });
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("adminAccount:createModal.validation.invalidEmail");
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

    onCreate({ username, nickname, email, role: role, password });
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
    setRole("");
    setPassword("");
    setErrors({});
  };

  const accountTypeData = [
    { value: "SUPER", label: t("adminAccount:adminAccountType.super") },
    { value: "ADMIN", label: t("adminAccount:adminAccountType.admin") },
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
            error={errors.loginId}
            required
        />
        <TextInput
          label={t("adminAccount:createModal.title.nickname")}
          placeholder={t("adminAccount:createModal.placeholder.nickname")}
          value={nickname}
          onChange={(e) => setNickname(e.currentTarget.value)}
          error={errors.name}
          required
        />
        <TextInput
            label={t("adminAccount:createModal.title.email")}
            placeholder={t("adminAccount:createModal.placeholder.email")}
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            error={errors.email}
        />

        <Select
            label={t("adminAccount:createModal.title.role")}
            placeholder={t("adminAccount:createModal.placeholder.role")}
            data={accountTypeData}
            value={role}
            onChange={(val) => setRole(val || "")}
            error={errors.type}
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