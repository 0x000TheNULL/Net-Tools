export type ToolCategory =
  | 'IP & Subnet'
  | 'DNS'
  | 'Email'
  | 'Network'
  | 'Encoding';

export type ToolDefinition = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: ToolCategory;
  tags: string[];
  featured?: boolean;
};

export type ResultRow = {
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
};
