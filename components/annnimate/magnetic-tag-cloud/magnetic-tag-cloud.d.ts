export type Tag = { label: string; href: string; className?: string; chip?: string };
declare const MagneticTagCloud: (props: { tags: Tag[]; className?: string }) => React.JSX.Element;
export default MagneticTagCloud;
