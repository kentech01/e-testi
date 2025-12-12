declare namespace JSX {
  interface IntrinsicElements {
    "math-field": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        value?: string;
        onInput?: (e: any) => void;
      },
      HTMLElement
    >;
  }
}

interface MathfieldElement extends HTMLElement {
  value: string;
}
