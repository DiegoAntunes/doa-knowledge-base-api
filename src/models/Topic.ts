export interface ITopic {
  id: string; // unique version id
  originalId: string; // base topic id (remains the same between versions)
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  parentTopicId?: string;
}


  export interface ITopicTree extends ITopic {
    children?: ITopicTree[];
  }
  
export class Topic implements ITopic {
  id: string;
  originalId: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  parentTopicId?: string;

  constructor(params: ITopic) {
    this.id = params.id;
    this.originalId = params.originalId;
    this.name = params.name;
    this.content = params.content;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.version = params.version;
    this.parentTopicId = params.parentTopicId;
    }
  }
  