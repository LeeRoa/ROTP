import { AppShell } from "@mantine/core";
import Sidebar from "./Sidebar";
import Header from "./Header";
import type { ReactNode } from "react";
import { layoutColors } from "../../theme/colors";
import { Footer } from "./Footer";

type Props = { children: ReactNode };

export default function AppLayout({ children }: Props) {
  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 240,
        breakpoint: "sm",
        collapsed: {
          mobile: false,
          desktop: false, // ← 이거 반드시 있어야 사이드바 보임!!!
        },
      }}
      styles={{
        main: {
          backgroundColor: layoutColors.mainBg,
          minHeight: "100vh",
        },
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
}
