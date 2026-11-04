export type Province = {
  id: number;
  title: string;
};

export type Ward = {
  id: number;
  title: string;
  parentId: number;
};

export type Nation = {
  id: number;
  title: string;
};

export type Ethnic = {
  id: number;
  title: string;
};

export type Religion = {
  id: number;
  title: string;
};

export type Country = {
  id: number;
  originalName: string;
  name: string;
  phoneCode: string;
  flag: string;
};

export type StudentPriorityPolicies = {
  id: number;
  title: string;
};

export type StudentSpecialNeedsPolicies = {
  id: number;
  title: string;
};