export interface WorkflowRule {
  RuleName: string;
  Expression: string;
}

export interface WorkflowParam {
  Name: string;
  Expression: string;
}

export interface Workflow {
  WorkflowID: number;
  WorkflowName: string;
  Path: string;
  Params: WorkflowParam[];
  Rules: WorkflowRule[];
}
