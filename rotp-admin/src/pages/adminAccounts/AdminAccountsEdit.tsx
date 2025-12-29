import { useState, useEffect } from "react";
import { Box, Text, Loader } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { AdminAccountEditForm } from "../../components/form/AdminAccountEditForm";
import type {
    AdminAccountResponse,
    AdminAccountUpdateRequest,
} from "../../types/adminAccount";
import type { AdminAccountUpdateFormState }
    from "../../components/form/AdminAccountEditForm";
import { apiGet, apiPut } from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminAccountEditPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation(["common", "adminAccount"]);

    const [account, setAccount] = useState<AdminAccountResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiGet<AdminAccountResponse>(`/admin/account/${id}`)
            .then(setAccount)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Loader />;

    if (!account) {
        return <Text>{t("common:notFound")}</Text>;
    }

    const handleUpdate = async (form: AdminAccountUpdateFormState) => {
        const req: AdminAccountUpdateRequest = {
            username: form.username,
            email: form.email,
            password: form.password ?? "",
            nickname: form.nickname,
            role: form.role,
            callNumber: form.callNumber,
        };

        await apiPut(`/admin/account`, req);
        navigate("/admin-accounts");
    };

    return (
        <Box p="md">
            <Text fw={600} size="lg">
                {t("adminAccount:edit.title")}
            </Text>

            <AdminAccountEditForm
                account={account}
                onSubmit={handleUpdate}
                onCancel={() => navigate("/admin-accounts")}
            />
        </Box>
    );
}
