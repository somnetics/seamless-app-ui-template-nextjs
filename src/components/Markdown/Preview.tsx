import MarkdownPreview from '@uiw/react-markdown-preview';
import { useGlobalState } from "@/context/globalState";

export type MDOptions = {
  source: string;
  theme: string;
}

export function Preview({ source, theme }: MDOptions) {
  const globalState = useGlobalState();

  return (
    <div data-color-mode={globalState.theme || theme}>
      <MarkdownPreview source={source} />
    </div>
  )
} 