import React, { ComponentType } from "react";

export default function withIsland(WrappedComponent: ComponentType<any>) {
  const responseToLLM = (response: string) => {
    window.parent.postMessage({
      // @ts-expect-error - toolCallId will be set by server by injecting window.toolCallId = <a-valid-id-from-llm> script to html
      toolCallId: window.toolCallId,
      data: response
    }, '*');
  };
  return (props: any) => {
    return <WrappedComponent data={props} responseToLLM={responseToLLM} />;
  }
}