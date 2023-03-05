import React from 'react';
/**
 * Parameters that can be entered after initializing flexcards.js.
 * @interface FlexCardsParams
 */
interface FlexCardsParams extends React.HTMLAttributes<HTMLDivElement> {
    component?: 'default' | 'images';
    delay?: number;
    indexType?: 'numbers' | 'dots';
    stop?: boolean;
    theme?: string;
    timer?: boolean;
}
export declare const Component: React.FC<React.HTMLAttributes<HTMLElement>>;
export declare const Carousel: React.FC<FlexCardsParams>;
export declare const AlternateCarousel: React.FC<FlexCardsParams>;
declare const _default: {
    Carousel: React.FC<FlexCardsParams>;
};
export default _default;
