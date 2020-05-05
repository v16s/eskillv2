export type VariableMapper = {
  add: (any) => { variables: any };
  edit: (prev: any, next: any) => { variables: any };
  delete: (any) => { variables: any };
};
