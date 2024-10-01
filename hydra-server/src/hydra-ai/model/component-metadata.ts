import { ComponentPropsMetadata } from "./component-props-metadata";

export interface ComponentMetadata {
  name: string;
  description: string;
  props: ComponentPropsMetadata;
}

export interface ComponentContextToolMetadata {
  name: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    isRequired: boolean;
    items?: { type: string };
    enumValues?: string[];
  }[];
}

export interface ComponentContextTool {
  getComponentContext: (...args: any[]) => Promise<any>;
  definition: ComponentContextToolMetadata;
}

export interface AvailableComponent extends ComponentMetadata {
  contextTools: ComponentContextToolMetadata[];
}

export interface ComponentWithContext extends ComponentMetadata {
  context: any;
}

export interface AvailableComponents {
  [key: string]: AvailableComponent;
}