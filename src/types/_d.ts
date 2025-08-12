export type AppRoute = {
  path?: string;
  element: React.FC;
  protected?: boolean;
  children?: AppRoute[];
  index?: boolean;
};
