import { ComponentType } from "react";

export default function withIsland<T>(WrappedComponent: ComponentType<T>) {
  const responseToLLM = (response: string) => {
    window.parent.postMessage({
      // @ts-expect-error - toolCallId will be set by server by injecting window.toolCallId = <a-valid-id-from-llm> script to html
      toolCallId: window.toolCallId,
      data: response
    }, '*');
  };
  return (props: T) => {
    return <WrappedComponent {...props} responseToLLM={responseToLLM} />;
  }
}