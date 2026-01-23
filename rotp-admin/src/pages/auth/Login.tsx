import { useState } from "react";
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Stack,
    Alert,
    Box,
    rem,
    Image
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IconAt, IconLock, IconAlertCircle } from "@tabler/icons-react";
import { apiPost } from "../../utils/api";
import type { LoginRequest, LoginResponse } from "../../types/auth";
import { layoutColors } from "../../theme/colors";
import {getDeviceUuid} from "../../utils/device.ts";

export default function LoginPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) return;

        setLoading(true);
        setError(null);

        const deviceUuid = getDeviceUuid();

        const requestBody: LoginRequest = {
            username,
            password,
            uuid: deviceUuid
        };

        try {
            const data = await apiPost<LoginResponse>("/auth/login", requestBody);

            localStorage.setItem("accessToken", data.accessToken);
            if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

            navigate("/main");
        } catch (err: any) {
            console.error("Login Error:", err);
            setError(t("login.errorMessage"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>

            {/* 1. 좌측: 브랜딩 영역 (사용자 테마 bgDark 적용) */}
            <Box
                visibleFrom="sm"
                style={{
                    flex: 1,
                    backgroundColor: layoutColors.bgDark,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    padding: rem(40),
                    position: 'relative'
                }}
            >
                <Box mb={30} style={{ textAlign: 'center', width: '100%' }}>
                    {/* 로고 영역 */}
                    <Image
                        src="logo.png"
                        w={180}
                        mx="auto"
                        fit="contain"
                        mb="xl"
                    />

                    <Title order={1} style={{ color: 'white', fontSize: rem(36), fontWeight: 800 }}>
                        {t("login.brandTitle")}
                    </Title>
                    <Text mt="md" size="lg" style={{ color: layoutColors.textMuted }}>
                        {t("login.brandSubtitle")}
                    </Text>
                </Box>
            </Box>

            {/* 2. 우측: 로그인 폼 영역 */}
            <Box
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: layoutColors.mainBg
                }}
            >
                <Container size={420} w="100%">

                    <Paper withBorder shadow="xl" p={50} radius="md" bg="white">

                        <Stack gap="xs" mb={30} align="center">
                            <Text fw={900} size="xl" c={layoutColors.primary} hiddenFrom="sm">ROTP</Text>

                            <Title order={2} ta="center">{t("login.title")}</Title>
                            <Text c="dimmed" size="sm" ta="center">
                                {t("login.subtitle")}
                            </Text>
                        </Stack>

                        <form onSubmit={handleLogin}>
                            <Stack gap="md">
                                {error && (
                                    <Alert variant="light" color="red" icon={<IconAlertCircle size={16} />} title={t("login.error")}>
                                        {error}
                                    </Alert>
                                )}

                                <TextInput
                                    label={t("login.username")}
                                    placeholder={t("login.usernamePlaceholder")}
                                    required
                                    size="md"
                                    leftSection={<IconAt size={18} />}
                                    value={username}
                                    onChange={(e) => setUsername(e.currentTarget.value)}
                                />

                                <PasswordInput
                                    label={t("login.password")}
                                    placeholder={t("login.passwordPlaceholder")}
                                    required
                                    size="md"
                                    leftSection={<IconLock size={18} />}
                                    value={password}
                                    onChange={(e) => setPassword(e.currentTarget.value)}
                                />

                                <Group justify="space-between" mt="xs">
                                    <Checkbox label={t("login.rememberMe")} size="sm" />
                                    <Anchor component="button" size="sm" c={layoutColors.primary}>
                                        {t("login.forgotPassword")}
                                    </Anchor>
                                </Group>

                                <Button
                                    type="submit"
                                    fullWidth
                                    mt="xl"
                                    size="md"
                                    loading={loading}
                                    color={layoutColors.primary}
                                >
                                    {t("login.submit")}
                                </Button>
                            </Stack>
                        </form>

                        <Text ta="center" mt="xl" size="xs" c="dimmed">
                            {t("login.copyright")}
                        </Text>
                    </Paper>
                </Container>
            </Box>
        </div>
    );
}