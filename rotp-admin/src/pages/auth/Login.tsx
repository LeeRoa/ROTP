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
import { IconAt, IconLock, IconAlertCircle } from "@tabler/icons-react";
import { apiPost } from "../../utils/api";
import type { LoginRequest, LoginResponse } from "../../types/auth";
import { layoutColors } from "../../theme/colors";
import {getDeviceUuid} from "../../utils/device.ts";

export default function LoginPage() {
    const navigate = useNavigate();

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
            setError("아이디 또는 비밀번호를 확인해주세요.");
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
                        Management Console
                    </Title>
                    <Text mt="md" size="lg" style={{ color: layoutColors.textMuted }}>
                        안전하고 효율적인 서비스 OTP 관리 시스템
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

                            <Title order={2} ta="center">로그인</Title>
                            <Text c="dimmed" size="sm" ta="center">
                                관리자 계정 정보를 입력해주세요
                            </Text>
                        </Stack>

                        <form onSubmit={handleLogin}>
                            <Stack gap="md">
                                {error && (
                                    <Alert variant="light" color="red" icon={<IconAlertCircle size={16} />} title="오류">
                                        {error}
                                    </Alert>
                                )}

                                <TextInput
                                    label="아이디"
                                    placeholder="ID"
                                    required
                                    size="md"
                                    leftSection={<IconAt size={18} />}
                                    value={username}
                                    onChange={(e) => setUsername(e.currentTarget.value)}
                                />

                                <PasswordInput
                                    label="비밀번호"
                                    placeholder="비밀번호"
                                    required
                                    size="md"
                                    leftSection={<IconLock size={18} />}
                                    value={password}
                                    onChange={(e) => setPassword(e.currentTarget.value)}
                                />

                                <Group justify="space-between" mt="xs">
                                    <Checkbox label="로그인 상태 유지" size="sm" />
                                    <Anchor component="button" size="sm" c={layoutColors.primary}>
                                        비밀번호 찾기
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
                                    로그인
                                </Button>
                            </Stack>
                        </form>

                        <Text ta="center" mt="xl" size="xs" c="dimmed">
                            Copyright © 2026. All rights reserved.
                        </Text>
                    </Paper>
                </Container>
            </Box>
        </div>
    );
}