export interface IFormFields { [key: string]: IFormField; }

interface IFormField {
  label: string;
  message: string;
  name: string;
  options?: Options;
  type: string;
  value?: string;
  values?: any[];
  disabled?: boolean;
}

type Options = IOption[];

interface IOption {
  value: string;
  label: string;
  clearableValue?: boolean;
}
