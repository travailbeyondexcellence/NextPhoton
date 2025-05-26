// types/simplebar-react.d.ts
declare module 'simplebar-react' {
    import * as React from 'react';
    export interface SimpleBarProps extends React.HTMLAttributes<HTMLDivElement> {
        children?: React.ReactNode;
        className?: string;
        autoHide?: boolean;
        timeout?: number;
        clickOnTrack?: boolean;
        scrollbarMinSize?: number;
        scrollbarMaxSize?: number;
        direction?: 'rtl' | 'ltr';
        forceVisible?: boolean | 'x' | 'y';
    }

    export default class SimpleBar extends React.Component<SimpleBarProps> { }
}
  