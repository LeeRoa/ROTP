import { Box, Text, useMantineTheme, useComputedColorScheme } from "@mantine/core";
import { useTranslation } from "react-i18next";

export function Footer() {
    const theme = useMantineTheme();
    const computedColorScheme = useComputedColorScheme('light');
    const { t } = useTranslation();
    
    const textColor = computedColorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.gray[7];
    const borderColor = computedColorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3];

    return (
        <Box 
            component="footer" 
            py="md" 
            px="md"
            style={{ 
                borderTop: `1px solid ${borderColor}`,
                backgroundColor: 'transparent', 
                marginTop: theme.spacing.xl,
            }}
        >
            <Text size="xs" ta="center" c={textColor}>
                {t("footer.copyright", { year: new Date().getFullYear() })}
            </Text>
            <Text size="xs" ta="center" c={textColor}>
                {t("footer.version", { version: "1.0.0" })}
            </Text>
        </Box>
    );
}