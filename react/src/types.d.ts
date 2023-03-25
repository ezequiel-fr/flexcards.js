import React from 'react';

type FlexCardsChild = React.ReactElement<CProps | ICProps>;

/**
 * FlexCards component properties.
 */
export type CProps = React.HTMLAttributes<HTMLElement>;

/**
 * FlexCards image component properties.
 */
export type ICProps = React.ImgHTMLAttributes<HTMLImageElement>;

/**
 * The FlexCards parameters to apply to the instance.\
 * The `flexcards.js` instance provided an HTML `<div>`, and here, you can customize or add your
 * own properties, like CSS or className...
 */
export interface FlexCardsParams extends React.HTMLAttributes<HTMLDivElement> {
    /** The arrow image url (by default provide a custom SVG image) */
    arrowUrl?: string;
    /** React children custom components */
    children: FlexCardsChild[];
    /** Apply a filter or not to the arrow (works better on SVG dark arrows) */
    colorized?: boolean;
    /** The delay used between every changes */
    delay?: number;
    /** Show the index display to be on top of the carousel */
    indexType?: "dots" | "numbers" | "none";
    /** The number of refresh to get elapsed time */
    refreshTime?: number;
    /** Hexadecimal color code to apply to the instance */
    theme?: string;
    /** Indicate wether a progress bar should be displayed at the top of the instance or not */
    timer?: boolean;
}
