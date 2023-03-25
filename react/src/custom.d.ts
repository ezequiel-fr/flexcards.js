/**
 * Default definitions for typescript will be overridden with
 * file-specific definitions by rollup.
 */
declare module "*.jpg";
declare module "*.png";
declare module "*.jpeg";
declare module "*.gif";

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg' {
  const svgUrl: string;
  const svgComponent: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default svgUrl;
  export { svgComponent as ReactComponent }
}
