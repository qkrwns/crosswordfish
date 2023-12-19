import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "../state/context";
import { Crossword } from "@/server/crossword";
import { americanSample110623 as sample } from "@/dataset/sample-puzzles";

export const metadata = {
  title: "Crosswordfish",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const crossword = new Crossword(15, 15, "freeform");
  await crossword.writeClues();
  const { grid, clues, rules } = crossword;

  return (
    <GameProvider {...{ grid, clues, rules }}>
      <TooltipProvider>{children}</TooltipProvider>
    </GameProvider>
  );
}
