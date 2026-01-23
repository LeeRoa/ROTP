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
      footer={{ height: 60 }}
      navbar={{
        width: 240,
        breakpoint: "sm",
        collapsed: {
          mobile: false,
          desktop: false,
        },
      }}
      styles={{
        main: {
          backgroundColor: layoutColors.mainBg,
          minHeight: "calc(100vh - 120px)",
          overflow: "auto",
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
