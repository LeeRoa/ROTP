import {
  Modal,
  Button,
  Stack,
  TextInput,
  Select,
  Group,
} from "@mantine/core";
import { useTranslation } from "react-i18next";

// 모달 Props 인터페이스 정의
interface AdminAccountCreateModalProps {
  opened: boolean;
  onClose: () => void;
  // 실제 API 연동 시 사용할 함수 (여기서는 더미)
  onCreate: (data: any) => void;
}

export function AdminAccountCreateModal({
  opened,
  onClose,
  onCreate,
}: AdminAccountCreateModalProps) {
  const { t } = useTranslation(["common", "adminAccount"]);
  // TODO: 실제 폼 상태 관리 및 유효성 검사 로직 추가 필요

  const handleSubmit = () => {
    // TODO: 실제 폼 데이터 추출 및 검증 후 onCreate 호출
    console.log("Submitting new admin account data...");
    onCreate({ success: true }); // 임시 호출
    onClose();
  };

  const accountTypeData = [
    { value: "S", label: t("adminAccount:adminAccountType.super") },
    { value: "U", label: t("adminAccount:adminAccountType.user") },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<div style={{ fontWeight: 600 }}>{t("adminAccount:createModal.title")}</div>}
      centered
      size="sm"
    >
      <Stack gap="md">
        <TextInput
          label={t("adminAccount:list.columns.loginId")}
          placeholder="login ID"
          required
        />
        <TextInput
          label={t("adminAccount:list.columns.name")}
          placeholder="Name"
          required
        />
        <TextInput
          label={t("common:email")}
          placeholder="email@example.com"
          type="email"
          required
        />
        <Select
          label={t("adminAccount:list.columns.type")}
          placeholder={t("common:select")}
          data={accountTypeData}
          required
        />
        <TextInput
          label={t("common:password")}
          placeholder="password"
          type="password"
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