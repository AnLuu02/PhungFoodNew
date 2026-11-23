import '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: {
        src: string;
        controls?: boolean;
        autoplay?: boolean;
        loop?: boolean;
        muted?: boolean;
        style?: string;
      }) => ReturnType;
    };
  }
}
